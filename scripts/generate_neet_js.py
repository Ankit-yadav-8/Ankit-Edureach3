# -*- coding: utf-8 -*-
"""
generate_neet_js.py — clean scripts/_neet_records.json and emit
src/data/neetColleges.js (the master NEET/MBBS college dataset).
"""
import json, re

recs = json.load(open("scripts/_neet_records.json", encoding="utf-8"))

# ---- state normalisation (raw column halves -> canonical) ----
STATE_MAP = {
    "andamannicobarislands": "Andaman & Nicobar Islands",
    "andhrapradesh": "Andhra Pradesh", "arunachalpradesh": "Arunachal Pradesh",
    "assam": "Assam", "bihar": "Bihar", "chandigarh": "Chandigarh",
    "chattisgarh": "Chhattisgarh", "chhattisgarh": "Chhattisgarh",
    "dadraandnagarhaveli": "Dadra & Nagar Haveli", "delhi": "Delhi", "goa": "Goa",
    "gujarat": "Gujarat", "haryana": "Haryana", "himachalpradesh": "Himachal Pradesh",
    "jammukashmir": "Jammu & Kashmir", "jharkhand": "Jharkhand",
    "karnataka": "Karnataka", "kerala": "Kerala",
    "madhya": "Madhya Pradesh", "madhyapradesh": "Madhya Pradesh",
    "maharashtra": "Maharashtra", "maharashtmissions": "Maharashtra",
    "maharashtramissions": "Maharashtra",
    "manipur": "Manipur", "meghalaya": "Meghalaya", "mizoram": "Mizoram",
    "nagaland": "Nagaland", "orissa": "Odisha", "odisha": "Odisha",
    "pondicherry": "Puducherry", "puducherry": "Puducherry", "punjab": "Punjab",
    "rajasthan": "Rajasthan", "sikkim": "Sikkim", "tamilnadu": "Tamil Nadu",
    "telangana": "Telangana", "tripura": "Tripura",
    "uttarpradesh": "Uttar Pradesh", "uttarpradesmh": "Uttar Pradesh",
    "uttar": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand", "uttarakhandmedical": "Uttarakhand",
    "west": "West Bengal", "westbengal": "West Bengal",
}
def norm_state(raw, prev):
    key = re.sub(r"[^a-z]", "", raw.lower())
    if key in STATE_MAP:
        return STATE_MAP[key]
    # startswith fallbacks
    for k, v in STATE_MAP.items():
        if key and (key.startswith(k) or k.startswith(key)) and len(key) >= 6:
            return v
    return prev or raw

# ---- management normalisation ----
def norm_mgmt(raw):
    r = raw.strip()
    if r.lower().startswith("govt"):
        return ("Government", True)
    if "society" in r.lower():
        return ("Society", False)
    if "trust" in r.lower():
        return ("Trust", False)
    if "private" in r.lower():
        return ("Private", False)
    return (r or "Government", r.lower().startswith("govt"))

# ---- name fixes for the 4 physically-overlapping Madhya Pradesh rows ----
NAME_OVERRIDE = {
    "298": "Government Medical College, Seoni",
    "299": "Sri Satya Sai University of Technology & Medical Sciences, Sehore (MP)",
    "300": "Sundarlal Patwa Govt. Medical College, Mandsaur",
    "301": "Virendra Kumar Sakhlecha Government Medical College, Neemuch",
}
def clean_name(slno, raw):
    if slno in NAME_OVERRIDE:
        return NAME_OVERRIDE[slno]
    n = re.sub(r"\s+", " ", raw).strip()
    n = re.sub(r"\s+,", ",", n)
    n = n.strip(" ,;-")
    return n

def clean_seats(raw):
    m = re.search(r"\b(\d{2,4})\b", raw)
    if not m:
        return None
    v = int(m.group(1))
    return v if 1 <= v <= 2000 else None

def slugify(s):
    s = s.lower()
    s = re.sub(r"&", " and ", s)
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

out = []
prev_state = ""
for r in recs:
    state = norm_state(r["state"], prev_state)
    prev_state = state
    name = clean_name(r["slno"], r["name"])
    if len(name) < 4:
        continue
    mgmt, govt = norm_mgmt(r["management"])
    seats = clean_seats(r["seats"])
    year = None
    ym = re.search(r"\b(19|20)\d{2}\b", r["year"])
    if ym:
        year = int(ym.group(0))
    district = re.sub(r"\s+", " ", r["district"]).strip(" ,;-")
    district = re.sub(r"\bDISTRICT\b", "", district, flags=re.I).strip(" ,;-")
    # rejoin a word that wrapped across lines (e.g. "Visakhapatn am" -> "Visakhapatnam")
    district = re.sub(r"([a-z]{4,})\s+([a-z]{1,3})$", r"\1\2", district)
    university = re.sub(r"\s+", " ", r["university"]).strip(" ,;-")
    out.append({
        "name": name, "state": state, "district": district,
        "university": university, "management": mgmt, "govt": govt,
        "year": year, "seats": seats,
    })

# ---- unique slugs ----
seen = {}
for c in out:
    base = slugify(c["name"])
    if c["district"] and base in seen:
        base2 = slugify(c["name"] + "-" + c["district"])
    else:
        base2 = base
    slug = base2
    i = 2
    while slug in seen:
        slug = f"{base2}-{i}"
        i += 1
    seen[slug] = True
    c["slug"] = slug

states = sorted(set(c["state"] for c in out))
total_seats = sum(c["seats"] or 0 for c in out)
print("colleges:", len(out), "| states:", len(states), "| total seats:", total_seats)
print("govt:", sum(1 for c in out if c["govt"]), "private/self:", sum(1 for c in out if not c["govt"]))

# ---- emit JS ----
def js(c):
    fields = []
    fields.append(f'slug:{json.dumps(c["slug"])}')
    fields.append(f'name:{json.dumps(c["name"], ensure_ascii=False)}')
    fields.append(f'state:{json.dumps(c["state"], ensure_ascii=False)}')
    fields.append(f'district:{json.dumps(c["district"], ensure_ascii=False)}')
    fields.append(f'university:{json.dumps(c["university"], ensure_ascii=False)}')
    fields.append(f'management:{json.dumps(c["management"])}')
    fields.append(f'govt:{"true" if c["govt"] else "false"}')
    fields.append(f'year:{c["year"] if c["year"] else "null"}')
    fields.append(f'seats:{c["seats"] if c["seats"] else "null"}')
    return "  { " + ", ".join(fields) + " },"

header = '''/* ============================================================
   neetColleges.js — master NEET / MBBS medical-college dataset
   ------------------------------------------------------------
   Source: NMC / MCI "Revised UG Seat Matrix 2024-25" (the
   state-wise list of MBBS medical colleges, incl. AIIMS & JIPMER),
   public/data/Revised UG Seat Matrix 2024-25 on 31-03-2025.pdf.
   Auto-generated by scripts/extract_neet.py + generate_neet_js.py.
   Each record: name, state, district, affiliating university,
   management (Government / Trust / Society / Private), year of
   inception and MBBS annual intake (seats).
   ============================================================ */

export const NEET_COLLEGES = [
'''
body = "\n".join(js(c) for c in out)
footer = '''
];

export const NEET_STATES = [...new Set(NEET_COLLEGES.map((c) => c.state))].sort();

export const NEET_BY_SLUG = Object.fromEntries(NEET_COLLEGES.map((c) => [c.slug, c]));

export const NEET_TOTAL_SEATS = NEET_COLLEGES.reduce((s, c) => s + (c.seats || 0), 0);

export function neetByState(state) {
  return NEET_COLLEGES.filter((c) => c.state === state);
}
'''
open("src/data/neetColleges.js", "w", encoding="utf-8").write(header + body + footer)
print("wrote src/data/neetColleges.js")
