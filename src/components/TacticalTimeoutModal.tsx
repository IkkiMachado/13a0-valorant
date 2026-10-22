import React, { useState } from 'react';
import { TacticalTimeoutStrategy, TACTICAL_STRATEGIES } from '../types/game';
import { Headphones, Zap, Shield, Brain, Check, X, ArrowRight } from 'lucide-react';

interface TacticalTimeoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeoutsLeft: number;
  onApplyTimeout: (strategy: TacticalTimeoutStrategy) => void;
}

export const TacticalTimeoutModal: React.FC<TacticalTimeoutModalProps> = ({
  isOpen,
  onClose,
  timeoutsLeft,
  onApplyTimeout
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<TacticalTimeoutStrategy>('RUSH_DUEL');

  if (!isOpen) return null;

  const strategiesList = Object.values(TACTICAL_STRATEGIES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-gradient-to-b from-[#142334] to-[#0a1017] rounded-2xl border-2 border-[#ff4655]/60 shadow-[0_0_40px_rgba(255,70,85,0.3)] p-6 sm:p-8 val-cut-top-right text-slate-100"
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
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-[#ff4655]/20 text-[#ff4655] border border-[#ff4655]/40 text-xs font-tech font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Headphones size={13} /> PAUSA TÁTICA DO COACH
          </span>
          <span className="text-xs font-tech text-amber-400 font-bold">
            {timeoutsLeft} {timeoutsLeft === 1 ? 'PAUSA RESTANTE' : 'PAUSAS RESTANTES'}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide">
          AJUSTE TÁTICO DE ROUND
        </h2>
        <p className="text-xs text-slate-300 font-tech mt-1 mb-6">
          Reúna a equipe no servidor, quebre o ritmo econômico do adversário e aplique uma instrução tática direta para o próximo round:
        </p>

        {/* 3 Strategy Cards */}
        <div className="space-y-3 mb-6">
          {strategiesList.map((info) => {
            const isSelected = selectedStrategy === info.strategy;

            return (
              <div
                key={info.strategy}
                onClick={() => setSelectedStrategy(info.strategy)}
                className={`p-4 rounded-xl border-2 transition cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#1e3247] to-[#121f2d] border-[#ff4655] shadow-[0_0_20px_rgba(255,70,85,0.25)]'
                    : 'bg-[#0f1923]/80 border-[#243447] hover:border-slate-500 hover:bg-[#13202e]'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-xl border ${
                  isSelected
                    ? 'bg-[#ff4655]/20 border-[#ff4655]/50 text-white'
                    : 'bg-[#18283a] border-[#243447] text-slate-400'
                }`}>
                  {info.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-display font-black text-base ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {info.title}
                    </h3>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded bg-[#ff4655] text-white text-[10px] font-tech font-bold uppercase tracking-wider flex items-center gap-1">
                        <Check size={12} /> SELECIONADO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-tech mt-1 leading-relaxed">
                    {info.description}
                  </p>
                  <div className="mt-2 text-[11px] font-tech font-bold text-[#00f59b] bg-[#00f59b]/10 px-2.5 py-1 rounded border border-[#00f59b]/25 inline-block">
                    ⚡ {info.bonusEffect}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#152230] hover:bg-[#1c2e42] text-slate-300 font-display font-bold text-sm uppercase tracking-wider rounded-xl transition cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            onClick={() => {
              onApplyTimeout(selectedStrategy);
              onClose();
            }}
            className="flex-2 py-3 bg-gradient-to-r from-[#ff4655] to-[#d62635] hover:from-[#ff5e6c] hover:to-[#ff4655] text-white font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(255,70,85,0.4)] transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>APLICAR AJUSTE TÁTICO</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
