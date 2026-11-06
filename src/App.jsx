import React, { useState } from 'react';
import { 
  Scale, 
  Search, 
  Upload, 
  FileText, 
  Folder, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Users, 
  Star, 
  Play, 
  ChevronRight, 
  MoreVertical, 
  Cpu, 
  Laptop, 
  FileCheck, 
  AlertTriangle, 
  X, 
  Download,
  Filter,
  Check,
  ArrowRight,
  User,
  LayoutDashboard,
  LogOut,
  Zap,
  Tag
} from 'lucide-react';
import LoginModal from './components/LoginModal.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('Início');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Documents list in the landing page interactive preview
  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      title: 'Contrato de Prestação de Serviços.pdf',
      category: 'Contratos',
      date: '02/11/2025',
      pages: 3,
      status: 'Classificado',
      iconColor: 'bg-red-500/10 text-red-500',
      tagColor: 'text-red-400 bg-red-400/10 border-red-500/20'
    },
    {
      id: 'doc-2',
      title: 'Processo Trabalhista nº 00142-2025.pdf',
      category: 'Processos',
      date: '28/10/2025',
      pages: 14,
      status: 'Classificado',
      iconColor: 'bg-blue-500/10 text-blue-500',
      tagColor: 'text-blue-400 bg-blue-400/10 border-blue-500/20'
    },
    {
      id: 'doc-3',
      title: 'Petição Inicial - Execução de Título.pdf',
      category: 'Petições',
      date: '20/10/2025',
      pages: 6,
      status: 'Classificado',
      iconColor: 'bg-emerald-500/10 text-emerald-500',
      tagColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20'
    },
    {
      id: 'doc-4',
      title: 'Procuração Ad Judicia e Substabelecimento.pdf',
      category: 'Outros',
      date: '15/10/2025',
      pages: 2,
      status: 'Classificado',
      iconColor: 'bg-purple-500/10 text-purple-500',
      tagColor: 'text-purple-400 bg-purple-400/10 border-purple-500/20'
    }
  ]);

  // Filtered documents for the landing preview
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Dedicated Dashboard View when authenticated / toggled
  if (currentView === 'dashboard') {
    return (
      <Dashboard 
        user={user} 
        onLogout={() => { setUser(null); setCurrentView('landing'); }} 
        onBackToSite={() => setCurrentView('landing')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-[#e2e8f0] flex flex-col font-sans selection:bg-[#dfba73]/30 selection:text-white w-full max-w-full overflow-x-hidden">

      {/* =========================================================================
          1. NAVBAR / HEADER (Transparente, sem logo)
          ========================================================================= */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Navigation Links */}
          <nav className="flex items-center gap-6 sm:gap-8 text-[14px]">
            {['Início', 'Funcionalidades', 'Planos', 'Sobre', 'FAQ'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`relative py-1 font-medium transition-colors cursor-pointer ${
                  activeTab === item ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item}
                {activeTab === item && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#dfba73] rounded-full shadow-[0_0_8px_#dfba73]" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Buttons: Login / Dashboard State */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-gold-btn px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 group cursor-pointer shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Workspace Jurídico</span>
                </button>
                <button
                  onClick={() => setUser(null)}
                  title="Sair da Conta"
                  className="p-2 rounded-full text-slate-300 hover:text-white border border-white/20 hover:border-red-400/40 hover:bg-red-500/10 transition-all cursor-pointer backdrop-blur-sm bg-black/20"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-xs sm:text-sm text-slate-200 hover:text-white px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all cursor-pointer font-medium backdrop-blur-sm bg-black/20"
                >
                  Entrar
                </button>
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gold-btn px-5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 group cursor-pointer shadow-lg"
                >
                  <span>Comece agora</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION (100vh Tela Inteira, Imagem Completa Sem Barras)
          ========================================================================= */}
      <section className="relative min-h-screen lg:h-screen flex flex-col justify-center overflow-hidden bg-[#07080b]">
        
        {/* Background Image: Preenchendo toda a tela do Hero sem qualquer obstrução */}
        <div 
          className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-[position:80%_center] sm:bg-[position:right_center] lg:bg-[position:right_center] pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url('/imagens/hero_bg.jpg')` }}
        />

        {/* Gradiente leve apenas na margem esquerda para garantir leitura nítida dos textos */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#07080b]/85 via-[#07080b]/40 via-42% to-transparent pointer-events-none" />

        {/* Hero Content Container (Centralizado perfeitamente na tela cheia) */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-20 sm:py-24 relative z-10 w-full flex flex-col justify-center overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-w-0 w-full">
            
            {/* Left Column: Negative Space with Text & Action Buttons */}
            <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start space-y-5 sm:space-y-6 min-w-0 w-full">
              
              {/* Eyebrow: Pure Letter-Spaced Golden Text */}
              <div className="text-[12px] sm:text-xs font-bold tracking-[0.22em] text-[#dfba73] uppercase drop-shadow">
                INTELIGÊNCIA JURÍDICA AO SEU ALCANCE
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight text-white leading-[1.14] drop-shadow-md">
                Seus documentos jurídicos organizados de forma{' '}
                <span className="text-[#dfba73]">inteligente</span>.
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-xl font-normal leading-relaxed drop-shadow">
                Encontre, organize e acesse seus documentos jurídicos em segundos com o poder da inteligência artificial.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => user ? setCurrentView('dashboard') : setIsLoginModalOpen(true)}
                  className="bg-gold-btn px-7 py-3 sm:px-8 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 group cursor-pointer shadow-xl w-full sm:w-auto"
                >
                  <span>Comece gratuitamente</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button 
                  onClick={() => {
                    const el = document.getElementById('dashboard-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 sm:px-7 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/20 hover:border-[#dfba73]/50 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg w-full sm:w-auto"
                >
                  Conheça a plataforma
                </button>
              </div>

            </div>

            {/* Right Column: Clear Negative Space for the Right Image Subject */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-6 min-h-[420px] pointer-events-none" />

          </div>
        </div>

      </section>

      {/* =========================================================================
          3. SECTION: SOBRE O LEXORGANIZE & APP PREVIEW MOCKUP (Light Clean Background)
          ========================================================================= */}
      <section id="dashboard-section" className="py-24 bg-[#f8f9fa] text-[#0f172a] relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text description */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="text-[12px] font-bold tracking-widest text-[#b88a1b] uppercase flex items-center gap-2">
                <span className="w-5 h-[2px] bg-[#b88a1b]" />
                Sobre o LexOrganize
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
                Sua biblioteca jurídica sempre em ordem
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                O LexOrganize utiliza inteligência artificial para ler, classificar e organizar seus documentos jurídicos, permitindo que você encontre qualquer arquivo com facilidade, sem perder tempo.
              </p>

              <div className="pt-2">
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gold-btn px-7 py-3 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 group cursor-pointer shadow-md"
                >
                  <span>Saiba mais</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

            </div>

            {/* Right Column: The Dashboard Mockup UI */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[460px]">
                
                {/* Embedded Sidebar (Dark style like reference) */}
                <div className="w-full md:w-48 bg-[#181b24] p-5 text-white flex flex-col justify-between shrink-0">
                  <div className="space-y-6">
                    {/* Mini Brand Icon */}
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                      <div className="w-7 h-7 rounded bg-[#dfba73]/20 border border-[#dfba73]/40 flex items-center justify-center text-[#dfba73]">
                        <Scale className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold tracking-tight text-white">LexOrganize</span>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-1 text-[12.5px]">
                      <button 
                        onClick={() => setSelectedCategory('Todos')}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                          selectedCategory === 'Todos' ? 'bg-[#dfba73]/20 text-[#dfba73] font-semibold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Início
                      </button>
                      <button 
                        onClick={() => setSelectedCategory('Contratos')}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                          selectedCategory === 'Contratos' ? 'bg-[#dfba73]/20 text-[#dfba73] font-semibold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Folder className="w-4 h-4" />
                        Documentos
                      </button>
                      <button 
                        onClick={() => setSelectedCategory('Processos')}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer ${
                          selectedCategory === 'Processos' ? 'bg-[#dfba73]/20 text-[#dfba73] font-semibold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Filter className="w-4 h-4" />
                        Categorias
                      </button>
                      <button 
                        onClick={() => {
                          const input = document.getElementById('dash-search-input');
                          input?.focus();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Search className="w-4 h-4" />
                        Busca
                      </button>
                    </nav>
                  </div>

                  <div className="pt-4 border-t border-white/10 text-[11px] text-slate-500">
                    Workspace v2.6
                  </div>
                </div>

                {/* Dashboard Main Content Area (Clean White) */}
                <div className="flex-1 p-6 flex flex-col justify-between bg-[#fbfcfd]">
                  
                  <div>
                    {/* Header: Title + Novo Upload button */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Meus Documentos</h3>
                        <p className="text-[12px] text-slate-500">
                          {selectedCategory === 'Todos' ? 'Todos os arquivos indexados' : `Filtro: ${selectedCategory}`}
                        </p>
                      </div>

                      <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-gold-btn px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Novo Upload</span>
                      </button>
                    </div>

                    {/* Search Input Bar */}
                    <div className="relative mb-5">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        id="dash-search-input"
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar documentos ou nomes..." 
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#dfba73]/40 focus:border-[#dfba73]"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* 4 Category Cards (Red, Blue, Green, Purple matching reference) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      
                      {/* Contratos (Red) */}
                      <button 
                        onClick={() => setSelectedCategory(selectedCategory === 'Contratos' ? 'Todos' : 'Contratos')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedCategory === 'Contratos'
                            ? 'bg-red-50/80 border-red-300 ring-2 ring-red-400/30'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-2">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-[12px] font-bold text-slate-800">Contratos</div>
                        <div className="text-[11px] text-slate-400">(24)</div>
                      </button>

                      {/* Processos (Blue) */}
                      <button 
                        onClick={() => setSelectedCategory(selectedCategory === 'Processos' ? 'Todos' : 'Processos')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedCategory === 'Processos'
                            ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/30'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                          <Folder className="w-4 h-4" />
                        </div>
                        <div className="text-[12px] font-bold text-slate-800">Processos</div>
                        <div className="text-[11px] text-slate-400">(18)</div>
                      </button>

                      {/* Petições (Green) */}
                      <button 
                        onClick={() => setSelectedCategory(selectedCategory === 'Petições' ? 'Todos' : 'Petições')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedCategory === 'Petições'
                            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div className="text-[12px] font-bold text-slate-800">Petições</div>
                        <div className="text-[11px] text-slate-400">(12)</div>
                      </button>

                      {/* Outros (Purple) */}
                      <button 
                        onClick={() => setSelectedCategory(selectedCategory === 'Outros' ? 'Todos' : 'Outros')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedCategory === 'Outros'
                            ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-400/30'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                          <Folder className="w-4 h-4" />
                        </div>
                        <div className="text-[12px] font-bold text-slate-800">Outros</div>
                        <div className="text-[11px] text-slate-400">(7)</div>
                      </button>

                    </div>

                    {/* Documentos Recentes List */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-bold text-slate-900">Documentos Recentes</span>
                        <button 
                          onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}
                          className="text-[11.5px] font-semibold text-[#b88a1b] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          Ver todos <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Document Item Rows */}
                      <div className="space-y-2">
                        {filteredDocs.map((item) => (
                          <div 
                            key={item.id}
                            className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between hover:border-slate-300 transition-all shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${item.iconColor} flex items-center justify-center shrink-0`}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[12.5px] font-bold text-slate-800 truncate max-w-[220px] sm:max-w-xs">
                                  {item.title}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                  <span>Adicionado em {item.date}</span>
                                  <span>•</span>
                                  <span>{item.pages} páginas</span>
                                </div>
                              </div>
                            </div>

                            <button className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. STATS & SOCIAL PROOF BANNER (Classical Pillars)
          ========================================================================= */}
      <section className="py-16 bg-[#0c0d12] border-y border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <div className="text-[12px] font-bold text-[#dfba73] tracking-widest uppercase mb-1">
            POR QUE ESCOLHER O LEXORGANIZE?
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-12">
            Mais produtividade, menos burocracia
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#dfba73]/10 border border-[#dfba73]/30 flex items-center justify-center text-[#dfba73] mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">+80%</div>
              <div className="text-[13px] text-slate-400 mt-1">de economia de tempo</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#dfba73]/10 border border-[#dfba73]/30 flex items-center justify-center text-[#dfba73] mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">100%</div>
              <div className="text-[13px] text-slate-400 mt-1">seguro e confiável</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#dfba73]/10 border border-[#dfba73]/30 flex items-center justify-center text-[#dfba73] mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">+10 mil</div>
              <div className="text-[13px] text-slate-400 mt-1">usuários satisfeitos</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#dfba73]/10 border border-[#dfba73]/30 flex items-center justify-center text-[#dfba73] mb-3">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">4.9/5</div>
              <div className="text-[13px] text-slate-400 mt-1">de avaliação média</div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. SECTION: COMO FUNCIONA (3 Clean Steps)
          ========================================================================= */}
      <section className="py-24 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <div className="text-[12px] font-bold text-[#b88a1b] tracking-widest uppercase mb-1">
            COMO FUNCIONA
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-16">
            Em 3 passos, seus documentos organizados
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
            
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all w-full">
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-[#b88a1b] mb-4 shadow-sm">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">1. Faça o upload</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs">
                Envie seus documentos em poucos cliques.
              </p>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:flex text-slate-300 items-center justify-center px-2">
              <ArrowRight className="w-6 h-6 stroke-[1.5]" />
            </div>

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all w-full">
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-[#b88a1b] mb-4 shadow-sm">
                <Cpu className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">2. Deixe a IA trabalhar</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs">
                Nossa tecnologia organiza, categoriza e indexa seus arquivos.
              </p>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:flex text-slate-300 items-center justify-center px-2">
              <ArrowRight className="w-6 h-6 stroke-[1.5]" />
            </div>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all w-full">
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-[#b88a1b] mb-4 shadow-sm">
                <Search className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">3. Encontre facilmente</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs">
                Busque e acesse o que precisar em segundos.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          6. FOOTER CTA BANNER (With Gavel & Law Books)
          ========================================================================= */}
      <section className="py-16 bg-[#07080b] px-6">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-[#0e1017] shadow-2xl relative">
          
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="p-6 sm:p-12 md:col-span-8 space-y-4 min-w-0">
              <div className="text-[11px] font-bold tracking-widest text-[#dfba73] uppercase">
                PRONTO PARA ORGANIZAR SEUS DOCUMENTOS?
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Experimente agora o LexOrganize
              </h3>
              <p className="text-slate-300 text-xs sm:text-base max-w-md">
                Simplifique sua rotina jurídica e documental com o poder da tecnologia.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => user ? setCurrentView('dashboard') : setIsLoginModalOpen(true)}
                  className="bg-gold-btn px-6 py-2.5 sm:px-7 sm:py-3 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 group cursor-pointer shadow-lg"
                >
                  <span>Comece gratuitamente</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Gavel Image */}
            <div className="md:col-span-4 h-48 sm:h-64 md:h-full relative overflow-hidden flex items-center justify-end min-w-0">
              <img 
                src="/assets/gavel.jpg" 
                alt="Martelo do Juiz e Livros de Direito"
                className="w-full h-full object-cover object-center filter contrast-105 brightness-90 max-w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e1017] via-transparent to-transparent hidden md:block" />
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          7. FOOTER
          ========================================================================= */}
      <footer className="py-8 bg-[#050608] border-t border-white/[0.06] text-slate-500 text-[12px] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#dfba73]" />
              <span className="text-white font-bold">LexOrganize</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>Hack Garanhuns Tech 2026 | Document AI Factory</span>
          </div>
          <div className="text-slate-500 text-[11px] sm:text-xs">
            © 2026 LexOrganize Inc. Todos os direitos reservados. Conformidade LGPD.
          </div>
        </div>
      </footer>

      {/* =========================================================================
          LOGIN MODAL
          ========================================================================= */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          setCurrentView('dashboard');
        }}
      />

    </div>
  );
}
