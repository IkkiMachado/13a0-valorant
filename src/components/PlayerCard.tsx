import React from 'react';
import { Player, Role } from '../types/game';
import { Crown, Sparkles, Crosshair, Brain, Zap, RefreshCw } from 'lucide-react';
import { getPlayerPhoto, getAgentIcon } from '../utils/playerPhotos';

interface PlayerCardProps {
  player: Player;
  onSelect?: () => void;
  onToggleAgent?: (agentName: string) => void;
  isSelected?: boolean;
  compact?: boolean;
  slotRole?: Role | 'IGL';
  hideOVR?: boolean;
}

const roleColors: Record<Role, { bg: string; text: string; border: string }> = {
  Duelista: { bg: 'bg-[#ff4655]/15', text: 'text-[#ff4655]', border: 'border-[#ff4655]/40' },
  Iniciador: { bg: 'bg-[#00c8b9]/15', text: 'text-[#00c8b9]', border: 'border-[#00c8b9]/40' },
  Controlador: { bg: 'bg-[#b05bff]/15', text: 'text-[#b05bff]', border: 'border-[#b05bff]/40' },
  Sentinela: { bg: 'bg-[#00f59b]/15', text: 'text-[#00f59b]', border: 'border-[#00f59b]/40' }
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onSelect,
  onToggleAgent,
  isSelected = false,
  compact = false,
  slotRole,
  hideOVR = false
}) => {
  const roleStyle = roleColors[player.role] || roleColors.Duelista;
  const agents = player.availableAgents || [player.signatureAgent];
  const photoUrl = getPlayerPhoto(player.name, player.signatureAgent, player.photoUrl);
  const fallbackAgentIcon = getAgentIcon(player.signatureAgent);

  // ==========================================
  // COMPACT CARD (Roster Slots / Lineup Board)
  // ==========================================
  if (compact) {
    return (
      <div 
        className={`relative flex items-center justify-between p-2 rounded-lg bg-[#0f1923] border ${
          player.isLegend && !hideOVR ? 'border-amber-500/60 shadow-[0_0_12px_rgba(245,183,49,0.15)]' : 'border-[#243447]'
        } hover:border-[#ff4655] transition group overflow-hidden`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          
          {/* Player Photo Avatar */}
          <div className="relative shrink-0">
            <div className={`w-11 h-11 rounded-lg overflow-hidden border ${
              player.isLegend && !hideOVR ? 'border-amber-400 shadow-[0_0_8px_rgba(245,183,49,0.3)]' : 'border-[#2d435d]'
            } bg-gradient-to-t from-[#090e14] to-[#1a2b3d]`}>
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
            </div>

            {/* IGL Golden Star Badge */}
            {player.isIGL && (
              <span
                className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full text-[9px] font-black shadow"
                title="In-Game Leader (IGL)"
              >
                ★
              </span>
            )}
          </div>

          {/* OVR Rating Box */}
          <div className={`w-9 h-11 rounded flex flex-col items-center justify-center font-display font-black text-sm shrink-0 ${
            hideOVR
              ? 'bg-[#1b2b3d] text-slate-400 border border-[#2d435d]'
              : player.isLegend
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-[#1b2b3d] text-white border border-[#2b415a]'
          }`}>
            <span>{hideOVR ? '?' : player.rating}</span>
            <span className="text-[7px] font-tech uppercase tracking-tighter -mt-0.5 opacity-70">
              OVR
            </span>
          </div>

          {/* Player Name, Flag, Era, Signature Agent */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm font-bold text-white tracking-wide truncate">{player.name}</span>
              <span className="text-xs shrink-0">{player.flag}</span>
              {player.isLegend && !hideOVR && (
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold shrink-0">
                  LENDA
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-tech truncate">
              <span className="truncate">{player.teamBadge} · {player.era}</span>
              <span>•</span>
              {agents.length > 1 && onToggleAgent ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIdx = agents.indexOf(player.signatureAgent);
                    const nextAgent = agents[(currentIdx + 1) % agents.length];
                    onToggleAgent(nextAgent);
                  }}
                  className="inline-flex items-center gap-1 font-bold bg-[#18293b] hover:bg-[#253d57] px-1.5 py-0.5 rounded border border-[#2e4764] text-cyan-300 cursor-pointer transition shrink-0"
                  title="Clique para alternar o agente"
                >
                  <img
                    src={getAgentIcon(player.signatureAgent)}
                    alt=""
                    className="w-3 h-3 rounded-full object-cover"
                  />
                  <span>{player.signatureAgent}</span>
                  <RefreshCw size={8} className="opacity-70" />
                </button>
              ) : (
                <span className={`inline-flex items-center gap-1 ${roleStyle.text} font-bold shrink-0`}>
                  <img
                    src={getAgentIcon(player.signatureAgent)}
                    alt=""
                    className="w-3 h-3 rounded-full object-cover"
                  />
                  {player.signatureAgent}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // FULL PRO DRAFT CARD (Draft Board Selection)
  // ==========================================
  return (
    <div
      onClick={onSelect}
      className={`relative p-3.5 rounded-xl bg-[#0f1923] border transition-all duration-200 cursor-pointer text-left select-none val-cut-top-right group overflow-hidden ${
        isSelected
          ? 'border-[#ff4655] shadow-[0_0_15px_rgba(255,70,85,0.3)] bg-[#162433]'
          : player.isLegend && !hideOVR
          ? 'border-amber-500/50 hover:border-amber-400 shadow-[0_0_12px_rgba(245,183,49,0.15)] hover:bg-[#152230]'
          : 'border-[#243447] hover:border-slate-400 hover:bg-[#152230]'
      }`}
    >
      {/* Top Header: Role badge, IGL crown, Flag */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-tech font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
            {player.role}
          </span>
          {player.isIGL && (
            <span className="text-[10px] font-tech font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Crown size={11} /> IGL
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {player.isLegend && !hideOVR && (
            <span className="flex items-center gap-1 text-[10px] font-tech font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded">
              <Sparkles size={11} className="animate-pulse" /> LENDA
            </span>
          )}
          <span className="text-base">{player.flag}</span>
        </div>
      </div>

      {/* Main Identity: Photo + Name + OVR Badge */}
      <div className="flex items-center gap-3 my-2">
        
        {/* Stylized Player Portrait Frame */}
        <div className="relative w-24 h-28 sm:w-26 sm:h-30 rounded-lg overflow-hidden border-2 border-[#2e4764] group-hover:border-[#ff4655] bg-gradient-to-t from-[#090e14] via-[#152538] to-[#1c3047] shadow-lg shrink-0 transition duration-200">
          <img
            src={photoUrl}
            alt={player.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackAgentIcon;
            }}
            className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
          />
          {/* Subtle gradient vignette at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#090e14] to-transparent pointer-events-none" />
        </div>

        {/* Player Name, Era, and OVR */}
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-black text-xl text-white tracking-wide group-hover:text-[#ff4655] transition truncate">
            {player.name}
          </h4>
          <p className="text-xs text-slate-400 font-tech truncate">
            {player.team}
          </p>
          <p className="text-[11px] text-slate-400 font-tech truncate mb-2">
            {player.era}
          </p>

          {/* Rating Badge (FIFA / Valorant Pro Card Style) */}
          <div className="inline-flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-display font-black ${
              hideOVR
                ? 'bg-[#162536] text-slate-400 border border-[#2c4159]'
                : player.isLegend
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#1a293b] text-white border border-[#2b4159]'
            }`}>
              <span className="text-xl leading-none">
                {hideOVR ? '?' : player.rating}
              </span>
              <span className="text-[9px] font-tech uppercase font-bold tracking-tight opacity-80">
                {hideOVR ? 'OCULTO' : 'OVR'}
              </span>
            </div>

            {/* Signature Agent Icon Pill */}
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#13202e] border border-[#233547] text-xs font-tech text-slate-300">
              <img
                src={fallbackAgentIcon}
                alt={player.signatureAgent}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="font-bold text-white text-[11px]">{player.signatureAgent}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Agents & Attributes Bar */}
      <div className="mt-3 pt-2.5 border-t border-[#243447]/60 flex items-center justify-between text-xs font-tech text-slate-300">
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Pool:</span>
          {agents.length > 1 ? (
            <div className="flex items-center gap-1 mt-0.5">
              {agents.map((ag) => (
                <span
                  key={ag}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    player.signatureAgent === ag
                      ? 'bg-[#ff4655] text-white shadow-sm'
                      : 'bg-[#162536] text-slate-400'
                  }`}
                >
                  {ag}
                </span>
              ))}
            </div>
          ) : (
            <span className="font-bold text-white text-[11px]">{player.signatureAgent}</span>
          )}
        </div>

        <div className="flex items-center gap-2.5 text-[11px]">
          <span title="Mira / Aim" className="flex items-center gap-0.5 text-slate-300 font-mono">
            <Crosshair size={11} className="text-red-400" /> {hideOVR ? '?' : player.aim}
          </span>
          <span title="Noção / Game Sense" className="flex items-center gap-0.5 text-slate-300 font-mono">
            <Brain size={11} className="text-cyan-400" /> {hideOVR ? '?' : player.gameSense}
          </span>
          <span title="Clutch" className="flex items-center gap-0.5 text-slate-300 font-mono">
            <Zap size={11} className="text-amber-400" /> {hideOVR ? '?' : player.clutch}
          </span>
        </div>
      </div>

      {/* Select Call-to-Action */}
      {onSelect && (
        <div className="mt-2.5 text-center py-1.5 bg-[#1a293b] group-hover:bg-[#ff4655] group-hover:text-white rounded-md text-[11px] font-tech font-bold uppercase tracking-wider text-slate-300 transition shadow-sm">
          Selecionar para Line-up
        </div>
      )}
    </div>
  );
};
