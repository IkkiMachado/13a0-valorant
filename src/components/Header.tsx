import React from 'react';
import { Trophy, Shield, HelpCircle, RotateCcw, User, Award, Calendar, Coins } from 'lucide-react';

interface HeaderProps {
  onNewDraft: () => void;
  onOpenHowToPlay: () => void;
  onOpenProfile: (tab?: 'CARD' | 'ACHIEVEMENTS' | 'HALL_OF_FAME') => void;
  onOpenDailyModal?: () => void;
  onOpenManagerHub?: () => void;
  managerCredits?: number;
  isCampaignActive?: boolean;
  nickname: string;
  achievementsCount: number;
  totalAchievementsCount?: number;
  isDraftComplete: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDraft,
  onOpenHowToPlay,
  onOpenProfile,
  onOpenDailyModal,
  onOpenManagerHub,
  managerCredits = 0,
  isCampaignActive = false,
  nickname,
  achievementsCount,
  totalAchievementsCount = 16,
  isDraftComplete
}) => {
  return (
    <header className="border-b border-[#243447] bg-[#090e14]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff4655] rounded flex items-center justify-center font-display font-black text-xl text-white tracking-tighter shadow-[0_0_15px_rgba(255,70,85,0.4)] val-cut-top-right">
            13:0
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl tracking-wider text-white">13 A 0</span>
              <span className="text-[10px] bg-[#ff4655]/20 text-[#ff4655] font-tech font-bold px-1.5 py-0.5 rounded border border-[#ff4655]/30">
                VALORANT VCT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-tech uppercase tracking-widest -mt-1">
              Road to Champions
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Manager Credits Button (when in campaign/match) */}
          {isCampaignActive && onOpenManagerHub && (
            <button
              onClick={onOpenManagerHub}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-tech font-bold text-amber-300 hover:text-white bg-[#142334] hover:bg-[#1a2e44] border border-amber-500/50 rounded transition cursor-pointer shadow-[0_0_10px_rgba(245,183,49,0.15)]"
              title="Abrir Central do Coach e Mercado Roguelike"
            >
              <Coins size={14} className="text-amber-400 animate-pulse" />
              <span>₡ {managerCredits.toLocaleString('pt-BR')}</span>
            </button>
          )}

          {/* Profile Card Button */}
          <button
            onClick={() => onOpenProfile('CARD')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-tech font-bold text-slate-200 hover:text-white bg-[#101b27] hover:bg-[#182738] border border-[#243447] hover:border-slate-500 rounded transition cursor-pointer"
            title="Ver Carteirinha e Estatísticas"
          >
            <User size={14} className="text-cyan-400" />
            <span className="font-mono">@{nickname}</span>
          </button>

          {/* Achievements Button */}
          <button
            onClick={() => onOpenProfile('ACHIEVEMENTS')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-tech font-bold text-amber-400 hover:text-amber-300 bg-[#142334] hover:bg-[#1a2d42] border border-amber-500/40 rounded transition cursor-pointer shadow-[0_0_10px_rgba(245,183,49,0.15)]"
            title="Ver Lista de Conquistas"
          >
            <Trophy size={14} className="text-amber-400" />
            <span className="font-mono">{achievementsCount}/{totalAchievementsCount}</span>
            <span className="hidden md:inline text-[10px] uppercase tracking-wider text-amber-300/80">Conquistas</span>
          </button>

          {/* Daily Challenge Button */}
          {onOpenDailyModal && (
            <button
              onClick={onOpenDailyModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-tech font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded transition cursor-pointer"
            >
              <Calendar size={14} className="text-amber-400" />
              <span className="hidden md:inline">DESAFIO DO DIA</span>
            </button>
          )}

          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-tech font-bold text-slate-300 hover:text-white bg-[#0f1923] hover:bg-[#162433] border border-[#243447] rounded transition cursor-pointer"
          >
            <HelpCircle size={15} className="text-[#00f59b]" />
            <span className="hidden sm:inline">COMO JOGAR</span>
          </button>

          <button
            onClick={onNewDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-tech font-bold text-slate-200 hover:text-white bg-[#0f1923] hover:bg-[#ff4655]/20 border border-[#243447] hover:border-[#ff4655]/50 rounded transition cursor-pointer"
          >
            <RotateCcw size={14} className="text-[#ff4655]" />
            <span className="hidden sm:inline">NOVO DRAFT</span>
          </button>
        </div>

      </div>
    </header>
  );
};
