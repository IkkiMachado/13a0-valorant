import { Lineup, RoundResult, TeamHistorical, DifficultyLevel } from '../types/game';
import { HISTORICAL_TEAMS } from '../data/teams';
import { calculateLineupStats } from './simulation';

/**
 * Checks round-level events (Ace, Clutch, Coach Timeout Win)
 */
export function checkRoundAchievements(
  round: RoundResult,
  triggerAchievement: (id: string) => void
) {
  // Ace
  if (round.isAce && round.winner === 'player') {
    triggerAchievement('ace_club');
  }

  // Clutch
  if (round.clutchPlayer && round.winner === 'player') {
    triggerAchievement('clutch_master');
  }

  // Tactical Timeout Win
  if (round.tacticalTimeoutEvent?.team === 'player' && round.winner === 'player') {
    triggerAchievement('tactical_timeout_win');
  }
}

/**
 * Checks lineup/draft achievements (e.g. Dream Team 96+ OVR)
 */
export function checkDraftAchievements(
  lineup: Lineup,
  triggerAchievement: (id: string) => void
) {
  const stats = calculateLineupStats(lineup);
  if (stats.overall >= 96) {
    triggerAchievement('dream_team_96');
  }
}

/**
 * Checks match-end achievements (13x0, LOUD 2022, Fnatic 2023, OpTic 2022, Ults Used)
 */
export function checkMatchEndAchievements(
  result: {
    playerScore: number;
    opponentScore: number;
    is13x0: boolean;
    playerUltsUsed?: number;
  },
  lineup: Lineup,
  opponentTeam: TeamHistorical,
  triggerAchievement: (id: string) => void
) {
  const playerWon = result.playerScore > result.opponentScore;

  if (playerWon) {
    // First match win
    triggerAchievement('first_blood');

    // 13-0 Flawless
    if (result.is13x0) {
      triggerAchievement('flawless_13_0');
    }

    // Ult storm (3+ ults used)
    if ((result.playerUltsUsed || 0) >= 3) {
      triggerAchievement('ult_storm');
    }

    // Lineup specific achievements
    const playerNames = Object.values(lineup)
      .filter(Boolean)
      .map(p => p?.name.trim().toLowerCase() || '');

    // LOUD 2022 (Aspas, Sacy, Saadhak, pANcada, Less)
    const loudNames = ['aspas', 'sacy', 'saadhak', 'pancada', 'less'];
    if (loudNames.every(req => playerNames.some(p => p.includes(req)))) {
      triggerAchievement('loud_istambul');
    }

    // Fnatic 2023 (Derke, Leo, Chronicle, Boaster, Alfajer)
    const fncNames = ['derke', 'leo', 'chronicle', 'boaster', 'alfajer'];
    if (fncNames.every(req => playerNames.some(p => p.includes(req)))) {
      triggerAchievement('fnc_masters');
    }

    // OpTic 2022 (yay, Marved, crashies, Victor, FNS)
    const opticNames = ['yay', 'marved', 'crashies', 'victor', 'fns'];
    if (opticNames.every(req => playerNames.some(p => p.includes(req)))) {
      triggerAchievement('optic_reykjavik');
    }
  }
}

/**
 * Checks campaign/tournament end achievements
 */
export function checkCampaignEndAchievements(
  isChampion: boolean,
  lineup: Lineup,
  difficulty: DifficultyLevel,
  isDailyMode: boolean,
  campaignsWonCount: number,
  dailyStreak: number,
  triggerAchievement: (id: string) => void
) {
  if (!isChampion) return;

  // First world championship
  triggerAchievement('first_champions');

  // Hardcore Master (Difficulty: DIFÍCIL)
  if (difficulty === 'DIFICIL') {
    triggerAchievement('hardcore_master');
  }

  // Underdog glory
  const draftedPlayers = Object.values(lineup).filter(Boolean);
  const hasUnderdogPlayer = draftedPlayers.some(p => {
    const teamObj = HISTORICAL_TEAMS.find(t => t.name === p?.team);
    return teamObj?.tier === 'UNDERDOG';
  });
  if (hasUnderdogPlayer) {
    triggerAchievement('underdog_glory');
  }

  // Dynasty (3+ titles)
  if (campaignsWonCount >= 3) {
    triggerAchievement('dynasty');
  }

  // Daily Mode
  if (isDailyMode) {
    triggerAchievement('daily_challenger');
    if (dailyStreak >= 3) {
      triggerAchievement('daily_streak_3');
    }
  }
}
