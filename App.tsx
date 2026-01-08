
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
const UPSELL_VALUE = 13.35; // Valor exato da imagem de referência
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

  useEffect(() => {
    // 1. Capturar Parâmetros de URL
    const params = new URLSearchParams(window.location.search);
    const tid = params.get('telegram_id');
    if (tid) setTelegramId(tid);

    // 2. Inserir Script do Facebook Pixel
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

    // 3. Inicializar e Disparar Conversão Imediata
    const initData: any = {};
    if (tid) initData.external_id = tid;
    
    window.fbq('init', PIXEL_ID, initData);
    window.fbq('track', 'PageView');
    window.fbq('track', 'Purchase', {
      value: UPSELL_VALUE,
      currency: CURRENCY,
      content_name: PLAN_NAME,
      external_id: tid
    });
  }, []);

  const handleLeadEnrichment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return;

    // Afiar o pixel com Advanced Matching
    window.fbq('init', PIXEL_ID, {
      em: email.trim().toLowerCase(),
      ph: phone.replace(/\D/g, ''),
      external_id: telegramId
    });

    window.fbq('track', 'Lead', {
      email: email,
      phone: phone,
      content_name: 'Upsell Confirmation'
    });

    setIsSubmitted(true);
  };

  return (
    <div className="main-card flex flex-col items-center">
      {/* Laço Decorativo no topo */}
      <div className="ribbon animate-bounce-soft">
        <svg width="80" height="50" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 30C50 30 20 5 10 15C0 25 35 45 50 35C65 45 100 25 90 15C80 5 50 30 50 30Z" fill="#ffb7c5" stroke="#ff8da6" strokeWidth="3"/>
          <rect x="42" y="25" width="16" height="12" rx="6" fill="#ff8da6"/>
        </svg>
      </div>

      {/* Título Principal */}
      <h1 className="title-text text-2xl md:text-3xl font-black text-center mb-4 mt-4">
        PAGAMENTO CONFIRMADO!
      </h1>

      {/* Mensagem de Boas-vindas */}
      <div className="text-center px-4 mb-6">
        <p className="text-pink-500 font-bold flex items-center justify-center gap-2 mb-1">
          <Heart size={16} fill="currentColor" /> Parabéns! Seu pagamento foi aprovado.
        </p>
        <p className="text-pink-400 text-sm font-semibold flex items-center justify-center gap-1">
          Você já tem acesso completo ao conteúdo VIP! <Sparkles size={14} className="text-yellow-400" />
        </p>
      </div>

      {/* Recibo Estilo Imagem de Referência */}
      <div className="dotted-receipt w-full space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <Gem size={18} /> Plano:
          </div>
          <div className="font-bold text-slate-700 uppercase">{PLAN_NAME}</div>
        </div>
        <div className="w-full h-px bg-slate-100"></div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <Coins size={18} /> Valor pago:
          </div>
          <div className="text-xl font-black text-pink-500">
            R$ {UPSELL_VALUE.toFixed(2).replace('.', ',')}
          </div>
        </div>
      </div>

      {/* Seção de Dados ou Botão Final */}
      <div className="w-full mt-8">
        {!isSubmitted ? (
          <form onSubmit={handleLeadEnrichment} className="space-y-4">
            <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest mb-2">
              Confirme seus dados para liberar o acesso
            </p>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-pink-300 w-5 h-5" />
              <input 
                type="email" 
                placeholder="Seu e-mail de compra"
                required
                className="w-full bg-pink-50/30 border-2 border-pink-100 rounded-2xl py-4 pl-12 pr-4 focus:border-pink-300 transition-all outline-none text-slate-700 font-semibold"
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
                className="w-full bg-pink-50/30 border-2 border-pink-100 rounded-2xl py-4 pl-12 pr-4 focus:border-pink-300 transition-all outline-none text-slate-700 font-semibold"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="btn-gradient w-full text-white font-black py-5 rounded-2xl transform active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
            >
              LIBERAR CONTEÚDO VIP <ChevronRight size={20} />
            </button>
          </form>
        ) : (
          <div className="animate-pop">
            <a 
              href={BOT_LINK}
              className="btn-gradient w-full text-white font-black py-6 rounded-2xl transform hover:-translate-y-1 active:scale-95 transition-all flex flex-col items-center justify-center relative overflow-hidden text-center shadow-xl"
            >
              <span className="text-[10px] opacity-80 mb-1">TUDO PRONTO! CLIQUE ABAIXO:</span>
              <div className="text-xl flex items-center gap-2">
                VOLTAR PARA O BOT 🎀
              </div>
            </a>
            <p className="text-center text-pink-300 text-[10px] font-bold mt-4 uppercase tracking-tighter">
              Clique acima para ser redirecionado ao Telegram
            </p>
          </div>
        )}
      </div>

      {/* Selo de Segurança */}
      <div className="mt-8 flex items-center gap-1 opacity-20">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">Acesso Seguro • 2024</span>
      </div>
    </div>
  );
};

export default App;
