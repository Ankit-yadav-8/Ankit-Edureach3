import fitz # PyMuPDF
import sys
import os

def convert_pdf_to_images(pdf_path, output_dir, prefix):
    print(f"Opening {pdf_path}...")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF {pdf_path}: {e}")
        return

    os.makedirs(output_dir, exist_ok=True)

    print(f"Found {len(doc)} pages in {prefix}. Converting...")
    for i in range(len(doc)):
        page = doc[i]
        
        # Crop the top header (ALLEN badge)
        rect = page.rect
        crop_rect = fitz.Rect(rect.x0, rect.y0 + 80, rect.x1, rect.y1 - 35)
        
        # 150 dpi for decent quality but not huge files
        pix = page.get_pixmap(dpi=150, clip=crop_rect) 
        output_path = os.path.join(output_dir, f"{prefix}_page_{i+1:03d}.png")
        pix.save(output_path)
        if (i+1) % 50 == 0:
            print(f"[{prefix}] Converted {i+1}/{len(doc)} pages...")
            
    print(f"Finished converting {pdf_path}!")

if __name__ == "__main__":
    pdfs = [
        {
            "path": r"public\Allen Handbook Chemistry @JEEAdvanced_2024.pdf_",
            "out": "public/mindmaps_raw/chemistry",
            "prefix": "chemistry"
        },
        {
            "path": r"public\Allen Handbook Mathematics @JEEAdvanced_2024.pdf_",
            "out": "public/mindmaps_raw/maths",
            "prefix": "maths"
        }
    ]
    
    for pdf in pdfs:
        if os.path.exists(pdf["path"]):
            convert_pdf_to_images(pdf["path"], pdf["out"], pdf["prefix"])
        else:
            print(f"Could not find {pdf['path']}")
