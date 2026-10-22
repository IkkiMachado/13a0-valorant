import { ManagerPerk } from '../types/manager';
import { Player } from '../types/game';
import { HISTORICAL_TEAMS } from './teams';

export const ALL_MANAGER_PERKS: ManagerPerk[] = [
  {
    id: 'aim_diff',
    name: 'Mira de Elite (Aim Diff)',
    description: '+3 de Mira e combate para todos os atletas do seu elenco.',
    rarity: 'Rara',
    cost: 800,
    icon: '🎯',
    effectType: 'AIM_BOOST'
  },
  {
    id: 'loss_bonus',
    name: 'Gestão Econômica',
    description: 'Minimiza o impacto financeiro de rounds perdidos, permitindo armamento melhor.',
    rarity: 'Comum',
    cost: 500,
    icon: '💰',
    effectType: 'LOSS_BONUS'
  },
  {
    id: 'ult_battery',
    name: 'Sobrecarga de Energia',
    description: 'Todos os seus atletas iniciam a partida com +2 Pontos de Ultimate já carregados.',
    rarity: 'Lendária',
    cost: 1200,
    icon: '⚡',
    effectType: 'ULT_BATTERY'
  },
  {
    id: 'retake_setup',
    name: 'Setup de Retake',
    description: '+20% de eficiência em defuses de spike e reconquista de bomb sites.',
    rarity: 'Rara',
    cost: 750,
    icon: '🛡️',
    effectType: 'RETAKE_SETUP'
  },
  {
    id: 'clutch_gene',
    name: 'Gene do Clutch',
    description: 'Quando restar apenas 1 jogador vivo, o clutch rating dele é elevado em +25%.',
    rarity: 'Lendária',
    cost: 1100,
    icon: '👑',
    effectType: 'CLUTCH_GENE'
  },
  {
    id: 'first_blood_hunter',
    name: 'Agressão de Abertura',
    description: 'Duelistas têm +25% de probabilidade de vencer o duelo de First Blood no round.',
    rarity: 'Rara',
    cost: 800,
    icon: '🩸',
    effectType: 'FIRST_BLOOD'
  },
  {
    id: 'coach_radiante',
    name: 'Coach Radiante VCT',
    description: 'Garante +1 Pausa Tática adicional (3 no total) e aumenta o bônus tático em 50%.',
    rarity: 'Lendária',
    cost: 1000,
    icon: '🎧',
    effectType: 'COACH_TIMEOUT'
  },
  {
    id: 'underdog_energy',
    name: 'Café Tático (Booster)',
    description: 'O atleta de menor Overall do seu elenco recebe +6 de OVR temporário.',
    rarity: 'Comum',
    cost: 450,
    icon: '☕',
    effectType: 'UNDERDOG_BUFF'
  },
  {
    id: 'pistol_specialist',
    name: 'Mão Pesada de Pistol',
    description: '+30% de chance de vencer os rounds Pistols cruciais (Round 1 e Round 13).',
    rarity: 'Comum',
    cost: 550,
    icon: '🔫',
    effectType: 'PISTOL_SPECIALIST'
  },
  {
    id: 'defensive_wall',
    name: 'Muralha Defensiva',
    description: 'Sentinelas e Controladores ganham +15% de sobrevivência e retenção no lado defensor.',
    rarity: 'Rara',
    cost: 700,
    icon: '🧱',
    effectType: 'DEFENSIVE_WALL'
  },
  {
    id: 'tactical_read',
    name: 'Leitura Antecipada',
    description: 'Análise antecipada das jogadas adversárias, reduzindo mortes sofridas por headshot.',
    rarity: 'Lendária',
    cost: 1300,
    icon: '🔮',
    effectType: 'TACTICAL_READ'
  },
  {
    id: 'credit_interest',
    name: 'Investimento em Patrocínio',
    description: 'Rende +15% de juros sobre o saldo de Créditos guardado após cada vitória.',
    rarity: 'Comum',
    cost: 600,
    icon: '📈',
    effectType: 'CREDIT_INTEREST'
  }
];

export function getRandomPerks(count: number, excludedIds: string[] = []): ManagerPerk[] {
  const available = ALL_MANAGER_PERKS.filter(p => !excludedIds.includes(p.id));
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function calculatePlayerPrice(rating: number, isLegend: boolean): number {
  const base = Math.max(500, Math.round((rating - 75) * 45 + 300));
  return isLegend ? base + 300 : base;
}

export function getRandomScoutPlayers(count: number, currentLineupPlayerNames: string[] = []): { player: Player; cost: number }[] {
  const allPlayers = HISTORICAL_TEAMS.flatMap(t => t.players);
  const normalizedCurrentNames = currentLineupPlayerNames.map(n => n.trim().toLowerCase());
  
  const eligible = allPlayers.filter(p => !normalizedCurrentNames.includes(p.name.trim().toLowerCase()));
  const shuffled = [...eligible].sort(() => 0.5 - Math.random());
  
  // Pick distinct roles if possible
  const selected: Player[] = [];
  for (const p of shuffled) {
    if (!selected.some(s => s.name === p.name)) {
      selected.push(p);
    }
    if (selected.length >= count) break;
  }

  return selected.map(p => ({
    player: p,
    cost: calculatePlayerPrice(p.rating, p.isLegend)
  }));
}
