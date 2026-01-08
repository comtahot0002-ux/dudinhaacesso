
import React, { useState, useEffect } from 'react';
import { 
  Rabbit, 
  Candy, 
  Heart, 
  Mail, 
  Smartphone, 
  CheckCircle2,
  Sparkles,
  ShieldCheck
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

  useEffect(() => {
    // 1. CAPTURA AGRESSIVA DE PARÂMETROS
    const search = window.location.search;
    const params = new URLSearchParams(search);
    
    // Lista de aliases comuns que as plataformas usam
    const tid = params.get('telegram_id') || 
                params.get('id_telegram') || 
                params.get('tid') || 
                params.get('payload_id') || 
                params.get('user_id') || 
                "NÃO CAPTURADO";

    const vid = params.get('id_venda') || 
                params.get('event_id') || 
                params.get('reference') || 
                params.get('transaction_id') || 
                params.get('checkout_id') ||
                `v_${Math.random().toString(36).substr(2, 9)}`;
    
    setCapturedTid(tid);
    setCapturedVid(vid);

    // Injetar script do Pixel mas NÃO inicializar ainda
    if (!window.fbq) {
      (function(f:any,b:any,e:any,v:any,n?:any,t?:any,s?:any){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    }

    console.log("[DEBUG] Parâmetros capturados:", { tid, vid });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Normalizar dados
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');

    // 2. INICIALIZAÇÃO E DISPARO (Delayed Strategy)
    // Inicializamos o Pixel APENAS agora, já com os dados do lead
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

    // Simular processamento e liberar
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1200);
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
        ACESSO VIP GARANTIDO 
        <Sparkles size={16} className="text-yellow-400" />
      </p>

      <div className="dotted-receipt space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-pink-300 uppercase">
          <span>Produto Selecionado</span>
          <div className="flex items-center gap-1"><Candy size={10}/> {PLAN_NAME}</div>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Pago:</span>
          <span className="text-2xl font-black text-pink-600">R$ {UPSELL_VALUE.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="text-center mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase leading-tight">
              Informe seus dados para <br/> vincular ao seu Telegram
            </p>
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-pink-200" size={18} />
            <input 
              type="email" 
              placeholder="E-mail usado na compra"
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
              placeholder="Seu WhatsApp (com DDD)"
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
            {loading ? "PROCESSANDO..." : "LIBERAR MEU ACESSO AGORA"}
          </button>
        </form>
      ) : (
        <div className="mt-8 space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-green-50 border-2 border-green-100 p-4 rounded-2xl">
            <p className="text-green-600 font-bold text-xs uppercase flex items-center justify-center gap-2">
               <ShieldCheck size={18}/> Tudo pronto! Acesso Liberado.
            </p>
          </div>
          
          <a 
            href={BOT_LINK}
            className="btn-pink w-full text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-2xl border-b-8 border-pink-700 active:border-b-0 active:translate-y-2"
          >
            VOLTAR PARA O BOT 🎀
          </a>
          
          <p className="text-[10px] text-slate-300 font-bold uppercase">
            Você será redirecionado para o conteúdo VIP
          </p>
        </div>
      )}

      {/* FOOTER DEBUG - VISÍVEL PARA VOCÊ CONFERIR SE A APEX ENVIOU OS DADOS */}
      <div className="mt-10 pt-6 border-t border-dashed border-pink-50">
        <div className="flex flex-col items-center gap-1 opacity-40">
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Status de Captura:</p>
           <div className="flex gap-4">
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${capturedTid !== 'NÃO CAPTURADO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                TID: {capturedTid}
              </span>
              <span className="text-[9px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                VID: {capturedVid}
              </span>
           </div>
        </div>
        <p className="text-[7px] text-slate-300 mt-4 uppercase font-bold">
          Transação Segura • {capturedVid}
        </p>
      </div>
    </div>
  );
};

export default App;
