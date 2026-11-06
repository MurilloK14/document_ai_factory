import json
d = json.load(open('estado_lote_atual.json', encoding='utf-8'))
for p in d['_indice_ocr_paginas']:
    if p['pagina'] in [118, 119, 120]:
        print(f"--- PAG {p['pagina']} ---")
        print(p['texto'][:300])
        print()
doc5 = next(d2 for d2 in d['segmentacao'] if d2['doc_id'] == 5)
print("Envolvidos doc5:", doc5['envolvidos'])
