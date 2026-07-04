import fitz
import sys

def print_first_pages(pdf_path, num_pages=15):
    doc = fitz.open(pdf_path)
    for i in range(min(num_pages, len(doc))):
        print(f"\n--- Page {i+1} ---")
        text = doc[i].get_text("text")
        # Print first 500 chars to avoid flooding
        print(text[:500])

if __name__ == "__main__":
    print_first_pages("public/Allen_Handbook_Physics_JEEAdvanced_2024.pdf")
