import React, { useState, useEffect } from 'react';
import { Lineup, TeamHistorical, MapData, TournamentStage, RoundResult, DifficultyLevel, GameMode } from './types/game';
import { HISTORICAL_TEAMS } from './data/teams';
import { MAPS } from './data/maps';
import { Header } from './components/Header';
import { DifficultySelect } from './components/DifficultySelect';
import { DraftBoard } from './components/DraftBoard';
import { CampaignView } from './components/CampaignView';
import { MatchSimulator } from './components/MatchSimulator';
import { ChampionsTrophy } from './components/ChampionsTrophy';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ProfileModal } from './components/ProfileModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { ManagerHubModal } from './components/ManagerHubModal';
import { ManagerPerk, PlayerUpgradeStats, ManagerMatchReward } from './types/manager';
import {
  getManagerCredits,
  saveManagerCredits,
  getEquippedPerks,
  saveEquippedPerks,
  getPlayerUpgrades,
  savePlayerUpgrades,
  resetManagerCareer,
  calculateMatchReward
} from './utils/manager';
import {
  DailyChallengeInfo,
  getDailyChallenge,
  getDailyResult,
  saveDailyResult,
  getDailyStreak,
  getTodayDateString,
  DailyResultRecord
} from './utils/daily';
import {
  UserProfile,
  UserStats,
  Achievement,
  HallOfFameEntry,
  getUserProfile,
  getUserStats,
  saveUserStats,
  getAchievements,
  unlockAchievement,
  getHallOfFame,
  addHallOfFameEntry
} from './utils/storage';
import {
  checkRoundAchievements,
  checkDraftAchievements,
  checkMatchEndAchievements,
  checkCampaignEndAchievements
} from './utils/achievements';
import { Award, Sparkles, X } from 'lucide-react';

type GameScreen = 'SELECT_DIFFICULTY' | 'DRAFT' | 'CAMPAIGN' | 'MATCH' | 'RESULT';

const INITIAL_LINEUP: Lineup = {
  duelista: null,
  iniciador: null,
  controlador: null,
  sentinela: null,
  igl: null
};

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('SELECT_DIFFICULTY');
  const [lineup, setLineup] = useState<Lineup>(INITIAL_LINEUP);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('DIFICIL');
  const [gameMode, setGameMode] = useState<GameMode>('CLASSIC');

  // Daily Mode State
  const [isDailyMode, setIsDailyMode] = useState(false);
  const [dailyChallenge] = useState<DailyChallengeInfo>(() => getDailyChallenge());
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(getDailyStreak());
  const [todayResult, setTodayResult] = useState<DailyResultRecord | null>(getDailyResult());
  
  // Modals
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'CARD' | 'ACHIEVEMENTS' | 'HALL_OF_FAME'>('CARD');
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);

  // Roguelike Manager State
  const [managerCredits, setManagerCredits] = useState<number>(getManagerCredits);
  const [equippedPerks, setEquippedPerks] = useState<ManagerPerk[]>(getEquippedPerks);
  const [playerUpgrades, setPlayerUpgrades] = useState<Record<string, PlayerUpgradeStats>>(getPlayerUpgrades);
  const [isManagerHubOpen, setIsManagerHubOpen] = useState(false);
  const [lastMatchReward, setLastMatchReward] = useState<ManagerMatchReward | null>(null);

  const handleOpenProfile = (tab: 'CARD' | 'ACHIEVEMENTS' | 'HALL_OF_FAME' = 'CARD') => {
    setProfileInitialTab(tab);
    setIsProfileOpen(true);
  };

  // Persistence State
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile);
  const [userStats, setUserStats] = useState<UserStats>(getUserStats);
  const [achievements, setAchievements] = useState<Achievement[]>(getAchievements);
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>(getHallOfFame);

  // Tournament State
  const [stage, setStage] = useState<TournamentStage>('GROUPS_R1');
  const [tournamentOpponents, setTournamentOpponents] = useState<TeamHistorical[]>([]);
  const [currentOpponentIndex, setCurrentOpponentIndex] = useState(0);
  const [currentMap, setCurrentMap] = useState<MapData>(MAPS[0]);
  const [matchHistory, setMatchHistory] = useState<{
    stageName: string;
    opponentName: string;
    playerScore: number;
    opponentScore: number;
    is13x0: boolean;
  }[]>([]);
  const [achieved13x0, setAchieved13x0] = useState(false);

  const isDraftComplete = Object.values(lineup).filter(Boolean).length === 5;
  const unlockedAchievementsCount = achievements.filter(a => a.unlockedAt).length;

  const triggerAchievement = (achievementId: string) => {
    const unlocked = unlockAchievement(achievementId);
    if (unlocked) {
      setAchievements(getAchievements());
      setAchievementToast(unlocked);
      setTimeout(() => {
        setAchievementToast(null);
      }, 5000);
    }
  };

  // Handle mode and difficulty selection to start draft
  const handleSelectModeAndDifficulty = (mode: GameMode, selectedDiff: DifficultyLevel) => {
    setIsDailyMode(false);
    setGameMode(mode);
    setDifficulty(selectedDiff);
    setLineup(INITIAL_LINEUP);
    if (mode === 'MANAGER') {
      const reset = resetManagerCareer();
      setManagerCredits(reset.credits);
      setEquippedPerks(reset.perks);
      setPlayerUpgrades(reset.upgrades);
      setLastMatchReward(null);
    }
    setCurrentScreen('DRAFT');
  };

  // Handle starting daily challenge with selected difficulty
  const handleStartDailyChallenge = (chosenDiff: DifficultyLevel = 'MEDIO') => {
    setIsDailyMode(true);
    setGameMode('CLASSIC');
    setDifficulty(chosenDiff);
    setLineup(INITIAL_LINEUP);
    setIsDailyModalOpen(false);
    setCurrentScreen('DRAFT');
  };

  // Start campaign
  const handleStartCampaign = () => {
    // Check for draft achievements (e.g. Dream Team 96+ OVR)
    checkDraftAchievements(lineup, triggerAchievement);

    // Pick 5 distinct opponents for the tournament path
    const shuffled = [...HISTORICAL_TEAMS].sort(() => 0.5 - Math.random());
    setTournamentOpponents(shuffled.slice(0, 5));
    setCurrentOpponentIndex(0);
    setStage('GROUPS_R1');
    setMatchHistory([]);
    setAchieved13x0(false);

    // Update stats: campaigns played
    const updatedStats = { ...userStats, campaignsPlayed: userStats.campaignsPlayed + 1 };
    setUserStats(updatedStats);
    saveUserStats(updatedStats);

    setCurrentScreen('CAMPAIGN');
  };

  // Launch match from campaign view
  const handleLaunchMatch = (selectedMap: MapData) => {
    setCurrentMap(selectedMap);
    setCurrentScreen('MATCH');
  };

  // Match finished
  const handleMatchComplete = (result: {
    playerScore: number;
    opponentScore: number;
    is13x0: boolean;
    rounds: RoundResult[];
    playerUltsUsed?: number;
    totalAces?: number;
    totalClutches?: number;
  }) => {
    const playerWon = result.playerScore > result.opponentScore;
    const opponent = tournamentOpponents[currentOpponentIndex] || HISTORICAL_TEAMS[0];

    const newHistory = [
      ...matchHistory,
      {
        stageName: stage,
        opponentName: opponent.name,
        playerScore: result.playerScore,
        opponentScore: result.opponentScore,
        is13x0: result.is13x0
      }
    ];
    setMatchHistory(newHistory);

    // Update stats
    const updatedStats: UserStats = {
      ...userStats,
      matchesPlayed: userStats.matchesPlayed + 1,
      matchesWon: playerWon ? userStats.matchesWon + 1 : userStats.matchesWon,
      flawless13x0Count: result.is13x0 ? userStats.flawless13x0Count + 1 : userStats.flawless13x0Count,
      totalAces: userStats.totalAces + (result.totalAces || 0),
      totalClutches: userStats.totalClutches + (result.totalClutches || 0)
    };
    setUserStats(updatedStats);
    saveUserStats(updatedStats);

    if (result.is13x0) {
      setAchieved13x0(true);
    }

    // Evaluate match-end achievements (13-0 Flawless, First Blood, Ult Storm, Legendary Rosters)
    checkMatchEndAchievements(result, lineup, opponent, triggerAchievement);

    // Calculate Roguelike manager reward only in MANAGER mode
    if (gameMode === 'MANAGER') {
      const reward = calculateMatchReward(result, managerCredits, equippedPerks);
      const newCredits = managerCredits + reward.total;
      setManagerCredits(newCredits);
      saveManagerCredits(newCredits);
      setLastMatchReward(reward);
    }

    if (!playerWon) {
      if (stage === 'GROUPS_R1') {
        // Lost opening game -> goes to elimination match
        setStage('GROUPS_DECIDER');
        setCurrentOpponentIndex(prev => prev + 1);
        setCurrentScreen('CAMPAIGN');
        if (gameMode === 'MANAGER') {
          setIsManagerHubOpen(true);
        }
      } else {
        // Eliminated from playoffs or decider
        setStage('ELIMINATED');
        setCurrentScreen('RESULT');
      }
      return;
    }

    // Player won!
    if (stage === 'GROUPS_R1') {
      setStage('GROUPS_WINNERS');
      setCurrentOpponentIndex(prev => prev + 1);
      setCurrentScreen('CAMPAIGN');
      if (gameMode === 'MANAGER') {
        setIsManagerHubOpen(true);
      }
    } else if (stage === 'GROUPS_WINNERS' || stage === 'GROUPS_DECIDER') {
      setStage('PLAYOFFS_QUARTERS');
      setCurrentOpponentIndex(prev => prev + 1);
      setCurrentScreen('CAMPAIGN');
      if (gameMode === 'MANAGER') {
        setIsManagerHubOpen(true);
      }
    } else if (stage === 'PLAYOFFS_QUARTERS') {
      setStage('PLAYOFFS_SEMIS');
      setCurrentOpponentIndex(prev => prev + 1);
      setCurrentScreen('CAMPAIGN');
      if (gameMode === 'MANAGER') {
        setIsManagerHubOpen(true);
      }
    } else if (stage === 'PLAYOFFS_SEMIS') {
      setStage('PLAYOFFS_FINALS');
      setCurrentOpponentIndex(prev => prev + 1);
      setCurrentScreen('CAMPAIGN');
      if (gameMode === 'MANAGER') {
        setIsManagerHubOpen(true);
      }
    } else if (stage === 'PLAYOFFS_FINALS') {
      // World Champion!
      setStage('CHAMPION');

      // Update campaigns won stats
      const champStats: UserStats = {
        ...updatedStats,
        campaignsWon: updatedStats.campaignsWon + 1,
        hardcoreWins: difficulty === 'DIFICIL' ? updatedStats.hardcoreWins + 1 : updatedStats.hardcoreWins
      };
      setUserStats(champStats);
      saveUserStats(champStats);

      let currentStreak = dailyStreak;
      if (isDailyMode) {
        saveDailyResult(getTodayDateString(), true, result.playerScore, result.is13x0 || achieved13x0, difficulty);
        currentStreak = getDailyStreak();
        setDailyStreak(currentStreak);
        setTodayResult(getDailyResult());
      }

      // Check all campaign victory achievements
      checkCampaignEndAchievements(
        true,
        lineup,
        difficulty,
        isDailyMode,
        champStats.campaignsWon,
        currentStreak,
        triggerAchievement
      );

      // Add to Hall of Fame
      addHallOfFameEntry(lineup, difficulty, result.is13x0 || achieved13x0);
      setHallOfFame(getHallOfFame());

      setCurrentScreen('RESULT');
    }
  };

  const handleResetDraft = () => {
    setIsDailyMode(false);
    setLineup(INITIAL_LINEUP);
    const reset = resetManagerCareer();
    setManagerCredits(reset.credits);
    setEquippedPerks(reset.perks);
    setPlayerUpgrades(reset.upgrades);
    setLastMatchReward(null);
    setCurrentScreen('SELECT_DIFFICULTY');
  };

  const currentOpponent = tournamentOpponents[currentOpponentIndex] || HISTORICAL_TEAMS[0];

  return (
    <div className="min-h-screen bg-[#090e14] bg-vct-grid text-slate-100 flex flex-col font-sans">
      <Header
        onNewDraft={handleResetDraft}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenProfile={handleOpenProfile}
        onOpenDailyModal={() => setIsDailyModalOpen(true)}
        onOpenManagerHub={gameMode === 'MANAGER' ? () => setIsManagerHubOpen(true) : undefined}
        managerCredits={managerCredits}
        isCampaignActive={(currentScreen === 'CAMPAIGN' || currentScreen === 'MATCH') && gameMode === 'MANAGER'}
        nickname={userProfile.nickname}
        achievementsCount={unlockedAchievementsCount}
        totalAchievementsCount={achievements.length}
        isDraftComplete={isDraftComplete}
      />

      {/* Achievement Toast Banner */}
      {achievementToast && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-gradient-to-r from-[#18283a] to-[#0f1923] border-2 border-amber-400 shadow-[0_0_25px_rgba(245,183,49,0.3)] flex items-center gap-3 animate-slideIn">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-2xl border border-amber-400/40">
            {achievementToast.icon}
          </div>
          <div>
            <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-amber-400 block">
              NOVA CONQUISTA DESBLOQUEADA!
            </span>
            <strong className="text-sm font-display font-black text-white">
              {achievementToast.title}
            </strong>
            <p className="text-xs text-slate-300 font-tech">{achievementToast.description}</p>
          </div>
          <button
            onClick={() => setAchievementToast(null)}
            className="p-1 text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <main className="flex-1">
        {currentScreen === 'SELECT_DIFFICULTY' && (
          <DifficultySelect
            onSelectModeAndDifficulty={handleSelectModeAndDifficulty}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onOpenDailyModal={() => setIsDailyModalOpen(true)}
            dailyStreak={dailyStreak}
          />
        )}

        {currentScreen === 'DRAFT' && (
          <DraftBoard
            lineup={lineup}
            difficulty={difficulty}
            gameMode={gameMode}
            dailyChallenge={isDailyMode ? dailyChallenge : null}
            onUpdateLineup={setLineup}
            onBackToDifficulty={() => setCurrentScreen('SELECT_DIFFICULTY')}
            onStartCampaign={handleStartCampaign}
          />
        )}

        {currentScreen === 'CAMPAIGN' && (
          <CampaignView
            playerLineup={lineup}
            stage={stage}
            nextOpponent={currentOpponent}
            matchHistory={matchHistory}
            managerCredits={gameMode === 'MANAGER' ? managerCredits : undefined}
            equippedPerks={gameMode === 'MANAGER' ? equippedPerks : []}
            playerUpgrades={gameMode === 'MANAGER' ? playerUpgrades : {}}
            onOpenManagerHub={gameMode === 'MANAGER' ? () => setIsManagerHubOpen(true) : undefined}
            onStartMatch={handleLaunchMatch}
          />
        )}

        {currentScreen === 'MATCH' && (
          <MatchSimulator
            playerLineup={lineup}
            opponentTeam={currentOpponent}
            map={currentMap}
            stageName={stage}
            managerPerks={gameMode === 'MANAGER' ? equippedPerks : []}
            playerUpgrades={gameMode === 'MANAGER' ? playerUpgrades : {}}
            onMatchComplete={handleMatchComplete}
            onRoundSimulated={(round) => checkRoundAchievements(round, triggerAchievement)}
          />
        )}

        {currentScreen === 'RESULT' && (
          <ChampionsTrophy
            isChampion={stage === 'CHAMPION'}
            lineup={lineup}
            achieved13x0={achieved13x0}
            difficulty={difficulty}
            isDailyMode={isDailyMode}
            dailyDayName={dailyChallenge.dayName}
            dailyStreak={dailyStreak}
            onRestart={handleResetDraft}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1b2b3d] py-6 text-center text-xs font-tech text-slate-500 bg-[#090e14]">
        <p>13a0 · Road to Champions | Inspirado no VCT, 7a0 e Road to Major</p>
        <p className="text-[10px] text-slate-600 mt-1">
          Feito para a comunidade fã de Valorant Esports. Todos os nomes de equipes e atletas pertencem a seus respectivos donos.
        </p>
      </footer>

      {/* Modals */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        stats={userStats}
        achievements={achievements}
        hallOfFame={hallOfFame}
        initialTab={profileInitialTab}
        onProfileUpdated={setUserProfile}
      />

      <DailyChallengeModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        challenge={dailyChallenge}
        todayResult={todayResult}
        onStartDaily={handleStartDailyChallenge}
      />

      <ManagerHubModal
        isOpen={isManagerHubOpen}
        onClose={() => setIsManagerHubOpen(false)}
        credits={managerCredits}
        onUpdateCredits={(c) => {
          setManagerCredits(c);
          saveManagerCredits(c);
        }}
        lineup={lineup}
        onUpdateLineup={setLineup}
        equippedPerks={equippedPerks}
        onUpdatePerks={(p) => {
          setEquippedPerks(p);
          saveEquippedPerks(p);
        }}
        playerUpgrades={playerUpgrades}
        onUpdatePlayerUpgrades={(u) => {
          setPlayerUpgrades(u);
          savePlayerUpgrades(u);
        }}
        lastMatchReward={lastMatchReward}
        stageName={stage}
      />
    </div>
  );
};

export default App;
