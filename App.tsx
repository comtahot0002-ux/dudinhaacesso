
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
    // 1. Capturar ID de Evento (o código longo que você viu na URL)
    // Pega o que está no caminho da URL (slug) ou gera um aleatório se não existir
    const pathParts = window.location.pathname.split('/').filter(p => p.length > 5);
    const extractedEventId = pathParts[pathParts.length - 1] || `upsell_${Math.random().toString(36).substr(2, 9)}`;
    setEventId(extractedEventId);

    // 2. Capturar Parâmetros de URL
    const params = new URLSearchParams(window.location.search);
    const tid = params.get('telegram_id') || params.get('id_telegram');
    if (tid) setTelegramId(tid);

    // 3. Inserir Script do Facebook Pixel
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

    // 4. Inicializar e Disparar Compra Imediata com Event ID
    const initData: any = {};
    if (tid) initData.external_id = tid;
    
    window.fbq('init', PIXEL_ID, initData);
    window.fbq('track', 'PageView', {}, { eventID: `pv_${extractedEventId}` });
    
    // PURCHASE COM DEDUPLICAÇÃO
    window.fbq('track', 'Purchase', {
      value: UPSELL_VALUE,
      currency: CURRENCY,
      content_name: PLAN_NAME,
      external_id: tid
    }, { 
      eventID: extractedEventId // Esse é o código que evita duplicidade
    });
  }, []);

  const handleLeadEnrichment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return;

    // Reinicializa com dados reais do lead para bater o Pixel (Advanced Matching)
    window.fbq('init', PIXEL_ID, {
      em: email.trim().toLowerCase(),
      ph: phone.replace(/\D/g, ''),
      external_id: telegramId
    });

    // Dispara Lead para marcar quem preencheu
    window.fbq('track', 'Lead', {
      email: email,
      phone: phone,
      content_name: 'Upsell Enrichment',
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

      <h1 className="title-text text-2xl md:text-3xl font-black text-center mb-4 mt-4">
        PAGAMENTO CONFIRMADO!
      </h1>

      <div className="text-center px-4 mb-6">
        <p className="text-pink-500 font-bold flex items-center justify-center gap-2 mb-1">
          <Heart size={16} fill="currentColor" /> Sua compra foi concluída.
        </p>
        <p className="text-pink-400 text-sm font-semibold">
          Vincule seus dados abaixo para liberar o VIP!
        </p>
      </div>

      {/* Recibo */}
      <div className="dotted-receipt w-full space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <Gem size={18} /> Produto:
          </div>
          <div className="font-bold text-slate-700 uppercase">{PLAN_NAME}</div>
        </div>
        <div className="w-full h-px bg-slate-100"></div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <Coins size={18} /> Valor Total:
          </div>
          <div className="text-xl font-black text-pink-500">
            R$ {UPSELL_VALUE.toFixed(2).replace('.', ',')}
          </div>
        </div>
      </div>

      <div className="w-full mt-8">
        {!isSubmitted ? (
          <form onSubmit={handleLeadEnrichment} className="space-y-4">
            <div className="bg-pink-50/50 p-3 rounded-xl border border-pink-100 mb-2">
               <p className="text-[10px] text-center text-pink-400 font-black tracking-widest uppercase">
                Verificação de Segurança do Telegram
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
              className="btn-gradient w-full text-white font-black py-5 rounded-2xl transform active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
            >
              LIBERAR ACESSO AGORA <ChevronRight size={20} />
            </button>
          </form>
        ) : (
          <div className="animate-pop">
            <div className="bg-green-50 border-2 border-green-100 text-green-600 p-4 rounded-2xl mb-4 text-center font-bold text-sm">
              ✨ ACESSO LIBERADO NO SISTEMA!
            </div>
            <a 
              href={BOT_LINK}
              className="btn-gradient w-full text-white font-black py-6 rounded-2xl transform hover:-translate-y-1 active:scale-95 transition-all flex flex-col items-center justify-center relative overflow-hidden text-center shadow-xl"
            >
              <div className="text-xl flex items-center gap-2">
                VOLTAR PARA O BOT 🎀
              </div>
            </a>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-1 opacity-20">
        <span className="text-[10px] font-bold uppercase tracking-widest">ID da Transação: {eventId.substring(0, 8)}...</span>
      </div>
    </div>
  );
};

export default App;
