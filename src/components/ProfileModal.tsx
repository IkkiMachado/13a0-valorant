import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  UserStats,
  Achievement,
  HallOfFameEntry,
  calculateUserRank,
  saveUserProfile
} from '../utils/storage';
import { getPlayerPhoto, getAgentIcon } from '../utils/playerPhotos';
import { X, Trophy, Award, Shield, User, Sparkles, Check, Lock, Edit3, Flame, Star, History, Filter } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  stats: UserStats;
  achievements: Achievement[];
  hallOfFame: HallOfFameEntry[];
  initialTab?: 'CARD' | 'ACHIEVEMENTS' | 'HALL_OF_FAME';
  onProfileUpdated: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  stats,
  achievements,
  hallOfFame,
  initialTab = 'CARD',
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'CARD' | 'ACHIEVEMENTS' | 'HALL_OF_FAME'>(initialTab);
  const [filterRarity, setFilterRarity] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editNick, setEditNick] = useState(profile.nickname);
  const [editTeam, setEditTeam] = useState(profile.favoriteTeam);
  const [editTagline, setEditTagline] = useState(profile.tagline);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const userRank = calculateUserRank(stats, achievements);
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  const filteredAchievements = achievements.filter(ach => {
    if (filterRarity === 'UNLOCKED') return !!ach.unlockedAt;
    if (filterRarity === 'LOCKED') return !ach.unlockedAt;
    if (filterRarity === 'ALL') return true;
    return ach.rarity === filterRarity;
  });

  const handleSaveProfile = () => {
    const updated: UserProfile = {
      ...profile,
      nickname: editNick.trim() || 'ProPlayer',
      favoriteTeam: editTeam,
      tagline: editTagline.trim() || 'Em busca do 13 a 0'
    };
    saveUserProfile(updated);
    onProfileUpdated(updated);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0f1923] border border-[#243447] rounded-2xl p-6 sm:p-8 val-cut-top-right shadow-2xl text-left flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-[#1b2b3d] rounded-lg transition cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Title & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#243447]">
          <div>
            <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-[#ff4655] block">
              PERFIL OFICIAL DO JOGADOR
            </span>
            <h2 className="text-2xl font-display font-black text-white tracking-wide">
              CARTEIRINHA VCT & CONQUISTAS
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#090e14] rounded-lg border border-[#243447]">
            <button
              onClick={() => setActiveTab('CARD')}
              className={`px-3 py-1.5 rounded text-xs font-tech font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'CARD'
                  ? 'bg-[#ff4655] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Carteirinha
            </button>
            <button
              onClick={() => setActiveTab('ACHIEVEMENTS')}
              className={`px-3 py-1.5 rounded text-xs font-tech font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'ACHIEVEMENTS'
                  ? 'bg-[#ff4655] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Conquistas</span>
              <span className="text-[10px] bg-black/30 px-1 rounded">{unlockedCount}/{achievements.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('HALL_OF_FAME')}
              className={`px-3 py-1.5 rounded text-xs font-tech font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'HALL_OF_FAME'
                  ? 'bg-[#ff4655] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Hall da Fama</span>
              <span className="text-[10px] bg-black/30 px-1 rounded">{hallOfFame.length}</span>
            </button>
          </div>
        </div>

        {/* ===================== TAB 1: CARTEIRINHA ===================== */}
        {activeTab === 'CARD' && (
          <div className="py-6 space-y-6">
            
            {/* VCT Player Banner Card */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#18283a] via-[#101b27] to-[#090e14] border-2 border-[#ff4655]/60 val-cut-top-right shadow-[0_0_30px_rgba(255,70,85,0.2)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                {/* Avatar and Identity */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ff4655] to-[#a81c28] flex items-center justify-center font-display font-black text-3xl text-white shadow-lg val-cut-corner">
                    {profile.nickname.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-2xl text-white tracking-wide">
                        @{profile.nickname}
                      </h3>
                      <span className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded border border-current ${userRank.tierColor} bg-black/40`}>
                        {userRank.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-tech mt-0.5">
                      Time do Coração: <strong className="text-amber-400">{profile.favoriteTeam}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 font-tech italic">
                      "{profile.tagline}"
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 bg-[#1b2b3d] hover:bg-[#253d57] text-slate-200 text-xs font-tech font-bold rounded border border-[#2d4663] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 size={13} /> {isEditing ? 'Cancelar Edição' : 'Editar Perfil'}
                </button>

              </div>

              {/* Edit Form */}
              {isEditing && (
                <div className="mt-6 pt-4 border-t border-[#243447] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
                  <div>
                    <label className="text-[10px] font-tech text-slate-400 uppercase tracking-widest block mb-1">
                      Seu Nickname
                    </label>
                    <input
                      type="text"
                      value={editNick}
                      onChange={(e) => setEditNick(e.target.value)}
                      maxLength={15}
                      className="w-full px-3 py-1.5 bg-[#090e14] border border-[#243447] rounded text-xs text-white focus:border-[#ff4655] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-tech text-slate-400 uppercase tracking-widest block mb-1">
                      Time Favorito
                    </label>
                    <input
                      type="text"
                      value={editTeam}
                      onChange={(e) => setEditTeam(e.target.value)}
                      maxLength={20}
                      className="w-full px-3 py-1.5 bg-[#090e14] border border-[#243447] rounded text-xs text-white focus:border-[#ff4655] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-tech text-slate-400 uppercase tracking-widest block mb-1">
                      Frase / Tagline
                    </label>
                    <input
                      type="text"
                      value={editTagline}
                      onChange={(e) => setEditTagline(e.target.value)}
                      maxLength={30}
                      className="w-full px-3 py-1.5 bg-[#090e14] border border-[#243447] rounded text-xs text-white focus:border-[#ff4655] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end mt-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-1.5 bg-[#ff4655] hover:bg-[#e03140] text-white text-xs font-tech font-bold uppercase rounded transition cursor-pointer"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Career Stats Grid */}
            <div>
              <span className="text-[11px] font-tech text-slate-400 uppercase tracking-widest block mb-3">
                ESTATÍSTICAS DA CARREIRA NO VCT:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#090e14] border border-[#243447] text-center">
                  <span className="text-[10px] font-tech text-slate-400 uppercase block">Títulos do Champions</span>
                  <div className="font-display font-black text-2xl text-amber-400 my-0.5 flex items-center justify-center gap-1">
                    <Trophy size={18} /> {stats.campaignsWon}
                  </div>
                  <span className="text-[10px] font-tech text-slate-500">{stats.campaignsPlayed} disputados</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090e14] border border-[#ff4655]/40 text-center shadow-[0_0_15px_rgba(255,70,85,0.15)]">
                  <span className="text-[10px] font-tech text-slate-400 uppercase block">13 a 0 Flawless</span>
                  <div className="font-display font-black text-2xl text-[#ff4655] my-0.5 flex items-center justify-center gap-1">
                    <Star size={18} /> {stats.flawless13x0Count}
                  </div>
                  <span className="text-[10px] font-tech text-[#ff4655]">Feito Supremo</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090e14] border border-[#243447] text-center">
                  <span className="text-[10px] font-tech text-slate-400 uppercase block">Partidas Vencidas</span>
                  <div className="font-display font-black text-2xl text-[#00f59b] my-0.5">
                    {stats.matchesWon}
                  </div>
                  <span className="text-[10px] font-tech text-slate-500">de {stats.matchesPlayed} partidas</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090e14] border border-[#243447] text-center">
                  <span className="text-[10px] font-tech text-slate-400 uppercase block">Títulos no Difícil</span>
                  <div className="font-display font-black text-2xl text-rose-400 my-0.5 flex items-center justify-center gap-1">
                    <Flame size={18} /> {stats.hardcoreWins}
                  </div>
                  <span className="text-[10px] font-tech text-slate-500">Modo Às Cegas</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090e14] border border-[#243447] text-center">
                  <span className="text-[10px] font-tech text-slate-400 uppercase block">Aces na Carreira</span>
                  <div className="font-display font-black text-2xl text-amber-300 my-0.5">
                    {stats.totalAces}
                  </div>
                  <span className="text-[10px] font-tech text-slate-500">Penta Kills</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#090e14] border border-[#243447] text-center">
                  <span className="text-[10px] font-tech text-slate-400 uppercase block">Clutches Salvos</span>
                  <div className="font-display font-black text-2xl text-cyan-400 my-0.5">
                    {stats.totalClutches}
                  </div>
                  <span className="text-[10px] font-tech text-slate-500">1vX Milagrosos</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ===================== TAB 2: CONQUISTAS ===================== */}
        {activeTab === 'ACHIEVEMENTS' && (
          <div className="py-6 space-y-5">
            {/* Progress Bar & Summary */}
            <div className="p-4 rounded-xl bg-[#090e14] border border-[#243447] space-y-2">
              <div className="flex items-center justify-between text-xs font-tech">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Trophy size={14} className="text-amber-400" /> PROGRESSO TOTAL DE CONQUISTAS
                </span>
                <span className="text-white font-mono font-bold">
                  {unlockedCount} / {achievements.length} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-[#ff4655] to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,70,85,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              <span className="text-[11px] font-tech text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter size={12} /> Filtrar:
              </span>
              {[
                { key: 'ALL', label: `Todas (${achievements.length})` },
                { key: 'UNLOCKED', label: `Conquistadas (${unlockedCount})` },
                { key: 'LOCKED', label: `Bloqueadas (${achievements.length - unlockedCount})` },
                { key: 'Mítica', label: 'Míticas' },
                { key: 'Lendária', label: 'Lendárias' },
                { key: 'Rara', label: 'Raras' },
                { key: 'Comum', label: 'Comuns' }
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterRarity(f.key)}
                  className={`px-2.5 py-1 rounded text-[11px] font-tech font-bold uppercase tracking-wider transition cursor-pointer border ${
                    filterRarity === f.key
                      ? 'bg-[#ff4655] text-white border-[#ff4655] shadow-sm'
                      : 'bg-[#090e14] text-slate-400 border-[#1e2d3d] hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Achievement Grid */}
            {filteredAchievements.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#090e14] border border-[#243447] text-center text-slate-500 font-tech">
                <p>Nenhuma conquista encontrada para este filtro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredAchievements.map((ach) => {
                  const isUnlocked = !!ach.unlockedAt;

                  const rarityStyles = {
                    Mítica: {
                      badge: 'bg-red-500/20 text-red-400 border-red-500/40',
                      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)] border-red-500/50'
                    },
                    Lendária: {
                      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                      glow: 'shadow-[0_0_20px_rgba(245,183,49,0.25)] border-amber-500/50'
                    },
                    Rara: {
                      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
                      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)] border-cyan-500/40'
                    },
                    Comum: {
                      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)] border-emerald-500/40'
                    }
                  }[ach.rarity] || {
                    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
                    glow: 'border-[#243447]'
                  };

                  return (
                    <div
                      key={ach.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isUnlocked
                          ? `bg-[#142334] ${rarityStyles.glow}`
                          : 'bg-[#090e14] border-[#1e2d3d] opacity-65 hover:opacity-85'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                          isUnlocked ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-slate-800/80 border border-slate-700'
                        }`}>
                          {isUnlocked ? ach.icon : <Lock size={20} className="text-slate-400" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-display font-bold text-sm sm:text-base text-white truncate">
                              {ach.title}
                            </h4>
                            <span className={`text-[9px] font-tech font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${rarityStyles.badge}`}>
                              {ach.rarity}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 font-tech mt-1 leading-relaxed">
                            {ach.description}
                          </p>

                          <div className="mt-2.5 text-[10px] font-tech">
                            {isUnlocked ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Check size={12} /> Conquistado em {new Date(ach.unlockedAt!).toLocaleDateString('pt-BR')}
                              </span>
                            ) : (
                              <span className="text-slate-500 flex items-center gap-1">
                                <Lock size={11} /> Bloqueado — Complete a façanha para liberar
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: HALL DA FAMA ===================== */}
        {activeTab === 'HALL_OF_FAME' && (
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-tech text-slate-400">
              <span>Elencos imortalizados que levantaram o troféu mundial do Champions com você:</span>
              <span className="text-amber-400 font-bold">{hallOfFame.length} títulos conquistados</span>
            </div>

            {hallOfFame.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#090e14] border border-[#243447] text-center text-slate-500 font-tech">
                <Trophy size={36} className="mx-auto mb-3 opacity-30 text-amber-400" />
                <p className="text-sm text-slate-300 font-bold">Nenhum elenco campeão registrado ainda.</p>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Vença a Grande Final do Champions com sua equipe para consagrar os 5 pro players na galeria eterna do Hall da Fama!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {hallOfFame.map((entry) => {
                  const roles = [
                    { key: 'duelista', roleName: 'DUELISTA', color: '#ff4655', data: entry.lineup.duelista },
                    { key: 'iniciador', roleName: 'INICIADOR', color: '#00c8b9', data: entry.lineup.iniciador },
                    { key: 'controlador', roleName: 'CONTROLADOR', color: '#b05bff', data: entry.lineup.controlador },
                    { key: 'sentinela', roleName: 'SENTINELA', color: '#00f59b', data: entry.lineup.sentinela },
                    { key: 'igl', roleName: 'IGL / FLEX', color: '#f59e0b', data: entry.lineup.igl }
                  ];

                  return (
                    <div
                      key={entry.id}
                      className="p-5 rounded-2xl bg-gradient-to-br from-[#101b27] to-[#090e14] border-2 border-amber-500/40 val-cut-top-right space-y-4 shadow-[0_0_25px_rgba(245,183,49,0.1)]"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#1e2d3d] pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display font-black text-lg sm:text-xl text-amber-400 flex items-center gap-1.5">
                            <Trophy size={18} className="text-amber-400" /> {entry.teamName}
                          </span>
                          <span className="text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            Modo {entry.difficulty}
                          </span>
                          {entry.achieved13x0 && (
                            <span className="text-[10px] font-tech font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                              ⭐ 13-0 FLAWLESS ABSOLUTO
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-tech text-slate-400">
                          {entry.date}
                        </span>
                      </div>

                      {/* 5 Pro Players Roster with Headshots */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {roles.map(r => {
                          const player = r.data;
                          const photoUrl = getPlayerPhoto(player.name, player.agent);
                          const fallbackAgentIcon = getAgentIcon(player.agent);

                          return (
                            <div
                              key={r.key}
                              className="p-2.5 rounded-xl bg-[#090e14] border border-[#1e2d3d] hover:border-amber-500/40 transition flex flex-col items-center text-center group"
                            >
                              <span
                                className="text-[9px] font-tech font-bold uppercase tracking-wider mb-2 px-1.5 py-0.5 rounded bg-black/40 border border-white/5"
                                style={{ color: r.color }}
                              >
                                {r.roleName}
                              </span>

                              {/* Player Headshot Photo */}
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-t from-[#090e14] to-[#1a2b3d] border border-slate-700 group-hover:border-amber-400/80 transition relative shadow-md mb-2">
                                <img
                                  src={photoUrl}
                                  alt={player.name}
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = fallbackAgentIcon;
                                  }}
                                  className="w-full h-full object-cover object-top"
                                />
                                {/* Agent Icon Badge */}
                                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-tl bg-black/80 p-0.5 border-t border-l border-slate-700">
                                  <img
                                    src={fallbackAgentIcon}
                                    alt={player.agent}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>

                              {/* Nick & Flag */}
                              <div className="font-display font-bold text-xs text-white truncate max-w-full flex items-center gap-1 justify-center">
                                <span className="truncate">{player.name}</span>
                                <span className="text-[11px] shrink-0">{player.flag}</span>
                              </div>

                              {/* Agent / Team info */}
                              <span className="text-[10px] text-slate-400 font-tech truncate max-w-full mt-0.5">
                                {player.agent}
                              </span>
                              {player.team && (
                                <span className="text-[9px] text-amber-400/80 font-tech truncate max-w-full">
                                  {player.team}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
