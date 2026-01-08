
import React, { useState, useEffect } from 'react';
import { 
  Gem, 
  Coins, 
  Mail, 
  Smartphone, 
  ChevronRight,
  Heart,
  Sparkles
} from 'lucide-react';

// --- CONFIGURAÇÕES CRÍTICAS ---
const PIXEL_ID = "893688729778022";
const UPSELL_VALUE = 13.35; 
const CURRENCY = "BRL";
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
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string>('');

  useEffect(() => {
    // 1. Capturar Parâmetros de URL com fallback robusto
    const params = new URLSearchParams(window.location.search);
    
    // Captura o ID do Telegram
    const tid = params.get('telegram_id') || params.get('id_telegram') || "sem_id";
    setTelegramId(tid !== "sem_id" ? tid : null);

    // 2. Capturar ID de Evento (Deduplicação)
    // Agora prioriza pegar de ?id_venda=... para evitar erro de página não encontrada (404)
    const extractedEventId = params.get('id_venda') || 
                             params.get('event_id') || 
                             params.get('token') ||
                             `venda_${Math.random().toString(36).substr(2, 9)}`;
    
    setEventId(extractedEventId);

    // 3. Inserir Script do Facebook Pixel (se não existir)
    if (!window.fbq) {
      (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return; n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    }

    // 4. Inicializar e Disparar Compra Imediata
    const initData: any = {};
    if (tid !== "sem_id") initData.external_id = tid;
    
    window.fbq('init', PIXEL_ID, initData);
    window.fbq('track', 'PageView', {}, { eventID: `pv_${extractedEventId}` });
    
    // PURCHASE COM DEDUPLICAÇÃO
    window.fbq('track', 'Purchase', {
      value: UPSELL_VALUE,
      currency: CURRENCY,
      content_name: PLAN_NAME,
      external_id: tid !== "sem_id" ? tid : undefined
    }, { 
      eventID: extractedEventId 
    });

    console.log("Pixel Disparado com EventID:", extractedEventId);
  }, []);

  const handleLeadEnrichment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return;

    // Enriquecimento de dados (Advanced Matching)
    window.fbq('init', PIXEL_ID, {
      em: email.trim().toLowerCase(),
      ph: phone.replace(/\D/g, ''),
      external_id: telegramId
    });

    window.fbq('track', 'Lead', {
      email: email.trim().toLowerCase(),
      phone: phone.replace(/\D/g, ''),
      content_name: 'Lead Confirmado Upsell',
      external_id: telegramId
    }, {
      eventID: `lead_${eventId}`
    });

    setIsSubmitted(true);
  };

  return (
    <div className="main-card flex flex-col items-center">
      {/* Laço Decorativo */}
      <div className="ribbon animate-bounce-soft">
        <svg width="80" height="50" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 30C50 30 20 5 10 15C0 25 35 45 50 35C65 45 100 25 90 15C80 5 50 30 50 30Z" fill="#ffb7c5" stroke="#ff8da6" strokeWidth="3"/>
          <rect x="42" y="25" width="16" height="12" rx="6" fill="#ff8da6"/>
        </svg>
      </div>

      <h1 className="title-text text-2xl md:text-3xl font-black text-center mb-2 mt-4 uppercase">
        Pagamento Aprovado!
      </h1>

      <div className="text-center px-4 mb-6">
        <p className="text-pink-500 font-bold flex items-center justify-center gap-2 mb-1">
          <Heart size={16} fill="currentColor" /> Sua vaga VIP está garantida.
        </p>
      </div>

      {/* Recibo */}
      <div className="dotted-receipt w-full space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-tighter">
            <Gem size={18} /> Item:
          </div>
          <div className="font-bold text-slate-700">{PLAN_NAME}</div>
        </div>
        <div className="w-full h-px bg-slate-100"></div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm uppercase tracking-tighter">
            <Coins size={18} /> Valor Pago:
          </div>
          <div className="text-xl font-black text-pink-500">
            R$ {UPSELL_VALUE.toFixed(2).replace('.', ',')}
          </div>
        </div>
      </div>

      <div className="w-full mt-8">
        {!isSubmitted ? (
          <form onSubmit={handleLeadEnrichment} className="space-y-4">
            <div className="bg-pink-50/50 p-4 rounded-2xl border-2 border-dashed border-pink-200 mb-2">
               <p className="text-[11px] text-center text-pink-500 font-bold uppercase leading-tight">
                Vincule seu Telegram para liberar o acesso VIP agora:
              </p>
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-pink-300 w-5 h-5" />
              <input 
                type="email" 
                placeholder="E-mail de compra"
                required
                className="w-full bg-white border-2 border-pink-100 rounded-2xl py-4 pl-12 pr-4 focus:border-pink-300 transition-all outline-none text-slate-700 font-semibold shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Smartphone className="absolute left-4 top-4 text-pink-300 w-5 h-5" />
              <input 
                type="tel" 
                placeholder="WhatsApp com DDD"
                required
                className="w-full bg-white border-2 border-pink-100 rounded-2xl py-4 pl-12 pr-4 focus:border-pink-300 transition-all outline-none text-slate-700 font-semibold shadow-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="btn-gradient w-full text-white font-black py-5 rounded-2xl transform active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
            >
              LIBERAR ACESSO <ChevronRight size={20} />
            </button>
          </form>
        ) : (
          <div className="animate-pop text-center">
            <div className="bg-green-50 border-2 border-green-100 text-green-600 p-4 rounded-2xl mb-6 font-bold text-sm uppercase">
              ✨ ACESSO LIBERADO COM SUCESSO!
            </div>
            <a 
              href={BOT_LINK}
              className="btn-gradient w-full text-white font-black py-6 rounded-2xl transform hover:-translate-y-1 active:scale-95 transition-all flex flex-col items-center justify-center text-center shadow-xl border-b-4 border-pink-700"
            >
              <div className="text-xl flex items-center gap-2">
                VOLTAR PARA O BOT 🎀
              </div>
            </a>
          </div>
        )}
      </div>

      <div className="mt-8 opacity-10 select-none">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Verified: {eventId.substring(0, 10)}</span>
      </div>
    </div>
  );
};

export default App;
