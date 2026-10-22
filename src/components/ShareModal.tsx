import React, { useState, useEffect, useRef } from 'react';
import { Lineup, DifficultyLevel } from '../types/game';
import { Share2, Copy, Check, Download, Send, Trophy, Award, Sparkles, X, Flame } from 'lucide-react';

const TwitterXIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isChampion: boolean;
  achieved13x0: boolean;
  lineup: Lineup;
  difficulty?: DifficultyLevel;
  isDailyMode?: boolean;
  dailyDayName?: string;
  dailyStreak?: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  isChampion,
  achieved13x0,
  lineup,
  difficulty = 'MEDIO',
  isDailyMode = false,
  dailyDayName,
  dailyStreak = 0
}) => {
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const players = [
    { slot: 'Duelista', p: lineup.duelista, emoji: '🤺' },
    { slot: 'Iniciador', p: lineup.iniciador, emoji: '🏹' },
    { slot: 'Controlador', p: lineup.controlador, emoji: '💨' },
    { slot: 'Sentinela', p: lineup.sentinela, emoji: '🛡️' },
    { slot: 'IGL / Flex', p: lineup.igl, emoji: '🧠' }
  ];

  // Generate shareable text
  const getShareText = () => {
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    let text = `🎮 13 A 0 · Road to Champions\n`;

    if (isDailyMode) {
      text += `📅 Desafio do Dia (${today}) — ${dailyDayName || 'VCT Daily'}\n`;
      text += `🎯 Dificuldade: ${difficulty === 'DIFICIL' ? 'Difícil (Às Cegas 🔥)' : difficulty === 'MEDIO' ? 'Médio ⚡' : 'Fácil 🛡️'}\n`;
      text += `🔥 Sequência Atual: ${dailyStreak} dia(s)\n`;
    } else {
      text += `🎯 Modo: ${difficulty === 'DIFICIL' ? 'Difícil (Às Cegas)' : difficulty === 'MEDIO' ? 'Médio' : 'Fácil'}\n`;
    }

    if (isChampion) {
      text += `🏆 CAMPEÃO MUNDIAL DO VCT! 👑\n`;
    } else {
      text += `💀 Campanha no VCT Champions\n`;
    }

    if (achieved13x0) {
      text += `⭐ SELO 13-0 FLAWLESS CONQUISTADO!\n`;
    }

    text += `\nLine-up dos Sonhos:\n`;
    players.forEach(({ slot, p, emoji }) => {
      if (p) {
        text += `${emoji} ${p.name} (${p.signatureAgent}) ${p.flag}\n`;
      }
    });

    text += `\nMonte a sua line-up e tente o 13 a 0: https://13a0.vercel.app`;
    return text;
  };

  const shareText = getShareText();

  // Generate Canvas HD Graphic Card
  useEffect(() => {
    if (!isOpen) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Dark Futuristic Tech Background
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 675);
    bgGradient.addColorStop(0, '#090e14');
    bgGradient.addColorStop(0.5, '#121e2d');
    bgGradient.addColorStop(1, '#080d13');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 675);

    // Subtle tactical grid lines
    ctx.strokeStyle = 'rgba(255, 70, 85, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 675);
      ctx.stroke();
    }
    for (let y = 0; y < 675; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Border Frame with VCT Red Accent
    ctx.strokeStyle = isChampion ? '#f5b731' : '#ff4655';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 1160, 635);

    // Decorative Cut Corner Top Right
    ctx.fillStyle = isChampion ? '#f5b731' : '#ff4655';
    ctx.beginPath();
    ctx.moveTo(1140, 20);
    ctx.lineTo(1180, 20);
    ctx.lineTo(1180, 60);
    ctx.closePath();
    ctx.fill();

    // 2. Top Header Brand
    ctx.fillStyle = '#ff4655';
    ctx.fillRect(50, 45, 60, 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px system-ui, sans-serif';
    ctx.fillText('13:0', 56, 71);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 32px system-ui, sans-serif';
    ctx.fillText('13 A 0 · ROAD TO CHAMPIONS', 125, 72);

    // Top Right Subtitle
    ctx.fillStyle = isDailyMode ? '#f5b731' : '#94a3b8';
    ctx.font = '700 16px monospace';
    const modeLabel = isDailyMode ? `DESAFIO DO DIA (${difficulty}) · ${dailyDayName || ''}` : `MODO ${difficulty}`;
    ctx.fillText(modeLabel, 1150 - ctx.measureText(modeLabel).width, 70);

    // 3. Campaign Result Title
    ctx.fillStyle = isChampion ? '#f5b731' : '#ffffff';
    ctx.font = '900 48px system-ui, sans-serif';
    const mainTitle = isChampion ? 'CAMPEÃO MUNDIAL DO VCT' : 'CAMPANHA VCT CHAMPIONS';
    ctx.fillText(mainTitle, 50, 160);

    // 13-0 Flawless Tag
    if (achieved13x0) {
      ctx.fillStyle = 'rgba(245, 183, 49, 0.2)';
      ctx.strokeStyle = '#f5b731';
      ctx.lineWidth = 2;
      ctx.fillRect(50, 185, 340, 40);
      ctx.strokeRect(50, 185, 340, 40);
      ctx.fillStyle = '#f5b731';
      ctx.font = '800 18px system-ui, sans-serif';
      ctx.fillText('⭐ SELO 13-0 FLAWLESS CONQUISTADO', 65, 211);
    } else if (isDailyMode) {
      ctx.fillStyle = 'rgba(255, 70, 85, 0.2)';
      ctx.strokeStyle = '#ff4655';
      ctx.lineWidth = 2;
      ctx.fillRect(50, 185, 280, 40);
      ctx.strokeRect(50, 185, 280, 40);
      ctx.fillStyle = '#ff7a85';
      ctx.font = '800 18px system-ui, sans-serif';
      ctx.fillText(`🔥 SEQUÊNCIA: ${dailyStreak} DIAS`, 65, 211);
    }

    // 4. Five Player Cards
    const cardY = 260;
    const cardW = 205;
    const cardH = 300;
    const startX = 50;
    const gap = 18;

    players.forEach(({ slot, p }, index) => {
      const x = startX + index * (cardW + gap);

      // Card Background
      ctx.fillStyle = 'rgba(15, 25, 35, 0.9)';
      ctx.fillRect(x, cardY, cardW, cardH);

      // Card Border
      ctx.strokeStyle = '#243447';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, cardY, cardW, cardH);

      // Top role accent line
      ctx.fillStyle = index === 0 ? '#ff4655' : index === 1 ? '#00c8b9' : index === 2 ? '#b05bff' : index === 3 ? '#00f59b' : '#f5b731';
      ctx.fillRect(x, cardY, cardW, 5);

      if (p) {
        // Slot Role Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 12px monospace';
        ctx.fillText(slot.toUpperCase(), x + 15, cardY + 32);

        // Player Name
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 24px system-ui, sans-serif';
        ctx.fillText(p.name, x + 15, cardY + 70);

        // Flag and Team
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '16px system-ui, sans-serif';
        ctx.fillText(`${p.flag}  ${p.team}`, x + 15, cardY + 102);

        // Agent Box
        ctx.fillStyle = 'rgba(20, 35, 50, 0.8)';
        ctx.fillRect(x + 15, cardY + 125, cardW - 30, 65);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 11px monospace';
        ctx.fillText('AGENTE ASSINATURA', x + 25, cardY + 148);
        ctx.fillStyle = '#00f59b';
        ctx.font = '800 18px system-ui, sans-serif';
        ctx.fillText(p.signatureAgent, x + 25, cardY + 174);

        // Stats Box
        ctx.fillStyle = '#64748b';
        ctx.font = '600 13px monospace';
        ctx.fillText(`MIRA: ${p.aim}`, x + 15, cardY + 225);
        ctx.fillText(`UTILIDADE: ${p.utility}`, x + 15, cardY + 248);
        ctx.fillText(`CLUTCH: ${p.clutch}`, x + 15, cardY + 271);

        // OVR Stamp
        ctx.fillStyle = '#f5b731';
        ctx.font = '900 20px system-ui, sans-serif';
        ctx.fillText(`${p.rating}`, x + cardW - 45, cardY + 271);
      }
    });

    // 5. Footer Watermark
    ctx.fillStyle = '#475569';
    ctx.font = '500 14px monospace';
    ctx.fillText('13a0 · Road to Champions | Simulação Tática VCT Esports', 50, 620);
    ctx.fillText('Jogue grátis em 13a0.vercel.app', 920, 620);

    const generated = canvas.toDataURL('image/png');
    setImageUrl(generated);
  }, [isOpen, isChampion, achieved13x0, lineup, difficulty, isDailyMode, dailyDayName, dailyStreak]);

  if (!isOpen) return null;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `13a0-vct-lineup-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#142334] to-[#0a1017] rounded-2xl border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,183,49,0.25)] p-6 sm:p-8 val-cut-top-right text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-tech font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Share2 size={13} /> COMPARTILHAR CONQUISTA
          </span>
          {isChampion && (
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1">
              <Trophy size={13} /> CAMPEÃO MUNDIAL
            </span>
          )}
          {achieved13x0 && (
            <span className="px-3 py-1 rounded-full bg-[#ff4655]/20 text-[#ff4655] border border-[#ff4655]/40 text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1">
              <Award size={13} /> 13-0 FLAWLESS
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide">
          MOSTRE SUA LINE-UP PRO MUNDO
        </h2>
        <p className="text-xs text-slate-300 font-tech mt-1 mb-6">
          Compartilhe sua escalação All-Star do VCT com seus amigos via texto formatado ou baixe o card visual em alta definição:
        </p>

        {/* Visual Card Image Preview */}
        {imageUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border-2 border-[#243447] shadow-xl relative group">
            <img src={imageUrl} alt="Card da Campanha VCT" className="w-full h-auto object-cover" />
            <button
              onClick={handleDownloadImage}
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#090e14]/90 hover:bg-[#ff4655] text-white text-xs font-tech font-bold transition flex items-center gap-1.5 border border-white/20 shadow-lg cursor-pointer"
            >
              <Download size={14} /> Baixar Imagem (PNG)
            </button>
          </div>
        )}

        {/* Copy Text Preview Box */}
        <div className="mb-6 p-4 rounded-xl bg-[#090e14] border border-[#243447]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-slate-400">
              PRÉVIA DO TEXTO (WHATSAPP & TWITTER/X)
            </span>
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1 text-xs font-tech font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'COPIADO! ✓' : 'COPIAR TEXTO'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap bg-[#101b26] p-3 rounded-lg border border-[#1e2f42] max-h-36 overflow-y-auto">
            {shareText}
          </pre>
        </div>

        {/* Share Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleCopyText}
            className={`py-3 px-4 rounded-xl font-display font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 border ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-[#152230] hover:bg-[#1f334a] text-slate-200 border-[#2b4159]'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'TEXTO COPIADO!' : 'COPIAR TEXTO'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl font-display font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 shadow-lg text-center"
          >
            <Send size={16} />
            <span>WHATSAPP</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl font-display font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1a90d9] text-white shadow-lg text-center"
          >
            <TwitterXIcon size={16} />
            <span>TWITTER / X</span>
          </a>
        </div>

      </div>
    </div>
  );
};
