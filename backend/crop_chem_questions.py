import fitz # PyMuPDF
import os

pdf_path = r"C:\Users\eabis\.gemini\antigravity-ide\brain\eaa82b4d-0fdc-4994-87e5-8cfb8fb6d101\.user_uploaded\media_1787418491466.pdf"
output_dir = r"d:\ILOVESTUDY\ILoveStudy\frontend\public\images\chemistry"
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
matrix = fitz.Matrix(2.5, 2.5) # High DPI

# Question page mappings & approximate bounding box ratios (ymin, xmin, ymax, xmax) relative to page height & width
# Left column x: 0.10 to 0.50, Right column x: 0.50 to 0.90
crops = {
    # Page 1
    2:  (1, 0.17, 0.10, 0.53, 0.50), # Match list 1
    3:  (1, 0.17, 0.50, 0.44, 0.88), # Benzaldehyde reaction
    4:  (1, 0.17, 0.50, 0.55, 0.88), # DIBAL-H ester
    # Page 2
    5:  (2, 0.17, 0.10, 0.48, 0.50), # Lactone DIBAL-H
    7:  (2, 0.17, 0.50, 0.35, 0.88), # Match list 1 & 2
    8:  (2, 0.17, 0.50, 0.48, 0.88), # Epoxide HBr
    9:  (2, 0.17, 0.50, 0.65, 0.88), # Benzaldehyde preparation
    # Page 3
    10: (3, 0.17, 0.10, 0.35, 0.50), # Bromoketone Mg
    11: (3, 0.17, 0.10, 0.53, 0.50), # Wolff Kishner
    12: (3, 0.17, 0.50, 0.30, 0.88), # Multistep propene
    13: (3, 0.17, 0.50, 0.60, 0.88), # Cyclohexene oxidation
    # Page 4
    14: (4, 0.17, 0.10, 0.30, 0.50), # Clemmensen hydroxy
    15: (4, 0.17, 0.10, 0.65, 0.50), # Chloroketone NaCN
    16: (4, 0.17, 0.50, 0.55, 0.88), # Reagents detection match
    17: (4, 0.17, 0.50, 0.65, 0.88), # Keto ester NaHSO3
    # Page 5
    18: (5, 0.17, 0.10, 0.55, 0.50), # n-heptane oxidation
    19: (5, 0.17, 0.50, 0.30, 0.88), # Keto-acid lactone
    20: (5, 0.17, 0.50, 0.65, 0.88), # Keto ester NaOMe
    # Page 6
    21: (6, 0.17, 0.10, 0.25, 0.50), # Acid character order
    22: (6, 0.17, 0.10, 0.45, 0.50), # Keto bromo NaOH
    23: (6, 0.17, 0.10, 0.65, 0.50), # Dialdehyde Tollens
    24: (6, 0.17, 0.50, 0.45, 0.88), # Alkene derivative reaction
    25: (6, 0.17, 0.50, 0.70, 0.88), # Substrate reaction match
    # Page 7
    26: (7, 0.17, 0.10, 0.25, 0.50), # Ethyl butanoate LiAlH4
    27: (7, 0.17, 0.10, 0.65, 0.50), # Anhydride AlCl3
    28: (7, 0.17, 0.50, 0.25, 0.88), # Diester LiBH4
    29: (7, 0.17, 0.50, 0.53, 0.88), # NaHCO3 CO2 liberation
    30: (7, 0.17, 0.50, 0.75, 0.88), # Iodoform test compounds
}

for q_num, (pg, y1_r, x1_r, y2_r, x2_r) in crops.items():
    page = doc[pg - 1]
    rect = page.rect
    w, h = rect.width, rect.height
    crop_rect = fitz.Rect(x1_r * w, y1_r * h, x2_r * w, y2_r * h)
    pix = page.get_pixmap(matrix=matrix, clip=crop_rect)
    out_path = os.path.join(output_dir, f"q{q_num}.png")
    pix.save(out_path)
    print(f"Saved q{q_num}.png ({pix.width}x{pix.height})")

print("Crop finished successfully.")
