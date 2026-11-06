import React, { useState } from 'react';
import { Scale, Lock, Mail, Eye, EyeOff, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated login delay
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Dra. Helena Martins',
        email: email || 'helena.martins@lexorganize.com.br',
        role: 'Advogada Sênior • Gestão de Contratos e GRT',
        oab: 'OAB/PE 45.892'
      });
      onClose();
    }, 500);
  };

  const handleFillDemo = () => {
    setEmail('helena.martins@lexorganize.com.br');
    setPassword('senha@segura2026');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f1118] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-white relative">
        
        {/* Top subtle golden hairline */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#dfba73] to-transparent" />

        {/* Modal Header */}
        <div className="p-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#dfba73]/15 border border-[#dfba73]/30 flex items-center justify-center text-[#dfba73]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">LexOrganize</h3>
              <p className="text-[11px] text-[#dfba73] font-medium tracking-wide">PORTAL DO OPERADOR JURÍDICO</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              E-mail corporativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.nome@escritorio.adv.br"
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 focus:border-[#dfba73] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#dfba73] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Senha de acesso
              </label>
              <button 
                type="button" 
                onClick={() => alert("Recuperação de acesso institucional.")}
                className="text-[11px] text-[#dfba73] hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white/[0.04] border border-white/10 focus:border-[#dfba73] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#dfba73] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-[#dfba73] focus:ring-[#dfba73] focus:ring-offset-0"
              />
              Lembrar credenciais
            </label>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Criptografia 256-bit
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-btn py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Demo quick fill button */}
          <div className="pt-2 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-[#dfba73] hover:text-white font-medium transition-colors cursor-pointer"
            >
              Preencher credenciais de demonstração (1 clique)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
