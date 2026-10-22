import { TeamHistorical, Lineup, DifficultyLevel } from '../types/game';
import { HISTORICAL_TEAMS } from '../data/teams';

export interface DailyChallengeInfo {
  dateStr: string;
  dayName: string;
  themeTitle: string;
  description: string;
  ruleConstraintText: string;
  validateLineup: (lineup: Lineup) => { valid: boolean; reason?: string };
  seedTeams: TeamHistorical[];
}

export interface DailyResultRecord {
  dateStr: string;
  completed: boolean;
  score: number;
  achieved13x0: boolean;
  streak: number;
  difficulty?: DifficultyLevel;
}

const STORAGE_KEYS = {
  DAILY_RESULTS: '13a0_vct_daily_results',
  DAILY_STREAK: '13a0_vct_daily_streak'
};

// Simple deterministic hash based on date string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Deterministic shuffle with seed
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let m = result.length;
  let t: T;
  let i: number;

  while (m) {
    seed = (seed * 9301 + 49297) % 233280;
    i = Math.floor((seed / 233280) * m--);
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }
  return result;
}

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getDailyChallenge(dateStr: string = getTodayDateString()): DailyChallengeInfo {
  const seed = hashString(dateStr);
  const dayOfWeek = new Date(dateStr).getUTCDay(); // 0-6

  const seedTeams = seededShuffle(HISTORICAL_TEAMS, seed);

  switch (dayOfWeek) {
    case 1: // Segunda
      return {
        dateStr,
        dayName: 'Segunda dos Campeões',
        themeTitle: 'A Glória dos Troféus',
        description: 'No primeiro dia da semana, o circuito exige pedigri de campeão.',
        ruleConstraintText: 'Monte sua line com atletas de times Campeões ou Contenders.',
        validateLineup: () => ({ valid: true }),
        seedTeams: seedTeams.filter(t => t.tier === 'CHAMPION' || t.tier === 'CONTENDER')
      };

    case 2: // Terça
      return {
        dateStr,
        dayName: 'Terça Verde e Amarela (VCT BR)',
        themeTitle: 'O Orgulho Brasileiro',
        description: 'O Brasil é o país com maior torcida no VCT mundial.',
        ruleConstraintText: 'Obrigatório ter pelo menos 2 pro players brasileiros (🇧🇷) na sua line-up.',
        validateLineup: (lineup) => {
          const players = Object.values(lineup).filter(Boolean);
          const brCount = players.filter(p => p?.flag === '🇧🇷').length;
          if (brCount < 2) {
            return {
              valid: false,
              reason: `O Desafio de hoje exige ao menos 2 brasileiros na line (você tem ${brCount})!`
            };
          }
          return { valid: true };
        },
        seedTeams
      };

    case 3: // Quarta
      return {
        dateStr,
        dayName: 'Quarta da Zebra (Underdogs)',
        themeTitle: 'A Força do Improvável',
        description: 'Vencer com supertimes é fácil. O desafio de hoje é dar palco às zebras!',
        ruleConstraintText: 'Obrigatório ter pelo menos 1 atleta de equipe Underdog na line.',
        validateLineup: (lineup) => {
          const players = Object.values(lineup).filter(Boolean);
          const hasUnderdog = players.some(p => {
            const team = HISTORICAL_TEAMS.find(t => t.name === p?.team);
            return team?.tier === 'UNDERDOG';
          });
          if (!hasUnderdog) {
            return {
              valid: false,
              reason: 'O Desafio de hoje exige ao menos 1 atleta de equipe Underdog na sua line!'
            };
          }
          return { valid: true };
        },
        seedTeams
      };

    case 4: // Quinta
      return {
        dateStr,
        dayName: 'Quinta dos Pioneiros',
        themeTitle: 'A Era das Origens (2021/2022)',
        description: 'Um tributo às primeiras duas temporadas oficiais do VCT.',
        ruleConstraintText: 'Sorteio composto exclusivamente por equipes lendárias de 2021 e 2022.',
        validateLineup: () => ({ valid: true }),
        seedTeams: seedTeams.filter(t => t.year <= 2022)
      };

    case 5: // Sexta
      return {
        dateStr,
        dayName: 'Sexta W-Gaming',
        themeTitle: 'Agressividade Máxima',
        description: 'Inspirado na Paper Rex: sem medo de entrar nos bombs e trocar tiro.',
        ruleConstraintText: 'Seu Duelista deve ter atributo de Mira (AIM) maior ou igual a 97.',
        validateLineup: (lineup) => {
          if (!lineup.duelista || lineup.duelista.aim < 97) {
            return {
              valid: false,
              reason: 'O Desafio Sexta W-Gaming exige um Duelista com Mira (AIM) 97 ou superior!'
            };
          }
          return { valid: true };
        },
        seedTeams
      };

    case 6: // Sábado
      return {
        dateStr,
        dayName: 'Sábado Hardcore',
        themeTitle: 'O Teste Supremo',
        description: 'O dia mais competitivo do VCT com chave de alto nível.',
        ruleConstraintText: 'Dispute a campanha e tente cravar a pontuação máxima do dia.',
        validateLineup: () => ({ valid: true }),
        seedTeams
      };

    default: // 0: Domingo
      return {
        dateStr,
        dayName: 'Domingo Clássico',
        themeTitle: 'O Clássico do VCT',
        description: 'Baralho completo e balanceado para fechar a semana no topo.',
        ruleConstraintText: 'Line-up completa com as 4 funções e IGL ativo.',
        validateLineup: () => ({ valid: true }),
        seedTeams
      };
  }
}

export function getDailyResult(dateStr: string = getTodayDateString()): DailyResultRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_RESULTS);
    if (!raw) return null;
    const records: Record<string, DailyResultRecord> = JSON.parse(raw);
    return records[dateStr] || null;
  } catch {
    return null;
  }
}

export function saveDailyResult(
  dateStr: string,
  completed: boolean,
  score: number,
  achieved13x0: boolean,
  difficulty: DifficultyLevel = 'MEDIO'
): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_RESULTS);
    const records: Record<string, DailyResultRecord> = raw ? JSON.parse(raw) : {};

    const rawStreak = localStorage.getItem(STORAGE_KEYS.DAILY_STREAK);
    let streak = rawStreak ? parseInt(rawStreak, 10) : 0;
    if (completed) {
      streak += 1;
      localStorage.setItem(STORAGE_KEYS.DAILY_STREAK, streak.toString());
    }

    records[dateStr] = {
      dateStr,
      completed,
      score,
      achieved13x0,
      streak,
      difficulty
    };
    localStorage.setItem(STORAGE_KEYS.DAILY_RESULTS, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save daily result', e);
  }
}

export function getDailyStreak(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_STREAK);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}
