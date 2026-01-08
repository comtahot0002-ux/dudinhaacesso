
import React, { useState, useEffect } from 'react';
import { 
  Rabbit, 
  Candy, 
  Heart, 
  Mail, 
  Smartphone, 
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

// --- CONFIGURAÇÕES DO PROJETO ---
const PIXEL_ID = "893688729778022";
const UPSELL_VALUE = 13.35; 
const BOT_LINK = "https://t.me/desbloqueio_dudabot";
const PLAN_NAME = "TAXA DE SIGILO";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capturedTid, setCapturedTid] = useState('');
  const [capturedVid, setCapturedVid] = useState('');
  const [hasConfigError, setHasConfigError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Função para verificar se a tag é literal (não foi substituída pela plataforma)
    const isInvalid = (val: string | null) => {
      if (!val) return true;
      const v = val.toLowerCase();
      return v.includes('[') || v.includes(']') || v.includes('{') || v.includes('}') || v.includes('id_venda') || v.includes('id_telegram');
    };

    // 1. Captura do TELEGRAM ID (Seguindo o padrão do clone que você mandou)
    let tid = params.get('telegram_id') || 
              params.get('payload_id') || // O clone usava muito payload_id
              params.get('id_telegram') || 
              params.get('tid');
    
    // 2. Captura do ID DA VENDA (Seguindo o padrão do clone)
    let vid = params.get('id_venda') || 
              params.get('transaction_id') || // O clone usava transaction_id
              params.get('event_id') || 
              params.get('reference');

    // Validação de erro de configuração (tags literais na URL)
    if (isInvalid(tid) || isInvalid(vid)) {
      setHasConfigError(true);
    }

    // Fallbacks para não quebrar o Pixel se a configuração estiver errada
    const finalTid = isInvalid(tid) ? "user_" + Math.random().toString(36).substr(2, 7) : tid;
    const finalVid = isInvalid(vid) ? "pur_" + Math.random().toString(36).substr(2, 9) : vid;

    setCapturedTid(finalTid || "");
    setCapturedVid(finalVid || "");

    // Injetar script do Pixel mas NÃO inicializar ainda (Delayed Init)
    if (!window.fbq) {
      (function(f:any,b:any,e:any,v:any,n?:any,t?:any,s?:any){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');

    // Inicialização do Pixel com Advanced Matching (Melhora o Match Rate)
    window.fbq('init', PIXEL_ID, { 
      em: cleanEmail,
      ph: cleanPhone,
      external_id: `tg:${capturedTid}` 
    });

    window.fbq('track', 'PageView');

    // Disparo do Purchase com Deduplicação (eventID)
    window.fbq('track', 'Purchase', {
      value: UPSELL_VALUE,
      currency: 'BRL',
      content_name: PLAN_NAME,
      content_type: 'product',
      external_id: `tg:${capturedTid}`
    }, { 
      eventID: capturedVid 
    });

    // Simulação de delay para feedback visual
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="main-card animate-pop">
      <div className="bunny-icon">
        <Rabbit size={80} color="#FF9EAA" fill="#FFD0D6" />
      </div>

      <div className="flex justify-center mb-4">
        <div className="bg-pink-100 p-3 rounded-full">
            <CheckCircle2 size={40} className="text-pink-500" />
        </div>
      </div>

      <h1 className="text-3xl font-black text-pink-500 uppercase tracking-tight leading-none mb-2">
        Pagamento <br/> Aprovado!
      </h1>
      
      <p className="text-slate-500 font-bold text-sm mb-6 flex items-center justify-center gap-2">
        <Sparkles size={16} className="text-yellow-400" /> 
        ACESSO VIP LIBERADO
        <Sparkles size={16} className="text-yellow-400" />
      </p>

      <div className="dotted-receipt space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-pink-300 uppercase">
          <span>Item Adquirido</span>
          <div className="flex items-center gap-1"><Candy size={10}/> {PLAN_NAME}</div>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-slate-400 uppercase">Valor:</span>
          <span className="text-2xl font-black text-pink-600">R$ {UPSELL_VALUE.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="text-center mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase leading-tight">
              Confirme seus dados para <br/> vincular ao Telegram
            </p>
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-pink-200" size={18} />
            <input 
              type="email" 
              placeholder="E-mail de compra"
              required
              className="w-full bg-slate-50 border-2 border-pink-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-300 transition-all font-bold text-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Smartphone className="absolute left-4 top-4 text-pink-200" size={18} />
            <input 
              type="tel" 
              placeholder="WhatsApp com DDD"
              required
              className="w-full bg-slate-50 border-2 border-pink-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-300 transition-all font-bold text-slate-600"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="btn-pink w-full text-white font-black py-5 rounded-2xl text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "PROCESSANDO..." : "LIBERAR ACESSO VIP"}
          </button>
        </form>
      ) : (
        <div className="mt-8 space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-green-50 border-2 border-green-100 p-4 rounded-2xl">
            <p className="text-green-600 font-bold text-xs uppercase flex items-center justify-center gap-2">
               <ShieldCheck size={18}/> Vínculo realizado com sucesso!
            </p>
          </div>
          
          <a 
            href={BOT_LINK}
            className="btn-pink w-full text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-2xl border-b-8 border-pink-700 active:border-b-0 active:translate-y-2"
          >
            VOLTAR PARA O BOT 🎀
          </a>
        </div>
      )}

      {/* FOOTER DEBUG */}
      <div className="mt-10 pt-6 border-t border-dashed border-pink-50">
        {hasConfigError && (
            <div className="mb-4 bg-red-50 p-2 rounded-lg flex items-center gap-2 justify-center border border-red-100">
                <AlertTriangle size={12} className="text-red-500 animate-pulse" />
                <p className="text-[9px] text-red-600 font-black uppercase">Erro de Configuração no Painel da Apex</p>
            </div>
        )}
        
        <div className="flex flex-col items-center gap-1 opacity-40">
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Dados de Rastreamento (Cloned Pattern):</p>
           <div className="flex gap-4">
              <span className="text-[9px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                TID: {capturedTid}
              </span>
              <span className="text-[9px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                VID: {capturedVid}
              </span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;
