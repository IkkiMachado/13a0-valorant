/**
 * Pro Player Headshots and Official Valorant Agent Portraits
 * High-definition photos stored locally in public/players/ for 100% reliable,
 * instant, zero-CORS loading, paired with Riot Games official Agent display icons.
 */

export const AGENT_ICONS: Record<string, string> = {
  Jett: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png',
  Raze: 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png',
  Reyna: 'https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png',
  Phoenix: 'https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png',
  Yoru: 'https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png',
  Neon: 'https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png',
  Iso: 'https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/displayicon.png',
  Sova: 'https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png',
  Fade: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png',
  Breach: 'https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png',
  Skye: 'https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png',
  'KAY/O': 'https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png',
  KAYO: 'https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png',
  Gekko: 'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png',
  Tejo: 'https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/displayicon.png',
  Omen: 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png',
  Brimstone: 'https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png',
  Viper: 'https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png',
  Astra: 'https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/displayicon.png',
  Harbor: 'https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png',
  Clove: 'https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayicon.png',
  Killjoy: 'https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png',
  Cypher: 'https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png',
  Sage: 'https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png',
  Chamber: 'https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/displayicon.png',
  Deadlock: 'https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/displayicon.png',
  Vyse: 'https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/displayicon.png'
};

export const DEFAULT_AGENT_ICON = AGENT_ICONS.Jett;

/**
 * Local Pro Player Headshots (Stored in public/players/ for zero-CORS fast loading)
 */
export const PLAYER_PHOTOS: Record<string, string> = {
  // === LOUD 2022 (All 5 World Champions) ===
  Aspas: '/players/aspas.png',
  aspas: '/players/aspas.png',
  Sacy: '/players/sacy.png',
  sacy: '/players/sacy.png',
  Saadhak: '/players/saadhak.png',
  saadhak: '/players/saadhak.png',
  pANcada: '/players/pancada.png',
  pancada: '/players/pancada.png',
  Less: '/players/less.png',
  less: '/players/less.png',

  // === Fnatic 2023 (All 5 International Champions) ===
  Derke: '/players/derke.png',
  derke: '/players/derke.png',
  Leo: '/players/leo.png',
  leo: '/players/leo.png',
  Chronicle: '/players/chronicle.png',
  chronicle: '/players/chronicle.png',
  Boaster: '/players/boaster.png',
  boaster: '/players/boaster.png',
  Alfajer: '/players/alfajer.png',
  alfajer: '/players/alfajer.png',

  // === Gambit 2021 (Berlin Champions) ===
  nAts: '/players/nats.png',
  nats: '/players/nats.png',
  Sheydos: '/players/sheydos.png',
  sheydos: '/players/sheydos.png',
  d3ffo: '/players/d3ffo.png',
  Redgar: '/players/redgar.png',
  redgar: '/players/redgar.png',

  // === Sentinels 2021 ===
  TenZ: '/players/tenz.png',
  tenz: '/players/tenz.png',

  // === Evil Geniuses 2023 (Champions 2023) ===
  Jawgemo: '/players/jawgemo.png',
  jawgemo: '/players/jawgemo.png',
  Boostio: '/players/boostio.png',
  boostio: '/players/boostio.png',
  Ethan: '/players/ethan.png',
  ethan: '/players/ethan.png',
  C0M: '/players/c0m.png',
  c0m: '/players/c0m.png',

  // === EDward Gaming 2024 (Champions 2024) ===
  'ZmjjKK (KangKang)': '/players/zmjjkk__kangkang_.png',
  ZmjjKK: '/players/zmjjkk__kangkang_.png',
  zmjjkk: '/players/zmjjkk__kangkang_.png',
  KangKang: '/players/zmjjkk__kangkang_.png',
  kangkang: '/players/zmjjkk__kangkang_.png',
  nobody: '/players/nobody.png',

  // === OpTic Gaming 2022 (Masters Reykjavik Champions - All 5 Players) ===
  yay: '/players/yay.png',
  Marved: '/players/marved.png',
  marved: '/players/marved.png',
  crashies: '/players/crashies.png',
  Victor: '/players/victor.png',
  victor: '/players/victor.png',
  FNS: '/players/fns.png',
  fns: '/players/fns.png',

  // === Leviatán 2024 ===
  kiNgg: '/players/kingg.png',
  kingg: '/players/kingg.png',
  Mazino: '/players/mazino.png',
  mazino: '/players/mazino.png',
  tex: '/players/tex.png',

  // === KRÜ Esports 2021 ===
  keznit: '/players/keznit.png',
  Klaus: '/players/klaus.png',
  klaus: '/players/klaus.png',

  // === Paper Rex 2023 ===
  something: '/players/something.png',
  fForsakeN: '/players/fforsaken.png',
  f0rsakeN: '/players/fforsaken.png',
  forsaken: '/players/fforsaken.png',
  d4v41: '/players/d4v41.png',

  // === DRX 2022 ===
  BuZz: '/players/buzz.png',
  buzz: '/players/buzz.png',
  MaKo: '/players/mako.png',
  mako: '/players/mako.png',
  stax: '/players/stax.png',

  // === Team Heretics 2024 ===
  MiniBoo: '/players/miniboo.png',
  miniboo: '/players/miniboo.png',
  benjyfishy: '/players/benjyfishy.png',

  // === Crazy Raccoon 2021 ===
  Medusa: '/players/medusa.png',
  medusa: '/players/medusa.png',
  Munchkin: '/players/munchkin.png',
  munchkin: '/players/munchkin.png',

  // === FURIA 2022 ===
  mwzera: '/players/mwzera.png'
};

/**
 * Normalizes player name for matching in the photo dictionary
 */
function normalizeName(name: string): string {
  if (!name) return '';
  return name.trim();
}

/**
 * Returns the official Riot Agent display icon
 */
export function getAgentIcon(agentName?: string): string {
  if (!agentName) return DEFAULT_AGENT_ICON;
  const direct = AGENT_ICONS[agentName];
  if (direct) return direct;

  const key = Object.keys(AGENT_ICONS).find(
    (k) => k.toLowerCase() === agentName.toLowerCase()
  );
  return key ? AGENT_ICONS[key] : DEFAULT_AGENT_ICON;
}

/**
 * Returns whether a real pro player photo exists in our database
 */
export function hasRealPlayerPhoto(name: string): boolean {
  const clean = normalizeName(name);
  if (PLAYER_PHOTOS[clean]) return true;

  const key = Object.keys(PLAYER_PHOTOS).find(
    (k) => k.toLowerCase() === clean.toLowerCase()
  );
  return !!key;
}

/**
 * Returns the best available portrait photo for a player:
 * 1. Custom photo URL (if specified on player object)
 * 2. Local high-res pro player photo from public/players/
 * 3. Official Riot Games Agent portrait icon as seamless fallback
 */
export function getPlayerPhoto(
  playerName: string,
  signatureAgent?: string,
  customPhotoUrl?: string
): string {
  if (customPhotoUrl && customPhotoUrl.trim().length > 0) {
    return customPhotoUrl;
  }

  const clean = normalizeName(playerName);

  // Direct match
  if (PLAYER_PHOTOS[clean]) {
    return PLAYER_PHOTOS[clean];
  }

  // Case-insensitive match
  const matchedKey = Object.keys(PLAYER_PHOTOS).find(
    (k) => k.toLowerCase() === clean.toLowerCase()
  );
  if (matchedKey && PLAYER_PHOTOS[matchedKey]) {
    return PLAYER_PHOTOS[matchedKey];
  }

  // Handle special aliases
  if (clean.includes('KangKang') || clean.includes('ZmjjKK')) {
    return PLAYER_PHOTOS['ZmjjKK (KangKang)'];
  }
  if (clean.toLowerCase().includes('forsaken')) {
    return PLAYER_PHOTOS['fForsakeN'];
  }

  // Reliable Fallback: Official Riot Agent portrait
  return getAgentIcon(signatureAgent);
}
