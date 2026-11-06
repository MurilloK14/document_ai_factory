import glob
import fitz

docs_map = [
    (1, "output_cortados/*doc_1*p1_a_10.pdf", 1, 10),
    (2, "output_cortados/*doc_2*p11_a_22.pdf", 11, 22),
    (3, "output_cortados/*doc_3*p23_a_116.pdf", 23, 116),
    (4, "output_cortados/*doc_4*p117_a_117.pdf", 117, 117),
    (5, "output_cortados/*doc_5*p118_a_120.pdf", 118, 120),
    (6, "output_cortados/*doc_6*p121_a_124.pdf", 121, 124),
    (7, "output_cortados/*doc_7*p125_a_141.pdf", 125, 141),
]

total_pages_found = 0
leandro_occurrences = []

for doc_id, pattern, p_ini, p_fim in docs_map:
    matches = glob.glob(pattern)
    f = matches[0]
    doc = fitz.open(f)
    print(f"Doc {doc_id}: {f} ({len(doc)} pags)")
    for idx, page in enumerate(doc):
        pag_lote = p_ini + idx
        total_pages_found += 1
        txt = page.get_text("text")
        if "leandro" in txt.lower():
            leandro_occurrences.append((doc_id, pag_lote, "text"))
            print(f"  --> FOUND 'leandro' in text of page {pag_lote} (Doc {doc_id})!")
        
        # Check blocks
        blocks = page.get_text("blocks")
        for b in blocks:
            if b[6] == 0 and "leandro" in b[4].lower():
                print(f"  --> FOUND 'leandro' in block of page {pag_lote}: {repr(b[4][:100])}")
        
        # Check tables
        try:
            tabs = page.find_tables()
            for t in tabs.tables:
                for row in t.extract():
                    row_str = " ".join(str(c) for c in row if c)
                    if "leandro" in row_str.lower():
                        print(f"  --> FOUND 'leandro' in table of page {pag_lote}: {repr(row_str[:100])}")
        except Exception as e:
            pass

print(f"Total pages verified: {total_pages_found}")
print(f"Total leandro occurrences: {len(leandro_occurrences)}")
