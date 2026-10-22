import React, { useState } from 'react';
import { Lineup, Player, TeamHistorical, SlotKey, Role, DifficultyLevel, DIFFICULTY_CONFIGS, GameMode } from '../types/game';
import { HISTORICAL_TEAMS } from '../data/teams';
import { PlayerCard } from './PlayerCard';
import { calculateLineupStats } from '../utils/simulation';
import { DailyChallengeInfo } from '../utils/daily';
import { Dices, Trophy, Shield, AlertTriangle, CheckCircle2, UserPlus, Sparkles, Flame, EyeOff, ArrowLeft, Swords, Calendar } from 'lucide-react';

interface DraftBoardProps {
  lineup: Lineup;
  difficulty: DifficultyLevel;
  gameMode?: GameMode;
  dailyChallenge?: DailyChallengeInfo | null;
  onUpdateLineup: (newLineup: Lineup) => void;
  onBackToDifficulty: () => void;
  onStartCampaign: () => void;
}

const SLOTS_CONFIG: { key: SlotKey; label: string; role: Role | 'IGL'; desc: string; color: string }[] = [
  { key: 'duelista', label: 'DUELISTA', role: 'Duelista', desc: 'Entry fragger & First Bloods', color: 'border-l-4 border-l-[#ff4655]' },
  { key: 'iniciador', label: 'INICIADOR', role: 'Iniciador', desc: 'Flashes & Coleta de Info', color: 'border-l-4 border-l-[#00c8b9]' },
  { key: 'controlador', label: 'CONTROLADOR', role: 'Controlador', desc: 'Smokes & Controle de Visão', color: 'border-l-4 border-l-[#b05bff]' },
  { key: 'sentinela', label: 'SENTINELA', role: 'Sentinela', desc: 'Retenção & Anti-flanco', color: 'border-l-4 border-l-[#00f59b]' },
  { key: 'igl', label: 'IGL / FLEX', role: 'IGL', desc: 'Capitão Tático & Liderança', color: 'border-l-4 border-l-amber-400' }
];

export const DraftBoard: React.FC<DraftBoardProps> = ({
  lineup,
  difficulty,
  gameMode = 'CLASSIC',
  dailyChallenge,
  onUpdateLineup,
  onBackToDifficulty,
  onStartCampaign
}) => {
  const currentDiffConfig = DIFFICULTY_CONFIGS[difficulty];
  const [rerollsLeft, setRerollsLeft] = useState(currentDiffConfig.rerolls);
  const [usedTeamIds, setUsedTeamIds] = useState<Set<string>>(new Set());
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Pool of teams: if daily challenge, use seeded order
  const teamPool = dailyChallenge && dailyChallenge.seedTeams.length > 0
    ? dailyChallenge.seedTeams
    : HISTORICAL_TEAMS;

  // Helper to get available unpicked teams
  const getAvailableTeams = (exclude: Set<string> = usedTeamIds) => {
    const unpicked = teamPool.filter(t => !exclude.has(t.id));
    return unpicked.length > 0 ? unpicked : teamPool;
  };

  // Exactly 1 team drawn at a time (deterministic for daily challenge)
  const [currentTeam, setCurrentTeam] = useState<TeamHistorical>(() => {
    if (dailyChallenge && dailyChallenge.seedTeams.length > 0) {
      return dailyChallenge.seedTeams[0];
    }
    const available = [...HISTORICAL_TEAMS].sort(() => 0.5 - Math.random());
    return available[0];
  });

  const [activeSlotTarget, setActiveSlotTarget] = useState<SlotKey | null>(null);

  const stats = calculateLineupStats(lineup);
  const totalFilled = Object.values(lineup).filter(Boolean).length;
  const isLineupReady = totalFilled === 5;

  const handleRollTeam = () => {
    if (rerollsLeft <= 0) return;
    const nextUsed = new Set(usedTeamIds);
    nextUsed.add(currentTeam.id);
    setUsedTeamIds(nextUsed);

    const available = getAvailableTeams(nextUsed);
    const nextTeam = dailyChallenge
      ? available[0]
      : [...available].sort(() => 0.5 - Math.random())[0];
    setCurrentTeam(nextTeam || teamPool[0]);
    setRerollsLeft(prev => prev - 1);
    setValidationMessage(null);
  };

  const handleSelectPlayer = (player: Player) => {
    setValidationMessage(null);

    // If player already in lineup by name (prevent duplicates across different years/teams, e.g. Aspas 2022 vs Aspas 2024)
    const isAlreadyIn = Object.values(lineup).some(
      p => p && p.name.trim().toLowerCase() === player.name.trim().toLowerCase()
    );
    if (isAlreadyIn) {
      setValidationMessage(
        `${player.name} já foi escalado na sua line-up! Não é permitido o mesmo atleta de anos diferentes.`
      );
      return;
    }

    const newLineup = { ...lineup };
    let placedSlot: SlotKey | null = null;

    // 1. If user explicitly clicked a slot
    if (activeSlotTarget) {
      const targetRole = SLOTS_CONFIG.find(s => s.key === activeSlotTarget)?.role;
      const canFitTarget = 
        targetRole === 'IGL'
          ? (player.isIGL || true)
          : (player.role === targetRole || player.secondaryRoles?.includes(targetRole as Role));

      if (!canFitTarget) {
        setValidationMessage(`${player.name} é ${player.role} e não pode ocupar a vaga de ${targetRole}!`);
        return;
      }

      newLineup[activeSlotTarget] = player;
      placedSlot = activeSlotTarget;
      setActiveSlotTarget(null);
    } else {
      // 2. Auto-placement
      if (player.role === 'Duelista' && !newLineup.duelista) {
        newLineup.duelista = player;
        placedSlot = 'duelista';
      } else if (player.role === 'Iniciador' && !newLineup.iniciador) {
        newLineup.iniciador = player;
        placedSlot = 'iniciador';
      } else if (player.role === 'Controlador' && !newLineup.controlador) {
        newLineup.controlador = player;
        placedSlot = 'controlador';
      } else if (player.role === 'Sentinela' && !newLineup.sentinela) {
        newLineup.sentinela = player;
        placedSlot = 'sentinela';
      } else if (player.isIGL && !newLineup.igl) {
        newLineup.igl = player;
        placedSlot = 'igl';
      } else if (!newLineup.igl) {
        newLineup.igl = player;
        placedSlot = 'igl';
      } else {
        // Try secondary roles
        if (player.secondaryRoles?.includes('Iniciador') && !newLineup.iniciador) {
          newLineup.iniciador = player;
          placedSlot = 'iniciador';
        } else if (player.secondaryRoles?.includes('Controlador') && !newLineup.controlador) {
          newLineup.controlador = player;
          placedSlot = 'controlador';
        } else if (player.secondaryRoles?.includes('Sentinela') && !newLineup.sentinela) {
          newLineup.sentinela = player;
          placedSlot = 'sentinela';
        } else if (player.secondaryRoles?.includes('Duelista') && !newLineup.duelista) {
          newLineup.duelista = player;
          placedSlot = 'duelista';
        } else {
          setValidationMessage(`As vagas compatíveis com ${player.name} (${player.role}) já estão preenchidas!`);
          return;
        }
      }
    }

    if (!placedSlot) return;

    onUpdateLineup(newLineup);

    // Consume current team
    const nextUsed = new Set(usedTeamIds);
    nextUsed.add(currentTeam.id);
    setUsedTeamIds(nextUsed);

    // Check if lineup is complete
    const newCount = Object.values(newLineup).filter(Boolean).length;
    if (newCount === 5) {
      return;
    }

    // Always immediately draw the next team!
    const available = getAvailableTeams(nextUsed);
    const nextTeam = dailyChallenge
      ? available[0]
      : [...available].sort(() => 0.5 - Math.random())[0];
    setCurrentTeam(nextTeam || teamPool[0]);
  };

  const handleToggleAgent = (slotKey: SlotKey, newAgent: string) => {
    const player = lineup[slotKey];
    if (!player) return;
    onUpdateLineup({
      ...lineup,
      [slotKey]: {
        ...player,
        signatureAgent: newAgent
      }
    });
  };

  const handleAutoFill = () => {
    const allPlayers = HISTORICAL_TEAMS.flatMap(t => t.players);
    const chosenNames = new Set<string>();

    const pickUnique = (pool: Player[]) => {
      const available = pool.filter(p => !chosenNames.has(p.name.trim().toLowerCase()));
      const selected = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : pool[Math.floor(Math.random() * pool.length)];
      chosenNames.add(selected.name.trim().toLowerCase());
      return selected;
    };

    const duelista = pickUnique(allPlayers.filter(p => p.role === 'Duelista'));
    const iniciador = pickUnique(allPlayers.filter(p => p.role === 'Iniciador'));
    const controlador = pickUnique(allPlayers.filter(p => p.role === 'Controlador'));
    const sentinela = pickUnique(allPlayers.filter(p => p.role === 'Sentinela'));
    const igl = pickUnique(allPlayers.filter(p => p.isIGL));

    onUpdateLineup({ duelista, iniciador, controlador, sentinela, igl });
    setValidationMessage(null);
  };

  const handleLaunchCampaign = () => {
    if (!isLineupReady) return;
    if (dailyChallenge) {
      const check = dailyChallenge.validateLineup(lineup);
      if (!check.valid) {
        setValidationMessage(check.reason || 'Requisito do Desafio do Dia não foi cumprido!');
        return;
      }
    }
    onStartCampaign();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Daily Challenge Active Banner */}
      {dailyChallenge && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-[#182637] to-[#0f1923] border-2 border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(245,183,49,0.2)] val-cut-top-right">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-tech font-bold uppercase tracking-wider text-amber-400">
                  DESAFIO DO DIA ATIVO · {dailyChallenge.dayName}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-tech font-bold uppercase ${
                  difficulty === 'DIFICIL'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : difficulty === 'MEDIO'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  MODO {difficulty} ({currentDiffConfig.hideOVR ? 'OVR OCULTO' : `${currentDiffConfig.rerolls} ROLLS`})
                </span>
              </div>
              <h3 className="font-display font-black text-lg text-white">
                {dailyChallenge.themeTitle}
              </h3>
              <p className="text-xs font-tech text-amber-200 mt-0.5">
                ⚡ <strong>Regra Obrigatória:</strong> {dailyChallenge.ruleConstraintText}
              </p>
            </div>
          </div>

          {/* Validation badge */}
          {dailyChallenge.validateLineup(lineup).valid ? (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-tech font-bold flex items-center gap-1.5 shrink-0">
              <CheckCircle2 size={14} /> REQUISITO CUMPRIDO
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-tech font-bold flex items-center gap-1.5 shrink-0">
              <AlertTriangle size={14} /> REQUISITO PENDENTE
            </span>
          )}
        </div>
      )}

      {/* Top Banner */}
      <div className="relative mb-6 p-5 sm:p-6 rounded-xl bg-gradient-to-r from-[#0f1923] via-[#14202d] to-[#0f1923] border border-[#243447] val-cut-top-right">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[11px] font-tech font-bold uppercase tracking-wider ${
                gameMode === 'MANAGER'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}>
                {gameMode === 'MANAGER' ? '⚡ MODO MANAGER ROGUELIKE' : '🏆 13 A 0 CLÁSSICO'}
              </span>

              <span className={`px-2 py-0.5 rounded text-[11px] font-tech font-bold uppercase tracking-wider ${
                difficulty === 'DIFICIL'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : difficulty === 'MEDIO'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                DIFICULDADE {currentDiffConfig.badge}
              </span>
              <span className="text-xs font-tech text-slate-400">
                {currentDiffConfig.badgeTitle}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide">
              MONTE SUA LINE-UP ({totalFilled}/5)
            </h1>
            <p className="text-xs text-slate-400 font-tech mt-0.5">
              {currentDiffConfig.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToDifficulty}
              className="px-3 py-1.5 text-xs font-tech font-bold text-slate-300 hover:text-white bg-[#162433] hover:bg-[#1e3247] border border-[#2b4159] rounded transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={13} /> Trocar Modo / Dificuldade
            </button>

            <button
              onClick={handleAutoFill}
              className="px-3 py-1.5 text-xs font-tech text-slate-300 hover:text-white bg-[#1b2b3d] hover:bg-[#24384e] border border-[#2d435d] rounded transition cursor-pointer"
            >
              Draft Rápido (Auto)
            </button>
          </div>

        </div>
      </div>

      {/* Validation / Alert Message */}
      {validationMessage && (
        <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-xs font-tech text-red-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-red-400 shrink-0" />
            <span>{validationMessage}</span>
          </div>
          <button 
            onClick={() => setValidationMessage(null)}
            className="text-red-400 hover:text-white text-xs font-bold px-2 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Lineup Slots (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#243447]">
            <h2 className="text-lg font-display font-black text-white tracking-wider flex items-center gap-2">
              <Shield size={18} className="text-[#ff4655]" />
              SUA LINE-UP ({totalFilled}/5)
            </h2>
            <div className="text-right">
              <span className="text-xs font-tech text-slate-400">FORÇA DA EQUIPE:</span>{' '}
              <span className="text-lg font-display font-bold text-amber-400">
                {currentDiffConfig.hideOVR ? '??? OVR' : `${stats.overall} OVR`}
              </span>
            </div>
          </div>

          {/* Synergy warnings */}
          <div className="space-y-1.5">
            {stats.hasIGL ? (
              <div className="flex items-center gap-2 text-xs font-tech text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/30">
                <CheckCircle2 size={14} /> IGL ativo: Liderança tática garantida (+5% de sinergia)
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-tech text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded border border-amber-500/30">
                <AlertTriangle size={14} /> Atenção: Sem IGL experiente na line (-8% desorganização)
              </div>
            )}
          </div>

          {/* The 5 Slots */}
          <div className="space-y-3">
            {SLOTS_CONFIG.map((slot) => {
              const player = lineup[slot.key];
              const isTargeted = activeSlotTarget === slot.key;

              return (
                <div key={slot.key} className="relative">
                  {player ? (
                    <div>
                      <div className="text-[10px] font-tech text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-between">
                        <span>{slot.label}</span>
                        <span className="text-[#00f59b] font-bold">OCUPADO</span>
                      </div>
                      <PlayerCard
                        player={player}
                        compact
                        hideOVR={currentDiffConfig.hideOVR}
                        onToggleAgent={(newAgent) => handleToggleAgent(slot.key, newAgent)}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => setActiveSlotTarget(isTargeted ? null : slot.key)}
                      className={`p-3.5 rounded-lg bg-[#0f1923]/60 border border-dashed transition cursor-pointer flex items-center justify-between group ${slot.color} ${
                        isTargeted
                          ? 'border-[#ff4655] bg-[#162433] shadow-[0_0_15px_rgba(255,70,85,0.2)]'
                          : 'border-[#243447] hover:border-slate-500 hover:bg-[#121e2a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-[#162433] flex items-center justify-center text-slate-400 group-hover:text-white transition">
                          <UserPlus size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-display font-bold tracking-wider text-slate-200 group-hover:text-white">
                              {slot.label}
                            </span>
                            {isTargeted && (
                              <span className="text-[9px] bg-[#ff4655] text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                                Alocando nesta vaga
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-tech">{slot.desc}</p>
                        </div>
                      </div>

                      <div className="text-xs font-tech text-slate-400 group-hover:text-slate-200">
                        {isTargeted ? 'Cancelar' : 'Preencher +'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Launch Campaign CTA */}
          <div className="pt-4">
            <button
              onClick={handleLaunchCampaign}
              disabled={!isLineupReady}
              className={`w-full py-3.5 px-6 rounded-lg font-display font-black text-lg tracking-wider transition uppercase flex items-center justify-center gap-2 cursor-pointer val-cut-top-right ${
                isLineupReady
                  ? 'bg-gradient-to-r from-[#ff4655] to-[#e03140] hover:from-[#ff5e6c] hover:to-[#ff4655] text-white shadow-[0_0_25px_rgba(255,70,85,0.4)]'
                  : 'bg-[#152230] text-slate-500 border border-[#243447] cursor-not-allowed opacity-60'
              }`}
            >
              <Trophy size={20} />
              {isLineupReady ? 'DISPUTAR O VCT CHAMPIONS' : `PREENCHA OS 5 SLOTS (${totalFilled}/5)`}
            </button>
          </div>
        </div>

        {/* Right: The Drawn Team (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Header of roll */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-[#243447]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-black text-white tracking-wider flex items-center gap-2">
                  <Dices size={18} className="text-[#00f59b]" />
                  TIME SORTEADO DA VEZ
                </h2>
                {currentDiffConfig.hideOVR && (
                  <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded font-bold font-tech flex items-center gap-1">
                    <EyeOff size={11} /> OVR OCULTO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-tech">
                Escolha 1 jogador deste elenco. Ao confirmar, o próximo time será sorteado automaticamente!
              </p>
            </div>

            <button
              onClick={handleRollTeam}
              disabled={rerollsLeft <= 0}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-tech font-bold rounded transition border cursor-pointer ${
                rerollsLeft > 0
                  ? 'bg-[#1a2b3d] hover:bg-[#223950] text-[#00f59b] border-[#00f59b]/40'
                  : 'bg-[#121c27] text-slate-600 border-[#1f2d3d] cursor-not-allowed'
              }`}
            >
              <Dices size={14} />
              PULAR TIME ({rerollsLeft} rolls)
            </button>
          </div>

          {/* Big Spotlight Card of the Single Drawn Team */}
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#142334] to-[#0f1923] border-2 border-[#ff4655]/60 val-cut-top-right shadow-[0_0_20px_rgba(255,70,85,0.2)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-[#ff4655]">
                    VAGA {totalFilled + 1} DE 5 · {currentTeam.region}
                  </span>
                  {currentTeam.tier === 'CHAMPION' && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-tech font-bold uppercase tracking-wider">
                      🏆 CAMPEÃO MUNDIAL
                    </span>
                  )}
                  {currentTeam.tier === 'CONTENDER' && (
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-tech font-bold uppercase tracking-wider flex items-center gap-1">
                      <Swords size={10} /> GIGANTE DO VCT
                    </span>
                  )}
                  {currentTeam.tier === 'UNDERDOG' && (
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-tech font-bold uppercase tracking-wider flex items-center gap-1">
                      <Flame size={10} /> UNDERDOG / ZEBRA
                    </span>
                  )}
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                  {currentTeam.name} ({currentTeam.year})
                </h3>
                <p className="text-xs text-slate-300 font-tech">{currentTeam.event}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-amber-400 font-tech font-bold block">
                  {currentTeam.achievement}
                </span>
                <span className="text-[10px] text-slate-400 font-tech">
                  Restam {5 - totalFilled} vagas na line
                </span>
              </div>
            </div>
          </div>

          {/* Drawn Team Players List */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-tech uppercase tracking-widest text-slate-400">
                Jogadores do <strong className="text-white">{currentTeam.name}</strong>:
              </span>
              <span className="text-xs font-tech text-[#00f59b]">
                Clique em 1 jogador para escalar e avançar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentTeam.players.map((player) => {
                const isAssigned = Object.values(lineup).some(
                  p => p && p.name.trim().toLowerCase() === player.name.trim().toLowerCase()
                );

                return (
                  <div key={player.id} className="relative">
                    <div className={isAssigned ? 'opacity-35 pointer-events-none' : ''}>
                      <PlayerCard
                        player={player}
                        hideOVR={currentDiffConfig.hideOVR}
                        onSelect={() => handleSelectPlayer(player)}
                      />
                    </div>
                    {isAssigned && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center pointer-events-none border border-slate-700">
                        <span className="px-2.5 py-1 rounded bg-[#090e14] text-amber-400 border border-amber-500/50 text-[10px] font-tech font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                          ✓ JÁ ESCALADO ({player.name})
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
