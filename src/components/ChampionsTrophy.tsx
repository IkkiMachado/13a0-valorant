import React, { useState, useEffect } from 'react';
import { Lineup, DifficultyLevel } from '../types/game';
import { Trophy, Award, Sparkles, RotateCcw, Skull, Share2 } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { getPlayerPhoto, getAgentIcon } from '../utils/playerPhotos';
import confetti from 'canvas-confetti';

interface ChampionsTrophyProps {
  isChampion: boolean;
  lineup: Lineup;
  achieved13x0: boolean;
  difficulty?: DifficultyLevel;
  isDailyMode?: boolean;
  dailyDayName?: string;
  dailyStreak?: number;
  onRestart: () => void;
}

export const ChampionsTrophy: React.FC<ChampionsTrophyProps> = ({
  isChampion,
  lineup,
  achieved13x0,
  difficulty = 'MEDIO',
  isDailyMode = false,
  dailyDayName,
  dailyStreak = 0,
  onRestart
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  useEffect(() => {
    if (isChampion) {
      // Big celebratory fireworks
      const duration = 3.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff4655', '#f5b731', '#00f59b']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff4655', '#f5b731', '#00f59b']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isChampion]);

  const players = Object.values(lineup).filter(Boolean);

  if (!isChampion) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl bg-[#0f1923] border border-red-500/40 val-cut-top-right shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4">
            <Skull size={32} />
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
            ELIMINADO DO CHAMPIONS
          </h2>
          <p className="text-sm text-slate-400 font-tech mt-2 max-w-md mx-auto">
            Sua campanha chegou ao fim. As zebras do VCT e a pressão dos playoffs custaram o sonho do título mundial.
          </p>

          {/* Drafted Lineup with Photos */}
          <div className="mt-6 pt-5 border-t border-[#1e2f42]">
            <h4 className="text-[11px] font-tech text-slate-400 uppercase tracking-widest mb-3">
              SUA LINE-UP DRAFTADA
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {players.map((p) => {
                if (!p) return null;
                const photo = getPlayerPhoto(p.name, p.signatureAgent, p.photoUrl);
                const fallbackIcon = getAgentIcon(p.signatureAgent);
                return (
                  <div key={p.id} className="p-2.5 bg-[#090e14] rounded-lg border border-[#1e2d3d] flex flex-col items-center text-center">
                    <div className="w-12 h-14 rounded-md overflow-hidden border border-slate-700 bg-[#13202e] mb-1.5 relative">
                      <img
                        src={photo}
                        alt={p.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackIcon;
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="text-xs font-bold text-white truncate w-full flex items-center justify-center gap-1">
                      <span className="truncate">{p.name}</span>
                      <span className="text-[10px] shrink-0">{p.flag}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-tech flex items-center gap-1 justify-center mt-0.5">
                      <img src={fallbackIcon} alt="" className="w-2.5 h-2.5 rounded-full object-cover" />
                      <span>{p.signatureAgent}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-6 py-3 bg-[#1e2f42] hover:bg-[#283e57] text-white font-display font-bold text-sm uppercase tracking-wider rounded-lg transition inline-flex items-center gap-2 cursor-pointer border border-[#334e6e]"
            >
              <Share2 size={16} className="text-amber-400" /> Compartilhar Line-up
            </button>

            <button
              onClick={onRestart}
              className="px-6 py-3 bg-[#ff4655] hover:bg-[#e03140] text-white font-display font-black text-sm uppercase tracking-wider rounded-lg transition inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={16} /> Tentar Novo Draft
            </button>
          </div>
        </div>

        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          isChampion={isChampion}
          achieved13x0={achieved13x0}
          lineup={lineup}
          difficulty={difficulty}
          isDailyMode={isDailyMode}
          dailyDayName={dailyDayName}
          dailyStreak={dailyStreak}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="relative p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-[#142232] via-[#0f1923] to-[#090e14] border-2 border-amber-500/60 val-cut-top-right shadow-[0_0_50px_rgba(245,183,49,0.2)]">
        
        {/* Glow & Trophy */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-amber-500/30 blur-2xl rounded-full"></div>
          <div className="relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl">
            <Trophy size={48} className="animate-bounce" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-tech font-bold uppercase tracking-widest mb-3">
          <Sparkles size={14} /> Campeão do Mundo
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-wide">
          CAMPEÃO DO VCT CHAMPIONS!
        </h1>
        <p className="text-base text-slate-300 font-tech mt-2 max-w-lg mx-auto">
          Sua line-up entrou para a história do Valorant ao levantar o troféu mundial!
        </p>

        {/* 13-0 Special Stamp */}
        {achieved13x0 && (
          <div className="mt-6 p-4 max-w-md mx-auto bg-gradient-to-r from-amber-500/20 via-[#ff4655]/20 to-amber-500/20 border-2 border-amber-400 rounded-xl">
            <div className="font-display font-black text-2xl text-amber-300 tracking-wider flex items-center justify-center gap-2">
              <Award size={24} className="text-amber-400" />
              SELO 13-0 FLAWLESS CONQUISTADO!
            </div>
            <p className="text-xs text-slate-300 font-tech mt-1">
              Você aplicou o lendário 13 a 0 durante o torneio, sem perder um único round!
            </p>
          </div>
        )}

        {/* Winning Roster */}
        <div className="mt-8 pt-6 border-t border-[#243447]">
          <h3 className="text-xs font-tech text-slate-400 uppercase tracking-widest mb-4">
            A LINE-UP CAMPEÃ MUNDIAL
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {players.map((p) => {
              if (!p) return null;
              const photo = getPlayerPhoto(p.name, p.signatureAgent, p.photoUrl);
              const fallbackIcon = getAgentIcon(p.signatureAgent);
              return (
                <div key={p.id} className="p-3 bg-[#090e14] rounded-xl border border-amber-500/40 flex flex-col items-center text-center shadow-[0_0_15px_rgba(245,183,49,0.1)]">
                  <div className="w-16 h-20 rounded-lg overflow-hidden border border-amber-400/60 bg-[#142334] mb-2 relative shadow-md">
                    <img
                      src={photo}
                      alt={p.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackIcon;
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                    {p.isIGL && (
                      <span className="absolute top-1 right-1 bg-amber-400 text-slate-950 px-1 rounded text-[8px] font-black shadow">
                        ★
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-white flex items-center justify-center gap-1 truncate w-full">
                    <span className="truncate">{p.name}</span>
                    <span className="text-xs shrink-0">{p.flag}</span>
                  </div>
                  <div className="text-[11px] text-[#ff4655] font-tech font-bold">{p.role}</div>
                  <div className="text-[10px] text-slate-400 font-tech flex items-center gap-1 justify-center mt-0.5">
                    <img src={fallbackIcon} alt="" className="w-3 h-3 rounded-full object-cover" />
                    <span>{p.signatureAgent}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-black text-lg uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(245,183,49,0.35)] transition inline-flex items-center gap-2.5 cursor-pointer val-cut-top-right"
          >
            <Share2 size={20} /> Compartilhar Vitória & Card
          </button>

          <button
            onClick={onRestart}
            className="px-8 py-4 bg-[#142334] hover:bg-[#1a2d42] border border-[#2b415a] text-white font-display font-bold text-base uppercase tracking-wider rounded-xl transition inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw size={18} /> Jogar Novo Draft
          </button>
        </div>

      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        isChampion={isChampion}
        achieved13x0={achieved13x0}
        lineup={lineup}
        difficulty={difficulty}
        isDailyMode={isDailyMode}
        dailyDayName={dailyDayName}
        dailyStreak={dailyStreak}
      />
    </div>
  );
};
