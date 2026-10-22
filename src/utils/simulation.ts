import { Lineup, TeamHistorical, MapData, RoundResult, KillEvent, PlayerStats, AGENT_ULTIMATES, UltimateActivation, TacticalTimeoutStrategy } from '../types/game';
import { ManagerPerk, PlayerUpgradeStats } from '../types/manager';

const WEAPONS_PISTOL = ['Ghost', 'Classic', 'Sheriff', 'Frenzy'];
const WEAPONS_ECO = ['Stinger', 'Sheriff', 'Marshal', 'Classic'];
const WEAPONS_FORCE = ['Spectre', 'Judge', 'Bulldog', 'Guardian'];
const WEAPONS_FULL = ['Vandal', 'Phantom', 'Operator', 'Odin'];

// Helper to choose random item from array
function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Calculate team overall strength
export function calculateLineupStats(
  lineup: Lineup,
  managerPerks?: ManagerPerk[],
  playerUpgrades?: Record<string, PlayerUpgradeStats>
) {
  const players = Object.values(lineup).filter(Boolean);
  if (players.length === 0) return { overall: 0, aim: 0, utility: 0, clutch: 0, hasIGL: false };

  // Underdog perk bonus
  const hasUnderdogBuff = managerPerks?.some(p => p.effectType === 'UNDERDOG_BUFF');
  const minRating = Math.min(...players.map(p => p?.rating || 99));

  let totalRating = 0;
  let totalAim = 0;
  let totalUtility = 0;
  let totalClutch = 0;

  for (const p of players) {
    if (!p) continue;
    const up = playerUpgrades?.[p.name];
    let rating = p.rating + (up ? up.level : 0);
    let aim = p.aim + (up ? up.aimBonus : 0);
    let utility = p.utility + (up ? up.gameSenseBonus : 0);
    let clutch = p.clutch + (up ? up.clutchBonus : 0);

    if (managerPerks?.some(perk => perk.effectType === 'AIM_BOOST')) {
      aim += 3;
    }

    if (hasUnderdogBuff && p.rating === minRating) {
      rating += 6;
    }

    totalRating += rating;
    totalAim += aim;
    totalUtility += utility;
    totalClutch += clutch;
  }

  // Check if lineup has an IGL
  const hasIGL = players.some(p => p?.isIGL);
  
  // Role diversity check
  const roles = new Set(players.map(p => p?.role));
  const hasAllRoles = roles.has('Duelista') && roles.has('Iniciador') && roles.has('Controlador') && roles.has('Sentinela');

  let synergyBonus = 0;
  if (hasAllRoles) synergyBonus += 2;
  if (hasIGL) synergyBonus += 3;
  else synergyBonus -= 4; // Penalty for having no IGL!

  const count = players.length;
  return {
    overall: Math.round(totalRating / count + synergyBonus),
    aim: Math.round(totalAim / count),
    utility: Math.round(totalUtility / count),
    clutch: Math.round(totalClutch / count),
    hasIGL,
    hasAllRoles
  };
}

export function simulateRound(
  roundNum: number,
  playerScore: number,
  opponentScore: number,
  playerLineup: Lineup,
  opponentTeam: TeamHistorical,
  playerEconomyStreak: number, // positive = player win streak, negative = opponent streak
  playerStatsState?: Record<string, PlayerStats>,
  opponentStatsState?: Record<string, PlayerStats>,
  timeoutBoost?: {
    team: 'player' | 'opponent';
    strategy: TacticalTimeoutStrategy;
    title: string;
    description: string;
  } | null,
  managerPerks?: ManagerPerk[],
  playerUpgrades?: Record<string, PlayerUpgradeStats>
): RoundResult {
  const playerPlayers = Object.values(playerLineup).filter(Boolean);
  const opponentPlayers = opponentTeam.players;

  const playerStats = calculateLineupStats(playerLineup, managerPerks, playerUpgrades);
  const oppAvgRating = Math.round(
    opponentPlayers.reduce((acc, p) => acc + p.rating, 0) / opponentPlayers.length
  );

  // Determine round economy type
  const isPistol = roundNum === 1 || roundNum === 13;
  let buyType: RoundResult['buyType'] = 'Full Buy';
  let weaponPool = WEAPONS_FULL;

  if (isPistol) {
    buyType = 'Pistol';
    weaponPool = WEAPONS_PISTOL;
  } else if (roundNum === 2 || roundNum === 14) {
    buyType = 'Bônus';
    weaponPool = WEAPONS_FORCE;
  } else if (playerEconomyStreak < -1 && Math.random() > 0.4) {
    buyType = 'Eco';
    weaponPool = WEAPONS_ECO;
  } else if (playerEconomyStreak < 0 && Math.random() > 0.5) {
    buyType = 'Forçado';
    weaponPool = WEAPONS_FORCE;
  }

  // Check and trigger ready Ultimates
  const activatedUltimates: UltimateActivation[] = [];
  let playerUltBonus = 0;
  let opponentUltBonus = 0;
  let isKayoSuppressed = false;

  // Player team ultimates
  if (playerStatsState && !isPistol && buyType !== 'Eco') {
    for (const p of playerPlayers) {
      const st = playerStatsState[p.name];
      if (st && st.isUltReady && Math.random() < 0.65) {
        const ultInfo = AGENT_ULTIMATES[p.signatureAgent] || AGENT_ULTIMATES.Jett;
        activatedUltimates.push({
          player: p.name,
          agent: p.signatureAgent,
          ultimateName: ultInfo.name,
          icon: ultInfo.icon,
          team: 'player'
        });
        playerUltBonus += 0.14;
        if (p.signatureAgent === 'KAY/O') {
          isKayoSuppressed = true;
        }
      }
    }
  }

  // Opponent team ultimates
  if (opponentStatsState && !isPistol && buyType !== 'Eco' && !isKayoSuppressed) {
    for (const p of opponentPlayers) {
      const st = opponentStatsState[p.name];
      if (st && st.isUltReady && Math.random() < 0.65) {
        const ultInfo = AGENT_ULTIMATES[p.signatureAgent] || AGENT_ULTIMATES.Jett;
        activatedUltimates.push({
          player: p.name,
          agent: p.signatureAgent,
          ultimateName: ultInfo.name,
          icon: ultInfo.icon,
          team: 'opponent'
        });
        opponentUltBonus += 0.14;
      }
    }
  }

  // Calculate base win probability (50% base +/- stat diff)
  let playerWinProb = 0.50 + ((playerStats.overall - oppAvgRating) * 0.025);

  // Economy modifier with manager perk support
  if (!isPistol) {
    if (playerEconomyStreak > 1) {
      playerWinProb += 0.08;
    } else if (playerEconomyStreak < -1) {
      // Loss bonus perk softens economic penalty
      if (managerPerks?.some(p => p.effectType === 'LOSS_BONUS')) {
        playerWinProb -= 0.03;
      } else {
        playerWinProb -= 0.08;
      }
    }
  } else {
    // Pistol round: Pistol Specialist perk provides massive boost
    if (managerPerks?.some(p => p.effectType === 'PISTOL_SPECIALIST')) {
      playerWinProb += 0.22;
    }
  }

  // Manager perks passive combat boosts
  if (managerPerks) {
    for (const perk of managerPerks) {
      if (perk.effectType === 'AIM_BOOST') playerWinProb += 0.04;
      if (perk.effectType === 'RETAKE_SETUP') playerWinProb += 0.04;
      if (perk.effectType === 'DEFENSIVE_WALL') playerWinProb += 0.04;
      if (perk.effectType === 'TACTICAL_READ') playerWinProb += 0.05;
    }
  }

  // Apply Ultimate impact
  playerWinProb += (playerUltBonus - opponentUltBonus);

  // Apply Tactical Timeout Boost (boosted if Coach Radiante perk is equipped)
  if (timeoutBoost) {
    const coachMultiplier = managerPerks?.some(p => p.effectType === 'COACH_TIMEOUT') ? 1.5 : 1.0;
    if (timeoutBoost.team === 'player') {
      if (timeoutBoost.strategy === 'RUSH_DUEL') playerWinProb += (0.14 * coachMultiplier);
      else if (timeoutBoost.strategy === 'SETUP_CONTROL') playerWinProb += (0.13 * coachMultiplier);
      else if (timeoutBoost.strategy === 'IGL_PLAYBOOK') playerWinProb += (0.11 * coachMultiplier);
    } else {
      playerWinProb -= 0.13;
    }
  }

  // Clamp probability between 10% and 92%
  playerWinProb = Math.max(0.10, Math.min(0.92, playerWinProb));

  const playerWon = Math.random() < playerWinProb;
  const newPlayerScore = playerWon ? playerScore + 1 : playerScore;
  const newOpponentScore = playerWon ? opponentScore : opponentScore + 1;

  // Generate kill feed & round narrative
  // Generate kill feed & round narrative with strict Valorant rules:
  // 1. Each player can die at most ONCE in a single round.
  // 2. Only currently alive players can make kills.
  // 3. Losing team has all 5 players eliminated (5 deaths).
  // 4. Winning team has 0 casualties (if Flawless) or 1-3 casualties (if not Flawless).
  // 5. Total round kills == Total round deaths (between 5 and 8 max).
  const killFeed: KillEvent[] = [];
  const winningTeam: 'player' | 'opponent' = playerWon ? 'player' : 'opponent';
  const losingTeam: 'player' | 'opponent' = playerWon ? 'opponent' : 'player';

  const hasDuelistUlt = activatedUltimates.some(
    u => (u.agent === 'Raze' || u.agent === 'Jett') && u.team === winningTeam
  );
  const isFlawless = Math.random() < 0.22;
  const isAce = !isFlawless && Math.random() < (hasDuelistUlt ? 0.20 : 0.08);
  let acePlayer: string | undefined = undefined;

  const winnersList = playerWon ? [...playerPlayers] : [...opponentPlayers];
  const losersList = playerWon ? [...opponentPlayers] : [...playerPlayers];

  // Helper to pick weapon for a kill
  const getKillWeapon = (killerName: string, killerAgent: string, kTeam: 'player' | 'opponent') => {
    const hasUlt = activatedUltimates.some(u => u.player === killerName && u.team === kTeam);
    if (hasUlt && ['Raze', 'Jett', 'Chamber', 'Neon', 'Sova'].includes(killerAgent)) {
      return 'Ultimate';
    }
    if (killerAgent === 'Jett' || killerAgent === 'Chamber') {
      if (Math.random() < 0.45) return 'Operator';
    }
    return pickRandom(weaponPool);
  };

  if (isAce) {
    const aceStar = playerWon
      ? (playerLineup.duelista?.name || pickRandom(winnersList).name)
      : pickRandom(winnersList).name;
    acePlayer = aceStar;

    // In an Ace, aceStar kills all 5 losers
    // If not flawless, losers might trade 1 or 2 teammates of aceStar first
    const aliveTeammates = winnersList.filter(p => p.name !== aceStar);
    const casualtiesCount = isFlawless ? 0 : Math.min(aliveTeammates.length, Math.floor(Math.random() * 2) + 1);

    // Losers get their kills on teammates before being eliminated
    for (let c = 0; c < casualtiesCount; c++) {
      if (aliveTeammates.length > 0 && losersList.length > 0) {
        const victimIdx = Math.floor(Math.random() * aliveTeammates.length);
        const victim = aliveTeammates.splice(victimIdx, 1)[0];
        const killer = pickRandom(losersList);
        killFeed.push({
          killer: killer.name,
          killerTeam: losingTeam,
          victim: victim.name,
          victimTeam: winningTeam,
          weapon: getKillWeapon(killer.name, killer.signatureAgent, losingTeam),
          headshot: Math.random() > 0.5
        });
      }
    }

    // aceStar eliminates all 5 losers
    const acePlayerObj = winnersList.find(p => p.name === aceStar) || winnersList[0];
    for (const loser of losersList) {
      killFeed.push({
        killer: aceStar,
        killerTeam: winningTeam,
        victim: loser.name,
        victimTeam: losingTeam,
        weapon: getKillWeapon(aceStar, acePlayerObj.signatureAgent, winningTeam),
        headshot: Math.random() > 0.45
      });
    }
  } else {
    // Normal round skirmishes
    const aliveWinners = [...winnersList];
    const aliveLosers = [...losersList];
    let remainingWinnerCasualties = isFlawless ? 0 : Math.min(3, Math.floor(Math.random() * 3) + 1);

    // First Blood event with perk influence:
    const hasFbPerk = managerPerks?.some(p => p.effectType === 'FIRST_BLOOD');
    const fbBaseRate = playerWon && hasFbPerk ? 0.84 : 0.65;
    const fbToWinner = remainingWinnerCasualties === 0 || Math.random() < fbBaseRate;
    if (fbToWinner) {
      const killer = pickRandom(aliveWinners);
      const victimIdx = Math.floor(Math.random() * aliveLosers.length);
      const victim = aliveLosers.splice(victimIdx, 1)[0];
      killFeed.push({
        killer: killer.name,
        killerTeam: winningTeam,
        victim: victim.name,
        victimTeam: losingTeam,
        weapon: getKillWeapon(killer.name, killer.signatureAgent, winningTeam),
        headshot: Math.random() > 0.45
      });
    } else {
      const killer = pickRandom(aliveLosers);
      const victimIdx = Math.floor(Math.random() * aliveWinners.length);
      const victim = aliveWinners.splice(victimIdx, 1)[0];
      remainingWinnerCasualties--;
      killFeed.push({
        killer: killer.name,
        killerTeam: losingTeam,
        victim: victim.name,
        victimTeam: winningTeam,
        weapon: getKillWeapon(killer.name, killer.signatureAgent, losingTeam),
        headshot: Math.random() > 0.5
      });
    }

    // Mid-round & site execute trades until all losers are eliminated
    while (aliveLosers.length > 0) {
      // Chance of a trade/casualty on the winning team if remaining casualties exist
      const shouldLoseCasualty = remainingWinnerCasualties > 0 && aliveWinners.length > 1 && Math.random() < 0.45;

      if (shouldLoseCasualty) {
        const killer = pickRandom(aliveLosers);
        const victimIdx = Math.floor(Math.random() * aliveWinners.length);
        const victim = aliveWinners.splice(victimIdx, 1)[0];
        remainingWinnerCasualties--;
        killFeed.push({
          killer: killer.name,
          killerTeam: losingTeam,
          victim: victim.name,
          victimTeam: winningTeam,
          weapon: getKillWeapon(killer.name, killer.signatureAgent, losingTeam),
          headshot: Math.random() > 0.5
        });
      } else {
        // Winning team eliminates a loser
        const killer = pickRandom(aliveWinners);
        const victimIdx = Math.floor(Math.random() * aliveLosers.length);
        const victim = aliveLosers.splice(victimIdx, 1)[0];
        killFeed.push({
          killer: killer.name,
          killerTeam: winningTeam,
          victim: victim.name,
          victimTeam: losingTeam,
          weapon: getKillWeapon(killer.name, killer.signatureAgent, winningTeam),
          headshot: Math.random() > 0.48
        });
      }
    }
  }

  // Spike event
  let spikeStatus: RoundResult['spikeStatus'] = 'Eliminated';
  if (Math.random() > 0.4) {
    spikeStatus = playerWon ? 'Defused' : 'Planted';
  }

  // Clutch detection with Clutch Gene perk influence
  let clutchPlayer: string | undefined = undefined;
  const hasClutchGenePerk = managerPerks?.some(p => p.effectType === 'CLUTCH_GENE');
  const clutchDetectionRate = hasClutchGenePerk ? 0.35 : 0.20;
  const clutchRatingThreshold = hasClutchGenePerk ? 86 : 94;

  if (!isFlawless && Math.random() < clutchDetectionRate) {
    const candidate = playerWon ? pickRandom(playerPlayers) : pickRandom(opponentPlayers);
    if (candidate && (candidate.clutch >= clutchRatingThreshold || (playerWon && hasClutchGenePerk))) {
      clutchPlayer = candidate.name;
    }
  }

  return {
    roundNumber: roundNum,
    winner: playerWon ? 'player' : 'opponent',
    playerScore: newPlayerScore,
    opponentScore: newOpponentScore,
    buyType,
    spikeStatus,
    killFeed,
    activatedUltimates,
    tacticalTimeoutEvent: timeoutBoost ? {
      team: timeoutBoost.team,
      strategyTitle: timeoutBoost.title,
      description: timeoutBoost.description
    } : undefined,
    clutchPlayer,
    isFlawless,
    isAce,
    acePlayer
  };
}

export function initPlayerStatsRecord(
  players: { name: string; signatureAgent?: string }[],
  bonusUltPoints: number = 0
): Record<string, PlayerStats> {
  const stats: Record<string, PlayerStats> = {};
  for (const p of players) {
    const agent = p.signatureAgent || 'Jett';
    const ultCost = AGENT_ULTIMATES[agent]?.cost || 8;
    const initialPoints = Math.min(ultCost, Math.floor(Math.random() * 3) + bonusUltPoints);
    stats[p.name] = {
      kills: 0,
      deaths: 0,
      assists: 0,
      clutches: 0,
      firstBloods: 0,
      ultPoints: initialPoints,
      maxUltPoints: ultCost,
      isUltReady: initialPoints >= ultCost,
      ultsUsed: 0
    };
  }
  return stats;
}

export function updateStatsWithRound(
  round: RoundResult,
  playerStats: Record<string, PlayerStats>,
  opponentStats: Record<string, PlayerStats>
) {
  // If an ultimate was activated during the round, consume it
  if (round.activatedUltimates) {
    for (const ult of round.activatedUltimates) {
      const target = ult.team === 'player' ? playerStats : opponentStats;
      if (target[ult.player]) {
        target[ult.player].ultPoints = 0;
        target[ult.player].isUltReady = false;
        target[ult.player].ultsUsed += 1;
      }
    }
  }

  round.killFeed.forEach((kill, idx) => {
    // Killer stats
    const kTarget = kill.killerTeam === 'player' ? playerStats : opponentStats;
    if (kTarget[kill.killer]) {
      kTarget[kill.killer].kills += 1;
      if (idx === 0) {
        kTarget[kill.killer].firstBloods += 1;
      }
      // Grant +1 ult point for each kill
      kTarget[kill.killer].ultPoints += 1;
      if (kTarget[kill.killer].ultPoints >= kTarget[kill.killer].maxUltPoints) {
        kTarget[kill.killer].isUltReady = true;
      }
    }

    // Victim stats
    const vTarget = kill.victimTeam === 'player' ? playerStats : opponentStats;
    if (vTarget[kill.victim]) {
      vTarget[kill.victim].deaths += 1;
      // Grant +1 ult point on death
      vTarget[kill.victim].ultPoints += 1;
      if (vTarget[kill.victim].ultPoints >= vTarget[kill.victim].maxUltPoints) {
        vTarget[kill.victim].isUltReady = true;
      }
    }
  });

  if (round.clutchPlayer) {
    if (playerStats[round.clutchPlayer]) playerStats[round.clutchPlayer].clutches += 1;
    if (opponentStats[round.clutchPlayer]) opponentStats[round.clutchPlayer].clutches += 1;
  }
}

export function clonePlayerStats(stats: Record<string, PlayerStats>): Record<string, PlayerStats> {
  const cloned: Record<string, PlayerStats> = {};
  for (const [key, value] of Object.entries(stats)) {
    cloned[key] = { ...value };
  }
  return cloned;
}
