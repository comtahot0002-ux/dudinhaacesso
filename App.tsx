
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
  AlertTriangle,
  Fingerprint
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
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const processParam = (key: string, altKeys: string[]) => {
      let val = params.get(key);
      if (!val) {
        for (const alt of altKeys) {
          val = params.get(alt);
          if (val) break;
        }
      }

      if (!val) return { id: "não detectado", isPlaceholder: true };
      
      const raw = decodeURIComponent(val);
      const isPlaceholder = raw.includes('{') || raw.includes('}') || raw.toLowerCase().includes('id_');
      
      // Limpa prefixos como v_, t_, i_ (o que você configurou na ApexTry)
      let clean = raw.replace(/^[a-z]{1,2}_/i, '').trim();
      
      return { id: clean, isPlaceholder };
    };

    // Mapeamento exato dos parâmetros que você gerou na ApexTry
    const tidData = processParam('utm_id', ['utm_term', 'telegram_id']);
    const vidData = processParam('code', ['utm_content', 'id_venda']);

    if (tidData.isPlaceholder || vidData.isPlaceholder) {
      setIsTestMode(true);
    }

    setCapturedTid(tidData.id);
    setCapturedVid(vidData.id);

    // Injeção do Pixel do Facebook
    if (!window.fbq) {
      (function(f:any,b:any,e:any,v:any,n?:any,t?:any,s?:any){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');
    
    // IDs Finais para o Pixel
    const finalTid = (capturedTid === "não detectado" || isTestMode) ? "test_user_" + Math.random().toString(36).substr(2, 5) : capturedTid;
    const finalVid = (capturedVid === "não detectado" || isTestMode) ? "test_pur_" + Math.random().toString(36).substr(2, 5) : capturedVid;

    // 1. Inicializa o Pixel com os dados do Lead (Aumenta Match Rate)
    window.fbq('init', PIXEL_ID, { 
      em: cleanEmail,
      ph: cleanPhone,
      external_id: finalTid 
    });

    window.fbq('track', 'PageView');

    // 2. Dispara a Venda (Purchase)
    window.fbq('track', 'Purchase', {
      value: UPSELL_VALUE,
      currency: 'BRL',
      content_name: PLAN_NAME,
      external_id: finalTid
    }, { 
      eventID: finalVid 
    });

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
        Acesso <br/> Confirmado!
      </h1>
      
      <p className="text-slate-500 font-bold text-sm mb-6 flex items-center justify-center gap-2">
        <Sparkles size={16} className="text-yellow-400" /> 
        CONTEÚDO VIP LIBERADO
        <Sparkles size={16} className="text-yellow-400" />
      </p>

      <div className="dotted-receipt space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-pink-300 uppercase">
          <span>Produto</span>
          <div className="flex items-center gap-1"><Candy size={10}/> {PLAN_NAME}</div>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-slate-400 uppercase">Valor Pago:</span>
          <span className="text-2xl font-black text-pink-600">R$ {UPSELL_VALUE.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="text-center mb-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase leading-tight">
              Informe seus dados para <br/> liberar o link de acesso
            </p>
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-pink-200" size={18} />
            <input 
              type="email" 
              placeholder="E-mail da compra"
              required
              className="w-full bg-slate-50 border-2 border-pink-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-300 transition-all font-bold text-slate-600 placeholder:text-slate-300"
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
              className="w-full bg-slate-50 border-2 border-pink-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pink-300 transition-all font-bold text-slate-600 placeholder:text-slate-300"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="btn-pink w-full text-white font-black py-5 rounded-2xl text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "PROCESSANDO..." : "LIBERAR MEU ACESSO"}
          </button>
        </form>
      ) : (
        <div className="mt-8 space-y-4 animate-in fade-in zoom-in duration-300 text-center">
          <div className="bg-green-50 border-2 border-green-100 p-4 rounded-2xl mb-4">
            <p className="text-green-600 font-bold text-xs uppercase flex items-center justify-center gap-2">
               <ShieldCheck size={18}/> Tudo pronto! Clique abaixo
            </p>
          </div>
          
          <a 
            href={BOT_LINK}
            className="btn-pink w-full text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-2xl border-b-8 border-pink-700 active:border-b-0 active:translate-y-2 no-underline"
          >
            VOLTAR PARA O BOT 🎀
          </a>
        </div>
      )}

      {/* RODAPÉ DE MONITORAMENTO (DEBUG) */}
      <div className="mt-10 pt-4 border-t border-dashed border-pink-100">
        <div className="flex flex-col items-center gap-3">
           
           <div className="flex flex-wrap justify-center gap-3">
              <div className="flex flex-col items-center min-w-[100px]">
                 <span className="text-[8px] font-bold text-slate-300 uppercase mb-1">Telegram (TID)</span>
                 <div className={`flex items-center gap-1 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border shadow-sm ${isTestMode || capturedTid === 'não detectado' ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-pink-50 text-pink-400 border-pink-200'}`}>
                    <Fingerprint size={10} />
                    {capturedTid}
                 </div>
              </div>

              <div className="flex flex-col items-center min-w-[100px]">
                 <span className="text-[8px] font-bold text-slate-300 uppercase mb-1">Transação (VID)</span>
                 <div className={`flex items-center gap-1 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border shadow-sm ${isTestMode || capturedVid === 'não detectado' ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-pink-50 text-pink-400 border-pink-200'}`}>
                    <Sparkles size={10} />
                    {capturedVid}
                 </div>
              </div>
           </div>

           {isTestMode && (
             <div className="flex items-center gap-1 text-[9px] font-bold text-yellow-500/60 uppercase">
                <AlertTriangle size={12}/> Link de teste detectado
             </div>
           )}

           <p className="text-[8px] text-slate-200 font-bold uppercase tracking-widest">Pixel Master Tracking • 8936...022</p>
        </div>
      </div>
    </div>
  );
};

export default App;
