export type Role = 'Duelista' | 'Iniciador' | 'Controlador' | 'Sentinela';
export type TeamTier = 'CHAMPION' | 'CONTENDER' | 'UNDERDOG';

export interface Player {
  id: string;
  name: string;
  team: string;
  era: string; // Ex: "Champions 2022"
  teamBadge: string;
  flag: string;
  role: Role;
  secondaryRoles?: Role[];
  isIGL: boolean;
  rating: number; // 78-99
  aim: number;
  gameSense: number;
  utility: number;
  clutch: number;
  signatureAgent: string;
  availableAgents?: string[];
  isLegend: boolean;
  avatarBg?: string;
  photoUrl?: string;
}

export interface TeamHistorical {
  id: string;
  name: string;
  event: string;
  year: number;
  achievement: string;
  tier: TeamTier;
  region: 'Americas' | 'EMEA' | 'Pacific' | 'China';
  color: string;
  players: Player[];
}

export interface Lineup {
  duelista: Player | null;
  iniciador: Player | null;
  controlador: Player | null;
  sentinela: Player | null;
  igl: Player | null;
}

export type SlotKey = keyof Lineup;

export type GameMode = 'CLASSIC' | 'MANAGER';

export type DifficultyLevel = 'FACIL' | 'MEDIO' | 'DIFICIL';

export interface DifficultyConfig {
  id: DifficultyLevel;
  name: string;
  badge: string;
  color: string;
  teamsPerRoll: number;
  onePlayerPerTeam: boolean;
  rerolls: number;
  hideOVR: boolean;
  description: string;
  badgeTitle: string;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  FACIL: {
    id: 'FACIL',
    name: 'Fácil',
    badge: 'FÁCIL',
    badgeTitle: '1 TIME POR VEZ · 3 ROLLS · OVR VISÍVEL',
    color: 'emerald',
    teamsPerRoll: 1,
    onePlayerPerTeam: true,
    rerolls: 3,
    hideOVR: false,
    description: 'Sorteia 1 time por vez com 3 rolls disponíveis. OVR e estatísticas de todos os atletas ficam visíveis.'
  },
  MEDIO: {
    id: 'MEDIO',
    name: 'Médio',
    badge: 'MÉDIO',
    badgeTitle: '1 TIME POR VEZ · 1 ROLL · OVR VISÍVEL',
    color: 'amber',
    teamsPerRoll: 1,
    onePlayerPerTeam: true,
    rerolls: 1,
    hideOVR: false,
    description: 'Sorteia 1 time por vez com apenas 1 roll disponível. OVR e atributos continuam visíveis.'
  },
  DIFICIL: {
    id: 'DIFICIL',
    name: 'Difícil (Às Cegas)',
    badge: 'DIFÍCIL',
    badgeTitle: '1 TIME POR VEZ · 0 ROLLS · OVR OCULTO (?)',
    color: 'red',
    teamsPerRoll: 1,
    onePlayerPerTeam: true,
    rerolls: 0,
    hideOVR: true,
    description: 'Modo Almanaque Hardcore: 1 time por vez, sem nenhum roll e OVR OCULTO (?). Monte a line apenas pelo seu conhecimento!'
  }
};

export interface AgentUltimateInfo {
  name: string;
  cost: number;
  effect: string;
  icon: string;
}

export const AGENT_ULTIMATES: Record<string, AgentUltimateInfo> = {
  Jett: { name: 'Tormenta de Aço', cost: 8, effect: '+25% First Blood & Adagas Letais', icon: '🗡️' },
  Raze: { name: 'Estraga-Prazeres', cost: 8, effect: 'Dano em Área & Multikill', icon: '🚀' },
  Reyna: { name: 'Imperatriz', cost: 7, effect: 'Velocidade de Disparo & Cura Contínua', icon: '👁️' },
  Neon: { name: 'Sobrecarga', cost: 7, effect: 'Raio Elétrico Contínuo & Velocidade', icon: '⚡' },
  Sova: { name: 'Fúria do Caçador', cost: 8, effect: 'Disparos Através de Paredes & Revelação', icon: '🏹' },
  Fade: { name: 'Queda da Noite', cost: 8, effect: 'Rastro & Ensurdecimento dos Inimigos', icon: '🌑' },
  Breach: { name: 'Onda Trovejante', cost: 8, effect: 'Atordoamento Massivo no Bomb', icon: '💥' },
  Skye: { name: 'Rastreadores', cost: 7, effect: 'Feras Rastreadoras & Cegueira', icon: '🐺' },
  'KAY/O': { name: 'Anular/CMD', cost: 8, effect: 'Suprime Habilidades Inimigas', icon: '🤖' },
  Gekko: { name: 'Thrash', cost: 7, effect: 'Detém e Imobiliza Inimigos', icon: '🦎' },
  Omen: { name: 'Salto das Sombras', cost: 7, effect: 'Teleporte Global & Flanco Perfeito', icon: '👤' },
  Viper: { name: 'Poço Peçonhento', cost: 8, effect: 'Nuvem Tóxica & Bloqueio Total de Bomb', icon: '🧪' },
  Astra: { name: 'Divisora Cósmica', cost: 7, effect: 'Muralha Cósmica Bloqueia Tiros e Som', icon: '✨' },
  Brimstone: { name: 'Ataque Orbital', cost: 8, effect: 'Laser Orbital Devastador no Plant', icon: '🛰️' },
  Clove: { name: 'Ainda Não', cost: 8, effect: 'Ressuscita e Continua no Round', icon: '🦋' },
  Killjoy: { name: 'Confinamento', cost: 9, effect: 'Detém Todos no Bomb por 8s', icon: '🔒' },
  Cypher: { name: 'Assalto Neural', cost: 6, effect: 'Revela Localização Exata de Todos', icon: '📡' },
  Chamber: { name: 'Tour de Force', cost: 8, effect: 'Sniper Personalizada de 1 Tiro Fatal', icon: '🎯' },
  Sage: { name: 'Ressurreição', cost: 8, effect: 'Revive 1 Aliado Imediatamente', icon: '🌿' },
  Iso: { name: 'Contrato de Morte', cost: 7, effect: 'Arena 1v1 Dimensional Forçada', icon: '⚔️' },
  Yoru: { name: 'Espionar Dimensões', cost: 7, effect: 'Invisibilidade e Coleta Segura', icon: '🎭' }
};

export interface UltimateActivation {
  player: string;
  agent: string;
  ultimateName: string;
  icon: string;
  team: 'player' | 'opponent';
}

export interface MapData {
  id: string;
  name: string;
  image: string;
  style: 'Tactical' | 'Aim Heavy' | 'Control Heavy' | 'Aggressive';
}

export interface KillEvent {
  killer: string;
  killerTeam: 'player' | 'opponent';
  victim: string;
  victimTeam: 'player' | 'opponent';
  weapon: string;
  headshot: boolean;
}

export type TacticalTimeoutStrategy = 'RUSH_DUEL' | 'SETUP_CONTROL' | 'IGL_PLAYBOOK';

export interface TacticalTimeoutInfo {
  strategy: TacticalTimeoutStrategy;
  title: string;
  description: string;
  icon: string;
  bonusEffect: string;
}

export const TACTICAL_STRATEGIES: Record<TacticalTimeoutStrategy, TacticalTimeoutInfo> = {
  RUSH_DUEL: {
    strategy: 'RUSH_DUEL',
    title: 'Agressividade & Rush Rápido',
    description: 'Instruções para o Duelista acelerar o bomb site e garantir o First Blood no round.',
    icon: '⚡',
    bonusEffect: '+15% First Blood e +12% de chance no round'
  },
  SETUP_CONTROL: {
    strategy: 'SETUP_CONTROL',
    title: 'Setup Defensivo & Retake',
    description: 'Controle de visão refinado com smokes milimétricas e retenção pesada do Sentinela.',
    icon: '🛡️',
    bonusEffect: 'Anula momentum adversário e +12% de retenção'
  },
  IGL_PLAYBOOK: {
    strategy: 'IGL_PLAYBOOK',
    title: 'Prancheta do IGL & Leitura Tática',
    description: 'Ajuste tático pelo Capitão: organiza a line-up e injeta confiança no elenco.',
    icon: '🧠',
    bonusEffect: '+1 Ponto de Ultimate para toda a line e quebra de ritmo adversário'
  }
};

export interface RoundResult {
  roundNumber: number;
  winner: 'player' | 'opponent';
  playerScore: number;
  opponentScore: number;
  buyType: 'Pistol' | 'Eco' | 'Forçado' | 'Full Buy' | 'Bônus';
  spikeStatus: 'Planted' | 'Defused' | 'Eliminated';
  killFeed: KillEvent[];
  activatedUltimates?: UltimateActivation[];
  tacticalTimeoutEvent?: {
    team: 'player' | 'opponent';
    strategyTitle: string;
    description: string;
  };
  clutchPlayer?: string;
  isFlawless?: boolean;
  isAce?: boolean;
  acePlayer?: string;
}

export interface PlayerStats {
  kills: number;
  deaths: number;
  assists: number;
  clutches: number;
  firstBloods: number;
  ultPoints: number;
  maxUltPoints: number;
  isUltReady: boolean;
  ultsUsed: number;
}

export interface MatchSimulation {
  opponent: TeamHistorical;
  map: MapData;
  stageName: string;
  playerScore: number;
  opponentScore: number;
  rounds: RoundResult[];
  playerStats: Record<string, PlayerStats>;
  opponentStats: Record<string, PlayerStats>;
  isCompleted: boolean;
  is13x0: boolean;
  mvp?: { name: string; kills: number; deaths: number; rating: number };
}

export type TournamentStage = 
  | 'GROUPS_R1' 
  | 'GROUPS_WINNERS' 
  | 'GROUPS_DECIDER' 
  | 'PLAYOFFS_QUARTERS' 
  | 'PLAYOFFS_SEMIS' 
  | 'PLAYOFFS_FINALS' 
  | 'CHAMPION' 
  | 'ELIMINATED';
