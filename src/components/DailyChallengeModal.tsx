import React, { useState } from 'react';
import { DailyChallengeInfo, DailyResultRecord, getDailyStreak } from '../utils/daily';
import { DifficultyLevel } from '../types/game';
import { Calendar, Flame, Trophy, AlertCircle, CheckCircle2, Swords, X, Sparkles, Eye, EyeOff } from 'lucide-react';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: DailyChallengeInfo;
  todayResult: DailyResultRecord | null;
  onStartDaily: (difficulty: DifficultyLevel) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  challenge,
  todayResult,
  onStartDaily
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(
    todayResult?.difficulty || 'MEDIO'
  );

  if (!isOpen) return null;

  const streak = getDailyStreak();

  // Format date in PT-BR friendly format
  const dateObj = new Date(challenge.dateStr + 'T12:00:00');
  const formattedDate = dateObj.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    weekday: 'long'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#142334] to-[#0a1017] rounded-2xl border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,183,49,0.25)] p-6 sm:p-8 val-cut-top-right text-slate-100 max-h-[92vh] overflow-y-auto"
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
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-tech font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Calendar size={13} /> DESAFIO DO DIA
          </span>

          <span className="px-3 py-1 rounded-full bg-[#ff4655]/20 text-[#ff4655] border border-[#ff4655]/40 text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1">
            <Flame size={13} /> {streak} DIAS DE STREAK
          </span>

          {todayResult?.completed && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={13} /> CONCLUÍDO ({todayResult.difficulty || 'MÉDIO'})
            </span>
          )}
        </div>

        {/* Date & Title */}
        <p className="text-xs font-tech text-slate-400 uppercase tracking-widest capitalize">
          {formattedDate}
        </p>

        <h2 className="text-2xl sm:text-3xl font-display font-black text-white mt-1 mb-2 tracking-wide">
          {challenge.dayName}
        </h2>

        <p className="text-sm font-tech text-amber-400 font-bold mb-3 flex items-center gap-1.5">
          <Sparkles size={16} /> {challenge.themeTitle}
        </p>

        <p className="text-xs text-slate-300 font-tech leading-relaxed mb-5">
          {challenge.description}
        </p>

        {/* Special Constraint Box */}
        <div className="p-4 rounded-xl bg-[#090e14] border-2 border-amber-500/50 mb-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
              <AlertCircle size={18} />
            </div>

            <div>
              <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-amber-400 block mb-0.5">
                REGRA OBRIGATÓRIA DE HOJE
              </span>
              <p className="text-xs sm:text-sm font-tech font-semibold text-white leading-snug">
                {challenge.ruleConstraintText}
              </p>
            </div>
          </div>
        </div>

        {/* Difficulty Selection for Daily Challenge */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-slate-400">
              DIFICULDADE DO DESAFIO:
            </span>
            <span className="text-[10px] font-tech text-amber-400 font-bold">
              {selectedDifficulty === 'DIFICIL'
                ? '🔥 0 Rolls · OVR Oculto (?)'
                : selectedDifficulty === 'MEDIO'
                ? '⚡ 1 Roll · OVR Visível'
                : '🛡️ 3 Rolls · OVR Visível'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Fácil */}
            <div
              onClick={() => setSelectedDifficulty('FACIL')}
              className={`p-3 rounded-xl border-2 transition cursor-pointer text-center ${
                selectedDifficulty === 'FACIL'
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-[#0f1923] border-[#243447] hover:border-slate-500 hover:bg-[#142332]'
              }`}
            >
              <div className="text-xs font-display font-black text-white">FÁCIL</div>
              <div className="text-[10px] font-tech text-emerald-400 mt-0.5">3 Rolls</div>
              <div className="text-[9px] font-tech text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                <Eye size={10} /> OVR Aberto
              </div>
            </div>

            {/* Médio */}
            <div
              onClick={() => setSelectedDifficulty('MEDIO')}
              className={`p-3 rounded-xl border-2 transition cursor-pointer text-center relative ${
                selectedDifficulty === 'MEDIO'
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,183,49,0.3)]'
                  : 'bg-[#0f1923] border-[#243447] hover:border-slate-500 hover:bg-[#142332]'
              }`}
            >
              <div className="text-xs font-display font-black text-white">MÉDIO</div>
              <div className="text-[10px] font-tech text-amber-400 mt-0.5">1 Roll</div>
              <div className="text-[9px] font-tech text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                <Eye size={10} /> Padrão
              </div>
            </div>

            {/* Difícil */}
            <div
              onClick={() => setSelectedDifficulty('DIFICIL')}
              className={`p-3 rounded-xl border-2 transition cursor-pointer text-center relative ${
                selectedDifficulty === 'DIFICIL'
                  ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.35)]'
                  : 'bg-[#0f1923] border-[#243447] hover:border-slate-500 hover:bg-[#142332]'
              }`}
            >
              <div className="text-xs font-display font-black text-white flex items-center justify-center gap-1">
                <Flame size={12} className="text-red-400" /> DIFÍCIL
              </div>
              <div className="text-[10px] font-tech text-red-400 mt-0.5">0 Rolls</div>
              <div className="text-[9px] font-tech text-red-300 mt-0.5 flex items-center justify-center gap-1">
                <EyeOff size={10} /> OVR Oculto
              </div>
            </div>
          </div>
        </div>

        {/* Info on Seed / Equality */}
        <div className="p-3 rounded-lg bg-[#101b26] border border-[#1e2f42] text-[11px] font-tech text-slate-400 mb-6 flex items-center gap-2.5">
          <Swords size={16} className="text-[#00f59b] shrink-0" />
          <span>
            Todos os jogadores competem com a <strong className="text-slate-200">mesma ordem sorteada de equipes</strong>. Mostre seu domínio tático!
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {
            onClose();
            onStartDaily(selectedDifficulty);
          }}
          className={`w-full py-4 font-display font-black text-base sm:text-lg tracking-wider rounded-xl uppercase transition cursor-pointer flex items-center justify-center gap-2 val-cut-top-right ${
            selectedDifficulty === 'DIFICIL'
              ? 'bg-gradient-to-r from-[#ff4655] to-[#d62635] text-white shadow-[0_0_25px_rgba(255,70,85,0.4)] hover:from-[#ff5e6c] hover:to-[#ff4655]'
              : selectedDifficulty === 'FACIL'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:from-emerald-400 hover:to-teal-400'
              : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 shadow-[0_0_25px_rgba(245,183,49,0.35)] hover:from-amber-400 hover:to-amber-500'
          }`}
        >
          <Trophy size={20} />
          {todayResult?.completed
            ? `JOGAR NOVAMENTE NO ${selectedDifficulty}`
            : `ACEITAR DESAFIO NO ${selectedDifficulty}`}
        </button>

      </div>
    </div>
  );
};
