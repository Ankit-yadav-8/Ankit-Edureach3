import fitz

pdf_path = "public/Allen_Handbook_Physics_JEEAdvanced_2024.pdf"
doc = fitz.open(pdf_path)

print("Searching for mind maps in Physics...")
for i in range(len(doc)):
    page = doc[i]
    text = page.get_text("text").lower()
    if "mind map" in text or "concept map" in text:
        print(f"Page {i+1} has 'mind map' or 'concept map'")

