# -*- coding: utf-8 -*-
"""
extract_neet.py — extract the state-wise MBBS college list from the
"Revised UG Seat Matrix 2024-25" PDF using the table's ruling lines.

The table is fully ruled: vertical lines give the 8 column x-bands, and a
horizontal line is drawn between every college. So each horizontal band is
exactly one record — we bucket every word into (band, column) and concatenate.

8 columns: slno | state | name | district | university | management | year | seats
Emits scripts/_neet_records.json
"""
import json, re, sys
import pdfplumber

PDF = "public/data/Revised UG Seat Matrix 2024-25 on 31-03-2025.pdf"
COLNAMES = ["slno", "state", "name", "district", "university", "management", "year", "seats"]

def merge(vals, tol):
    vals = sorted(set(vals))
    out = []
    for v in vals:
        if out and v - out[-1] <= tol:
            continue
        out.append(v)
    return out

def vcuts(page):
    xs = [round(ln['x0']) for ln in (page.lines + page.edges)
          if abs(ln['x0'] - ln['x1']) < 1.0 and abs(ln['top'] - ln['bottom']) > 20]
    return merge(xs, 6)

def hcuts(page):
    ys = [round(ln['top']) for ln in (page.lines + page.edges)
          if abs(ln['top'] - ln['bottom']) < 1.0 and abs(ln['x0'] - ln['x1']) > 40]
    return merge(ys, 3)

def main():
    recs = []
    with pdfplumber.open(PDF) as pdf:
        grid = None
        for p in pdf.pages:
            c = vcuts(p)
            if len(c) >= 9:
                grid = c[:9]; break
        print("grid:", grid, file=sys.stderr)

        for page in pdf.pages:
            vc = vcuts(page)
            g = vc[:9] if len(vc) >= 9 else grid
            if not g or len(g) < 9:
                continue
            colranges = [(g[i], g[i+1]) for i in range(len(g)-1)]
            hy = hcuts(page)
            if len(hy) < 2:
                continue
            bands = [(hy[i], hy[i+1]) for i in range(len(hy)-1)]

            words = page.extract_words(use_text_flow=False, keep_blank_chars=False,
                                       x_tolerance=1.5, y_tolerance=2)

            def col_of(cx):
                for i, (a, b) in enumerate(colranges):
                    if a - 2 <= cx < b + 2:
                        return i
                return None

            for (y0, y1) in bands:
                cells = {i: [] for i in range(8)}
                ws = [w for w in words if y0 - 1 <= (w['top'] + w['bottom']) / 2 < y1 + 1]
                if not ws:
                    continue
                ws.sort(key=lambda w: (round(w['top']), w['x0']))
                for w in ws:
                    ci = col_of((w['x0'] + w['x1']) / 2)
                    if ci is not None:
                        cells[ci].append(w['text'])
                rec = {nm: re.sub(r'\s+', ' ', ' '.join(cells[i])).strip()
                       for i, nm in enumerate(COLNAMES)}
                # only keep real data bands: a numeric Sl.No
                if not re.match(r'^\d{1,3}$', rec['slno']):
                    continue
                recs.append(rec)

    json.dump(recs, open("scripts/_neet_records.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print("records:", len(recs), file=sys.stderr)
    for r in recs[:6] + recs[298:303] + recs[-2:]:
        print(r['slno'], '|', r['state'], '|', r['name'], '|', r['seats'], file=sys.stderr)

if __name__ == "__main__":
    main()
