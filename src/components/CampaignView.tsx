import React, { useState } from 'react';
import { Lineup, TeamHistorical, MapData, TournamentStage } from '../types/game';
import { ManagerPerk, PlayerUpgradeStats } from '../types/manager';
import { MAPS } from '../data/maps';
import { Trophy, Swords, Shield, MapPin, CheckCircle2, XCircle, ArrowRight, Coins, Sparkles, Star } from 'lucide-react';

interface CampaignViewProps {
  playerLineup: Lineup;
  stage: TournamentStage;
  nextOpponent: TeamHistorical;
  matchHistory: {
    stageName: string;
    opponentName: string;
    playerScore: number;
    opponentScore: number;
    is13x0: boolean;
  }[];
  managerCredits?: number;
  equippedPerks?: ManagerPerk[];
  playerUpgrades?: Record<string, PlayerUpgradeStats>;
  onOpenManagerHub?: () => void;
  onStartMatch: (selectedMap: MapData) => void;
}

const STAGE_NAMES: Record<TournamentStage, string> = {
  GROUPS_R1: 'Fase de Grupos · Jogo de Abertura',
  GROUPS_WINNERS: 'Fase de Grupos · Jogo dos Vencedores',
  GROUPS_DECIDER: 'Fase de Grupos · Jogo Decisivo (Vida ou Morte)',
  PLAYOFFS_QUARTERS: 'Playoffs · Quartas de Final',
  PLAYOFFS_SEMIS: 'Playoffs · Semifinais do Champions',
  PLAYOFFS_FINALS: 'Grande Final do VCT Champions 🏆',
  CHAMPION: 'Campeão Mundial do VCT!',
  ELIMINATED: 'Eliminado do Torneio'
};

export const CampaignView: React.FC<CampaignViewProps> = ({
  playerLineup,
  stage,
  nextOpponent,
  matchHistory,
  managerCredits = 0,
  equippedPerks = [],
  playerUpgrades = {},
  onOpenManagerHub,
  onStartMatch
}) => {
  const [selectedMap, setSelectedMap] = useState<MapData>(MAPS[0]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Tournament Stage Header */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-[#0f1923] via-[#142230] to-[#0f1923] border border-[#243447] mb-6 val-cut-top-right">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff4655] flex items-center gap-1.5">
              <Trophy size={14} /> Circuito Oficial VCT Champions
            </span>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-wide mt-1">
              {STAGE_NAMES[stage]}
            </h1>
            <p className="text-sm text-slate-400 font-tech">
              Vença seus confrontos e alcance a glória máxima cravando o placar perfeito de 13 a 0.
            </p>
          </div>

          {/* Quick Lineup summary */}
          <div className="flex items-center gap-2 bg-[#090e14] px-4 py-2.5 rounded-lg border border-[#243447]">
            <span className="text-xs font-tech text-slate-400">LINE-UP:</span>
            {Object.values(playerLineup).map((p, i) => {
              if (!p) return null;
              const lvl = playerUpgrades[p.name]?.level || 0;
              return (
                <span key={i} className="text-xs font-bold text-white bg-[#162433] px-2 py-0.5 rounded border border-[#243447] flex items-center gap-1" title={p.name}>
                  <span>{p.name}</span>
                  {lvl > 0 && <span className="text-[10px] text-amber-400 font-tech">★+{lvl}</span>}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Manager Status & Shop Bar */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#101b27] via-[#090e14] to-[#142334] border border-amber-500/40 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(245,183,49,0.1)]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Coins size={22} className="text-amber-400 animate-pulse" />
            <div>
              <span className="text-[9px] font-tech text-slate-400 uppercase tracking-widest block">
                CRÉDITOS DO COACH
              </span>
              <span className="font-display font-black text-xl text-amber-300">
                ₡ {managerCredits.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          {/* Equipped Perks */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-tech text-slate-400 uppercase tracking-wider mr-1">
              PERKS ({equippedPerks.length}/3):
            </span>
            {equippedPerks.length === 0 ? (
              <span className="text-xs text-slate-500 font-tech italic">Nenhum perk equipado</span>
            ) : (
              equippedPerks.map(p => (
                <span
                  key={p.id}
                  className="px-2 py-0.5 rounded bg-[#162433] border border-amber-500/40 text-[11px] font-tech text-amber-300 font-bold flex items-center gap-1"
                  title={p.description}
                >
                  <span>{p.icon}</span>
                  <span className="hidden md:inline">{p.name}</span>
                </span>
              ))
            )}
          </div>
        </div>

        {onOpenManagerHub && (
          <button
            onClick={onOpenManagerHub}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles size={15} />
            <span>Central do Coach & Loja</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Next Match Confrontation Card (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0f1923] p-6 rounded-xl border border-[#243447] val-cut-top-right shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#243447] mb-4">
              <h2 className="text-lg font-display font-black text-white tracking-wider flex items-center gap-2">
                <Swords size={18} className="text-[#ff4655]" />
                PRÓXIMO CONFRONTO
              </h2>
              <span className="text-xs font-tech text-amber-400 font-bold uppercase tracking-wider">
                MD1 (Mata-mata)
              </span>
            </div>

            {/* Duel Presentation */}
            <div className="grid grid-cols-5 items-center gap-2 py-4 text-center">
              
              {/* Player side */}
              <div className="col-span-2">
                <div className="w-16 h-16 mx-auto rounded-lg bg-[#ff4655] flex items-center justify-center font-display font-black text-2xl text-white shadow-[0_0_20px_rgba(255,70,85,0.3)] val-cut-corner mb-2">
                  YOU
                </div>
                <h3 className="font-display font-black text-xl text-white">ALL-STAR VCT</h3>
                <p className="text-xs text-slate-400 font-tech">Sua Equipe</p>
              </div>

              {/* VS */}
              <div className="col-span-1 flex flex-col items-center">
                <span className="font-display font-black text-2xl text-slate-500 italic">VS</span>
              </div>

              {/* Opponent side */}
              <div className="col-span-2">
                <div 
                  className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center font-display font-black text-2xl text-white shadow-lg val-cut-corner mb-2"
                  style={{ backgroundColor: nextOpponent.color || '#243447' }}
                >
                  {nextOpponent.name.slice(0, 3).toUpperCase()}
                </div>
                <h3 className="font-display font-black text-xl text-white">{nextOpponent.name}</h3>
                <p className="text-xs text-amber-400 font-tech">{nextOpponent.event}</p>
              </div>

            </div>

            {/* Opponent Key Star Players */}
            <div className="mt-4 pt-4 border-t border-[#1e2d3d]">
              <span className="text-[11px] font-tech text-slate-400 uppercase tracking-widest block mb-2">
                Destaques do {nextOpponent.name}:
              </span>
              <div className="flex flex-wrap gap-2">
                {nextOpponent.players.map((p) => (
                  <span key={p.id} className="text-xs font-tech bg-[#090e14] px-2.5 py-1 rounded border border-[#243447] text-slate-300">
                    {p.flag} <strong className="text-white">{p.name}</strong> ({p.signatureAgent} · {p.role})
                  </span>
                ))}
              </div>
            </div>

            {/* Map Selection */}
            <div className="mt-6 pt-4 border-t border-[#1e2d3d]">
              <span className="text-[11px] font-tech text-slate-400 uppercase tracking-widest block mb-3 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#00f59b]" />
                Escolha o Mapa do Confronto:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MAPS.map((m) => {
                  const isSelected = selectedMap.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMap(m)}
                      className={`p-2 rounded text-left border transition cursor-pointer ${
                        isSelected
                          ? 'border-[#ff4655] bg-[#162433] shadow-[0_0_10px_rgba(255,70,85,0.3)]'
                          : 'border-[#243447] bg-[#090e14] hover:border-slate-500'
                      }`}
                    >
                      <div className="font-display font-bold text-sm text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400 font-tech">{m.style}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <button
                onClick={() => onStartMatch(selectedMap)}
                className="w-full py-4 bg-gradient-to-r from-[#ff4655] to-[#d62635] hover:from-[#ff5e6c] hover:to-[#ff4655] text-white font-display font-black text-xl tracking-wider uppercase rounded-lg shadow-[0_0_20px_rgba(255,70,85,0.4)] transition flex items-center justify-center gap-2 cursor-pointer val-cut-top-right"
              >
                ENTRAR NO SERVIDOR · JOGAR EM {selectedMap.name.toUpperCase()} <ArrowRight size={20} />
              </button>
            </div>

          </div>
        </div>

        {/* Campaign History & Roadmap (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f1923] p-5 rounded-xl border border-[#243447]">
            <h3 className="font-display font-black text-base text-white tracking-wider mb-4 flex items-center gap-2">
              <Shield size={16} className="text-[#00f59b]" />
              HISTÓRICO DA CAMPANHA
            </h3>

            {matchHistory.length === 0 ? (
              <p className="text-xs text-slate-500 font-tech py-6 text-center">
                Nenhuma partida disputada ainda. Seu primeiro desafio é a rodada de abertura!
              </p>
            ) : (
              <div className="space-y-2.5">
                {matchHistory.map((h, i) => (
                  <div key={i} className="p-3 bg-[#090e14] rounded-lg border border-[#243447] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-tech block uppercase">{h.stageName}</span>
                      <span className="font-bold text-white">vs {h.opponentName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {h.is13x0 && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          13-0 FLAWLESS
                        </span>
                      )}
                      <div className="flex items-center gap-1 font-mono font-bold text-sm">
                        <span className={h.playerScore > h.opponentScore ? 'text-[#00f59b]' : 'text-red-400'}>
                          {h.playerScore}
                        </span>
                        <span className="text-slate-600">:</span>
                        <span className={h.opponentScore > h.playerScore ? 'text-[#00f59b]' : 'text-slate-400'}>
                          {h.opponentScore}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tournament Steps Roadmap */}
          <div className="bg-[#0f1923] p-5 rounded-xl border border-[#243447]">
            <h3 className="font-display font-black text-sm text-slate-300 tracking-wider mb-3">
              CAMINHO ATÉ O TROFÉU
            </h3>
            <div className="space-y-2 text-xs font-tech">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4655]"></span>
                1. Fase de Grupos (GSL - 2 Vitórias para avançar)
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                2. Quartas de Final (Playoffs Mata-Mata)
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                3. Semifinais do Champions
              </div>
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                4. Grande Final Mundial do VCT 🏆
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
