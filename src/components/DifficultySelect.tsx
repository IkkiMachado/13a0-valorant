import React, { useState } from 'react';
import { DifficultyLevel, GameMode } from '../types/game';
import { Trophy, Shield, EyeOff, Eye, RotateCcw, Flame, Sparkles, Check, HelpCircle, Calendar, Coins, Zap, Dumbbell, Award } from 'lucide-react';

interface DifficultySelectProps {
  onSelectModeAndDifficulty: (mode: GameMode, difficulty: DifficultyLevel) => void;
  onOpenHowToPlay: () => void;
  onOpenDailyModal?: () => void;
  dailyStreak?: number;
}

export const DifficultySelect: React.FC<DifficultySelectProps> = ({
  onSelectModeAndDifficulty,
  onOpenHowToPlay,
  onOpenDailyModal,
  dailyStreak = 0
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('CLASSIC');

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-center">
      
      {/* Hero Branding */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#ff4655]/20 border border-[#ff4655]/40 text-[#ff4655] text-xs font-tech font-bold uppercase tracking-widest mb-3">
          <Sparkles size={14} /> VCT Esports Simulator
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-wide uppercase">
          13 A 0 · ROAD TO CHAMPIONS
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-tech max-w-xl mx-auto mt-2">
          Escolha seu estilo de jogo e a dificuldade do draft para iniciar sua jornada ao troféu mundial:
        </p>
      </div>

      {/* Daily Challenge Banner */}
      {onOpenDailyModal && (
        <div 
          onClick={onOpenDailyModal}
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#182638] to-[#0f1923] border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(245,183,49,0.2)] val-cut-top-right flex flex-col sm:flex-row items-center justify-between gap-4 text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Calendar size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-tech font-bold uppercase tracking-wider">
                  MODO DIÁRIO
                </span>
                <span className="text-xs font-tech text-[#ff4655] font-bold flex items-center gap-1">
                  <Flame size={13} /> {dailyStreak} DIAS DE SEQUÊNCIA
                </span>
              </div>
              <h3 className="font-display font-black text-xl text-white group-hover:text-amber-400 transition">
                DESAFIO DO DIA (DAILY CHALLENGE)
              </h3>
              <p className="text-xs text-slate-300 font-tech">
                Regras e sementes temáticas únicas atualizadas a cada 24 horas. Todos os jogadores competem no mesmo cenário!
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDailyModal();
            }}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shrink-0 shadow-lg"
          >
            VER DESAFIO DE HOJE 📅
          </button>
        </div>
      )}

      {/* STEP 1: Game Mode Selection */}
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-[#ff4655] text-white flex items-center justify-center font-display font-black text-xs">
            1
          </span>
          <span className="text-xs font-tech text-white uppercase tracking-widest font-bold">
            ESCOLHA O MODO DE JOGO:
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: 13 a 0 Clássico */}
          <div
            onClick={() => setSelectedMode('CLASSIC')}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedMode === 'CLASSIC'
                ? 'bg-gradient-to-br from-[#162534] to-[#0f1923] border-[#ff4655] shadow-[0_0_25px_rgba(255,70,85,0.3)] ring-2 ring-[#ff4655]/40'
                : 'bg-[#0f1923] border-[#243447] hover:border-slate-500 opacity-70 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded bg-[#ff4655]/20 text-[#ff4655] border border-[#ff4655]/40 text-[10px] font-tech font-bold uppercase tracking-wider">
                  DESAFIO ORIGINAL
                </span>
                {selectedMode === 'CLASSIC' ? (
                  <span className="text-xs font-tech font-bold text-[#ff4655] flex items-center gap-1">
                    <Check size={16} /> SELECIONADO
                  </span>
                ) : (
                  <span className="text-xs font-tech text-slate-500">Clique para selecionar</span>
                )}
              </div>

              <h3 className="font-display font-black text-2xl text-white mb-2 flex items-center gap-2">
                <Trophy size={22} className="text-[#ff4655]" /> 13 A 0 CLÁSSICO
              </h3>
              
              <p className="text-xs text-slate-300 font-tech mb-4 leading-relaxed">
                O desafio de draft puro inspirado no 7 a 0 e Road to Major. Você drafteia os 5 atletas sorteados e disputa as partidas diretamente, sem interferências externas.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[10px] font-tech">
              <span className="bg-black/50 text-slate-300 px-2.5 py-1 rounded border border-white/5">
                ✓ Draft Puro & Sem Trocas
              </span>
              <span className="bg-black/50 text-slate-300 px-2.5 py-1 rounded border border-white/5">
                ✓ Sem Economia / Perks
              </span>
              <span className="bg-black/50 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/20">
                ✓ Foco 100% no Conhecimento
              </span>
            </div>
          </div>

          {/* Card 2: Modo Manager Roguelike */}
          <div
            onClick={() => setSelectedMode('MANAGER')}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedMode === 'MANAGER'
                ? 'bg-gradient-to-br from-[#1b2618] via-[#101f27] to-[#0f1923] border-amber-400 shadow-[0_0_25px_rgba(245,183,49,0.3)] ring-2 ring-amber-400/40'
                : 'bg-[#0f1923] border-[#243447] hover:border-slate-500 opacity-70 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-tech font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={11} /> EXPERIÊNCIA ROGUELIKE
                </span>
                {selectedMode === 'MANAGER' ? (
                  <span className="text-xs font-tech font-bold text-amber-400 flex items-center gap-1">
                    <Check size={16} /> SELECIONADO
                  </span>
                ) : (
                  <span className="text-xs font-tech text-slate-500">Clique para selecionar</span>
                )}
              </div>

              <h3 className="font-display font-black text-2xl text-white mb-2 flex items-center gap-2">
                <Coins size={22} className="text-amber-400" /> MODO MANAGER & ROGUELIKE
              </h3>

              <p className="text-xs text-slate-300 font-tech mb-4 leading-relaxed">
                Carreira de Coach estilo Balatro: fature Créditos VCT por vitórias e proezas, compre Perks Táticos com sinergias, contrate estrelas mundiais e evolua seus atletas no Bootcamp.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[10px] font-tech">
              <span className="bg-black/50 text-amber-300 px-2.5 py-1 rounded border border-amber-500/20 flex items-center gap-1">
                <Coins size={11} /> Economia de Créditos (₡)
              </span>
              <span className="bg-black/50 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/20 flex items-center gap-1">
                <Zap size={11} /> 12 Perks Táticos
              </span>
              <span className="bg-black/50 text-rose-300 px-2.5 py-1 rounded border border-rose-500/20 flex items-center gap-1">
                <Dumbbell size={11} /> Mercado & Treinos
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* STEP 2: Difficulty Selection */}
      <div className="text-left">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-[#ff4655] text-white flex items-center justify-center font-display font-black text-xs">
            2
          </span>
          <span className="text-xs font-tech text-white uppercase tracking-widest font-bold">
            ESCOLHA A DIFICULDADE DO DRAFT PARA INICIAR:
          </span>
        </div>

        {/* 3 Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. FÁCIL */}
          <div 
            onClick={() => onSelectModeAndDifficulty(selectedMode, 'FACIL')}
            className="relative p-6 rounded-2xl bg-[#0f1923] border border-emerald-500/40 hover:border-emerald-400 hover:bg-[#142332] transition-all duration-300 cursor-pointer group val-cut-top-right shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-tech font-bold uppercase tracking-widest">
                  FÁCIL
                </span>
                <span className="text-xs font-tech text-slate-500">Iniciante</span>
              </div>

              <h3 className="font-display font-black text-2xl text-white mb-2 group-hover:text-emerald-400 transition">
                DIFICULDADE FÁCIL
              </h3>
              <p className="text-xs text-slate-400 font-tech mb-6 leading-relaxed">
                Ideal para planejar com calma e comparar todos os atributos dos pro players visíveis.
              </p>

              {/* Rules list */}
              <ul className="space-y-2.5 text-xs font-tech text-slate-300 border-t border-[#1e2d3d] pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span><strong>1 time sorteado por vez</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-emerald-400" />
                  <span><strong>3 rolls</strong> para pular times</span>
                </li>
                <li className="flex items-center gap-2">
                  <Eye size={14} className="text-emerald-400" />
                  <span><strong>OVR e atributos visíveis</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield size={14} className="text-emerald-400" />
                  <span>1 jogador por time sorteado</span>
                </li>
              </ul>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectModeAndDifficulty(selectedMode, 'FACIL');
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-display font-black text-sm uppercase tracking-wider rounded-lg transition cursor-pointer"
            >
              JOGAR NO FÁCIL →
            </button>
          </div>

          {/* 2. MÉDIO */}
          <div 
            onClick={() => onSelectModeAndDifficulty(selectedMode, 'MEDIO')}
            className="relative p-6 rounded-2xl bg-[#0f1923] border border-amber-500/40 hover:border-amber-400 hover:bg-[#142332] transition-all duration-300 cursor-pointer group val-cut-top-right shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-tech font-bold uppercase tracking-widest">
                  MÉDIO
                </span>
                <span className="text-xs font-tech text-slate-500">Competitivo</span>
              </div>

              <h3 className="font-display font-black text-2xl text-white mb-2 group-hover:text-amber-400 transition">
                DIFICULDADE MÉDIA
              </h3>
              <p className="text-xs text-slate-400 font-tech mb-6 leading-relaxed">
                Mais restrito: exige decisões estratégicas rápidas com apenas 1 chance de pular time.
              </p>

              {/* Rules list */}
              <ul className="space-y-2.5 text-xs font-tech text-slate-300 border-t border-[#1e2d3d] pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-amber-400" />
                  <span><strong>1 time sorteado por vez</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-amber-400" />
                  <span>Apenas <strong>1 roll</strong> disponível</span>
                </li>
                <li className="flex items-center gap-2">
                  <Eye size={14} className="text-amber-400" />
                  <span><strong>OVR e atributos visíveis</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield size={14} className="text-amber-400" />
                  <span>1 jogador por time sorteado</span>
                </li>
              </ul>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectModeAndDifficulty(selectedMode, 'MEDIO');
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-sm uppercase tracking-wider rounded-lg transition cursor-pointer"
            >
              JOGAR NO MÉDIO →
            </button>
          </div>

          {/* 3. DIFÍCIL (HARDCORE) */}
          <div 
            onClick={() => onSelectModeAndDifficulty(selectedMode, 'DIFICIL')}
            className="relative p-6 rounded-2xl bg-gradient-to-b from-[#182330] to-[#0f1923] border-2 border-[#ff4655] hover:border-[#ff5e6c] transition-all duration-300 cursor-pointer group val-cut-top-right shadow-[0_0_25px_rgba(255,70,85,0.25)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-[#ff4655]/20 text-[#ff4655] border border-[#ff4655]/40 text-xs font-tech font-bold uppercase tracking-widest flex items-center gap-1">
                  <Flame size={12} /> DIFÍCIL
                </span>
                <span className="text-[10px] bg-red-500 text-white font-tech font-bold px-1.5 py-0.5 rounded">
                  EXPERIÊNCIA 7A0
                </span>
              </div>

              <h3 className="font-display font-black text-2xl text-white mb-2 group-hover:text-[#ff4655] transition">
                MODO ALMANAQUE
              </h3>
              <p className="text-xs text-slate-300 font-tech mb-6 leading-relaxed">
                O teste supremo: monte às cegas com <strong className="text-white">OVR OCULTO</strong>, confiando puramente no seu conhecimento histórico do VCT!
              </p>

              {/* Rules list */}
              <ul className="space-y-2.5 text-xs font-tech text-slate-200 border-t border-[#1e2d3d] pt-4 mb-6">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#ff4655]" />
                  <span><strong>1 time sorteado por vez</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <EyeOff size={14} className="text-[#ff4655]" />
                  <span><strong className="text-red-400">OVR e Atributos OCULTOS (?)</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-slate-500" />
                  <span><strong>0 rolls</strong> (sem segunda chance)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield size={14} className="text-[#ff4655]" />
                  <span>1 jogador por time sorteado</span>
                </li>
              </ul>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectModeAndDifficulty(selectedMode, 'DIFICIL');
              }}
              className="w-full py-3 bg-gradient-to-r from-[#ff4655] to-[#d62635] hover:from-[#ff5e6c] hover:to-[#ff4655] text-white font-display font-black text-sm uppercase tracking-wider rounded-lg shadow-lg transition cursor-pointer"
            >
              JOGAR NO DIFÍCIL (ÀS CEGAS) →
            </button>
          </div>

        </div>
      </div>

      {/* Manual link */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={onOpenHowToPlay}
          className="flex items-center gap-2 text-xs font-tech text-slate-400 hover:text-white transition cursor-pointer"
        >
          <HelpCircle size={15} className="text-[#00f59b]" />
          Dúvidas sobre as 4 funções e o IGL? Leia o Manual Tático.
        </button>
      </div>

    </div>
  );
};
