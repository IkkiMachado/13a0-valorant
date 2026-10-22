import { Lineup, DifficultyLevel, RoundResult } from '../types/game';

export interface UserProfile {
  nickname: string;
  favoriteTeam: string;
  tagline: string;
  createdAt: string;
}

export interface UserStats {
  campaignsPlayed: number;
  campaignsWon: number;
  matchesPlayed: number;
  matchesWon: number;
  flawless13x0Count: number;
  totalClutches: number;
  totalAces: number;
  hardcoreWins: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Comum' | 'Rara' | 'Lendária' | 'Mítica';
  unlockedAt: string | null;
}

export interface HallOfFameEntry {
  id: string;
  date: string;
  teamName: string;
  difficulty: DifficultyLevel;
  achieved13x0: boolean;
  lineup: {
    duelista: { name: string; flag: string; agent: string; team?: string };
    iniciador: { name: string; flag: string; agent: string; team?: string };
    controlador: { name: string; flag: string; agent: string; team?: string };
    sentinela: { name: string; flag: string; agent: string; team?: string };
    igl: { name: string; flag: string; agent: string; team?: string };
  };
}

const STORAGE_KEYS = {
  PROFILE: '13a0_vct_profile',
  STATS: '13a0_vct_stats',
  ACHIEVEMENTS: '13a0_vct_achievements',
  HALL_OF_FAME: '13a0_vct_hall_of_fame'
};

const DEFAULT_PROFILE: UserProfile = {
  nickname: 'ProPlayer',
  favoriteTeam: 'LOUD',
  tagline: 'Em busca do 13 a 0',
  createdAt: new Date().toISOString()
};

const DEFAULT_STATS: UserStats = {
  campaignsPlayed: 0,
  campaignsWon: 0,
  matchesPlayed: 0,
  matchesWon: 0,
  flawless13x0Count: 0,
  totalClutches: 0,
  totalAces: 0,
  hardcoreWins: 0
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'Primeiro Disparo',
    description: 'Vença sua primeira partida em qualquer modo do jogo.',
    icon: '🎯',
    rarity: 'Comum',
    unlockedAt: null
  },
  {
    id: 'flawless_13_0',
    title: '13 a 0 Flawless',
    description: 'Vença uma partida sem perder um único round (13x0 absoluto).',
    icon: '⭐',
    rarity: 'Mítica',
    unlockedAt: null
  },
  {
    id: 'first_champions',
    title: 'Campeão Mundial',
    description: 'Levante o troféu do VCT Champions pela primeira vez.',
    icon: '🏆',
    rarity: 'Rara',
    unlockedAt: null
  },
  {
    id: 'dynasty',
    title: 'Dinastia do VCT',
    description: 'Conquiste 3 títulos mundiais de Champions na sua carreira.',
    icon: '👑',
    rarity: 'Lendária',
    unlockedAt: null
  },
  {
    id: 'hardcore_master',
    title: 'Mestre da Tática',
    description: 'Conquiste o Champions no Modo Difícil (Às Cegas / OVR Oculto).',
    icon: '🧠',
    rarity: 'Lendária',
    unlockedAt: null
  },
  {
    id: 'underdog_glory',
    title: 'Zebra Heroica',
    description: 'Seja campeão com pelo menos 1 atleta de equipe Underdog na line.',
    icon: '🔥',
    rarity: 'Rara',
    unlockedAt: null
  },
  {
    id: 'daily_challenger',
    title: 'Rotina de Pro',
    description: 'Vença o VCT Champions no Modo Desafio do Dia.',
    icon: '📅',
    rarity: 'Rara',
    unlockedAt: null
  },
  {
    id: 'daily_streak_3',
    title: 'Em Chamas',
    description: 'Mantenha uma sequência de 3 vitórias no Desafio do Dia.',
    icon: '⚡',
    rarity: 'Lendária',
    unlockedAt: null
  },
  {
    id: 'ace_club',
    title: 'Penta Kill (Ace!)',
    description: 'Presencie um Ace com 5 eliminações de um único atleta em um round.',
    icon: '💥',
    rarity: 'Rara',
    unlockedAt: null
  },
  {
    id: 'clutch_master',
    title: 'Sangue Frio',
    description: 'Vença um round em situação heroica de Clutch (1vX).',
    icon: '🧤',
    rarity: 'Rara',
    unlockedAt: null
  },
  {
    id: 'loud_istambul',
    title: 'Eles Não Passarão',
    description: 'Escale os 5 titulares da LOUD 2022 (Aspas, Sacy, Saadhak, pANcada, Less) e vença.',
    icon: '🇧🇷',
    rarity: 'Lendária',
    unlockedAt: null
  },
  {
    id: 'fnc_masters',
    title: 'Dinastia Laranja',
    description: 'Escale os 5 titulares da Fnatic 2023 (Derke, Leo, Chronicle, Boaster, Alfajer) e vença.',
    icon: '🇪🇺',
    rarity: 'Lendária',
    unlockedAt: null
  },
  {
    id: 'optic_reykjavik',
    title: 'Mestres de Reykjavik',
    description: 'Escale os 5 titulares da OpTic 2022 (yay, Marved, crashies, Victor, FNS) e vença.',
    icon: '🇺🇸',
    rarity: 'Lendária',
    unlockedAt: null
  },
  {
    id: 'tactical_timeout_win',
    title: 'Parada Providencial',
    description: 'Peça uma Pausa do Coach e vença o round com o plano tático.',
    icon: '🎧',
    rarity: 'Comum',
    unlockedAt: null
  },
  {
    id: 'ult_storm',
    title: 'Tempestade Radiante',
    description: 'Ative 3 ou mais Ultimates da sua equipe em uma única partida.',
    icon: '💫',
    rarity: 'Rara',
    unlockedAt: null
  },
  {
    id: 'dream_team_96',
    title: 'Galácticos do VCT',
    description: 'Monte um elenco com média Geral (OVR) igual ou superior a 96.',
    icon: '🌟',
    rarity: 'Lendária',
    unlockedAt: null
  }
];

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    return raw ? JSON.parse(raw) : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

export function getAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!raw) return INITIAL_ACHIEVEMENTS;
    const saved: Achievement[] = JSON.parse(raw);
    // Merge with defaults in case new achievements were added
    return INITIAL_ACHIEVEMENTS.map(def => {
      const match = saved.find(s => s.id === def.id);
      return match || def;
    });
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function unlockAchievement(achievementId: string): Achievement | null {
  try {
    const list = getAchievements();
    const item = list.find(a => a.id === achievementId);
    if (item && !item.unlockedAt) {
      item.unlockedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(list));
      return item;
    }
  } catch (e) {
    console.error('Failed to unlock achievement', e);
  }
  return null;
}

export function getHallOfFame(): HallOfFameEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HALL_OF_FAME);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHallOfFameEntry(
  lineup: Lineup,
  difficulty: DifficultyLevel,
  achieved13x0: boolean
): void {
  try {
    const list = getHallOfFame();
    const entry: HallOfFameEntry = {
      id: `hof_${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      teamName: `ALL-STAR VCT #${list.length + 1}`,
      difficulty,
      achieved13x0,
      lineup: {
        duelista: {
          name: lineup.duelista?.name || 'Duelista',
          flag: lineup.duelista?.flag || '🏳️',
          agent: lineup.duelista?.signatureAgent || 'Jett',
          team: lineup.duelista?.team || 'VCT'
        },
        iniciador: {
          name: lineup.iniciador?.name || 'Iniciador',
          flag: lineup.iniciador?.flag || '🏳️',
          agent: lineup.iniciador?.signatureAgent || 'Sova',
          team: lineup.iniciador?.team || 'VCT'
        },
        controlador: {
          name: lineup.controlador?.name || 'Controlador',
          flag: lineup.controlador?.flag || '🏳️',
          agent: lineup.controlador?.signatureAgent || 'Omen',
          team: lineup.controlador?.team || 'VCT'
        },
        sentinela: {
          name: lineup.sentinela?.name || 'Sentinela',
          flag: lineup.sentinela?.flag || '🏳️',
          agent: lineup.sentinela?.signatureAgent || 'Killjoy',
          team: lineup.sentinela?.team || 'VCT'
        },
        igl: {
          name: lineup.igl?.name || 'IGL',
          flag: lineup.igl?.flag || '🏳️',
          agent: lineup.igl?.signatureAgent || 'Capitão',
          team: lineup.igl?.team || 'VCT'
        }
      }
    };
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.HALL_OF_FAME, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to add to hall of fame', e);
  }
}

export function calculateUserRank(stats: UserStats, achievements: Achievement[]): {
  tierName: string;
  tierColor: string;
  badge: string;
} {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  if (stats.flawless13x0Count >= 1 && stats.campaignsWon >= 3 && stats.hardcoreWins >= 1) {
    return { tierName: 'RADIANTE VCT', tierColor: 'text-amber-400', badge: '👑 RADIANTE' };
  }
  if (stats.flawless13x0Count >= 1 || stats.campaignsWon >= 2) {
    return { tierName: 'IMORTAL', tierColor: 'text-rose-500', badge: '⚡ IMORTAL' };
  }
  if (stats.campaignsWon >= 1) {
    return { tierName: 'ASCENDENTE', tierColor: 'text-emerald-400', badge: '🛡️ ASCENDENTE' };
  }
  if (stats.matchesWon >= 2) {
    return { tierName: 'DIAMANTE', tierColor: 'text-cyan-400', badge: '💎 DIAMANTE' };
  }
  return { tierName: 'ASPIRANTE VCT', tierColor: 'text-slate-400', badge: '🔰 ASPIRANTE' };
}
