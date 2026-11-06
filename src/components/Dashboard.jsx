import React, { useState, useEffect, useRef } from 'react';
import {
  Scale,
  Search,
  Upload,
  FileText,
  Folder,
  Layers,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Calendar,
  Filter,
  User,
  Shield,
  Download,
  ArrowRight,
  Database,
  Tag,
  Check,
  ChevronRight,
  Sparkles,
  Cpu,
  Clock,
  Eye,
  FileCheck,
  RotateCcw,
  Scissors,
  ExternalLink,
  ChevronDown,
  Info,
  CheckCheck,
  FileCode,
  Lock,
  ArrowLeft,
  RefreshCw,
  FileUp,
  Activity,
  AlertCircle
} from 'lucide-react';

export default function Dashboard({ user, onLogout, onBackToSite }) {
  // Navigation: 'search' (Pesquisa Multi-Documento) | 'organize' (Organizar com IA) | 'library' (Acervo)
  const [activeTab, setActiveTab] = useState('organize');

  // Backend status and connectivity
  const [backendOnline, setBackendOnline] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fileInputRef = useRef(null);

  // =========================================================================
  // BATCH DATA & SEGMENTATION STATE (INTEGRADO COM FastAPI /api/processar-lote)
  // =========================================================================
  const [batchInfo, setBatchInfo] = useState({
    loteId: 'benchmark_141p',
    nomeArquivo: 'lote_processual_concursal_141pags.pdf',
    totalPaginas: 141,
    totalDocumentos: 7,
    tempoMlMs: 142.5,
    fronteirasMl: [1, 11, 23, 117, 118, 121, 125],
    aprovadosAuto: 6,
    pendentesRevisao: 1
  });

  const [segmentedDocuments, setSegmentedDocuments] = useState([
    {
      doc_id: 1,
      categoria_macro: 'Jurídico / Processual',
      tipo_documento: 'Recuperação Judicial',
      subtipo_detalhe: 'Decisão Judicial de Deferimento',
      envolvidos: ['Indústrias Metalúrgicas Reunidas S.A.', 'Banco Safra S.A.', 'Itaú Unibanco'],
      juiz: 'Dr. Alexandre de Carvalho Freitas',
      data_processo: '2024-03-15',
      pagina_inicio: 1,
      pagina_fim: 10,
      total_paginas_doc: 10,
      paginas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      confianca: 0.98,
      status_revisao: 'APROVADO_AUTOMATICO',
      motivo_revisao: null,
      ocr_resumo_lgpd: 'PODER JUDICIÁRIO - TRIBUNAL DE JUSTIÇA DO ESTADO. 2ª Vara de Falências e Recuperações Judiciais. Processo nº 1048291-44.2024.8.26.0100. Vistos etc. Trata-se de pedido de Recuperação Judicial formulado por Indústrias Metalúrgicas Reunidas S.A., inscrita no CNPJ [CNPJ_OCULTO]...',
      nome_arquivo: 'doc_1_Jurídico_Processual_Recuperação_Judicial_p1_a_10.pdf',
      url_download: '/api/download/doc_1_Jurídico_Processual_Recuperação_Judicial_p1_a_10.pdf'
    },
    {
      doc_id: 2,
      categoria_macro: 'Jurídico / Processual',
      tipo_documento: 'Certidão / Termo Processual',
      subtipo_detalhe: 'Certidão de Consulta e Intimação de Credores',
      envolvidos: ['Cartório da 2ª Vara de Falências e Recuperações Judiciais'],
      juiz: null,
      data_processo: '2024-03-22',
      pagina_inicio: 11,
      pagina_fim: 22,
      total_paginas_doc: 12,
      paginas: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      confianca: 0.94,
      status_revisao: 'APROVADO_AUTOMATICO',
      motivo_revisao: null,
      ocr_resumo_lgpd: 'CERTIDÃO DE PUBLICAÇÃO DE EDITAL DE CREDORES. Certifico e dou fé que nesta data foi publicado no Diário da Justiça Eletrônico o edital de intimação com a relação nominal de credores da Recuperanda...',
      nome_arquivo: 'doc_2_Jurídico_Processual_Certidão_Termo_Processual_p11_a_22.pdf',
      url_download: '/api/download/doc_2_Jurídico_Processual_Certidão_Termo_Processual_p11_a_22.pdf'
    },
    {
      doc_id: 3,
      categoria_macro: 'Jurídico / Processual',
      tipo_documento: 'Plano de Recuperação Judicial',
      subtipo_detalhe: 'Plano Estruturado de Reestruturação do Passivo Concursal',
      envolvidos: ['Indústrias Metalúrgicas Reunidas S.A.', 'Comitê Geral de Credores'],
      juiz: null,
      data_processo: '2024-04-10',
      pagina_inicio: 23,
      pagina_fim: 116,
      total_paginas_doc: 94,
      paginas: [23, 24, 25, 26, 27, 28, 29, 30],
      confianca: 0.96,
      status_revisao: 'APROVADO_AUTOMATICO',
      motivo_revisao: null,
      ocr_resumo_lgpd: 'PLANO ESTRUTURADO DE RECUPERAÇÃO JUDICIAL. Capítulo I - Da Viabilidade Econômico-Financeira da Atividade Produtiva. A Recuperanda apresenta nos termos do art. 53 da Lei 11.101/2005...',
      nome_arquivo: 'doc_3_Jurídico_Processual_Plano_de_Recuperação_Judicial_p23_a_116.pdf',
      url_download: '/api/download/doc_3_Jurídico_Processual_Plano_de_Recuperação_Judicial_p23_a_116.pdf'
    },
    {
      doc_id: 4,
      categoria_macro: 'Administrativo',
      tipo_documento: 'Requisição de Despesa / Suprimentos',
      subtipo_detalhe: 'Formulário de Requisição de Despesa - Suprimentos',
      envolvidos: ['Departamento Financeiro', 'PricewaterhouseCoopers'],
      juiz: null,
      data_processo: '2024-05-02',
      pagina_inicio: 117,
      pagina_fim: 117,
      total_paginas_doc: 1,
      paginas: [117],
      confianca: 0.92,
      status_revisao: 'APROVADO_AUTOMATICO',
      motivo_revisao: null,
      ocr_resumo_lgpd: 'FORMULÁRIO INTERNO DE REQUISIÇÃO DE DESPESA (RD-2024/091). Centro de Custo: Controladoria Central. Descrição do Pagamento: Honorários de perícia contábil prévia da Recuperação Judicial. Valor: R$ 45.000,00...',
      nome_arquivo: 'doc_4_Administrativo_Requisição_de_Despesa_Suprimentos_p117_a_117.pdf',
      url_download: '/api/download/doc_4_Administrativo_Requisição_de_Despesa_Suprimentos_p117_a_117.pdf'
    },
    {
      doc_id: 5,
      categoria_macro: 'Administrativo',
      tipo_documento: 'Ordem de Compra / Contratação',
      subtipo_detalhe: 'Ordem de Compra (OC-2024/8892) - Serviços Especializados',
      envolvidos: ['Gerência de Suprimentos', 'TechServices Consultoria Ltda'],
      juiz: null,
      data_processo: '2024-05-03',
      pagina_inicio: 118,
      pagina_fim: 120,
      total_paginas_doc: 3,
      paginas: [118, 119, 120],
      confianca: 0.89,
      status_revisao: 'APROVADO_AUTOMATICO',
      motivo_revisao: null,
      ocr_resumo_lgpd: 'ORDEM DE COMPRA (OC) Nº 8892/2024. Fornecedor: TechServices Consultoria Ltda. CNPJ: [CNPJ_OCULTO]. Condições de Pagamento: 30 dias após emissão da NF...',
      nome_arquivo: 'doc_5_Administrativo_Ordem_de_Compra_Contratação_p118_a_120.pdf',
      url_download: '/api/download/doc_5_Administrativo_Ordem_de_Compra_Contratação_p118_a_120.pdf'
    },
    {
      doc_id: 6,
      categoria_macro: 'Societário / Contratos',
      tipo_documento: 'Contrato Social / Alteração Contratual',
      subtipo_detalhe: '14ª Alteração Contratual e Consolidação do Estatuto Social',
      envolvidos: ['Sócios Administradores', 'Junta Comercial do Estado'],
      juiz: null,
      data_processo: '2024-05-10',
      pagina_inicio: 121,
      pagina_fim: 124,
      total_paginas_doc: 4,
      paginas: [121, 122, 123, 124],
      confianca: 0.72,
      status_revisao: 'REVISAO_NECESSARIA',
      motivo_revisao: 'Confiança abaixo do limiar de segurança (0.80); carimbo de autenticação com baixa legibilidade na margem esquerda.',
      ocr_resumo_lgpd: 'DÉCIMA QUARTA ALTERAÇÃO CONTRATUAL DA SOCIEDADE. Pelo presente instrumento particular, os sócios decidem pela alteração da sede social e aumento do capital subscrito...',
      nome_arquivo: 'doc_6_Societário_Contratos_Contrato_Social_Alteraç_p121_a_124.pdf',
      url_download: '/api/download/doc_6_Societário_Contratos_Contrato_Social_Alteraç_p121_a_124.pdf'
    },
    {
      doc_id: 7,
      categoria_macro: 'Financeiro / Contábil',
      tipo_documento: 'Demonstrações Financeiras e Relatório de Auditoria',
      subtipo_detalhe: 'Balanço Patrimonial, DRE e Relatório dos Auditores Independentes',
      envolvidos: ['KPMG Auditores Independentes', 'Diretoria de Relações com Investidores'],
      juiz: null,
      data_processo: '2024-05-18',
      pagina_inicio: 125,
      pagina_fim: 141,
      total_paginas_doc: 17,
      paginas: [125, 126, 127, 128, 129, 130],
      confianca: 0.95,
      status_revisao: 'APROVADO_AUTOMATICO',
      motivo_revisao: null,
      ocr_resumo_lgpd: 'RELATÓRIO DOS AUDITORES INDEPENDENTES SOBRE AS DEMONSTRAÇÕES FINANCEIRAS. Aos Administradores e Acionistas. Examinamos as demonstrações financeiras consolidadas...',
      nome_arquivo: 'doc_7_Financeiro_Contábil_Demonstrações_Financeiras_p125_a_141.pdf',
      url_download: '/api/download/doc_7_Financeiro_Contábil_Demonstrações_Financeiras_p125_a_141.pdf'
    }
  ]);

  const [selectedDocId, setSelectedDocId] = useState(1);
  const [selectedPageForPreview, setSelectedPageForPreview] = useState(1);

  // =========================================================================
  // SEARCH TAB: REAL OCR SEARCH & MULTI-DOCUMENT QUERY
  // =========================================================================
  const [searchQuery, setSearchQuery] = useState('Recuperação Judicial');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Todos');
  const [ocrSearchResults, setOcrSearchResults] = useState(null);
  const [isSearchingOcr, setIsSearchingOcr] = useState(false);

  // Active selected document in inspector pane
  const activeDoc = segmentedDocuments.find(d => d.doc_id === selectedDocId) || segmentedDocuments[0];

  // =========================================================================
  // INITIAL DATA SYNC WITH BACKEND
  // =========================================================================
  const checkBackendStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setBackendOnline(true);
        setServerInfo(data);
        return true;
      }
    } catch {
      setBackendOnline(false);
    }
    return false;
  };

  const loadBatchFromBackend = async () => {
    try {
      const res = await fetch('/api/lote-atual');
      if (res.ok) {
        const data = await res.json();
        if (data.segmentacao && data.segmentacao.length > 0) {
          setSegmentedDocuments(data.segmentacao);
          setBatchInfo({
            loteId: data.lote_id || 'lote_ativo',
            nomeArquivo: data.nome_arquivo || 'lote_documental_ativo.pdf',
            totalPaginas: data.total_paginas_lote || 141,
            totalDocumentos: data.total_documentos_detectados || data.segmentacao.length,
            tempoMlMs: data.motor_ml_local?.tempo_processamento_ms || 142.5,
            fronteirasMl: data.motor_ml_local?.fronteiras_detectadas_ml || [1, 11, 23, 117, 118, 121, 125],
            aprovadosAuto: data.resumo_fila_revisao?.aprovados_automatico || 6,
            pendentesRevisao: data.resumo_fila_revisao?.pendentes_revisao_humana || 1
          });
          setSelectedDocId(data.segmentacao[0].doc_id);
        }
      }
    } catch {
      // Offline fallback state already initialized
    }
  };

  useEffect(() => {
    checkBackendStatus().then(online => {
      if (online) {
        loadBatchFromBackend();
      }
    });
  }, []);

  // Show auto-dismissing toast notifications
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // =========================================================================
  // FUNÇÃO 1: UPLOAD REAL DE PDF PARA A ESTEIRA DE IA (POST /api/processar-lote)
  // =========================================================================
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Apenas arquivos no formato PDF são suportados.');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);
    setProcessingStage('1/3: Extraindo páginas e executando Machine Learning local (TF-IDF + Cosine Distance Drop)...');

    const formData = new FormData();
    formData.append('file', file);

    const stageTimer1 = setTimeout(() => {
      setProcessingStage('2/3: Auditoria Semântica com Gemini 3.8 Flash e delimitação de fronteiras...');
    }, 1800);

    const stageTimer2 = setTimeout(() => {
      setProcessingStage('3/3: Fatiando fisicamente PDFs individuais e mascarando dados LGPD...');
    }, 3600);

    try {
      const response = await fetch('/api/processar-lote', {
        method: 'POST',
        body: formData
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.segmentacao && data.segmentacao.length > 0) {
        setSegmentedDocuments(data.segmentacao);
        setBatchInfo({
          loteId: data.lote_id || 'novo_lote',
          nomeArquivo: file.name,
          totalPaginas: data.total_paginas_lote,
          totalDocumentos: data.total_documentos_detectados,
          tempoMlMs: data.motor_ml_local?.tempo_processamento_ms || 120,
          fronteirasMl: data.motor_ml_local?.fronteiras_detectadas_ml || [],
          aprovadosAuto: data.resumo_fila_revisao?.aprovados_automatico || 0,
          pendentesRevisao: data.resumo_fila_revisao?.pendentes_revisao_humana || 0
        });
        setSelectedDocId(data.segmentacao[0].doc_id);
        triggerToast(`Lote processado com sucesso! ${data.total_documentos_detectados} documentos gerados.`);
      }
    } catch (err) {
      console.warn('Backend call failed, using resilient offline simulation:', err);
      setUploadError(`Servidor de processamento retornou: ${err.message}. Verifique se o backend FastAPI está ativo.`);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // =========================================================================
  // FUNÇÃO 2: APROVAÇÃO NA FILA DE REVISÃO HUMANA (PATCH /api/revisao/{doc_id})
  // =========================================================================
  const handleApproveHitl = async (docId) => {
    try {
      const res = await fetch(`/api/revisao/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_revisao: 'APROVADO_HUMANO' })
      });

      if (res.ok) {
        triggerToast(`Documento #${docId} aprovado pelo analista de backoffice!`);
      }
    } catch {
      // Local state update still occurs
    }

    setSegmentedDocuments(prev =>
      prev.map(doc =>
        doc.doc_id === docId
          ? {
              ...doc,
              status_revisao: 'APROVADO_HUMANO',
              motivo_revisao: 'Validado manualmente pelo analista de backoffice.'
            }
          : doc
      )
    );

    setBatchInfo(prev => ({
      ...prev,
      aprovadosAuto: prev.aprovadosAuto + 1,
      pendentesRevisao: Math.max(0, prev.pendentesRevisao - 1)
    }));
  };

  // =========================================================================
  // FUNÇÃO 3: BUSCA NO OCR COMPLETO DO LOTE (GET /api/buscar-ocr?q=...)
  // =========================================================================
  const handleOcrSearch = async (term) => {
    const q = term !== undefined ? term : searchQuery;
    if (!q || q.trim().length < 2) {
      setOcrSearchResults(null);
      return;
    }

    setIsSearchingOcr(true);
    try {
      const res = await fetch(`/api/buscar-ocr?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOcrSearchResults(data);
      } else {
        setOcrSearchResults(null);
      }
    } catch {
      setOcrSearchResults(null);
    } finally {
      setIsSearchingOcr(false);
    }
  };

  const handleDownloadZip = () => {
    window.open('/api/download-zip', '_blank');
  };

  const handleDownloadSingleDoc = (nomeArquivo) => {
    if (!nomeArquivo) return;
    window.open(`/api/download/${encodeURIComponent(nomeArquivo)}`, '_blank');
  };

  // Filtered documents list for the search view
  const filteredDocuments = segmentedDocuments.filter(doc => {
    const matchesCategory =
      selectedCategoryFilter === 'Todos' ||
      doc.categoria_macro.toLowerCase().includes(selectedCategoryFilter.toLowerCase());

    const term = searchQuery.toLowerCase().trim();
    if (!term) return matchesCategory;

    const matchesText =
      doc.tipo_documento.toLowerCase().includes(term) ||
      doc.subtipo_detalhe.toLowerCase().includes(term) ||
      doc.envolvidos.some(e => e.toLowerCase().includes(term)) ||
      (doc.ocr_resumo_lgpd && doc.ocr_resumo_lgpd.toLowerCase().includes(term));

    return matchesCategory && matchesText;
  });

  return (
    <div className="min-h-screen bg-[#07080b] text-[#e2e8f0] flex flex-col md:flex-row font-sans selection:bg-[#dfba73]/30 selection:text-white">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#161b26] border border-[#dfba73]/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#dfba73] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          SIDEBAR DO WORKSPACE JURÍDICO
          ========================================================================= */}
      <aside className="w-full md:w-64 bg-[#0b0d14] border-r border-white/[0.07] flex flex-col justify-between shrink-0">
        
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-white/[0.07] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#dfba73]/15 border border-[#dfba73]/30 flex items-center justify-center text-[#dfba73]">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">LexOrganize</span>
                <span className="block text-[10px] font-semibold text-[#dfba73] tracking-widest uppercase">WORKSPACE IA</span>
              </div>
            </div>

            {/* Backend Connection Badge */}
            <div
              title={backendOnline ? 'Backend FastAPI conectado' : 'Backend offline (modo demonstração resiliente)'}
              className={`w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-amber-400'}`}
            />
          </div>

          {/* Engine Status Tag */}
          <div className="px-4 py-2.5 mx-3 mt-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5 text-[#dfba73]" />
              {backendOnline ? 'FastAPI Online' : 'Modo Standby'}
            </span>
            <span className="text-[10px] bg-[#dfba73]/10 text-[#dfba73] px-2 py-0.5 rounded font-mono font-bold">
              Gemini 3.8
            </span>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Operações Principais
            </div>

            {/* TAB 1: Organizar com IA */}
            <button
              onClick={() => setActiveTab('organize')}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-medium flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'organize'
                  ? 'bg-white/[0.07] text-[#dfba73] font-semibold border border-[#dfba73]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Scissors className={`w-4 h-4 ${activeTab === 'organize' ? 'text-[#dfba73]' : 'text-slate-400'}`} />
                <span>Organizar & Fatiar</span>
              </div>
              <span className="text-[10px] bg-[#dfba73]/20 text-[#dfba73] px-1.5 py-0.5 rounded font-mono font-bold">
                {segmentedDocuments.length} docs
              </span>
            </button>

            {/* TAB 2: Pesquisa Multi-Documento */}
            <button
              onClick={() => setActiveTab('search')}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-medium flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-white/[0.07] text-[#dfba73] font-semibold border border-[#dfba73]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className={`w-4 h-4 ${activeTab === 'search' ? 'text-[#dfba73]' : 'text-slate-400'}`} />
                <span>Pesquisa OCR Lote</span>
              </div>
              <span className="text-[10px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded font-mono font-medium">
                141 págs
              </span>
            </button>

            {/* TAB 3: Acervo Digital */}
            <button
              onClick={() => setActiveTab('library')}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-[13px] font-medium flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-white/[0.07] text-[#dfba73] font-semibold border border-[#dfba73]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>Acervo Digital</span>
            </button>
          </div>
        </div>

        {/* Footer Profile */}
        <div className="p-4 border-t border-white/[0.07] space-y-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#dfba73]/20 border border-[#dfba73]/40 flex items-center justify-center text-[#dfba73] font-bold text-xs shrink-0">
              HM
            </div>
            <div className="overflow-hidden">
              <div className="text-[12.5px] font-bold text-white truncate">{user?.name || 'Dra. Helena Martins'}</div>
              <div className="text-[10.5px] text-slate-400 truncate">{user?.oab || 'OAB/PE 45.892 • Sênior'}</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onBackToSite}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portal</span>
            </button>
            <button
              onClick={onLogout}
              title="Encerrar Sessão"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 bg-white/[0.02] hover:bg-red-500/10 border border-white/[0.06] transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* =========================================================================
          CONTEÚDO PRINCIPAL (MAIN OPERATIONS VIEWPORT)
          ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Workspace Topbar */}
        <header className="h-16 px-6 border-b border-white/[0.07] bg-[#090b10] flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-white">
              {activeTab === 'organize' && 'Esteira de Fatiamento & Classificação com IA'}
              {activeTab === 'search' && 'Pesquisa Transversal em Lotes & Busca no OCR'}
              {activeTab === 'library' && 'Repositório de Documentos Validados'}
            </h2>
            <span className="text-[10px] bg-white/[0.06] text-slate-400 px-2 py-0.5 rounded border border-white/[0.08] font-mono">
              Lote: {batchInfo.loteId}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Hidden Real File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <FileUp className="w-3.5 h-3.5 text-[#dfba73]" />
              <span>Enviar Novo Lote (.PDF)</span>
            </button>

            <button
              onClick={handleDownloadZip}
              className="bg-gold-btn px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Lote (.ZIP)</span>
            </button>
          </div>
        </header>

        {/* Dynamic Processing Status Modal/Overlay */}
        {isProcessing && (
          <div className="p-4 mx-6 mt-6 rounded-2xl bg-[#0f131d] border border-[#dfba73]/40 shadow-xl flex items-center gap-4 animate-pulse">
            <RefreshCw className="w-5 h-5 text-[#dfba73] animate-spin shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-bold text-white">Processando Documento no Backend FastAPI...</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{processingStage}</div>
            </div>
          </div>
        )}

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="p-4 mx-6 mt-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
            >
              Dispensar
            </button>
          </div>
        )}

        {/* Viewport Content */}
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">

          {/* =====================================================================
              FUNÇÃO 2: ORGANIZAR DOCUMENTOS COM IA (ESTEIRA DE FATIAMENTO)
              Page Stream Slicing Matrix & Digital Triagem Studio
              ===================================================================== */}
          {activeTab === 'organize' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Batch Metrics Card */}
              <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.08] shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#dfba73]/15 border border-[#dfba73]/30 flex items-center justify-center text-[#dfba73] shrink-0">
                    <Scissors className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Mesa de Triagem & Fatiamento Digital</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                        Ativo
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Arquivo: <strong className="text-slate-200">{batchInfo.nomeArquivo}</strong> • {batchInfo.totalPaginas} páginas no lote • {batchInfo.totalDocumentos} documentos separados
                    </p>
                  </div>
                </div>

                {/* Algorithmic Performance Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Tempo ML Local</div>
                    <div className="text-xs font-mono font-bold text-[#dfba73] mt-0.5">{batchInfo.tempoMlMs} ms</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Fronteiras ML</div>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">{batchInfo.fronteirasMl.length} cortes</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Aprovados Auto</div>
                    <div className="text-xs font-mono font-bold text-blue-400 mt-0.5">{batchInfo.aprovadosAuto} docs</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Fila HITL</div>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">{batchInfo.pendentesRevisao} pendente</div>
                  </div>
                </div>
              </div>

              {/* Visual Page Stream Matrix with Explicit Split Lines */}
              <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.08] shadow-lg space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#dfba73]" />
                    <span>Fluxo Contínuo de Páginas & Divisores de Fronteira (Scikit-Learn + Gemini Flash)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Clique em qualquer página ou documento para inspecionar
                  </span>
                </div>

                {/* Horizontal Page Strip with Scissors Cut Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {segmentedDocuments.map((doc, idx) => {
                    const isSelected = selectedDocId === doc.doc_id;
                    const isHitl = doc.status_revisao === 'REVISAO_NECESSARIA';

                    return (
                      <div
                        key={doc.doc_id}
                        onClick={() => {
                          setSelectedDocId(doc.doc_id);
                          setSelectedPageForPreview(doc.pagina_inicio);
                        }}
                        className={`relative p-3.5 rounded-xl bg-[#141822] border transition-all cursor-pointer flex flex-col justify-between h-52 ${
                          isSelected
                            ? 'border-[#dfba73] ring-1 ring-[#dfba73] bg-[#1a1f2c]'
                            : isHitl
                            ? 'border-amber-500/40 hover:border-amber-500/60'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-400">
                            P.{doc.pagina_inicio} - {doc.pagina_fim}
                          </span>
                          <span className="text-[#dfba73] font-semibold">Doc #{doc.doc_id}</span>
                        </div>

                        <div className="my-auto text-center space-y-1">
                          <FileText className={`w-8 h-8 mx-auto ${isSelected ? 'text-[#dfba73]' : isHitl ? 'text-amber-400' : 'text-slate-500'}`} />
                          <div className="text-[11px] font-bold text-white line-clamp-2">
                            {doc.tipo_documento}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {doc.categoria_macro}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono">
                          <span className="text-slate-400">{doc.total_paginas_doc} {doc.total_paginas_doc === 1 ? 'pág' : 'págs'}</span>
                          {idx < segmentedDocuments.length - 1 ? (
                            <span className="text-amber-400 font-semibold">Corte ✂</span>
                          ) : (
                            <span className="text-emerald-400 font-semibold">Fim Lote ✓</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Segmented Documents Table & Human Approval */}
              <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.08] shadow-lg space-y-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Documentos Independentes Resultantes do Fatiamento Físico</span>
                  <span className="text-slate-400 font-normal">Motor Multimodal Gemini 3.8 + Local DBD</span>
                </div>

                <div className="space-y-3">
                  {segmentedDocuments.map((doc) => {
                    const isHitl = doc.status_revisao === 'REVISAO_NECESSARIA';
                    const isSelected = selectedDocId === doc.doc_id;

                    return (
                      <div
                        key={doc.doc_id}
                        className={`p-4 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-[#dfba73]/40 bg-[#dfba73]/[0.03]'
                            : isHitl
                            ? 'border-amber-500/40 bg-amber-500/[0.03]'
                            : 'border-white/[0.07] bg-[#10141d]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0 mt-0.5">
                            {String(doc.doc_id).padStart(2, '0')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-[#dfba73] uppercase tracking-wider">
                                {doc.categoria_macro}
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-xs text-slate-400 font-mono">
                                Páginas {doc.pagina_inicio} a {doc.pagina_fim} ({doc.total_paginas_doc} {doc.total_paginas_doc === 1 ? 'folha' : 'folhas'})
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-white mt-0.5">
                              {doc.tipo_documento} — <span className="text-slate-300 font-normal">{doc.subtipo_detalhe}</span>
                            </h4>

                            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                              <span>Partes: <strong className="text-slate-200">{doc.envolvidos.join(', ')}</strong></span>
                              {doc.juiz && (
                                <>
                                  <span>•</span>
                                  <span>Juiz: <strong className="text-slate-200">{doc.juiz}</strong></span>
                                </>
                              )}
                              {doc.data_processo && (
                                <>
                                  <span>•</span>
                                  <span>Data: <strong className="text-slate-200">{doc.data_processo}</strong></span>
                                </>
                              )}
                            </div>

                            {doc.motivo_revisao && isHitl && (
                              <div className="text-[11px] text-amber-400 flex items-center gap-1.5 mt-2 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>{doc.motivo_revisao}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                          <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            {Math.round(doc.confianca * 100)}% Confiança
                          </span>

                          {isHitl ? (
                            <button
                              onClick={() => handleApproveHitl(doc.doc_id)}
                              className="bg-gold-btn px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow hover:brightness-110 transition-all"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Validar (HITL)</span>
                            </button>
                          ) : (
                            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              {doc.status_revisao === 'APROVADO_HUMANO' ? 'Validado por Helena Martins' : 'Aprovado Automático'}
                            </span>
                          )}

                          <button
                            onClick={() => handleDownloadSingleDoc(doc.nome_arquivo)}
                            title={`Baixar ${doc.nome_arquivo}`}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

          {/* =====================================================================
              FUNÇÃO 1: PESQUISA MULTI-DOCUMENTO & BUSCA REAL NO OCR
              ===================================================================== */}
          {activeTab === 'search' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Filter and Search Bar */}
              <div className="p-5 rounded-2xl bg-[#0d1017] border border-white/[0.08] shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  
                  {/* Search Input Box */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleOcrSearch(e.target.value);
                      }}
                      placeholder="Pesquise por termo no OCR (ex: Recuperação, KPMG, CNPJ, Despesa, Credores)..."
                      className="w-full bg-[#141822] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#dfba73] transition-colors"
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {['Todos', 'Jurídico', 'Administrativo', 'Societário', 'Financeiro'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategoryFilter === cat
                            ? 'bg-[#dfba73] text-black font-bold shadow'
                            : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>
                    Exibindo <strong>{filteredDocuments.length}</strong> de {segmentedDocuments.length} documentos correspondentes
                  </span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Anonimização LGPD Automática Ativa
                  </span>
                </div>
              </div>

              {/* Real OCR Match Highlight (When available from FastAPI) */}
              {ocrSearchResults && ocrSearchResults.total_ocorrencias > 0 && (
                <div className="p-5 rounded-2xl bg-[#0e1626] border border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#dfba73]" />
                      <span>{ocrSearchResults.total_ocorrencias} Ocorrência(s) de "{ocrSearchResults.termo_pesquisado}" no OCR do Lote</span>
                    </h4>
                    <span className="text-[10px] text-blue-400 font-mono">Índice In-Memory</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ocrSearchResults.ocorrencias.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          if (item.doc_id) setSelectedDocId(item.doc_id);
                        }}
                        className="p-3 rounded-xl bg-white/[0.03] border border-blue-500/20 hover:border-blue-500/40 cursor-pointer transition-all space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-[#dfba73]">Página {item.pagina_lote}</span>
                          <span className="text-slate-400">Doc #{item.doc_id}: {item.tipo_documento}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                          {item.trecho_encontrado}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Two Column Layout: Document Cards + Digital Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Results Column (7 Cols) */}
                <div className="lg:col-span-7 space-y-3">
                  {filteredDocuments.map(doc => {
                    const isSelected = selectedDocId === doc.doc_id;

                    return (
                      <div
                        key={doc.doc_id}
                        onClick={() => setSelectedDocId(doc.doc_id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-[#dfba73] bg-[#dfba73]/[0.05] ring-1 ring-[#dfba73]/50'
                            : 'border-white/[0.07] bg-[#0d1017] hover:border-white/20'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#dfba73] uppercase tracking-wider">
                              {doc.categoria_macro}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Págs {doc.pagina_inicio}-{doc.pagina_fim}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                            {doc.tipo_documento}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {doc.subtipo_detalhe}
                          </p>

                          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>Partes: <strong className="text-slate-200">{doc.envolvidos.slice(0, 2).join(', ')}</strong></span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0">
                          <span className="text-[10.5px] font-medium text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {Math.round(doc.confianca * 100)}% Confiança
                          </span>
                          <span className="text-[11px] text-[#dfba73] hover:underline font-semibold flex items-center gap-1">
                            Inspecionar <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Document Inspector Pane (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Digital Document Sheet Replica */}
                  <div className="bg-[#fcfcfd] text-[#1e293b] rounded-2xl p-6 shadow-xl border border-slate-200/80 relative overflow-hidden font-sans">
                    
                    {/* Watermark Crest Header */}
                    <div className="border-b border-slate-200 pb-4 mb-4 flex items-start justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Visualizador Documental
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 tracking-tight mt-0.5">
                          {activeDoc.tipo_documento}
                        </h4>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
                        <Scale className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Excerpt with highlight */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 text-xs leading-relaxed text-slate-700 font-mono mb-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                        OCR Extraído com Proteção LGPD:
                      </div>
                      <p className="italic">
                        {activeDoc.ocr_resumo_lgpd || 'Texto em processamento OCR...'}
                      </p>
                    </div>

                    {/* Parties and Judges Tags */}
                    <div className="space-y-2 mb-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Envolvidos e Órgão Julgador:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeDoc.envolvidos.map((p, i) => (
                          <span key={i} className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <Tag className="w-3 h-3 text-amber-700" />
                            {p}
                          </span>
                        ))}
                        {activeDoc.juiz && (
                          <span className="text-[11px] bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <Scale className="w-3 h-3 text-blue-700" />
                            {activeDoc.juiz}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-200 pt-3 text-slate-600">
                      <div>
                        <span className="block text-slate-400">Classificação Macro</span>
                        <strong className="text-slate-800">{activeDoc.categoria_macro}</strong>
                      </div>
                      <div>
                        <span className="block text-slate-400">Páginas</span>
                        <strong className="text-slate-800">
                          {activeDoc.pagina_inicio} a {activeDoc.pagina_fim} ({activeDoc.total_paginas_doc} págs)
                        </strong>
                      </div>
                      <div className="col-span-2 pt-1 font-mono text-[10px] text-slate-500 truncate">
                        Arquivo: {activeDoc.nome_arquivo}
                      </div>
                    </div>

                    {/* Inspector Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-slate-200 flex items-center gap-2">
                      <button 
                        onClick={() => handleDownloadSingleDoc(activeDoc.nome_arquivo)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Baixar PDF Fatiado
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(activeDoc.nome_arquivo);
                          triggerToast('Nome do arquivo copiado para a área de transferência!');
                        }}
                        className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      >
                        Copiar Nome
                      </button>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* =====================================================================
              FUNÇÃO 3: ACERVO DIGITAL (BIBLIOTECA COMPLETA)
              ===================================================================== */}
          {activeTab === 'library' && (
            <div className="p-8 rounded-2xl bg-[#0d1017] border border-white/[0.08] text-center space-y-4 animate-in fade-in duration-200">
              <Folder className="w-12 h-12 mx-auto text-[#dfba73]" />
              <h3 className="text-lg font-bold text-white">Acervo Digital Centralizado</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Todos os {segmentedDocuments.length} documentos fatiados, classificados e validados do lote estão armazenados com integridade e conformidade LGPD.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleDownloadZip}
                  className="bg-gold-btn px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow"
                >
                  <Download className="w-4 h-4" />
                  Baixar Todos os Arquivos (.ZIP)
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  Buscar no Acervo
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
