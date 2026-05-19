import { useEffect, useRef, useState, useCallback } from 'react'
import bridge from '@vkontakte/vk-bridge'
import { StatsBar } from './components/StatsBar'
import { ClickButton } from './components/ClickButton'
import { TrainersList } from './components/TrainersList'
import { DailyChallenges } from './components/DailyChallenges'
import { ProgressDiary } from './components/ProgressDiary'
import { RewardsPanel } from './components/RewardsPanel'
import { TabBar } from './components/TabBar'
import { OfflineEarnings } from './components/OfflineEarnings'
import { AchievementToast } from './components/AchievementToast'
import {
  GameState, Trainer, TRAINERS, LEVELS, DAILY_CHALLENGES, PROGRAMS,
  MAX_DAILY_CLICKS, MAX_OFFLINE_SECONDS, ENDURANCE_CLICKS_PER_LEVEL,
  getLevel, getTrainerCost, saveGame, loadGame, todayStr, todayMidnightMs,
} from './store/gameStore'
import './App.css'

const TICK_MS = 200
const COMBO_RESET_MS = 1500
const FREEZE_COST = 200

export type Tab = 'train' | 'challenges' | 'diary' | 'rewards'

const BG_PARTICLES = [
  { id: 0, size: 3, left: 7,  dur: 9,  delay: 0,   color: '#FF5722' },
  { id: 1, size: 5, left: 17, dur: 11, delay: 1.8, color: '#FF9800' },
  { id: 2, size: 3, left: 27, dur: 8,  delay: 3.2, color: 'rgba(255,255,255,0.55)' },
  { id: 3, size: 4, left: 36, dur: 10, delay: 0.6, color: '#FF5722' },
  { id: 4, size: 6, left: 46, dur: 13, delay: 2.5, color: '#FF9800' },
  { id: 5, size: 3, left: 57, dur: 9,  delay: 4.8, color: 'rgba(255,255,255,0.45)' },
  { id: 6, size: 5, left: 66, dur: 11, delay: 1.4, color: '#FF5722' },
  { id: 7, size: 4, left: 77, dur: 8,  delay: 3.9, color: '#FF9800' },
  { id: 8, size: 3, left: 87, dur: 10, delay: 0.9, color: 'rgba(255,255,255,0.5)' },
  { id: 9, size: 4, left: 94, dur: 12, delay: 5.5, color: '#FF5722' },
]

const BG_EQUIPMENT = [
  { emoji: '🏋️', size: 72, left: 6,  top: 18, dur: 8,  delay: 0 },
  { emoji: '💪',  size: 58, left: 80, top: 12, dur: 10, delay: 1.8 },
  { emoji: '🎽',  size: 52, left: 52, top: 58, dur: 9,  delay: 3.5 },
  { emoji: '⚡',  size: 48, left: 14, top: 62, dur: 11, delay: 2.2 },
  { emoji: '🔥',  size: 44, left: 88, top: 52, dur: 7,  delay: 4.5 },
  { emoji: '🥇',  size: 42, left: 40, top: 25, dur: 12, delay: 1 },
]

function AppBackground() {
  return (
    <div className="app-bg" aria-hidden="true">
      {/* 3D floor */}
      <div className="bg-floor-scene">
        <div className="bg-floor" />
      </div>
      <div className="bg-floor-fade" />

      {/* Ceiling spotlights */}
      <div className="bg-spot bg-spot-1" />
      <div className="bg-spot bg-spot-2" />

      {/* Ambient glows */}
      <div className="app-bg-glow glow-1" />
      <div className="app-bg-glow glow-2" />
      <div className="app-bg-glow glow-3" />

      {/* Floating gym equipment */}
      {BG_EQUIPMENT.map((e, i) => (
        <div
          key={i}
          className="bg-equipment"
          style={{
            fontSize: e.size,
            left: `${e.left}%`,
            top: `${e.top}%`,
            animationDuration: `${e.dur}s`,
            animationDelay: `${e.delay}s`,
          }}
        >
          {e.emoji}
        </div>
      ))}

      {/* Energy particles */}
      {BG_PARTICLES.map(p => (
        <div
          key={p.id}
          className="app-bg-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}

function buildInitialState(): GameState {
  const saved = loadGame()
  const today = todayStr()

  const trainerCounts: Record<string, number> = {}
  if (saved?.trainers) {
    for (const t of saved.trainers as { id: string; count: number }[]) {
      trainerCounts[t.id] = t.count
    }
  }

  const trainers: Trainer[] = TRAINERS.map(t => ({
    ...t,
    count: trainerCounts[t.id] ?? 0,
  }))
  const pps = trainers.reduce((sum, t) => sum + t.baseIncome * t.count, 0)

  const isNewDay = (saved?.lastDailyReset ?? '') !== today
  const dailyClicksLeft = isNewDay ? MAX_DAILY_CLICKS : (saved?.dailyClicksLeft ?? MAX_DAILY_CLICKS)
  const completedChallenges = isNewDay ? [] : (saved?.completedChallenges ?? [])

  const lastLogin = saved?.lastLoginDate ?? ''
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  let streak = saved?.streak ?? 0
  const streakFreezes = saved?.streakFreezes ?? 0

  if (lastLogin === today) {
    // already counted
  } else if (lastLogin === yesterdayStr) {
    streak = streak + 1
  } else if (lastLogin === '') {
    streak = 1
  } else {
    // missed a day — use freeze if available
    if (streakFreezes > 0) {
      // streak preserved by freeze, freeze consumed
    } else {
      streak = 1
    }
  }

  return {
    power: saved?.power ?? 0,
    totalPower: saved?.totalPower ?? 0,
    totalClicks: saved?.totalClicks ?? 0,
    powerPerSecond: pps,
    userName: '',
    trainers,
    dailyClicksLeft,
    lastDailyReset: today,
    completedChallenges,
    streak,
    lastLoginDate: today,
    streakFreezes: lastLogin !== today && lastLogin !== yesterdayStr && (saved?.streakFreezes ?? 0) > 0
      ? (saved?.streakFreezes ?? 1) - 1
      : (saved?.streakFreezes ?? 0),
    achievements: saved?.achievements ?? [],
    lastActiveTime: Date.now(),
    characterStats: (saved as any)?.characterStats ?? { strength: 0, endurance: 0 },
    trainerLastWorkout: (saved as any)?.trainerLastWorkout ?? {},
    selectedProgram: (saved as any)?.selectedProgram ?? null,
    programLastCompleted: (saved as any)?.programLastCompleted ?? '',
  }
}

export default function App() {
  const [state, setState] = useState<GameState>(buildInitialState)
  const [tab, setTab] = useState<Tab>('train')
  const [comboCount, setComboCount] = useState(0)
  const [offlineGain, setOfflineGain] = useState<{ gain: number; seconds: number } | null>(null)
  const [achievementQueue, setAchievementQueue] = useState<string[]>([])
  const [currentAchievement, setCurrentAchievement] = useState<string | null>(null)

  const comboCountRef = useRef(0)
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  // Unlock achievement (deduped)
  const unlock = useCallback((id: string) => {
    setState(s => {
      if (s.achievements.includes(id)) return s
      setAchievementQueue(q => [...q, id])
      return { ...s, achievements: [...s.achievements, id] }
    })
  }, [])

  // Process achievement queue one-by-one
  useEffect(() => {
    if (!currentAchievement && achievementQueue.length > 0) {
      setCurrentAchievement(achievementQueue[0])
      setAchievementQueue(q => q.slice(1))
      const t = setTimeout(() => setCurrentAchievement(null), 3200)
      return () => clearTimeout(t)
    }
  }, [achievementQueue, currentAchievement])

  // VK Bridge
  useEffect(() => {
    bridge.send('VKWebAppInit').catch(() => {})
    bridge.send('VKWebAppGetUserInfo')
      .then(u => setState(s => ({ ...s, userName: u.first_name })))
      .catch(() => {})
  }, [])

  // Offline earnings on mount
  useEffect(() => {
    const saved = loadGame()
    if (!saved?.lastActiveTime || !stateRef.current.powerPerSecond) return
    const secondsAway = (Date.now() - saved.lastActiveTime) / 1000
    if (secondsAway < 600) return // less than 10 min — skip
    const clampedSeconds = Math.min(secondsAway, MAX_OFFLINE_SECONDS)
    const gain = Math.floor(clampedSeconds * stateRef.current.powerPerSecond)
    if (gain <= 0) return
    setState(s => ({ ...s, power: s.power + gain, totalPower: s.totalPower + gain }))
    setOfflineGain({ gain, seconds: Math.floor(clampedSeconds) })
    if (secondsAway >= 3600) unlock('offline_1h')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Idle tick
  useEffect(() => {
    const interval = setInterval(() => {
      setState(s => {
        if (s.powerPerSecond === 0) return s
        const gain = s.powerPerSecond * (TICK_MS / 1000)
        return { ...s, power: s.power + gain, totalPower: s.totalPower + gain }
      })
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [])

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => saveGame(stateRef.current), 5000)
    return () => clearInterval(interval)
  }, [])

  // Daily reset
  useEffect(() => {
    const interval = setInterval(() => {
      const today = todayStr()
      setState(s => {
        if (s.lastDailyReset === today) return s
        return { ...s, dailyClicksLeft: MAX_DAILY_CLICKS, lastDailyReset: today, completedChallenges: [] }
      })
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  // Achievement watchers
  const level = getLevel(state.totalPower)
  useEffect(() => {
    if (state.streak >= 7) unlock('streak_7')
    else if (state.streak >= 3) unlock('streak_3')
  }, [state.streak, unlock])
  useEffect(() => {
    if (level.label === 'Спортсмен') unlock('level_sportsman')
    else if (level.label === 'Любитель') unlock('level_amateur')
  }, [level.label, unlock])

  const handleWorkoutComplete = useCallback((trainerId: string, reward: number) => {
    setState(s => ({
      ...s,
      power: s.power + reward,
      totalPower: s.totalPower + reward,
      trainerLastWorkout: { ...s.trainerLastWorkout, [trainerId]: Date.now() },
    }))
  }, [])

  const handleSelectProgram = useCallback((programId: string) => {
    setState(s => ({ ...s, selectedProgram: programId }))
  }, [])

  const handleProgramComplete = useCallback((programId: string) => {
    const prog = PROGRAMS.find(p => p.id === programId)
    if (!prog) return
    setState(s => {
      if (s.programLastCompleted === todayStr()) return s
      return {
        ...s,
        power: s.power + prog.powerBonus,
        totalPower: s.totalPower + prog.powerBonus,
        programLastCompleted: todayStr(),
        characterStats: {
          strength: s.characterStats.strength + (prog.statBonus.strength ?? 0),
          endurance: s.characterStats.endurance + (prog.statBonus.endurance ?? 0),
        },
      }
    })
  }, [])

  const handleClick = useCallback(() => {
    comboCountRef.current += 1
    const c = comboCountRef.current
    setComboCount(c)
    const multiplier = c >= 10 ? 3 : c >= 5 ? 2 : 1

    setState(s => {
      if (s.dailyClicksLeft <= 0) return s
      const clickPower = multiplier + s.characterStats.strength
      const newClicks = s.totalClicks + 1
      return {
        ...s,
        power: s.power + clickPower,
        totalPower: s.totalPower + clickPower,
        totalClicks: newClicks,
        dailyClicksLeft: s.dailyClicksLeft - 1,
      }
    })

    // Click-based achievements
    const newClicks = comboCountRef.current
    const totalAfter = stateRef.current.totalClicks + 1
    if (totalAfter === 1) unlock('first_click')
    if (totalAfter === 50) unlock('clicks_50')
    if (totalAfter === 500) unlock('clicks_500')
    if (c >= 5 && c < 6) unlock('combo_x2')
    if (c >= 10 && c < 11) unlock('combo_x3')
    void newClicks

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current)
    comboTimerRef.current = setTimeout(() => {
      comboCountRef.current = 0
      setComboCount(0)
    }, COMBO_RESET_MS)
  }, [unlock])

  const handleCompleteChallenge = useCallback((id: string) => {
    setState(s => {
      if (s.completedChallenges.includes(id)) return s
      const ch = DAILY_CHALLENGES.find(c => c.id === id)
      if (!ch) return s
      const newCompleted = [...s.completedChallenges, id]
      if (newCompleted.length === 1) setTimeout(() => unlock('first_challenge'), 0)
      if (newCompleted.length === DAILY_CHALLENGES.length) setTimeout(() => unlock('all_challenges'), 100)
      return {
        ...s,
        power: s.power + ch.reward,
        totalPower: s.totalPower + ch.reward,
        completedChallenges: newCompleted,
      }
    })
  }, [unlock])

  const handleBuy = useCallback((id: string) => {
    setState(s => {
      const idx = s.trainers.findIndex(t => t.id === id)
      if (idx === -1) return s
      const t = s.trainers[idx]
      const cost = getTrainerCost(t, t.count)
      if (s.power < cost) return s
      const wasFirst = s.trainers.every(tr => tr.count === 0)
      if (wasFirst) setTimeout(() => unlock('first_trainer'), 0)
      const newTrainers = s.trainers.map((tr, i) =>
        i === idx ? { ...tr, count: tr.count + 1 } : tr
      )
      const pps = newTrainers.reduce((sum, tr) => sum + tr.baseIncome * tr.count, 0)
      return { ...s, power: s.power - cost, trainers: newTrainers, powerPerSecond: pps }
    })
  }, [unlock])

  const handleBuyFreeze = useCallback(() => {
    setState(s => {
      if (s.power < FREEZE_COST || s.streakFreezes > 0) return s
      return { ...s, power: s.power - FREEZE_COST, streakFreezes: 1 }
    })
  }, [])

  const currentLevelIdx = LEVELS.findIndex(l => l.label === level.label)
  const nextLevel = LEVELS[currentLevelIdx + 1]
  const progress = nextLevel
    ? Math.min(100, ((state.totalPower - level.min) / (nextLevel.min - level.min)) * 100)
    : 100
  const comboMultiplier = comboCount >= 10 ? 3 : comboCount >= 5 ? 2 : 1
  const effectiveMaxClicks = MAX_DAILY_CLICKS + state.characterStats.endurance * ENDURANCE_CLICKS_PER_LEVEL

  // Program completion check
  const selectedProg = PROGRAMS.find(p => p.id === state.selectedProgram)
  const todayMidnight = todayMidnightMs()
  const programDone = selectedProg
    ? selectedProg.trainerIds
        .filter(id => state.trainers.find(t => t.id === id && t.count > 0))
        .every(id => (state.trainerLastWorkout[id] ?? 0) > todayMidnight)
    : false
  const programAlreadyClaimed = state.programLastCompleted === todayStr()

  return (
    <div className="app">
      <AppBackground />
      {offlineGain && (
        <OfflineEarnings
          gain={offlineGain.gain}
          seconds={offlineGain.seconds}
          onCollect={() => setOfflineGain(null)}
        />
      )}

      <AchievementToast achievementId={currentAchievement} />

      <div className="app-header">
        <span className="app-title">🏋️ Фитнес-клуб</span>
        <div className="app-header-right">
          {state.streak > 1 && <span className="streak-badge">🔥 {state.streak}</span>}
          <span className="app-level">{level.emoji} {level.label}</span>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="app-content">
        <StatsBar
          power={state.power}
          powerPerSecond={state.powerPerSecond}
          totalPower={state.totalPower}
          userName={state.userName}
          streakFreezes={state.streakFreezes}
          onBuyFreeze={handleBuyFreeze}
        />

        {tab === 'train' && (
          <>
            <ClickButton
              level={level}
              comboMultiplier={comboMultiplier}
              comboCount={comboCount}
              dailyClicksLeft={state.dailyClicksLeft}
              maxDailyClicks={effectiveMaxClicks}
              strengthBonus={state.characterStats.strength}
              onСlick={handleClick}
            />
            <TrainersList
              trainers={state.trainers}
              power={state.power}
              characterStats={state.characterStats}
              trainerLastWorkout={state.trainerLastWorkout}
              selectedProgram={state.selectedProgram}
              programDone={programDone}
              programAlreadyClaimed={programAlreadyClaimed}
              onBuy={handleBuy}
              onWorkoutComplete={handleWorkoutComplete}
              onSelectProgram={handleSelectProgram}
              onProgramComplete={handleProgramComplete}
            />
          </>
        )}

        {tab === 'challenges' && (
          <DailyChallenges
            completedChallenges={state.completedChallenges}
            onComplete={handleCompleteChallenge}
          />
        )}

        {tab === 'diary' && (
          <ProgressDiary
            state={state}
            onBuyFreeze={handleBuyFreeze}
          />
        )}

        {tab === 'rewards' && (
          <RewardsPanel
            unlockedIds={state.achievements}
            totalClicks={state.totalClicks}
            streak={state.streak}
          />
        )}
      </div>

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
