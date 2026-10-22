import { ManagerPerk, PlayerUpgradeStats, ManagerMatchReward } from '../types/manager';
import { RoundResult, Player } from '../types/game';

const STORAGE_KEYS = {
  CREDITS: '13a0_vct_manager_credits',
  PERKS: '13a0_vct_manager_perks',
  UPGRADES: '13a0_vct_manager_upgrades'
};

export const INITIAL_MANAGER_CREDITS = 1200;
export const MAX_EQUIPPED_PERKS = 3;

export function getManagerCredits(): number {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CREDITS);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load manager credits', e);
  }
  return INITIAL_MANAGER_CREDITS;
}

export function saveManagerCredits(credits: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CREDITS, credits.toString());
  } catch (e) {
    console.error('Failed to save manager credits', e);
  }
}

export function getEquippedPerks(): ManagerPerk[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PERKS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load manager perks', e);
  }
  return [];
}

export function saveEquippedPerks(perks: ManagerPerk[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PERKS, JSON.stringify(perks));
  } catch (e) {
    console.error('Failed to save manager perks', e);
  }
}

export function getPlayerUpgrades(): Record<string, PlayerUpgradeStats> {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.UPGRADES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load player upgrades', e);
  }
  return {};
}

export function savePlayerUpgrades(upgrades: Record<string, PlayerUpgradeStats>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.UPGRADES, JSON.stringify(upgrades));
  } catch (e) {
    console.error('Failed to save player upgrades', e);
  }
}

export function resetManagerCareer(): {
  credits: number;
  perks: ManagerPerk[];
  upgrades: Record<string, PlayerUpgradeStats>;
} {
  const credits = INITIAL_MANAGER_CREDITS;
  const perks: ManagerPerk[] = [];
  const upgrades: Record<string, PlayerUpgradeStats> = {};

  saveManagerCredits(credits);
  saveEquippedPerks(perks);
  savePlayerUpgrades(upgrades);

  return { credits, perks, upgrades };
}

export function calculateMatchReward(
  result: {
    playerScore: number;
    opponentScore: number;
    is13x0: boolean;
    rounds: RoundResult[];
    totalAces?: number;
    totalClutches?: number;
  },
  currentBalance: number,
  equippedPerks: ManagerPerk[]
): ManagerMatchReward {
  const isVictory = result.playerScore > result.opponentScore;
  const baseAmount = isVictory ? 1000 : 400;
  
  const flawlessBonus = result.is13x0 ? 1000 : 0;
  const dominantBonus = isVictory && result.opponentScore <= 5 && !result.is13x0 ? 350 : 0;
  const acesBonus = (result.totalAces || 0) * 300;
  const clutchesBonus = (result.totalClutches || 0) * 200;
  
  const usedTimeout = result.rounds.some(r => r.tacticalTimeoutEvent?.team === 'player' && r.winner === 'player');
  const timeoutBonus = isVictory && usedTimeout ? 150 : 0;

  const hasInterestPerk = equippedPerks.some(p => p.effectType === 'CREDIT_INTEREST');
  const interestBonus = isVictory && hasInterestPerk ? Math.round(currentBalance * 0.15) : 0;

  const total = baseAmount + flawlessBonus + dominantBonus + acesBonus + clutchesBonus + timeoutBonus + interestBonus;

  return {
    baseAmount,
    isVictory,
    flawlessBonus: flawlessBonus + dominantBonus,
    acesBonus,
    clutchesBonus,
    timeoutBonus,
    interestBonus,
    total
  };
}
