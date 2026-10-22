import React, { useState, useEffect } from 'react';
import { Lineup, Player, Role } from '../types/game';
import { ManagerPerk, PlayerUpgradeStats, ManagerMatchReward } from '../types/manager';
import {
  ALL_MANAGER_PERKS,
  getRandomPerks,
  getRandomScoutPlayers
} from '../data/managerPerks';
import { getPlayerPhoto, getAgentIcon } from '../utils/playerPhotos';
import {
  X,
  Zap,
  Users,
  Trophy,
  ArrowRight,
  RefreshCw,
  Star,
  Flame,
  Dumbbell,
  Sparkles,
  Check,
  AlertCircle,
  Coins,
  ShieldAlert,
  Sliders,
  Award
} from 'lucide-react';

interface ManagerHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  credits: number;
  onUpdateCredits: (newCredits: number) => void;
  lineup: Lineup;
  onUpdateLineup: (newLineup: Lineup) => void;
  equippedPerks: ManagerPerk[];
  onUpdatePerks: (newPerks: ManagerPerk[]) => void;
  playerUpgrades: Record<string, PlayerUpgradeStats>;
  onUpdatePlayerUpgrades: (newUpgrades: Record<string, PlayerUpgradeStats>) => void;
  lastMatchReward?: ManagerMatchReward | null;
  stageName?: string;
}

export const ManagerHubModal: React.FC<ManagerHubModalProps> = ({
  isOpen,
  onClose,
  credits,
  onUpdateCredits,
  lineup,
  onUpdateLineup,
  equippedPerks,
  onUpdatePerks,
  playerUpgrades,
  onUpdatePlayerUpgrades,
  lastMatchReward,
  stageName
}) => {
  const [activeTab, setActiveTab] = useState<'PERKS' | 'SCOUT' | 'TRAINING' | 'REWARDS'>(
    lastMatchReward ? 'REWARDS' : 'PERKS'
  );

  // Shop state
  const [availablePerks, setAvailablePerks] = useState<ManagerPerk[]>([]);
  const [scoutedPlayers, setScoutedPlayers] = useState<{ player: Player; cost: number }[]>([]);
  const [selectedPlayerToTrain, setSelectedPlayerToTrain] = useState<Player | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Initialize shop catalog on open
  useEffect(() => {
    if (isOpen) {
      if (lastMatchReward) {
        setActiveTab('REWARDS');
      }
      refreshPerksShop();
      refreshScoutMarket();
      const firstPlayer = Object.values(lineup).find(Boolean) || null;
      setSelectedPlayerToTrain(firstPlayer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLineupPlayers = Object.values(lineup).filter(Boolean) as Player[];

  const refreshPerksShop = () => {
    const excludedIds = equippedPerks.map(p => p.id);
    setAvailablePerks(getRandomPerks(4, excludedIds));
  };

  const refreshScoutMarket = () => {
    const currentNames = currentLineupPlayers.map(p => p.name);
    setScoutedPlayers(getRandomScoutPlayers(3, currentNames));
  };

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // ==========================================
  // PERK ACTIONS
  // ==========================================
  const handleBuyPerk = (perk: ManagerPerk) => {
    if (credits < perk.cost) {
      showFeedback('Créditos VCT insuficientes para comprar este perk!', 'error');
      return;
    }
    if (equippedPerks.length >= 3) {
      showFeedback('Limite de 3 perks atingido! Venda um perk equipado para liberar espaço.', 'error');
      return;
    }

    onUpdateCredits(credits - perk.cost);
    const updated = [...equippedPerks, perk];
    onUpdatePerks(updated);
    setAvailablePerks(prev => prev.filter(p => p.id !== perk.id));
    showFeedback(`Perk "${perk.name}" comprado e ativado no elenco!`, 'success');
  };

  const handleSellPerk = (perk: ManagerPerk) => {
    const refund = Math.round(perk.cost * 0.5);
    onUpdateCredits(credits + refund);
    const updated = equippedPerks.filter(p => p.id !== perk.id);
    onUpdatePerks(updated);
    showFeedback(`Perk "${perk.name}" vendido por ₡${refund.toLocaleString('pt-BR')}!`, 'success');
  };

  const handleRerollPerks = () => {
    const REROLL_COST = 150;
    if (credits < REROLL_COST) {
      showFeedback('Créditos insuficientes para rerrolar a loja de perks (custo: ₡150)!', 'error');
      return;
    }
    onUpdateCredits(credits - REROLL_COST);
    refreshPerksShop();
    showFeedback('Loja de perks táticos atualizada com novos itens!', 'success');
  };

  // ==========================================
  // SCOUT & SIGN PLAYER ACTIONS
  // ==========================================
  const handleSignPlayer = (newPlayer: Player, cost: number) => {
    if (credits < cost) {
      showFeedback('Créditos insuficientes para contratar este pro player!', 'error');
      return;
    }

    // Determine target slot
    let slotKey: keyof Lineup | null = null;
    if (newPlayer.role === 'Duelista') slotKey = 'duelista';
    else if (newPlayer.role === 'Iniciador') slotKey = 'iniciador';
    else if (newPlayer.role === 'Controlador') slotKey = 'controlador';
    else if (newPlayer.role === 'Sentinela') slotKey = 'sentinela';
    else if (newPlayer.isIGL) slotKey = 'igl';

    // Fallback if slot is occupied or matches secondary
    if (!slotKey) slotKey = 'igl';

    // Prevent duplicate player name in another slot
    const isAlreadyInAnotherSlot = Object.entries(lineup).some(
      ([key, p]) => key !== slotKey && p && p.name.trim().toLowerCase() === newPlayer.name.trim().toLowerCase()
    );
    if (isAlreadyInAnotherSlot) {
      showFeedback(`Você já possui ${newPlayer.name} em outra vaga do elenco!`, 'error');
      return;
    }

    const previousPlayer = lineup[slotKey];
    const newLineup: Lineup = {
      ...lineup,
      [slotKey]: newPlayer
    };

    onUpdateCredits(credits - cost);
    onUpdateLineup(newLineup);
    setScoutedPlayers(prev => prev.filter(p => p.player.name !== newPlayer.name));
    showFeedback(
      `Contratação concluída! ${newPlayer.name} (${newPlayer.rating} OVR) assumiu a vaga de ${previousPlayer?.name || 'titular'}!`,
      'success'
    );
  };

  const handleRerollScout = () => {
    const REROLL_SCOUT_COST = 200;
    if (credits < REROLL_SCOUT_COST) {
      showFeedback('Créditos insuficientes para nova pesquisa de mercado (custo: ₡200)!', 'error');
      return;
    }
    onUpdateCredits(credits - REROLL_SCOUT_COST);
    refreshScoutMarket();
    showFeedback('Olheiros trouxeram novos atletas para avaliação!', 'success');
  };

  // ==========================================
  // TRAINING & BOOTCAMP ACTIONS
  // ==========================================
  const handleTrainPlayer = (
    player: Player,
    statType: 'AIM' | 'GAMESENSE' | 'CLUTCH',
    cost: number
  ) => {
    if (credits < cost) {
      showFeedback('Créditos insuficientes para este treinamento!', 'error');
      return;
    }

    const current = playerUpgrades[player.name] || {
      aimBonus: 0,
      gameSenseBonus: 0,
      clutchBonus: 0,
      level: 0
    };

    const updatedStats: PlayerUpgradeStats = {
      ...current,
      aimBonus: statType === 'AIM' ? current.aimBonus + 2 : current.aimBonus,
      gameSenseBonus: statType === 'GAMESENSE' ? current.gameSenseBonus + 2 : current.gameSenseBonus,
      clutchBonus: statType === 'CLUTCH' ? current.clutchBonus + 3 : current.clutchBonus,
      level: current.level + 1
    };

    const newUpgrades = {
      ...playerUpgrades,
      [player.name]: updatedStats
    };

    onUpdateCredits(credits - cost);
    onUpdatePlayerUpgrades(newUpgrades);
    showFeedback(`Treino concluído com sucesso para ${player.name}! Atributos aprimorados.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0f1923] border border-[#243447] rounded-2xl p-5 sm:p-7 val-cut-top-right shadow-2xl text-left flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-[#1b2b3d] rounded-lg transition cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#243447]">
          <div>
            <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-[#ff4655] flex items-center gap-1.5">
              <Sparkles size={12} /> CENTRAL DO COACH & MERCADO ROGUELIKE
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-wide">
              GERENCIAMENTO DO ELENCO {stageName && `· ${stageName}`}
            </h2>
          </div>

          {/* Balance display */}
          <div className="flex items-center gap-3 bg-[#090e14] px-4 py-2 rounded-xl border border-amber-500/40 shadow-[0_0_15px_rgba(245,183,49,0.15)]">
            <Coins size={20} className="text-amber-400 animate-pulse" />
            <div>
              <span className="text-[9px] font-tech text-slate-400 uppercase tracking-widest block">
                SALDO DE CRÉDITOS VCT
              </span>
              <span className="font-display font-black text-xl text-amber-300 tracking-wider">
                ₡ {credits.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback alert toast */}
        {feedbackMessage && (
          <div
            className={`my-3 p-3 rounded-lg text-xs font-tech flex items-center gap-2 border animate-fadeIn ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-red-500/20 text-red-300 border-red-500/40'
            }`}
          >
            {feedbackMessage.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Equipped Perks Strip */}
        <div className="my-4 p-3 rounded-xl bg-[#090e14] border border-[#1e2d3d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-tech text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1">
              <Zap size={14} className="text-amber-400" /> PERKS EQUIPADOS ({equippedPerks.length}/3):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[0, 1, 2].map((slotIdx) => {
              const perk = equippedPerks[slotIdx];
              if (perk) {
                return (
                  <div
                    key={perk.id}
                    className="p-1.5 px-2.5 rounded-lg bg-[#142334] border border-amber-500/40 flex items-center gap-2 text-xs font-tech shadow-sm group relative"
                  >
                    <span>{perk.icon}</span>
                    <span className="font-bold text-white text-[11px] max-w-[120px] truncate">{perk.name}</span>
                    <button
                      onClick={() => handleSellPerk(perk)}
                      className="text-[9px] text-amber-400 hover:text-red-400 hover:bg-red-500/20 px-1 py-0.5 rounded cursor-pointer transition font-bold"
                      title="Vender por 50% do valor"
                    >
                      +₡{Math.round(perk.cost * 0.5)}
                    </button>
                  </div>
                );
              }
              return (
                <div
                  key={slotIdx}
                  className="px-3 py-1.5 rounded-lg border border-dashed border-slate-700 text-slate-600 text-[10px] font-tech uppercase"
                >
                  Slot {slotIdx + 1} Vazio
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-[#090e14] rounded-lg border border-[#243447] mb-5 overflow-x-auto">
          {lastMatchReward && (
            <button
              onClick={() => setActiveTab('REWARDS')}
              className={`px-3 py-2 rounded text-xs font-tech font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'REWARDS'
                  ? 'bg-[#00f59b] text-slate-950 font-black shadow-md'
                  : 'text-emerald-400 hover:text-white'
              }`}
            >
              <Award size={14} /> Recompensa da Partida
            </button>
          )}

          <button
            onClick={() => setActiveTab('PERKS')}
            className={`px-3 py-2 rounded text-xs font-tech font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'PERKS'
                ? 'bg-[#ff4655] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap size={14} /> Perks Táticos ({availablePerks.length})
          </button>

          <button
            onClick={() => setActiveTab('SCOUT')}
            className={`px-3 py-2 rounded text-xs font-tech font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'SCOUT'
                ? 'bg-[#ff4655] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={14} /> Mercado de Transferências ({scoutedPlayers.length})
          </button>

          <button
            onClick={() => setActiveTab('TRAINING')}
            className={`px-3 py-2 rounded text-xs font-tech font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'TRAINING'
                ? 'bg-[#ff4655] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dumbbell size={14} /> Bootcamp & Treinos
          </button>
        </div>

        {/* ===================== TAB: MATCH REWARDS ===================== */}
        {activeTab === 'REWARDS' && lastMatchReward && (
          <div className="py-2 space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#10231e] to-[#090e14] border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(0,245,155,0.15)] space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy size={20} className="text-emerald-400" />
                  <h3 className="font-display font-black text-lg text-white">
                    {lastMatchReward.isVictory ? 'PREMIAÇÃO PELA VITÓRIA VCT' : 'PAGAMENTO DE PARTICIPAÇÃO'}
                  </h3>
                </div>
                <span className="font-display font-black text-2xl text-emerald-400">
                  +₡ {lastMatchReward.total.toLocaleString('pt-BR')}
                </span>
              </div>

              {/* Reward line items */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-tech">
                <div className="p-2.5 rounded-lg bg-[#090e14] border border-[#1e2d3d]">
                  <span className="text-slate-400 block">Base da Partida:</span>
                  <span className="font-bold text-white text-sm">+₡{lastMatchReward.baseAmount}</span>
                </div>

                {lastMatchReward.flawlessBonus > 0 && (
                  <div className="p-2.5 rounded-lg bg-[#090e14] border border-amber-500/40">
                    <span className="text-amber-400 block">⭐ 13-0 Flawless / Domínio:</span>
                    <span className="font-bold text-amber-300 text-sm">+₡{lastMatchReward.flawlessBonus}</span>
                  </div>
                )}

                {lastMatchReward.acesBonus > 0 && (
                  <div className="p-2.5 rounded-lg bg-[#090e14] border border-rose-500/40">
                    <span className="text-rose-400 block">⚡ Bônus de Aces:</span>
                    <span className="font-bold text-rose-300 text-sm">+₡{lastMatchReward.acesBonus}</span>
                  </div>
                )}

                {lastMatchReward.clutchesBonus > 0 && (
                  <div className="p-2.5 rounded-lg bg-[#090e14] border border-cyan-500/40">
                    <span className="text-cyan-400 block">🛡️ Bônus de Clutches:</span>
                    <span className="font-bold text-cyan-300 text-sm">+₡{lastMatchReward.clutchesBonus}</span>
                  </div>
                )}

                {lastMatchReward.timeoutBonus > 0 && (
                  <div className="p-2.5 rounded-lg bg-[#090e14] border border-amber-500/40">
                    <span className="text-amber-400 block">🎧 Pausa do Coach Eficaz:</span>
                    <span className="font-bold text-amber-300 text-sm">+₡{lastMatchReward.timeoutBonus}</span>
                  </div>
                )}

                {lastMatchReward.interestBonus > 0 && (
                  <div className="p-2.5 rounded-lg bg-[#090e14] border border-emerald-500/40">
                    <span className="text-emerald-400 block">📈 Juros de Patrocínio:</span>
                    <span className="font-bold text-emerald-300 text-sm">+₡{lastMatchReward.interestBonus}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('PERKS')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
                >
                  Ir para a Loja & Gastar Créditos →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 1: PERKS TÁTICOS ===================== */}
        {activeTab === 'PERKS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-tech text-slate-400">
              <span>Compre modificadores táticos passivos inspirados no estilo Roguelike / Balatro:</span>
              <button
                onClick={handleRerollPerks}
                className="flex items-center gap-1 px-3 py-1 bg-[#101b27] hover:bg-[#182738] text-amber-400 border border-amber-500/40 rounded transition cursor-pointer"
                title="Rerrolar Loja de Perks"
              >
                <RefreshCw size={12} /> Rerrolar Loja (₡150)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availablePerks.map((perk) => {
                const isEquipped = equippedPerks.some(p => p.id === perk.id);
                const canAfford = credits >= perk.cost;

                const rarityColor = {
                  Lendária: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
                  Rara: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300',
                  Comum: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                }[perk.rarity];

                return (
                  <div
                    key={perk.id}
                    className="p-4 rounded-xl bg-[#090e14] border border-[#243447] hover:border-amber-500/50 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-2 rounded-lg bg-[#142334] border border-white/5">{perk.icon}</span>
                          <div>
                            <h4 className="font-display font-bold text-white text-sm">{perk.name}</h4>
                            <span className={`text-[9px] font-tech font-bold uppercase px-1.5 py-0.2 rounded border ${rarityColor}`}>
                              {perk.rarity}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-display font-black text-amber-400 text-base">
                            ₡ {perk.cost.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 font-tech mt-3 leading-relaxed">
                        {perk.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1e2d3d] flex justify-end">
                      <button
                        onClick={() => handleBuyPerk(perk)}
                        disabled={isEquipped || !canAfford || equippedPerks.length >= 3}
                        className={`w-full py-2 rounded-lg font-tech font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          isEquipped
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : !canAfford
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            : 'bg-[#ff4655] hover:bg-[#e03140] text-white shadow-md'
                        }`}
                      >
                        {isEquipped ? 'Já Equipado' : canAfford ? 'Comprar & Equipar' : 'Créditos Insuficientes'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: MERCADO DE TRANSFERÊNCIAS ===================== */}
        {activeTab === 'SCOUT' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-tech text-slate-400">
              <span>Contrate estrelas mundiais para substituir jogadores no seu elenco titular:</span>
              <button
                onClick={handleRerollScout}
                className="flex items-center gap-1 px-3 py-1 bg-[#101b27] hover:bg-[#182738] text-amber-400 border border-amber-500/40 rounded transition cursor-pointer"
              >
                <RefreshCw size={12} /> Olheiros / Novo Scouting (₡200)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {scoutedPlayers.map(({ player, cost }) => {
                const canAfford = credits >= cost;
                const photoUrl = getPlayerPhoto(player.name, player.signatureAgent);
                const fallbackIcon = getAgentIcon(player.signatureAgent);

                // Slot currently holding this role
                const targetSlotRole = player.role;
                const slotKey = (
                  targetSlotRole === 'Duelista' ? 'duelista' :
                  targetSlotRole === 'Iniciador' ? 'iniciador' :
                  targetSlotRole === 'Controlador' ? 'controlador' :
                  targetSlotRole === 'Sentinela' ? 'sentinela' : 'igl'
                ) as keyof Lineup;
                const currentHolder = lineup[slotKey];

                return (
                  <div
                    key={player.name}
                    className="p-4 rounded-xl bg-[#090e14] border border-[#243447] hover:border-amber-500/50 transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Photo & Role */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative">
                          <img
                            src={photoUrl}
                            alt={player.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = fallbackIcon;
                            }}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-display font-bold text-base text-white">{player.name}</h4>
                            <span className="text-xs">{player.flag}</span>
                          </div>
                          <span className="text-[10px] font-tech text-slate-400 block">
                            {player.teamBadge} · {player.era}
                          </span>
                          <span className="text-[10px] font-tech font-bold text-amber-400">
                            {player.signatureAgent} ({player.role})
                          </span>
                        </div>
                      </div>

                      {/* Stat badges */}
                      <div className="grid grid-cols-3 gap-1 text-center font-tech text-[10px] bg-[#101b27] p-2 rounded-lg border border-[#1e2d3d] mb-3">
                        <div>
                          <span className="text-slate-500 block">OVR</span>
                          <span className="font-bold text-white text-xs">{player.rating}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">MIRA</span>
                          <span className="font-bold text-cyan-400 text-xs">{player.aim}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">CLUTCH</span>
                          <span className="font-bold text-emerald-400 text-xs">{player.clutch}</span>
                        </div>
                      </div>

                      {/* Replacement Preview */}
                      {currentHolder && (
                        <div className="p-2 rounded bg-black/40 border border-white/5 text-[10px] font-tech text-slate-400 mb-3">
                          Substituirá: <strong className="text-white">{currentHolder.name}</strong> ({currentHolder.rating} OVR)
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-tech text-slate-400 uppercase">Multa Rescisória:</span>
                        <span className="font-display font-black text-amber-400">
                          ₡ {cost.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSignPlayer(player, cost)}
                        disabled={!canAfford}
                        className={`w-full py-2 rounded-lg font-tech font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                          canAfford
                            ? 'bg-[#00f59b] hover:bg-[#00db8b] text-slate-950 font-black shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Contratar Jogador' : 'Créditos Insuficientes'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: BOOTCAMP & TREINAMENTO ===================== */}
        {activeTab === 'TRAINING' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-tech text-slate-400">
              <span>Selecione um pro player do seu quinteto para investir em treinos específicos:</span>
              <span className="text-white font-bold">{currentLineupPlayers.length} atletas disponíveis</span>
            </div>

            {/* Lineup player select chips */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {currentLineupPlayers.map((player) => {
                const isSelected = selectedPlayerToTrain?.name === player.name;
                const upgrades = playerUpgrades[player.name];

                return (
                  <button
                    key={player.name}
                    onClick={() => setSelectedPlayerToTrain(player)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-[#ff4655] bg-[#162433] shadow-[0_0_12px_rgba(255,70,85,0.3)]'
                        : 'border-[#243447] bg-[#090e14] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-xs text-white truncate">{player.name}</span>
                      <span className="text-[10px]">{player.flag}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-tech truncate block">
                      {player.role}
                    </span>
                    {upgrades && upgrades.level > 0 && (
                      <span className="text-[9px] text-amber-400 font-tech font-bold flex items-center gap-0.5 mt-1">
                        <Star size={10} className="fill-amber-400" /> Nível +{upgrades.level}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Player Training Card */}
            {selectedPlayerToTrain && (
              <div className="p-5 rounded-2xl bg-[#090e14] border border-[#243447] space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e2d3d] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                      <img
                        src={getPlayerPhoto(selectedPlayerToTrain.name, selectedPlayerToTrain.signatureAgent)}
                        alt={selectedPlayerToTrain.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-lg text-white">
                        {selectedPlayerToTrain.name} {selectedPlayerToTrain.flag}
                      </h4>
                      <p className="text-xs text-slate-400 font-tech">
                        {selectedPlayerToTrain.signatureAgent} · {selectedPlayerToTrain.role} · Base {selectedPlayerToTrain.rating} OVR
                      </p>
                    </div>
                  </div>

                  {/* Level stars */}
                  <div className="text-right">
                    <span className="text-[10px] font-tech text-slate-500 uppercase tracking-widest block">
                      NÍVEL DE TREINO
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                      <Star size={14} className="fill-amber-400" />
                      <span>+{playerUpgrades[selectedPlayerToTrain.name]?.level || 0} Aprimoramentos</span>
                    </div>
                  </div>
                </div>

                {/* Training options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Drill 1: Aim */}
                  <div className="p-3.5 rounded-xl bg-[#101b27] border border-[#1b2b3d] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                          🎯 Treino de Mira & Refluxo
                        </span>
                        <span className="font-bold text-xs text-cyan-400">+2 Aim</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-tech leading-relaxed">
                        Rotina intensa de DM e The Range para elevar a precisão de tiro em duelos.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTrainPlayer(selectedPlayerToTrain, 'AIM', 450)}
                      className="mt-4 w-full py-1.5 bg-[#1b2b3d] hover:bg-[#253d57] text-cyan-300 font-tech font-bold text-xs rounded border border-cyan-500/30 transition cursor-pointer"
                    >
                      Treinar (₡450)
                    </button>
                  </div>

                  {/* Drill 2: GameSense */}
                  <div className="p-3.5 rounded-xl bg-[#101b27] border border-[#1b2b3d] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                          🧠 VOD Review & Noção Tática
                        </span>
                        <span className="font-bold text-xs text-emerald-400">+2 Noção</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-tech leading-relaxed">
                        Sessão de análise tática de replays com o coach para refinar posicionamento.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTrainPlayer(selectedPlayerToTrain, 'GAMESENSE', 450)}
                      className="mt-4 w-full py-1.5 bg-[#1b2b3d] hover:bg-[#253d57] text-emerald-300 font-tech font-bold text-xs rounded border border-emerald-500/30 transition cursor-pointer"
                    >
                      Treinar (₡450)
                    </button>
                  </div>

                  {/* Drill 3: Clutch */}
                  <div className="p-3.5 rounded-xl bg-[#101b27] border border-[#1b2b3d] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                          ❄️ Controle Emocional & Clutch
                        </span>
                        <span className="font-bold text-xs text-amber-400">+3 Clutch</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-tech leading-relaxed">
                        Treinamento de calma sob pressão para garantir rounds milagrosos de 1vX.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTrainPlayer(selectedPlayerToTrain, 'CLUTCH', 400)}
                      className="mt-4 w-full py-1.5 bg-[#1b2b3d] hover:bg-[#253d57] text-amber-300 font-tech font-bold text-xs rounded border border-amber-500/30 transition cursor-pointer"
                    >
                      Treinar (₡400)
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Bottom CTA */}
        <div className="mt-6 pt-4 border-t border-[#243447] flex items-center justify-between">
          <span className="text-[11px] font-tech text-slate-500">
            Você pode reabrir esta central a qualquer momento no mapa do torneio.
          </span>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-[#ff4655] to-[#d62635] hover:from-[#ff5e6c] hover:to-[#ff4655] text-white font-display font-black text-xs uppercase tracking-wider rounded-lg transition shadow-[0_0_15px_rgba(255,70,85,0.4)] cursor-pointer flex items-center gap-2"
          >
            <span>Salvar Estratégia & Continuar</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
};
