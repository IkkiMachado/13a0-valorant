import React from 'react';
import { X, Shield, Crosshair, Brain, Zap, Crown, Trophy, Sparkles, Flame, Dices } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f1923] border border-[#243447] rounded-xl p-6 sm:p-8 val-cut-top-right shadow-2xl text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-[#1b2b3d] rounded-lg transition cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-tech font-bold text-[#ff4655] uppercase tracking-widest bg-[#ff4655]/10 px-2 py-0.5 rounded border border-[#ff4655]/20">
            MANUAL TÁTICO
          </span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide mb-4">
          COMO JOGAR O 13 A 0 · ROAD TO CHAMPIONS
        </h2>

        {/* Sections */}
        <div className="space-y-6 text-sm text-slate-300 font-sans">
          
          {/* 1. O Objetivo */}
          <div className="p-4 bg-[#090e14] rounded-lg border border-[#1e2d3d]">
            <h3 className="font-display font-black text-lg text-amber-400 mb-1 flex items-center gap-1.5">
              <Trophy size={18} /> 1. O Objetivo Máximo: O 13 a 0 Perfeito
            </h3>
            <p className="text-xs text-slate-400 font-tech leading-relaxed">
              No futebol existe o 7 a 0. No Valorant, o maior feito é o <strong>13 a 0 (Flawless total)</strong> — vencer uma partida oficial sem ceder nenhum round ao adversário. Seu objetivo é montar a line dos sonhos e ser campeão mundial do VCT, buscando cravar o 13x0!
            </p>
          </div>

          {/* 2. Níveis de Dificuldade */}
          <div>
            <h3 className="font-display font-black text-base text-white mb-2 flex items-center gap-1.5">
              <Dices size={16} className="text-[#00f59b]" /> 2. Níveis de Dificuldade do Draft
            </h3>
            <div className="space-y-2 text-xs font-tech">
              <div className="p-3 bg-[#090e14] rounded border border-red-500/40">
                <strong className="text-red-400 flex items-center gap-1 mb-1">
                  <Flame size={13} /> DIFÍCIL (Hardcore 7a0 - Padrão Recomendado):
                </strong>
                Apenas <strong>1 time sorteado por vez</strong> e só é permitido escolher <strong>1 jogador daquele time</strong>. Assim que você escolhe, um novo time é sorteado para a próxima vaga! Rerolls estritamente limitados.
              </div>

              <div className="p-3 bg-[#090e14] rounded border border-amber-500/30">
                <strong className="text-amber-400 mb-1 block">MÉDIO (Draft Pro):</strong>
                Aparecem 2 times por vez. Máximo de 1 jogador por equipe sorteada. Ao escolher um atleta, aquele time dá lugar a outro sorteio.
              </div>

              <div className="p-3 bg-[#090e14] rounded border border-emerald-500/30">
                <strong className="text-emerald-400 mb-1 block">FÁCIL (Livre):</strong>
                3 times simultâneos na mesa. Você pode escolher livremente qualquer atleta de qualquer uma das 3 equipes.
              </div>
            </div>
          </div>

          {/* 3. As Funções */}
          <div>
            <h3 className="font-display font-black text-base text-white mb-2 flex items-center gap-1.5">
              <Shield size={16} className="text-[#ff4655]" /> 3. As 4 Funções Obrigatórias + IGL
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-tech">
              <div className="p-2.5 bg-[#090e14] rounded border border-red-500/30">
                <strong className="text-[#ff4655] block">🔴 DUELISTA</strong>
                Entrada nos bombs, first bloods e alto volume de eliminações.
              </div>
              <div className="p-2.5 bg-[#090e14] rounded border border-cyan-500/30">
                <strong className="text-[#00c8b9] block">🔵 INICIADOR</strong>
                Flashes, drones e coleta de informação para desarticular a defesa.
              </div>
              <div className="p-2.5 bg-[#090e14] rounded border border-purple-500/30">
                <strong className="text-[#b05bff] block">🟣 CONTROLADOR</strong>
                Cortinas de fumaça, bloqueio de linhas de mira e domínio de espaço.
              </div>
              <div className="p-2.5 bg-[#090e14] rounded border border-emerald-500/30">
                <strong className="text-[#00f59b] block">🟢 SENTINELA</strong>
                Retenção de bombsites, armadilhas e bloqueio de flancos.
              </div>
            </div>

            <div className="mt-2.5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-tech text-amber-300 flex items-start gap-2">
              <Crown size={16} className="shrink-0 mt-0.5" />
              <div>
                <strong>A Regra de Ouro do IGL:</strong> Pelo menos um dos 5 jogadores escolhidos precisa ter a insígnia de <strong>IGL (In-Game Leader)</strong>. Uma equipe sem capitão sofre uma penalidade de -8% nas decisões táticas!
              </div>
            </div>
          </div>

          {/* 4. A Campanha do Champions */}
          <div>
            <h3 className="font-display font-black text-base text-white mb-2 flex items-center gap-1.5">
              <Sparkles size={16} className="text-cyan-400" /> 4. Formato do Torneio
            </h3>
            <p className="text-xs text-slate-400 font-tech leading-relaxed">
              O torneio replica o VCT Champions da Riot: você inicia na <strong>Fase de Grupos (Chave GSL)</strong> com 2 vitórias necessárias para avançar aos <strong>Playoffs (Quartas, Semis e Grande Final)</strong>. Cada confronto é disputado até 13 pontos (com direito a Overtime caso empate em 12x12).
            </p>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="mt-6 pt-4 border-t border-[#243447] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#ff4655] hover:bg-[#e03140] text-white font-tech font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer"
          >
            Entendido, Bora Jogar!
          </button>
        </div>

      </div>
    </div>
  );
};
