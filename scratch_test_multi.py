import fitz
import glob
import re
import unicodedata

def normalizar(s: str) -> str:
    return unicodedata.normalize('NFKD', s).encode('ASCII', 'ignore').decode('ASCII').lower()

def extrair_texto_multimodal_completo(page, num_pagina: int = 1) -> dict:
    """
    Extrai texto completo de alta fidelidade:
    1. Cabeçalho (região superior / metadados visuais)
    2. Tabelas estruturadas (find_tables)
    3. Blocos de texto (get_text('blocks'))
    4. Texto contínuo (get_text('text'))
    5. Imagens e elementos gráficos embutidos
    """
    resultado = {
        "pagina": num_pagina,
        "cabecalho": "",
        "tabelas_texto": [],
        "blocos_texto": [],
        "imagens_info": [],
        "texto_completo": ""
    }
    
    # 1. Extração de Cabeçalho (região superior da página: top 25%)
    rect_cabecalho = fitz.Rect(0, 0, page.rect.width, page.rect.height * 0.25)
    texto_cabecalho = page.get_text("text", clip=rect_cabecalho).strip()
    resultado["cabecalho"] = texto_cabecalho
    
    # 2. Extração de Tabelas Estruturadas
    tabelas_str = []
    try:
        tabs = page.find_tables()
        for idx_tab, t in enumerate(tabs.tables):
            linhas_tabela = []
            for row in t.extract():
                linha_formatada = " | ".join(str(c).strip().replace("\n", " ") for c in row if c is not None and str(c).strip())
                if linha_formatada:
                    linhas_tabela.append(linha_formatada)
            if linhas_tabela:
                tabelas_str.append("\n".join(linhas_tabela))
    except Exception as e:
        pass
    resultado["tabelas_texto"] = tabelas_str
    
    # 3. Extração de Blocos de Texto (preserva bounding boxes e ordem)
    blocos = page.get_text("blocks")
    blocos_limpos = []
    for b in blocos:
        if b[6] == 0 and b[4].strip(): # tipo 0 = texto
            blocos_limpos.append(b[4].strip())
    resultado["blocos_texto"] = blocos_limpos
    
    # 4. Imagens embutidas
    imgs = page.get_images(full=True)
    resultado["imagens_info"] = [f"img_{xref}_{w}x{h}" for xref, smask, w, h, bpc, cs, alt, name, filt in imgs]
    
    # 5. Texto consolidado para busca e indexação
    partes = []
    if texto_cabecalho:
        partes.append(f"[CABEÇALHO]\n{texto_cabecalho}")
    if tabelas_str:
        partes.append(f"[TABELAS E DADOS ESTRUTURADOS]\n" + "\n---\n".join(tabelas_str))
    
    # Texto padrão da página
    texto_geral = page.get_text("text").strip()
    partes.append(f"[CONTEÚDO DA PÁGINA]\n{texto_geral}")
    
    resultado["texto_completo"] = "\n\n".join(partes)
    return resultado

# Testar com doc 5 (p118)
f = glob.glob('output_cortados/*doc_5*p118*.pdf')[0]
doc = fitz.open(f)
p0 = doc[0]
res = extrair_texto_multimodal_completo(p0, 118)

print("=== CABEÇALHO EXTRAÍDO ===")
print(res["cabecalho"])
print("\n=== TABELAS EXTRAÍDAS ===")
for t in res["tabelas_texto"]:
    print(t[:200])
print("\n=== BUSCA POR 'LEANDRO' ===")
print("'leandro' no cabecalho?", "leandro" in normalizar(res["cabecalho"]))
print("'leandro' nas tabelas?", any("leandro" in normalizar(t) for t in res["tabelas_texto"]))
print("'leandro' no texto_completo?", "leandro" in normalizar(res["texto_completo"]))
