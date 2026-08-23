import fitz # PyMuPDF
import os

pdf_path = r"C:\Users\eabis\.gemini\antigravity-ide\brain\eaa82b4d-0fdc-4994-87e5-8cfb8fb6d101\.user_uploaded\media_1787418491466.pdf"
output_dir = r"d:\ILOVESTUDY\ILoveStudy\frontend\public\images\chemistry"

os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total PDF pages: {len(doc)}")

# Render each page at 2x resolution (zoom = 2.0)
matrix = fitz.Matrix(2.0, 2.0)

for i in range(min(12, len(doc))):
    page = doc[i]
    pix = page.get_pixmap(matrix=matrix)
    out_file = os.path.join(output_dir, f"page_{i+1}.png")
    pix.save(out_file)
    print(f"Saved {out_file} ({pix.width}x{pix.height})")

print("🎉 All PDF pages rendered to PNG successfully!")
