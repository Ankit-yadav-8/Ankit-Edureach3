import fitz
import json

def get_chapter_pages(pdf_path):
    print(f"Opening {pdf_path}")
    doc = fitz.open(pdf_path)
    toc = doc.get_toc()
    print("TOC:")
    for item in toc:
        print(item)

if __name__ == "__main__":
    pdfs = [
        "public/Allen_Handbook_Physics_JEEAdvanced_2024.pdf",
        "public/Allen Handbook Chemistry @JEEAdvanced_2024.pdf_",
        "public/Allen Handbook Mathematics @JEEAdvanced_2024.pdf_"
    ]
    for p in pdfs:
        try:
            get_chapter_pages(p)
        except Exception as e:
            print(f"Error reading TOC for {p}: {e}")
