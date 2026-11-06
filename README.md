# ⚖️ Document AI Factory — LexOrganize

> **Hack Garanhuns Tech 2026** — Desafio 3 (Bernhoeft GRT): Segmentação Inteligente e Gestão de Documentos Jurídicos com IA & Human-In-The-Loop (HITL).

Plataforma jurídica de alta performance construída para orquestrar fatiamento de lotes monolíticos digitalizados, classificação tipológica automatizada, auditoria de conformidade LGPD e pesquisa avançada multi-documento.

---

## 🏛️ Arquitetura Integrada

```
+-------------------------------------------------------------+
|                LexOrganize Frontend (React 19 + Vite 8)      |
|  - Hero Cinematográfico (100vh) & Portal de Autenticação    |
|  - Mesa de Triagem & Fatiamento Digital (Timeline 1..N)     |
|  - Fila de Validação Human-in-the-Loop (HITL com 1 Clique)  |
|  - Pesquisa Transversal com Ocorrências no OCR do Lote      |
+------------------------------+------------------------------+
                               | Proxy (/api/*)
                               v
+-------------------------------------------------------------+
|               DocSplit AI Backend (FastAPI + Python)        |
|                                                             |
| [ESTÁGIO 1] ML Local (Scikit-Learn):                        |
|   - TF-IDF + Cosine Distance Drop (Queda de similaridade)   |
|   - Regex de CNJ & Vocativos Inéditos no Cabeçalho          |
|                                                             |
| [ESTÁGIO 2] Auditoria Semântica & Classificação:            |
|   - Gemini 3.8 Flash Multimodal (com fallback de resiliência)|
|   - Anonimização LGPD Automática (CPF/CNPJ Mascarados)       |
|                                                             |
| [ESTÁGIO 3] Fatiamento Físico & Distribuição:               |
|   - PyMuPDF (fitz) corta os PDFs individuais em disco       |
|   - Endpoints para Download Individual e Pacote Completo ZIP|
+-------------------------------------------------------------+
```

---

## 🚀 Funcionalidades Principais

### 1. Landing Page Premium
- **Hero Cinematográfico em Tela Inteira (100vh):** Fundo visual de alta resolução com a estátua da Justiça e documentos flutuantes, iluminação dourada e cabeçalho transparente.
- **Tipografia Editorial & Design:** Lettering balanceado, paleta em preto obsidiana, ardósia e ouro metálico acetinado (`#dfba73`).
- **Showcase Interativo:** Demonstração visual do acervo categorizado (Contratos, Processos, Petições, Outros).

### 2. Portal de Autenticação do Operador
- Modal de login para advogados e analistas com credenciais de demonstração rápida (Dra. Helena Martins - OAB/PE).

### 3. Dashboard Operacional (Workbench Jurídico)
- **Organizar Documentos com IA (Esteira de Triagem & Fatiamento):**
  - Upload real de lotes PDF via `POST /api/processar-lote`.
  - Visualização em fluxo contínuo de páginas com marcadores de corte (`✂ Fim de Doc`).
  - Indicadores de performance do modelo: tempo de processamento local (ms) e fronteiras ML detectadas.
  - Fila de Revisão Humana (HITL): sinalização de documentos com baixa confiança ou artefatos para aprovação em 1 clique via `PATCH /api/revisao/{doc_id}`.
  - Download individual de PDFs fatiados ou pacote consolidado via `GET /api/download-zip`.
- **Pesquisa Multi-Documento & Busca no OCR:**
  - Busca transversal nos textos indexados do lote via `GET /api/buscar-ocr?q=...`.
  - Destaque das ocorrências por página com contexto e proteção LGPD.
  - Inspetor documental lateral com réplica de folha digital e metadados.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19**
- **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (Ícones vetoriais)
- **Google Fonts** (*Plus Jakarta Sans* & *JetBrains Mono*)

### Backend
- **FastAPI** & **Uvicorn**
- **PyMuPDF (fitz)** (Manipulação e fatiamento físico de PDFs)
- **Scikit-Learn** (Vetorização TF-IDF e Similaridade de Cosseno)
- **Google GenAI SDK** (Gemini 3.8 Flash e Gemini 3.8 Pro)
- **Pillow (PIL)** (Processamento multimodal de páginas escaneadas)
- **Tenacity** (Resiliência e retry com backoff exponencial)

---

## 📦 Como Executar o Projeto Completo

### 1. Backend (FastAPI)

```bash
# Instale as dependências Python
pip install -r requirements.txt

# (Opcional) Configure sua chave da API Gemini
# export GEMINI_API_KEY="sua_chave_aqui" (Linux/Mac)
# set GEMINI_API_KEY="sua_chave_aqui" (Windows CMD)
# $env:GEMINI_API_KEY="sua_chave_aqui" (PowerShell)

# Inicie o servidor FastAPI na porta 8000
python -m uvicorn main:app --reload --port 8000
```

> **Nota de Resiliência:** Caso a chave `GEMINI_API_KEY` não seja fornecida no ambiente, o sistema ativa automaticamente o modo de contingência local usando as fronteiras preditas pelo motor Scikit-Learn.

### 2. Frontend (React 19 + Vite)

```bash
# Instale os pacotes npm
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse a aplicação no navegador em: `http://localhost:5173`.
O Vite está configurado para direcionar chamadas de `/api` diretamente para `http://localhost:8000`.

---

## 👥 Equipe
Projeto desenvolvido para o **Hack Garanhuns Tech 2026** — Desafio Bernhoeft GRT.
