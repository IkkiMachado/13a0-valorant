import React, { useState, useEffect } from 'react';
import { Lineup, TeamHistorical, MapData, RoundResult, PlayerStats, TacticalTimeoutStrategy, TACTICAL_STRATEGIES } from '../types/game';
import { ManagerPerk, PlayerUpgradeStats } from '../types/manager';
import { simulateRound, initPlayerStatsRecord, updateStatsWithRound, clonePlayerStats } from '../utils/simulation';
import { TacticalTimeoutModal } from './TacticalTimeoutModal';
import { getPlayerPhoto, getAgentIcon } from '../utils/playerPhotos';
import { Trophy, Play, FastForward, SkipForward, Flame, Crosshair, Bomb, ShieldCheck, Skull, Award, Zap, Headphones, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchSimulatorProps {
  playerLineup: Lineup;
  opponentTeam: TeamHistorical;
  map: MapData;
  stageName: string;
  managerPerks?: ManagerPerk[];
  playerUpgrades?: Record<string, PlayerUpgradeStats>;
  onMatchComplete: (result: {
    playerScore: number;
    opponentScore: number;
    is13x0: boolean;
    rounds: RoundResult[];
    playerUltsUsed?: number;
    totalAces?: number;
    totalClutches?: number;
  }) => void;
  onRoundSimulated?: (round: RoundResult) => void;
}

export const MatchSimulator: React.FC<MatchSimulatorProps> = ({
  playerLineup,
  opponentTeam,
  map,
  stageName,
  managerPerks = [],
  playerUpgrades = {},
  onMatchComplete,
  onRoundSimulated
}) => {
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [currentRoundNum, setCurrentRoundNum] = useState(1);
  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [speedMs, setSpeedMs] = useState(1200);
  const [economyStreak, setEconomyStreak] = useState(0);

  // Tactical Timeouts (Coach perk gives 3 timeouts)
  const initialTimeouts = managerPerks.some(p => p.effectType === 'COACH_TIMEOUT') ? 3 : 2;
  const [playerTimeoutsLeft, setPlayerTimeoutsLeft] = useState(initialTimeouts);
  const [opponentTimeoutsLeft, setOpponentTimeoutsLeft] = useState(1);
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
  const [pendingTimeoutBoost, setPendingTimeoutBoost] = useState<{
    team: 'player' | 'opponent';
    strategy: TacticalTimeoutStrategy;
    title: string;
    description: string;
  } | null>(null);
  const [activeTimeoutBanner, setActiveTimeoutBanner] = useState<string | null>(null);

  const playerList = Object.values(playerLineup).filter(Boolean) as any[];
  const opponentList = opponentTeam.players;

  // Ult Battery perk gives initial ult points
  const bonusUltPoints = managerPerks.some(p => p.effectType === 'ULT_BATTERY') ? 2 : 0;

  const [playerStats, setPlayerStats] = useState<Record<string, PlayerStats>>(() =>
    initPlayerStatsRecord(playerList, bonusUltPoints)
  );
  const [opponentStats, setOpponentStats] = useState<Record<string, PlayerStats>>(() =>
    initPlayerStatsRecord(opponentList)
  );

  const isGameOver = (playerScore >= 13 || opponentScore >= 13) && Math.abs(playerScore - opponentScore) >= 2;
  const is13x0 = playerScore === 13 && opponentScore === 0;

  // Trigger confetti if 13-0 occurs!
  useEffect(() => {
    if (isGameOver && is13x0) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff4655', '#00f59b', '#f5b731']
      });
    }
  }, [isGameOver, is13x0]);

  const handleApplyTimeout = (strategy: TacticalTimeoutStrategy) => {
    if (playerTimeoutsLeft <= 0) return;
    setPlayerTimeoutsLeft(prev => prev - 1);

    const info = TACTICAL_STRATEGIES[strategy];
    setPendingTimeoutBoost({
      team: 'player',
      strategy,
      title: info.title,
      description: info.bonusEffect
    });

    // Strategy 3 (IGL Playbook): give +1 Ult Point to all player athletes
    if (strategy === 'IGL_PLAYBOOK') {
      setPlayerStats(prev => {
        const copy = { ...prev };
        for (const p of playerList) {
          if (copy[p.name]) {
            const nextPts = Math.min(copy[p.name].maxUltPoints, copy[p.name].ultPoints + 1);
            copy[p.name] = {
              ...copy[p.name],
              ultPoints: nextPts,
              isUltReady: nextPts >= copy[p.name].maxUltPoints
            };
          }
        }
        return copy;
      });
    }

    // Reset opponent streak if negative
    if (economyStreak < 0) {
      setEconomyStreak(0);
    }

    setActiveTimeoutBanner(`PAUSA DO COACH ATIVA: ${info.title} (${info.bonusEffect})`);
  };

  // Step one round
  const stepRound = () => {
    if (isGameOver) return;

    let timeoutToApply = pendingTimeoutBoost;

    // Check if AI opponent should call timeout
    if (!timeoutToApply && opponentTimeoutsLeft > 0) {
      const isLosingHard = (playerScore >= 4 && opponentScore <= 1) || economyStreak >= 3;
      if (isLosingHard && Math.random() < 0.65) {
        setOpponentTimeoutsLeft(prev => prev - 1);
        if (economyStreak > 0) {
          setEconomyStreak(0); // opponent timeout stops player momentum
        }
        timeoutToApply = {
          team: 'opponent',
          strategy: 'SETUP_CONTROL',
          title: `Pausa Tática (${opponentTeam.name})`,
          description: `O Coach do ${opponentTeam.name} pediu tempo para conter seu ímpeto!`
        };
        setActiveTimeoutBanner(`PAUSA ADVERSÁRIA: O Coach da equipe ${opponentTeam.name} pediu tempo!`);
      }
    }

    const roundResult = simulateRound(
      currentRoundNum,
      playerScore,
      opponentScore,
      playerLineup,
      opponentTeam,
      economyStreak,
      playerStats,
      opponentStats,
      timeoutToApply,
      managerPerks,
      playerUpgrades
    );

    // Clear one-shot boost
    setPendingTimeoutBoost(null);
    if (timeoutToApply?.team === 'player') {
      setActiveTimeoutBanner(null);
    }

    const newPlayerScore = roundResult.playerScore;
    const newOpponentScore = roundResult.opponentScore;
    const playerWon = roundResult.winner === 'player';

    setPlayerScore(newPlayerScore);
    setOpponentScore(newOpponentScore);
    setCurrentRoundNum(prev => prev + 1);
    setRounds(prev => [roundResult, ...prev]);

    // Update streak
    setEconomyStreak(prev => (playerWon ? (prev > 0 ? prev + 1 : 1) : (prev < 0 ? prev - 1 : -1)));

    // Update stats cleanly without nesting state setters or mutating state references
    const nextP = clonePlayerStats(playerStats);
    const nextO = clonePlayerStats(opponentStats);
    updateStatsWithRound(roundResult, nextP, nextO);
    setPlayerStats(nextP);
    setOpponentStats(nextO);
    onRoundSimulated?.(roundResult);
  };

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlayingAuto && !isGameOver) {
      timer = setTimeout(() => {
        stepRound();
      }, speedMs);
    } else if (isGameOver) {
      setIsPlayingAuto(false);
    }
    return () => clearTimeout(timer);
  }, [isPlayingAuto, isGameOver, currentRoundNum, speedMs]);

  // Fast forward / simulate all until end
  const handleInstantSimulate = () => {
    setIsPlayingAuto(false);
    let pScore = playerScore;
    let oScore = opponentScore;
    let roundNum = currentRoundNum;
    let streak = economyStreak;
    const accumulatedRounds: RoundResult[] = [...rounds];
    const copyP = clonePlayerStats(playerStats);
    const copyO = clonePlayerStats(opponentStats);

    while (!((pScore >= 13 || oScore >= 13) && Math.abs(pScore - oScore) >= 2)) {
      const r = simulateRound(
        roundNum,
        pScore,
        oScore,
        playerLineup,
        opponentTeam,
        streak,
        copyP,
        copyO,
        null,
        managerPerks,
        playerUpgrades
      );
      pScore = r.playerScore;
      oScore = r.opponentScore;
      streak = r.winner === 'player' ? (streak > 0 ? streak + 1 : 1) : (streak < 0 ? streak - 1 : -1);
      roundNum += 1;
      accumulatedRounds.unshift(r);
      updateStatsWithRound(r, copyP, copyO);
      onRoundSimulated?.(r);
    }

    setPlayerScore(pScore);
    setOpponentScore(oScore);
    setCurrentRoundNum(roundNum);
    setRounds(accumulatedRounds);
    setPlayerStats(copyP);
    setOpponentStats(copyO);
  };

  const latestRound = rounds[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Top Match Bar */}
      <div className="relative mb-6 p-6 rounded-xl bg-[#0f1923] border border-[#243447] val-cut-top-right overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Player Team */}
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            <div className="w-14 h-14 rounded-lg bg-[#ff4655] flex items-center justify-center font-display font-black text-2xl text-white shadow-[0_0_15px_rgba(255,70,85,0.4)] val-cut-corner">
              YOU
            </div>
            <div>
              <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-[#ff4655]">
                Sua Equipe dos Sonhos
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white">ALL-STAR VCT</h2>
              <p className="text-xs text-slate-400 font-tech">5 Pro Players Lendários</p>
              
              {/* Active Manager Perks */}
              {managerPerks.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  {managerPerks.map(p => (
                    <span
                      key={p.id}
                      className="text-[9px] font-tech font-bold px-1.5 py-0.5 rounded bg-[#162433] border border-amber-500/40 text-amber-300 flex items-center gap-1 shadow-sm"
                      title={p.description}
                    >
                      <span>{p.icon}</span>
                      <span className="truncate max-w-[100px]">{p.name}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Central Scoreboard */}
          <div className="flex flex-col items-center">
            <div className="text-[11px] font-tech text-amber-400 uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5">
              <span>{stageName}</span> · <span className="text-white">MAPA: {map.name}</span>
            </div>

            <div className="flex items-center gap-4 bg-[#090e14] px-6 py-2 rounded-xl border border-[#243447]">
              <span className={`font-display font-black text-4xl sm:text-5xl ${playerScore > opponentScore ? 'text-[#ff4655]' : 'text-white'}`}>
                {playerScore}
              </span>
              <span className="text-slate-600 font-display text-2xl font-light">:</span>
              <span className={`font-display font-black text-4xl sm:text-5xl ${opponentScore > playerScore ? 'text-amber-400' : 'text-white'}`}>
                {opponentScore}
              </span>
            </div>

            <span className="text-[10px] text-slate-400 font-tech mt-1">
              {isGameOver ? 'PARTIDA ENCERRADA' : `ROUND ${currentRoundNum} DE 24+ (FIRST TO 13)`}
            </span>
          </div>

          {/* Opponent Team */}
          <div className="flex items-center justify-end gap-4 text-right w-full md:w-auto">
            <div>
              <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-slate-400">
                {opponentTeam.event}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white">{opponentTeam.name}</h2>
              <p className="text-xs text-amber-400 font-tech">{opponentTeam.achievement}</p>
            </div>
            <div 
              className="w-14 h-14 rounded-lg flex items-center justify-center font-display font-black text-2xl text-white val-cut-corner"
              style={{ backgroundColor: opponentTeam.color || '#243447' }}
            >
              {opponentTeam.name.slice(0, 3).toUpperCase()}
            </div>
          </div>

        </div>

        {/* 13-0 Special Banner */}
        {is13x0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/20 via-[#ff4655]/20 to-amber-500/20 border border-amber-500/50 rounded-lg text-center animate-pulse">
            <span className="font-display font-black text-xl text-amber-300 tracking-widest flex items-center justify-center gap-2">
              <Trophy size={20} className="text-amber-400" />
              13-0 FLAWLESS ABSOLUTO CONQUISTADO!
            </span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      {!isGameOver && (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6 bg-[#0f1923] p-3 rounded-lg border border-[#243447]">
          <button
            onClick={stepRound}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#ff4655] hover:bg-[#e03140] text-white font-tech font-bold text-xs uppercase tracking-wider rounded transition cursor-pointer"
          >
            <Play size={14} /> Próximo Round
          </button>

          <button
            onClick={() => setIsPlayingAuto(!isPlayingAuto)}
            className={`flex items-center gap-1.5 px-4 py-2 font-tech font-bold text-xs uppercase tracking-wider rounded border transition cursor-pointer ${
              isPlayingAuto
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-[#1a2b3d] hover:bg-[#223950] text-slate-200 border-[#2b4159]'
            }`}
          >
            <FastForward size={14} />
            {isPlayingAuto ? 'Pausar Simulação' : 'Auto Play (Ao Vivo)'}
          </button>

          <button
            onClick={handleInstantSimulate}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1b2b3d] hover:bg-[#253d57] text-slate-200 font-tech font-bold text-xs uppercase tracking-wider rounded border border-[#2d4663] transition cursor-pointer"
          >
            <SkipForward size={14} /> Simular Até o Fim
          </button>

          {/* Coach Timeout Button */}
          <button
            onClick={() => {
              setIsPlayingAuto(false);
              setIsTimeoutModalOpen(true);
            }}
            disabled={playerTimeoutsLeft <= 0 || isGameOver}
            className={`flex items-center gap-1.5 px-4 py-2 font-tech font-bold text-xs uppercase tracking-wider rounded border transition cursor-pointer ${
              playerTimeoutsLeft > 0 && !isGameOver
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,183,49,0.2)]'
                : 'bg-[#121c27] text-slate-600 border-[#1f2d3d] cursor-not-allowed'
            }`}
          >
            <Headphones size={14} className={playerTimeoutsLeft > 0 ? 'text-amber-400' : 'text-slate-600'} />
            <span>PAUSA DO COACH ({playerTimeoutsLeft}/2)</span>
          </button>
        </div>
      )}

      {/* Active Tactical Timeout Banner */}
      {activeTimeoutBanner && !isGameOver && (
        <div className="mb-6 p-3 rounded-lg bg-gradient-to-r from-amber-500/20 via-[#182738] to-[#0f1923] border border-amber-400/60 shadow-[0_0_20px_rgba(245,183,49,0.2)] flex items-center justify-between gap-3 text-xs font-tech animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Headphones size={16} className="text-amber-400 shrink-0" />
            <span className="text-amber-200 font-bold">{activeTimeoutBanner}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            EM AÇÃO NESTE ROUND
          </span>
        </div>
      )}

      {/* Main Grid: Player Lineup Stats (Left), Round Feed (Center), Opponent Stats (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Your Players Table */}
        <div className="lg:col-span-4 bg-[#0f1923] p-4 rounded-xl border border-[#243447]">
          <h3 className="font-display font-black text-base text-white tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff4655]"></span>
              SUA LINE-UP
            </span>
            <span className="text-xs font-tech text-slate-400 font-normal">K / D · ULT</span>
          </h3>

          <div className="space-y-2">
            {playerList.map((p) => {
              const st = playerStats[p.name] || { kills: 0, deaths: 0, firstBloods: 0, clutches: 0, ultPoints: 0, maxUltPoints: 8, isUltReady: false };
              return (
                <div key={p.id} className="flex items-center justify-between p-2 rounded bg-[#090e14] border border-[#1e2d3d] text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative">
                      <img
                        src={getPlayerPhoto(p.name, p.signatureAgent, p.photoUrl)}
                        alt={p.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getAgentIcon(p.signatureAgent);
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white flex items-center gap-1 truncate">
                        <span className="truncate">{p.name}</span>
                        <span className="text-[11px] shrink-0">{p.flag}</span>
                        {p.isIGL && <span className="text-[9px] text-amber-400 font-black shrink-0" title="IGL">★</span>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-tech truncate block">{p.signatureAgent} ({p.role})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="font-mono text-right text-xs">
                      <span className="font-bold text-white">{st.kills}</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-slate-400">{st.deaths}</span>
                    </div>

                    {/* Ult status */}
                    {st.isUltReady ? (
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded animate-pulse" title="Ultimate Pronta para Ativar!">
                        ULT
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-mono" title={`Pontos de Ult: ${st.ultPoints}/${st.maxUltPoints}`}>
                        ⚡{st.ultPoints}/{st.maxUltPoints}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Live Round Event & Killfeed */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Latest Round Highlight */}
          {latestRound ? (
            <div className="bg-[#0f1923] p-4 rounded-xl border border-[#243447] text-center">
              <div className="text-[10px] font-tech uppercase tracking-widest text-slate-400 mb-1">
                ROUND {latestRound.roundNumber} · COMPRA: <strong className="text-white">{latestRound.buyType}</strong>
              </div>

              <div className={`text-lg font-display font-black tracking-wide my-1 ${
                latestRound.winner === 'player' ? 'text-[#00f59b]' : 'text-amber-400'
              }`}>
                {latestRound.winner === 'player' ? 'VITÓRIA DA SUA EQUIPE' : `ROUND DO ${opponentTeam.name.toUpperCase()}`}
              </div>

              {/* Tactical Timeout Activated in this Round */}
              {latestRound.tacticalTimeoutEvent && (
                <div className={`my-2 p-1.5 rounded text-xs font-tech font-bold flex items-center justify-center gap-1.5 animate-fadeIn ${
                  latestRound.tacticalTimeoutEvent.team === 'player'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,183,49,0.2)]'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  <Headphones size={13} />
                  <span>PAUSA TÁTICA: <strong>{latestRound.tacticalTimeoutEvent.strategyTitle}</strong> ({latestRound.tacticalTimeoutEvent.description})</span>
                </div>
              )}

              {/* Ultimates Activated in this Round */}
              {latestRound.activatedUltimates && latestRound.activatedUltimates.length > 0 && (
                <div className="my-2 space-y-1">
                  {latestRound.activatedUltimates.map((u, i) => (
                    <div 
                      key={i} 
                      className={`p-1.5 rounded text-xs font-tech font-bold flex items-center justify-center gap-1.5 animate-fadeIn ${
                        u.team === 'player' 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,245,155,0.2)]' 
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      <span>{u.icon}</span>
                      <span>ULTIMATE: <strong>{u.player}</strong> ({u.agent}) ativou <strong>{u.ultimateName}</strong>!</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Badges: Ace, Flawless, Clutch */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 my-2">
                {latestRound.isFlawless && (
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-tech font-bold flex items-center gap-1">
                    <ShieldCheck size={11} /> FLAWLESS
                  </span>
                )}
                {latestRound.isAce && (
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-tech font-bold flex items-center gap-1">
                    <Flame size={11} /> ACE DE {latestRound.acePlayer}
                  </span>
                )}
                {latestRound.clutchPlayer && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-tech font-bold flex items-center gap-1">
                    <Award size={11} /> CLUTCH DE {latestRound.clutchPlayer}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-tech">
                  SPIKE: {latestRound.spikeStatus.toUpperCase()}
                </span>
              </div>

              {/* Kill Feed List */}
              <div className="mt-3 pt-3 border-t border-[#1e2d3d] space-y-1.5 text-left text-xs max-h-48 overflow-y-auto">
                {latestRound.killFeed.map((k, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 bg-[#090e14] rounded border border-[#162433]">
                    <span className={`font-bold ${k.killerTeam === 'player' ? 'text-[#ff4655]' : 'text-amber-400'}`}>
                      {k.killer}
                    </span>
                    <span className="text-[10px] text-slate-400 font-tech px-2">
                      [{k.weapon}] {k.headshot ? '🎯' : ''}
                    </span>
                    <span className={`line-through ${k.victimTeam === 'player' ? 'text-slate-500' : 'text-slate-500'}`}>
                      {k.victim}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#0f1923] p-8 rounded-xl border border-[#243447] text-center text-slate-500 font-tech">
              Aguardando início do Pistol Round...
            </div>
          )}

          {/* If Match is Over, Next Stage CTA */}
          {isGameOver && (
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#162433] to-[#0f1923] border border-[#ff4655] text-center shadow-lg">
              <h4 className="font-display font-black text-xl text-white mb-1">
                {playerScore > opponentScore ? '🏆 VITÓRIA NA PARTIDA!' : '❌ DERROTA NA PARTIDA'}
              </h4>
              <p className="text-xs text-slate-300 font-tech mb-4">
                Placar Final: <strong className="text-white">{playerScore} x {opponentScore}</strong>
              </p>
              <button
                onClick={() => onMatchComplete({
                  playerScore,
                  opponentScore,
                  is13x0,
                  rounds,
                  playerUltsUsed: Object.values(playerStats).reduce((acc, p) => acc + (p.ultsUsed || 0), 0),
                  totalAces: rounds.filter(r => r.isAce && r.winner === 'player').length,
                  totalClutches: rounds.filter(r => !!r.clutchPlayer && r.winner === 'player').length
                })}
                className="w-full py-3 bg-[#ff4655] hover:bg-[#e03140] text-white font-display font-black text-sm uppercase tracking-wider rounded transition cursor-pointer"
              >
                Avançar na Chave do Torneio →
              </button>
            </div>
          )}

        </div>

        {/* Right: Opponent Lineup Stats */}
        <div className="lg:col-span-4 bg-[#0f1923] p-4 rounded-xl border border-[#243447]">
          <h3 className="font-display font-black text-base text-white tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opponentTeam.color }} />
              {opponentTeam.name.toUpperCase()}
            </span>
            <span className="text-xs font-tech text-slate-400 font-normal">K / D · ULT</span>
          </h3>

          <div className="space-y-2">
            {opponentList.map((p) => {
              const st = opponentStats[p.name] || { kills: 0, deaths: 0, firstBloods: 0, clutches: 0, ultPoints: 0, maxUltPoints: 8, isUltReady: false };
              return (
                <div key={p.id} className="flex items-center justify-between p-2 rounded bg-[#090e14] border border-[#1e2d3d] text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative">
                      <img
                        src={getPlayerPhoto(p.name, p.signatureAgent, p.photoUrl)}
                        alt={p.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getAgentIcon(p.signatureAgent);
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white flex items-center gap-1 truncate">
                        <span className="truncate">{p.name}</span>
                        <span className="text-[11px] shrink-0">{p.flag}</span>
                        {p.isIGL && <span className="text-[9px] text-amber-400 font-black shrink-0" title="IGL">★</span>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-tech truncate block">{p.signatureAgent} ({p.role})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="font-mono text-right text-xs">
                      <span className="font-bold text-white">{st.kills}</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-slate-400">{st.deaths}</span>
                    </div>

                    {/* Ult status */}
                    {st.isUltReady ? (
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded animate-pulse" title="Ultimate Pronta!">
                        ULT
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-mono" title={`Pontos de Ult: ${st.ultPoints}/${st.maxUltPoints}`}>
                        ⚡{st.ultPoints}/{st.maxUltPoints}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Tactical Timeout Modal */}
      <TacticalTimeoutModal
        isOpen={isTimeoutModalOpen}
        onClose={() => setIsTimeoutModalOpen(false)}
        timeoutsLeft={playerTimeoutsLeft}
        onApplyTimeout={handleApplyTimeout}
      />
    </div>
  );
};
