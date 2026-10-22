import { Player, Role } from './game';

export interface ManagerPerk {
  id: string;
  name: string;
  description: string;
  rarity: 'Comum' | 'Rara' | 'Lendária';
  cost: number;
  icon: string;
  effectType: 
    | 'AIM_BOOST'
    | 'LOSS_BONUS'
    | 'ULT_BATTERY'
    | 'RETAKE_SETUP'
    | 'CLUTCH_GENE'
    | 'FIRST_BLOOD'
    | 'COACH_TIMEOUT'
    | 'UNDERDOG_BUFF'
    | 'PISTOL_SPECIALIST'
    | 'DEFENSIVE_WALL'
    | 'TACTICAL_READ'
    | 'CREDIT_INTEREST';
}

export interface PlayerUpgradeStats {
  aimBonus: number;
  gameSenseBonus: number;
  clutchBonus: number;
  level: number;
}

export interface ManagerMatchReward {
  baseAmount: number;
  isVictory: boolean;
  flawlessBonus: number;
  acesBonus: number;
  clutchesBonus: number;
  timeoutBonus: number;
  interestBonus: number;
  total: number;
}
