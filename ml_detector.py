import time
import re
from typing import TypedDict, Sequence
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class DetalhePagina(TypedDict):
    pagina: int
    score_corte: float
    eh_candidato: bool
    motivos: list[str]


class ResultadoDeteccao(TypedDict):
    paginas_candidatas: list[int]
    tempo_execucao_ms: float
    detalhes: list[DetalhePagina]


class LocalBoundaryDetector:
    """
    Motor local de Document Boundary Detection (DBD).
    Utiliza NLP estatístico (TF-IDF), Queda de Similaridade de Cosseno (Cosine Distance Drop)
    e heurísticas estruturais de processos judiciais/administrativos para identificar
    fronteiras de novos documentos em milissegundos a custo zero.
    """

    PADRAO_CNJ = re.compile(r'\b\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}\b')

    TERMOS_ABERTURA = [
        "EXCELENTÍSSIMO", "AO JUÍZO", "ILUSTRÍSSIMO", "À VARA", "TRIBUNAL DE JUSTIÇA",
        "PETIÇÃO INICIAL", "TERMO DE", "CONTRATO SOCIAL", "ALTERAÇÃO CONTRATUAL",
        "ORDEM DE COMPRA", "RELATÓRIO DO AUDITOR", "DEMONSTRAÇÕES FINANCEIRAS",
        "CERTIDÃO DE DISTRIBUIÇÃO", "AUTUAÇÃO", "FORMULÁRIO DE REQUISIÇÃO",
        "RECURSO DE APELAÇÃO", "EMBARGOS DE DECLARAÇÃO", "HABILITAÇÃO DE CRÉDITO",
        "PLANO DE RECUPERAÇÃO"
    ]

    def __init__(self, threshold_corte: float = 0.45):
        self.threshold_corte = threshold_corte

    def extrair_cnj(self, texto: str) -> str | None:
        match = self.PADRAO_CNJ.search(texto)
        return match.group(0) if match else None

    def analisar_paginas(self, textos_paginas: Sequence[str]) -> ResultadoDeteccao:
        inicio_t = time.perf_counter()
        total_pags = len(textos_paginas)

        if total_pags == 0:
            return {"paginas_candidatas": [], "tempo_execucao_ms": 0.0, "detalhes": []}

        # Trata páginas vazias para evitar problemas com TF-IDF
        textos_seguros = [
            str(t) if len(str(t).strip()) > 15 else "pagina_vazia_ou_escaneada"
            for t in textos_paginas
        ]

        # 1. Vetorização TF-IDF
        tem_tfidf = False
        matriz_tfidf = None
        try:
            vectorizer = TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=2500,
                sublinear_tf=True
            )
            matriz_tfidf = vectorizer.fit_transform(textos_seguros)
            tem_tfidf = True
        except ValueError:
            tem_tfidf = False

        candidatos = [1]  # Página 1 sempre é início do primeiro documento
        detalhes: list[DetalhePagina] = []
        cnj_anterior = None

        for i in range(total_pags):
            num_pag = i + 1
            texto = textos_paginas[i]
            cabecalho = texto[:800].upper()
            cnj_atual = self.extrair_cnj(cabecalho)

            score = 0.0
            motivos = []

            if i == 0:
                score = 1.0
                motivos.append("Início do lote (Página 1)")
                cnj_anterior = cnj_atual
            else:
                # Sinal 1: Queda de Similaridade de Cosseno (Cosine Similarity Drop)
                if tem_tfidf and matriz_tfidf is not None:
                    sim = float(
                        cosine_similarity(matriz_tfidf[i], matriz_tfidf[i - 1])[0][0]) # type: ignore
                    queda_sim = max(0.0, 1.0 - sim)
                    score += queda_sim * 0.40
                    if queda_sim > 0.65:
                        motivos.append(
                            f"Ruptura de vocabulário (Cosine Drop: {queda_sim:.2f})")

                # Sinal 2: Mudança de Número de Processo CNJ
                if cnj_atual and cnj_anterior and cnj_atual != cnj_anterior:
                    score += 0.45
                    motivos.append(f"Novo número CNJ detectado: {cnj_atual}")
                elif cnj_atual and not cnj_anterior:
                    score += 0.25
                    motivos.append(f"CNJ identificado: {cnj_atual}")

                if cnj_atual:
                    cnj_anterior = cnj_atual

                # Sinal 3: Palavras-chave de Abertura (Apenas se NÃO estava no cabeçalho da pág anterior)
                cabecalho_ant = textos_paginas[i - 1][:800].upper()
                for termo in self.TERMOS_ABERTURA:
                    if termo in cabecalho and termo not in cabecalho_ant:
                        score += 0.35
                        motivos.append(
                            f"Termo de abertura inédito na sequência: '{termo}'")
                        break

                # Normalização do score
                score = min(1.0, round(score, 3))

                if score >= self.threshold_corte:
                    candidatos.append(num_pag)

            detalhes.append({
                "pagina": num_pag,
                "score_corte": score,
                "eh_candidato": (score >= self.threshold_corte or i == 0),
                "motivos": motivos
            })

        tempo_ms = round((time.perf_counter() - inicio_t) * 1000, 2)

        return {
            "paginas_candidatas": sorted(list(set(candidatos))),
            "tempo_execucao_ms": tempo_ms,
            "detalhes": detalhes
        }
