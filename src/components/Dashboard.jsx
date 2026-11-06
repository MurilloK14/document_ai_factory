import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';

export default function Dashboard({ user, onLogout, onBackToSite }) {
  // Navigation: 'search' (Pesquisa Multi-Documento) | 'organize' (Organizar com IA) | 'library' (Acervo)
  const [activeTab, setActiveTab] = useState('search');

  // =========================================================================
  // FUNÇÃO 1: PESQUISA DE VÁRIOS DOCUMENTOS (ESTADOS PRONTOS PARA O BACKEND)
  // Payload pronto para POST /api/documents/search-batch
  // =========================================================================
  const [searchQuery, setSearchQuery] = useState('João da Silva rescisão');
  const [selectedTypes, setSelectedTypes] = useState(['Contratos', 'ASO Médico', 'CNH / RG']);
  const [dateFilter, setDateFilter] = useState('2024-2026');
  const [selectedDocId, setSelectedDocId] = useState('doc-1');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Available document types
  const allDocTypes = [
    'Todos',
    'Contratos',
    'ASO Médico',
    'CNH / RG',
    'Processos Trabalhistas',
    'Petições',
    'Certificados NRs'
  ];

  // Realistic legal document dataset for multi-document query results
  const searchResultsData = [
    {
      id: 'doc-1',
      title: 'Contrato de Prestação de Serviços - Alpha Engenharia.pdf',
      type: 'Contratos',
      titular: 'João da Silva',
      cpf: '***.412.890-**',
      date: '02/11/2025',
      pages: 3,
      compliance: 'Conforme LGPD',
      status: 'Válido e Assinado',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      clausulasDetectadas: ['Cláusula 4ª - Objeto e Prazo', 'Cláusula 8ª - Rescisão Imotivada (Aviso Prévio 30d)'],
      sha256: 'a9f24b89c02d184e9301fa3829dc7482',
      excerpt: '...pelo presente instrumento particular, a CONTRATANTE contrata os serviços especializados do profissional João da Silva, conforme discriminado no anexo técnico. Em caso de rescisão contratual, prevalecerá o aviso prévio de 30 (trinta) dias corridos...'
    },
    {
      id: 'doc-2',
      title: 'ASO Admissional - Exame Clínico Ocupacional.pdf',
      type: 'ASO Médico',
      titular: 'João da Silva',
      cpf: '***.412.890-**',
      date: '14/08/2025',
      pages: 2,
      compliance: 'Sem CID (NR-7 LGPD)',
      status: 'Apto para Função',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      clausulasDetectadas: ['Aptidão Clínica Ocupacional', 'Sem Exposição a Riscos Biológicos'],
      sha256: '7c819a3b904df821a92e104fca928371',
      excerpt: '...Atesto para os devidos fins da Norma Regulamentadora nº 7 (NR-7) que o colaborador João da Silva encontra-se APTO para o exercício das atividades laborais contratadas. Documento em estrita conformidade com a LGPD, isento de codificação CID...'
    },
    {
      id: 'doc-3',
      title: 'CNH Categoria B - Carteira Nacional de Habilitação.pdf',
      type: 'CNH / RG',
      titular: 'João da Silva',
      cpf: '***.412.890-**',
      date: '10/01/2025',
      pages: 1,
      compliance: 'Autenticado 99.4%',
      status: 'Documento Válido (2029)',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      clausulasDetectadas: ['Validação QR-Code DENATRAN', 'Identificação Biométrica Facial'],
      sha256: '18bfa92305ca7192df8301ecfa490182',
      excerpt: '...REPÚBLICA FEDERATIVA DO BRASIL - MINISTÉRIO DOS TRANSPORTES. Nome do Condutor: JOÃO DA SILVA. Registro CNH: 04928192019. Categoria: B. Validade do Exame: 10/01/2029. Emissão Digital Autenticada...'
    },
    {
      id: 'doc-4',
      title: 'Acordo Extrajudicial e Honorários Sucumbenciais.pdf',
      type: 'Petições',
      titular: 'Construtora Beta Ltda / João da Silva',
      cpf: '***.412.890-**',
      date: '28/10/2025',
      pages: 4,
      compliance: 'Revisão Pendente',
      status: 'Requer Validação Humana',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      clausulasDetectadas: ['Transação de Direitos', 'Quitação Ampla e Geral'],
      sha256: 'df302948ca9012fba82910faec718293',
      excerpt: '...As partes transacionam sobre as verbas rescisórias e honorários de sucumbência, concedendo mútua e irrevogável quitação com relação a todo e qualquer contrato pretérito firmado entre as partes...'
    }
  ];

  // Currently selected document in the inspector pane
  const activeDoc = searchResultsData.find(d => d.id === selectedDocId) || searchResultsData[0];

  const handleToggleDocType = (type) => {
    if (type === 'Todos') {
      setSelectedTypes([]);
      return;
    }
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // =========================================================================
  // FUNÇÃO 2: ORGANIZAR DOCUMENTOS (ESTEIRA IA / FATIAMENTO DE LOTES)
  // Payload pronto para POST /api/documents/organize
  // =========================================================================
  const [batchFile, setBatchFile] = useState({
    name: 'lote_juridico_digitalizado_alpha_06pags.pdf',
    size: '3.4 MB',
    pages: 6
  });
  const [selectedPageForPreview, setSelectedPageForPreview] = useState(1);
  const [hitlApproved, setHitlApproved] = useState(false);

  // Simulated Segmented Documents inside the monolithic PDF
  const segmentedDocuments = [
    {
      id: 'seg-1',
      docIndex: '01',
      title: 'Contrato Social Consolidado (Junta Comercial)',
      type: 'Contratos',
      pageRange: 'Páginas 1 a 3',
      confidence: 98.4,
      status: 'Aprovado Automático',
      pages: [1, 2, 3],
      color: 'border-blue-500/40 bg-blue-500/[0.03]'
    },
    {
      id: 'seg-2',
      docIndex: '02',
      title: 'CNH do Representante Legal da Contratada',
      type: 'Identificação',
      pageRange: 'Página 4 (Avulsa)',
      confidence: 99.6,
      status: 'Aprovado Automático',
      pages: [4],
      color: 'border-emerald-500/40 bg-emerald-500/[0.03]'
    },
    {
      id: 'seg-3',
      docIndex: '03',
      title: 'Petição de Acordo Extrajudicial e Honorários',
      type: 'Petições',
      pageRange: 'Páginas 5 e 6',
      confidence: 68.2,
      status: hitlApproved ? 'Validado por Dra. Helena' : 'Atenção: Revisão Humana (HITL)',
      pages: [5, 6],
      color: hitlApproved ? 'border-emerald-500/40 bg-emerald-500/[0.03]' : 'border-amber-500/40 bg-amber-500/[0.03]',
      warning: 'Assinatura digital com artefato gráfico na folha final'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07080b] text-[#e2e8f0] flex flex-col md:flex-row font-sans selection:bg-[#dfba73]/30 selection:text-white">
      
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
                <span className="block text-[10px] font-semibold text-[#dfba73] tracking-widest uppercase">WORKSPACE GRT</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Operações Principais
            </div>

            {/* TAB 1: Pesquisa Multi-Documento */}
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
                <span>Pesquisa em Lote</span>
              </div>
              <span className="text-[10px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded font-mono font-medium">
                4 docs
              </span>
            </button>

            {/* TAB 2: Organizar com IA */}
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
                <span>Organizar com IA</span>
              </div>
              <span className="text-[10px] bg-[#dfba73]/20 text-[#dfba73] px-1.5 py-0.5 rounded font-mono font-bold">
                Triagem
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
          WORKBENCH PRINCIPAL
          ========================================================================= */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/[0.07] bg-[#090b10]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Workspace Jurídico</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-semibold text-white">
              {activeTab === 'search' && 'Pesquisa Avançada em Vários Documentos'}
              {activeTab === 'organize' && 'Esteira de Segmentação & Triagem de Lotes'}
              {activeTab === 'library' && 'Biblioteca de Arquivos Indexados'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Ambiente Integrado</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">

          {/* =====================================================================
              FUNÇÃO 1: PESQUISA DE VÁRIOS DOCUMENTOS
              Omni-Search Bar + Master-Detail Table & Document Inspector
              ===================================================================== */}
          {activeTab === 'search' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Omni-Search Toolbar */}
              <div className="p-5 rounded-2xl bg-[#0d1017] border border-white/[0.08] shadow-lg space-y-4">
                
                {/* Search Bar Input */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Pesquisar por termos, cláusulas (ex: rescisão), nome do titular ou palavra-chave..."
                      className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 focus:border-[#dfba73] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#dfba73] transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`px-4 py-3 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
                        isFilterOpen
                          ? 'bg-[#dfba73]/15 text-[#dfba73] border-[#dfba73]/40'
                          : 'bg-white/[0.03] text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Filtros Avançados</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      onClick={() => alert("Simulação de exportação: Dossiê completo do titular gerado em .ZIP.")}
                      className="bg-gold-btn px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar Dossiê (.ZIP)</span>
                    </button>
                  </div>
                </div>

                {/* Filter Chips Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.05]">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                    Tipo de Documento:
                  </span>
                  {allDocTypes.map((type) => {
                    const isSelected = type === 'Todos' ? selectedTypes.length === 0 : selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleToggleDocType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#dfba73]/15 border-[#dfba73]/40 text-[#dfba73]'
                            : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:border-white/15'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>

                {/* Collapsible Advanced Filters */}
                {isFilterOpen && (
                  <div className="pt-3 border-t border-white/[0.05] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in duration-150">
                    <div>
                      <label className="block text-slate-400 mb-1">Titular / Pessoa Física</label>
                      <input
                        type="text"
                        defaultValue="João da Silva"
                        className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#dfba73]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Intervalo Temporal</label>
                      <input
                        type="text"
                        defaultValue="01/01/2024 até 05/11/2026"
                        className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#dfba73]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Conformidade LGPD</label>
                      <select className="w-full px-3 py-2 bg-[#0d1017] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#dfba73]">
                        <option>Qualquer Conformidade</option>
                        <option>Apenas Isentos de CID (NR-7)</option>
                        <option>Tarjamento Automático Aplicado</option>
                      </select>
                    </div>
                  </div>
                )}

              </div>

              {/* Master-Detail Dual Pane Workbench */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Master Table (7 Cols) */}
                <div className="lg:col-span-7 bg-[#0d1017] border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg">
                  <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#dfba73]" />
                      <span>Documentos Localizados ({searchResultsData.length})</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Indexação multitemática em 34ms
                    </span>
                  </div>

                  <div className="divide-y divide-white/[0.05]">
                    {searchResultsData.map((doc) => {
                      const isSelected = doc.id === activeDoc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => setSelectedDocId(doc.id)}
                          className={`p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-[#dfba73]/[0.08] border-l-3 border-[#dfba73]'
                              : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${doc.badgeColor}`}>
                                {doc.type}
                              </span>
                              <span className="text-[11px] text-slate-400">{doc.pages} págs</span>
                              <span className="text-[11px] text-slate-500">•</span>
                              <span className="text-[11px] text-slate-400">{doc.date}</span>
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                              {doc.title}
                            </h4>

                            <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>Titular: <strong className="text-slate-200">{doc.titular}</strong></span>
                              <span className="text-slate-500 font-mono">({doc.cpf})</span>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0">
                            <span className="text-[10.5px] font-medium text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {doc.compliance}
                            </span>
                            <span className="text-[11px] text-[#dfba73] hover:underline font-semibold flex items-center gap-1">
                              Inspecionar <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                          {activeDoc.type} — Folha Digital
                        </h4>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
                        <Scale className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Excerpt with highlight */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 text-xs leading-relaxed text-slate-700 font-mono mb-4">
                      <p className="italic">
                        {activeDoc.excerpt}
                      </p>
                    </div>

                    {/* Detected Clauses Tags */}
                    <div className="space-y-2 mb-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Cláusulas e Termos Indexados:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeDoc.clausulasDetectadas.map((c, i) => (
                          <span key={i} className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <Tag className="w-3 h-3 text-amber-700" />
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-200 pt-3 text-slate-600">
                      <div>
                        <span className="block text-slate-400">Titular Verificado</span>
                        <strong className="text-slate-800">{activeDoc.titular}</strong>
                      </div>
                      <div>
                        <span className="block text-slate-400">Data de Emissão</span>
                        <strong className="text-slate-800">{activeDoc.date}</strong>
                      </div>
                      <div className="col-span-2 pt-1 font-mono text-[10px] text-slate-500 truncate">
                        Hash SHA-256: {activeDoc.sha256}
                      </div>
                    </div>

                    {/* Inspector Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-slate-200 flex items-center gap-2">
                      <button 
                        onClick={() => alert(`Download de ${activeDoc.title} iniciado.`)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Baixar PDF
                      </button>
                      <button 
                        onClick={() => alert("Link autenticado copiado para a área de transferência.")}
                        className="py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      >
                        Copiar Link
                      </button>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* =====================================================================
              FUNÇÃO 2: ORGANIZAR DOCUMENTOS COM IA (ESTEIRA DE FATIAMENTO)
              Page Stream Slicing Matrix & Digital Triagem Studio
              ===================================================================== */}
          {activeTab === 'organize' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Batch Upload & Status Bar */}
              <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.08] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#dfba73]/15 border border-[#dfba73]/30 flex items-center justify-center text-[#dfba73] shrink-0">
                    <Scissors className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Mesa de Triagem & Fatiamento Digital</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                        Lote Carregado
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Arquivo: <strong className="text-slate-200">{batchFile.name}</strong> • {batchFile.pages} páginas digitalizadas • {batchFile.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => alert("Download dos 3 documentos fatiados individualmente (.ZIP).")}
                    className="bg-gold-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Todos os PDFs (.ZIP)</span>
                  </button>
                </div>
              </div>

              {/* Visual Page Stream Matrix with Explicit Split Lines */}
              <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.08] shadow-lg space-y-6">
                
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#dfba73]" />
                    <span>Fluxo Contínuo de Páginas e Divisores de Documento (Split Boundaries)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    3 documentos identificados pelo Gemini Flash Multimodal
                  </span>
                </div>

                {/* Horizontal Page Strip with Scissors Cut Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  
                  {/* Page 1 */}
                  <div 
                    onClick={() => setSelectedPageForPreview(1)}
                    className={`relative p-3 rounded-xl bg-[#141822] border transition-all cursor-pointer flex flex-col justify-between h-48 ${
                      selectedPageForPreview === 1 ? 'border-[#dfba73] ring-1 ring-[#dfba73]' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400">PÁG 01</span>
                      <span className="text-[#dfba73] font-semibold">Doc 01</span>
                    </div>
                    <div className="my-auto text-center space-y-1">
                      <FileText className="w-8 h-8 mx-auto text-slate-500" />
                      <div className="text-[11px] font-bold text-white">Cabeçalho</div>
                      <div className="text-[10px] text-slate-400">Contrato Social</div>
                    </div>
                    <div className="text-[9px] text-center text-emerald-400 font-mono">Início de Doc</div>
                  </div>

                  {/* Page 2 */}
                  <div 
                    onClick={() => setSelectedPageForPreview(2)}
                    className={`relative p-3 rounded-xl bg-[#141822] border transition-all cursor-pointer flex flex-col justify-between h-48 ${
                      selectedPageForPreview === 2 ? 'border-[#dfba73] ring-1 ring-[#dfba73]' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400">PÁG 02</span>
                      <span className="text-[#dfba73] font-semibold">Doc 01</span>
                    </div>
                    <div className="my-auto text-center space-y-1">
                      <FileText className="w-8 h-8 mx-auto text-slate-500" />
                      <div className="text-[11px] font-bold text-white">Cláusulas</div>
                      <div className="text-[10px] text-slate-400">Quotas Sociais</div>
                    </div>
                    <div className="text-[9px] text-center text-slate-500 font-mono">Continuação</div>
                  </div>

                  {/* Page 3 - End of Doc 1 */}
                  <div 
                    onClick={() => setSelectedPageForPreview(3)}
                    className={`relative p-3 rounded-xl bg-[#141822] border transition-all cursor-pointer flex flex-col justify-between h-48 ${
                      selectedPageForPreview === 3 ? 'border-[#dfba73] ring-1 ring-[#dfba73]' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400">PÁG 03</span>
                      <span className="text-[#dfba73] font-semibold">Doc 01</span>
                    </div>
                    <div className="my-auto text-center space-y-1">
                      <FileText className="w-8 h-8 mx-auto text-slate-500" />
                      <div className="text-[11px] font-bold text-white">Assinaturas</div>
                      <div className="text-[10px] text-slate-400">Junta Comercial</div>
                    </div>
                    <div className="text-[9px] text-center text-amber-400 font-mono">Fim do Doc 01 ✂</div>
                  </div>

                  {/* Page 4 - CNH (Doc 2) */}
                  <div 
                    onClick={() => setSelectedPageForPreview(4)}
                    className={`relative p-3 rounded-xl bg-[#141822] border transition-all cursor-pointer flex flex-col justify-between h-48 ${
                      selectedPageForPreview === 4 ? 'border-[#dfba73] ring-1 ring-[#dfba73]' : 'border-emerald-500/40 hover:border-emerald-500/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-emerald-400">PÁG 04</span>
                      <span className="text-emerald-400 font-semibold">Doc 02</span>
                    </div>
                    <div className="my-auto text-center space-y-1">
                      <Shield className="w-8 h-8 mx-auto text-emerald-400" />
                      <div className="text-[11px] font-bold text-white">CNH Digital</div>
                      <div className="text-[10px] text-slate-400">Documento Único</div>
                    </div>
                    <div className="text-[9px] text-center text-emerald-400 font-mono">100% Autônomo</div>
                  </div>

                  {/* Page 5 - Petição (Doc 3) */}
                  <div 
                    onClick={() => setSelectedPageForPreview(5)}
                    className={`relative p-3 rounded-xl bg-[#141822] border transition-all cursor-pointer flex flex-col justify-between h-48 ${
                      selectedPageForPreview === 5 ? 'border-[#dfba73] ring-1 ring-[#dfba73]' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400">PÁG 05</span>
                      <span className="text-purple-400 font-semibold">Doc 03</span>
                    </div>
                    <div className="my-auto text-center space-y-1">
                      <FileText className="w-8 h-8 mx-auto text-slate-500" />
                      <div className="text-[11px] font-bold text-white">Acordo</div>
                      <div className="text-[10px] text-slate-400">Petição Inicial</div>
                    </div>
                    <div className="text-[9px] text-center text-slate-500 font-mono">Início de Doc</div>
                  </div>

                  {/* Page 6 - Petição Termo Final */}
                  <div 
                    onClick={() => setSelectedPageForPreview(6)}
                    className={`relative p-3 rounded-xl bg-[#141822] border transition-all cursor-pointer flex flex-col justify-between h-48 ${
                      selectedPageForPreview === 6 ? 'border-[#dfba73] ring-1 ring-[#dfba73]' : 'border-amber-500/40 hover:border-amber-500/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-400">PÁG 06</span>
                      <span className="text-purple-400 font-semibold">Doc 03</span>
                    </div>
                    <div className="my-auto text-center space-y-1">
                      <AlertTriangle className="w-8 h-8 mx-auto text-amber-400" />
                      <div className="text-[11px] font-bold text-white">Assinatura</div>
                      <div className="text-[10px] text-amber-300">Revisão HITL</div>
                    </div>
                    <div className="text-[9px] text-center text-amber-400 font-mono">Fim do Lote</div>
                  </div>

                </div>

              </div>

              {/* Segmented Documents Table & Human Approval */}
              <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.08] shadow-lg space-y-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Documentos Independentes Resultantes do Fatiamento</span>
                  <span className="text-slate-400 font-normal">Algoritmo MSBD + Gemini Flash</span>
                </div>

                <div className="space-y-3">
                  {segmentedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${doc.color}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                          {doc.docIndex}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{doc.title}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{doc.pageRange}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">{doc.confidence}% de Confiança</span>
                          </div>
                          {doc.warning && !hitlApproved && (
                            <div className="text-[11px] text-amber-400 flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-3 h-3" /> {doc.warning}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.warning && !hitlApproved ? (
                          <button
                            onClick={() => setHitlApproved(true)}
                            className="bg-gold-btn px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Aprovar com 1 Clique (HITL)</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> {doc.status}
                          </span>
                        )}
                        <button
                          onClick={() => alert(`Download individual de ${doc.title}`)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                Todos os documentos fatiados, classificados e validados são armazenados e indexados com criptografia e trilha de auditoria completa.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('search')}
                  className="bg-gold-btn px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  Ir para a Pesquisa em Lote
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
