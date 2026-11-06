import os
import json
import re
from typing import Any
from fastapi import FastAPI, File, UploadFile, HTTPException
import fitz
from PIL import Image
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential_jitter, retry_if_exception
from ml_detector import LocalBoundaryDetector

app = FastAPI(
    title="DocSplit AI - Factory Core",
    description="Fatiamento inteligente de PDF com Machine Learning local (Scikit-Learn) e Gemini Flash."
)

client = genai.Client()
detector_ml = LocalBoundaryDetector(threshold_corte=0.45)

MODELOS_PRIORITARIOS = [
    "gemini-3.8-flash",
    "gemini-3.8-pro"
]

PASTA_PDFS_CORTADOS = "output_cortados"


def limpar_nome_arquivo(nome: str) -> str:
    """Remove caracteres inválidos para criar nomes de arquivos limpos e seguros."""
    nome_limpo = re.sub(r'[\\/*?:"<>| /]', '_', str(nome))
    nome_limpo = re.sub(r'_+', '_', nome_limpo)
    return nome_limpo.strip('_')


def eh_erro_temporario(exc: BaseException) -> bool:
    msg = str(exc)
    return any(termo in msg for termo in ("503", "429", "UNAVAILABLE", "high demand", "ResourceExhausted"))


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential_jitter(initial=2, max=10),
    retry=retry_if_exception(eh_erro_temporario),
    reraise=True
)
def gerar_conteudo_com_resiliencia(conteudos: list[Any]):
    erro_final = None
    for modelo in MODELOS_PRIORITARIOS:
        try:
            return client.models.generate_content(
                model=modelo,
                contents=conteudos,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.0  # Zero criatividade: máxima fidelidade e consistência
                )
            )
        except Exception as e:
            msg = str(e)
            if eh_erro_temporario(e) or "404" in msg or "NOT_FOUND" in msg:
                erro_final = e
                continue
            raise e
    raise erro_final or RuntimeError("Nenhum modelo respondeu com sucesso.")


def cortar_e_salvar_documentos(caminho_pdf_orig: str, lista_docs: list[dict], pasta_saida: str) -> list[dict]:
    """Fatia fisicamente o PDF original em arquivos individuais por processo."""
    os.makedirs(pasta_saida, exist_ok=True)
    doc_orig = fitz.open(caminho_pdf_orig)
    documentos_salvos = []

    for doc_info in lista_docs:
        p_ini = int(doc_info.get("pagina_inicio", 1))
        p_fim = int(doc_info.get("pagina_fim", p_ini))
        doc_id = doc_info.get("doc_id", 1)

        cat_macro = limpar_nome_arquivo(
            doc_info.get("categoria_macro", "Geral"))[:25]
        tipo_doc = limpar_nome_arquivo(
            doc_info.get("tipo_documento", "Documento"))[:35]

        total_pags = (p_fim - p_ini) + 1
        nome_arq = f"doc_{doc_id}_{cat_macro}_{tipo_doc}_p{p_ini}_a_{p_fim}.pdf"
        caminho_final = os.path.join(pasta_saida, nome_arq)

        novo_pdf = fitz.open()
        novo_pdf.insert_pdf(doc_orig, from_page=p_ini - 1, to_page=p_fim - 1)
        novo_pdf.save(caminho_final)
        novo_pdf.close()

        doc_atualizado = {
            **doc_info,
            "total_paginas_doc": total_pags,
            "paginas": list(range(p_ini, p_fim + 1)),
            "arquivo_salvo": caminho_final
        }
        documentos_salvos.append(doc_atualizado)

    doc_orig.close()
    return documentos_salvos


@app.post("/api/processar-lote")
async def processar_lote(file: UploadFile = File(...)):
    if not file or not file.filename:
        raise HTTPException(
            status_code=400, detail="Nenhum ficheiro foi enviado.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400, detail="Apenas ficheiros PDF são suportados.")

    pdf_path = f"temp_{file.filename}"
    imagens_temporarias = []

    try:
        with open(pdf_path, "wb") as buffer:
            buffer.write(await file.read())

        doc = fitz.open(pdf_path)
        total_paginas = len(doc)

        # ---------------------------------------------------------
        # ESTÁGIO 1: Machine Learning Local (Scikit-Learn + TF-IDF)
        # ---------------------------------------------------------
        textos_todas_paginas: list[str] = [
            str(doc[p].get_text("text")) for p in range(total_paginas)
        ]
        resultado_ml = detector_ml.analisar_paginas(textos_todas_paginas)
        candidatos_ml = resultado_ml["paginas_candidatas"]
        tempo_ml = resultado_ml["tempo_execucao_ms"]

        # ---------------------------------------------------------
        # Extração de Cabeçalhos e Fallback para Imagens
        # ---------------------------------------------------------
        partes_conteudo: list[Any] = []
        bloco_texto_paginas = []

        for page_num in range(total_paginas):
            num_exibicao = page_num + 1
            page = doc[page_num]
            texto = textos_todas_paginas[page_num].strip()

            if len(texto) >= 60:
                cabecalho = texto[:1200].replace("\n", " ").strip()
                bloco_texto_paginas.append(
                    f"[PÁGINA {num_exibicao}]: {cabecalho}\n")
            else:
                pix = page.get_pixmap(dpi=100)
                img_filename = f"temp_pagina_scan_{num_exibicao}.jpg"
                pix.save(img_filename)
                imagens_temporarias.append(img_filename)

                if bloco_texto_paginas:
                    partes_conteudo.append("".join(bloco_texto_paginas))
                    bloco_texto_paginas = []

                partes_conteudo.append(
                    f"\n--- [IMAGEM DA PÁGINA {num_exibicao}] ---")
                partes_conteudo.append(Image.open(img_filename))

        if bloco_texto_paginas:
            partes_conteudo.append("".join(bloco_texto_paginas))

        doc.close()

        # ---------------------------------------------------------
        # ESTÁGIO 2: Gemini Flash como Juiz e Auditor Semântico
        # ---------------------------------------------------------
        prompt_sistema = f"""
        Você é um auditor sênior de inteligência documental e classificação jurídica/corporativa.
        Recebeu a estrutura de um lote com EXATAMENTE {total_paginas} PÁGINAS (numeradas de 1 a {total_paginas}).

        INSIGHTS DO MOTOR DE MACHINE LEARNING LOCAL (SCIKIT-LEARN):
        O algoritmo preditivo de DBD (NLP TF-IDF + Cosine Distance Drop) analisou o lote em {tempo_ml}ms
        e detectou picos estatísticos de nova fronteira de documento nas páginas: {candidatos_ml}.

        SUA MISSÃO COMO ÁRBITRO E AUDITOR:
        1. Use os candidatos sugeridos pelo ML como referência principal para validar e delimitar os documentos exatos.
        2. Classifique cada documento com ABRANGÊNCIA AMPLA e PADRONIZADA.

        PADRÃO DE CLASSIFICAÇÃO:
        - **categoria_macro**: Defina o macro-setor institucional:
          * "Jurídico / Processual"
          * "Administrativo"
          * "Societário / Contratos"
          * "Financeiro / Contábil"
          * "Recursos Humanos"
          * "Governança / Compliance"
        
        - **tipo_documento**: Use nomes de classes DOCUMENTAIS AMPLAS e UNIVERSAIS:
          Exemplos: "Recuperação Judicial", "Certidão / Termo Processual", "Plano de Recuperação Judicial",
          "Requisição de Despesa / Suprimentos", "Ordem de Compra / Contratação", "Contrato Social / Alteração Contratual",
          "Demonstrações Financeiras e Relatório de Auditoria", "Petição Judicial".
        
        - **subtipo_detalhe**: Breve descrição ou subtítulo da peça específica.

        REGRAS INEGOCIÁVEIS:
        - COBERTURA COMPLETA: Todas as páginas de 1 a {total_paginas} DEVEM ser atribuídas a algum documento.
        - CONTINUIDADE: Se um documento termina na página 10, o próximo DEVE começar na página 11.

        Formato JSON de saída obrigatório:
        [
          {{
            "doc_id": 1,
            "categoria_macro": "Jurídico / Processual",
            "tipo_documento": "Recuperação Judicial",
            "subtipo_detalhe": "Decisão Judicial de Deferimento",
            "envolvidos": ["Parte A", "Parte B"],
            "juiz": "Nome do Juiz ou null",
            "data_processo": "YYYY-MM-DD ou null",
            "pagina_inicio": 1,
            "pagina_fim": 10,
            "confianca": 0.98
          }}
        ]
        """

        conteudos_finais = [prompt_sistema] + partes_conteudo

        response = gerar_conteudo_com_resiliencia(conteudos_finais)

        if not response.text:
            raise HTTPException(
                status_code=500, detail="A IA retornou resposta vazia.")

        resultado_ia = json.loads(response.text)

        # Fatiamento físico real dos arquivos em disco
        documentos_finais = cortar_e_salvar_documentos(
            pdf_path, resultado_ia, PASTA_PDFS_CORTADOS)

        return {
            "status": "sucesso",
            "total_paginas_lote": total_paginas,
            "total_documentos_detectados": len(documentos_finais),
            "motor_ml_local": {
                "tempo_processamento_ms": tempo_ml,
                "fronteiras_detectadas_ml": candidatos_ml
            },
            "pasta_documentos_cortados": PASTA_PDFS_CORTADOS,
            "segmentacao": documentos_finais
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erro interno no processamento do lote: {str(e)}")

    finally:
        if os.path.exists(pdf_path):
            try:
                os.remove(pdf_path)
            except OSError:
                pass
        for img_path in imagens_temporarias:
            if os.path.exists(img_path):
                try:
                    os.remove(img_path)
                except OSError:
                    pass
