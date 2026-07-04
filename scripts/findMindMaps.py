import fitz # PyMuPDF
import sys

def find_mind_maps(pdf_path):
    print(f"Analyzing {pdf_path}...")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    mind_map_pages = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text").lower()
        if "mind map" in text or "concept map" in text:
            mind_map_pages.append(page_num + 1) # 1-indexed

    print(f"Found 'mind map' or 'concept map' text on pages: {mind_map_pages}")
    
    # Also let's check the table of contents to see if mind maps are listed
    toc = doc.get_toc()
    if toc:
        print("\nTable of Contents entries mentioning 'mind map':")
        for entry in toc:
            level, title, page = entry
            if "mind map" in title.lower() or "concept map" in title.lower():
                print(f"  Page {page}: {title}")
    else:
        print("No TOC found.")

if __name__ == "__main__":
    find_mind_maps("public/Allen_Handbook_Physics_JEEAdvanced_2024.pdf")
