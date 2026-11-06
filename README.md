# ⚖️ Document AI Factory — LexOrganize

> **Hack Garanhuns Tech 2026** — Desafio 3 (Bernhoeft GRT): Segmentação Inteligente e Gestão de Documentos Jurídicos com IA & HITL.

Plataforma jurídica de alta performance construída para orquestrar fatiamento de lotes monolíticos digitalizados, classificação tipológica automatizada, auditoria de conformidade LGPD e pesquisa avançada multi-documento.

---

## 🚀 Funcionalidades

### 1. Landing Page Premium (LexOrganize)
- **Hero Cinematográfico em Tela Inteira (100vh):** Fundo visual de alta resolução com a estátua da Justiça e documentos flutuantes, iluminação dourada e cabeçalho transparente.
- **Tipografia Editorial & Design:** Lettering balanceado, paleta em preto obsidiana, ardósia e ouro metálico acetinado (`#dfba73`).
- **Showcase Interativo:** Demonstração visual do acervo categorizado (Contratos, Processos, Petições, Outros).

### 2. Portal de Autenticação do Operador
- Modal de autenticação para advogados e analistas com preenchimento de demonstração em 1 clique.

### 3. Dashboard do Operador (Workbench Jurídico)
- **Pesquisa de Vários Documentos (Multi-Documento):**
  - Omni-search bar com filtros rápidos por tipo documental (*Contratos*, *ASO Médico*, *CNH/RG*, *Petições*, etc.).
  - Layout *Master-Detail*: Tabela de alta densidade com metadados jurídicos e conformidade LGPD à esquerda + Inspetor Documental com réplica de folha digital e hash SHA-256 à direita.
  - Preparado para integração via `POST /api/documents/search-batch`.
- **Organizar Documentos com IA (Esteira de Triagem & Fatiamento):**
  - *Mesa de Triagem Digital*: Linha do tempo visual exibindo o fluxo de páginas digitalizadas (Páginas 1 a 6).
  - *Divisores de Corte IA (Split Boundaries)*: Indicação visual dos pontos exatos de separação documental gerados pelo motor multimodal.
  - *Fila de Revisão Humana (HITL)*: Sinalização para páginas com baixa nitidez ou validação de assinatura com aprovação em 1 clique.
  - Preparado para integração via `POST /api/documents/organize`.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (Ícones vetoriais)
- **Google Fonts** (*Plus Jakarta Sans* & *JetBrains Mono*)

---

## 📦 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/MurilloK14/document_ai_factory.git
cd document_ai_factory

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse no navegador: `http://localhost:5173/`

### Build para Produção

```bash
npm run build
npm run preview
```

---

## 🔒 Conformidade & Segurança
- **LGPD by Design:** Detecção de sensibilidade e conformidade regulatória (ex: verificação de atestados ocupacionais sem CID - NR-7).
- **Human-in-the-Loop:** Garantia de supervisão humana quando o score de confiança tipológica for inferior a 80%.
