import fitz
import glob
import os

docs_map = [
    (1, "output_cortados/*doc_1*p1_a_10.pdf", 1, 10),
    (2, "output_cortados/*doc_2*p11_a_22.pdf", 11, 22),
    (3, "output_cortados/*doc_3*p23_a_116.pdf", 23, 116),
    (4, "output_cortados/*doc_4*p117_a_117.pdf", 117, 117),
    (5, "output_cortados/*doc_5*p118_a_120.pdf", 118, 120),
    (6, "output_cortados/*doc_6*p121_a_124.pdf", 121, 124),
    (7, "output_cortados/*doc_7*p125_a_141.pdf", 125, 141),
]

for doc_id, pattern, p_ini, p_fim in docs_map:
    matches = glob.glob(pattern)
    if not matches:
        print(f"Doc {doc_id}: NENHUM ARQUIVO ENCONTRADO para {pattern}")
        continue
    f = matches[0]
    doc = fitz.open(f)
    print(f"=== DOC {doc_id} ({f}): {len(doc)} pages (p.{p_ini} a {p_fim}) ===")
    for idx, page in enumerate(doc):
        real_pag = p_ini + idx
        text = page.get_text("text").strip()
        imgs = page.get_images()
        print(f"  Pág {real_pag} (idx {idx+1}): len_text={len(text)}, imagens={len(imgs)}, início={repr(text[:80])}")
