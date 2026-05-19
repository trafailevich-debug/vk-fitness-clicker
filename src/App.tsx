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
import { Leaderboard } from './components/Leaderboard'
import { VipWorkouts } from './components/VipWorkouts'
import {
  GameState, Trainer, TRAINERS, LEVELS, DAILY_CHALLENGES, PROGRAMS,
  MAX_DAILY_CLICKS, MAX_OFFLINE_SECONDS, ENDURANCE_CLICKS_PER_LEVEL,
  getLevel, getTrainerCost, saveGame, loadGame, todayStr, todayMidnightMs,
  formatNumber,
} from './store/gameStore'
import './App.css'

const TICK_MS = 200
const COMBO_RESET_MS = 1500
const FREEZE_COST = 200

export type Tab = 'train' | 'challenges' | 'leaderboard' | 'rewards'

const BG_PARTICLES = [
  { id: 0, size: 2, left: 8,  dur: 11, delay: 0,   color: 'rgba(96,165,250,0.7)' },
  { id: 1, size: 3, left: 19, dur: 14, delay: 2.1, color: 'rgba(167,139,250,0.6)' },
  { id: 2, size: 2, left: 31, dur: 9,  delay: 4.0, color: 'rgba(255,255,255,0.5)' },
  { id: 3, size: 3, left: 43, dur: 12, delay: 1.2, color: 'rgba(52,211,153,0.6)' },
  { id: 4, size: 2, left: 55, dur: 15, delay: 3.5, color: 'rgba(96,165,250,0.55)' },
  { id: 5, size: 3, left: 67, dur: 10, delay: 5.2, color: 'rgba(255,255,255,0.45)' },
  { id: 6, size: 2, left: 79, dur: 13, delay: 1.8, color: 'rgba(167,139,250,0.65)' },
  { id: 7, size: 3, left: 88, dur: 11, delay: 4.1, color: 'rgba(52,211,153,0.5)' },
]

function AppBackground() {
  return (
    <div className="app-bg" aria-hidden="true">
      {/* Aurora cloud blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      <div className="bg-blob bg-blob-4" />
      <div className="bg-blob bg-blob-5" />

      {/* 3D perspective grid */}
      <div className="bg-grid-scene">
        <div className="bg-grid" />
      </div>
      <div className="bg-grid-fade" />

      {/* Light particles */}
      {BG_PARTICLES.map(p => (
        <div
          key={p.id}
          className="bg-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}

function StatusBanner({ totalPower, completedChallenges }: { totalPower: number; completedChallenges: string[] }) {
  const level = getLevel(totalPower)
  const currentIdx = LEVELS.findIndex(l => l.label === level.label)
  const nextLevel = LEVELS[currentIdx + 1]

  if (!nextLevel || nextLevel.nextRequiredChallenges.length === 0) {
    return (
      <div className="status-banner">
        <div className="status-banner-top">
          <div className="status-level-chip">
            <span className="status-level-emoji">{level.emoji}</span>
            <span className="status-level-text">{level.label}</span>
          </div>
          <span className="status-power">💪 {formatNumber(totalPower)}</span>
        </div>
        <div className="status-hint">
          {nextLevel ? `До «${nextLevel.label}» — ${formatNumber(nextLevel.min - totalPower)} силы` : '🏆 Максимальный уровень!'}
        </div>
      </div>
    )
  }

  const reqs = nextLevel.nextRequiredChallenges
  const challenge = DAILY_CHALLENGES

  return (
    <div className="status-banner">
      <div className="status-banner-top">
        <div className="status-level-chip">
          <span className="status-level-emoji">{level.emoji}</span>
          <span className="status-level-text">{level.label}</span>
        </div>
        <span className="status-power">→ {nextLevel.emoji} {nextLevel.label}</span>
      </div>
      <div className="status-hint">Для следующего уровня выполни сегодня:</div>
      <div className="status-req-chips">
        {reqs.map(id => {
          const ch = challenge.find(c => c.id === id)
          const done = completedChallenges.includes(id)
          return (
            <span key={id} className={`status-req-chip ${done ? 'done' : 'todo'}`}>
              {done ? '✓ ' : ''}{ch?.name ?? id}
            </span>
          )
        })}
      </div>
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
  const completedVipWorkouts = isNewDay ? [] : ((saved as any)?.completedVipWorkouts ?? [])

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
    if (streakFreezes > 0) {
      // streak preserved
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
    completedVipWorkouts,
    dailyAllDoneDate: (saved as any)?.dailyAllDoneDate ?? '',
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

  const unlock = useCallback((id: string) => {
    setState(s => {
      if (s.achievements.includes(id)) return s
      setAchievementQueue(q => [...q, id])
      return { ...s, achievements: [...s.achievements, id] }
    })
  }, [])

  useEffect(() => {
    if (!currentAchievement && achievementQueue.length > 0) {
      setCurrentAchievement(achievementQueue[0])
      setAchievementQueue(q => q.slice(1))
      const t = setTimeout(() => setCurrentAchievement(null), 3200)
      return () => clearTimeout(t)
    }
  }, [achievementQueue, currentAchievement])

  useEffect(() => {
    bridge.send('VKWebAppInit').catch(() => {})
    bridge.send('VKWebAppGetUserInfo')
      .then(u => setState(s => ({ ...s, userName: u.first_name })))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const saved = loadGame()
    if (!saved?.lastActiveTime || !stateRef.current.powerPerSecond) return
    const secondsAway = (Date.now() - saved.lastActiveTime) / 1000
    if (secondsAway < 600) return
    const clampedSeconds = Math.min(secondsAway, MAX_OFFLINE_SECONDS)
    const gain = Math.floor(clampedSeconds * stateRef.current.powerPerSecond)
    if (gain <= 0) return
    setState(s => ({ ...s, power: s.power + gain, totalPower: s.totalPower + gain }))
    setOfflineGain({ gain, seconds: Math.floor(clampedSeconds) })
    if (secondsAway >= 3600) unlock('offline_1h')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  useEffect(() => {
    const interval = setInterval(() => saveGame(stateRef.current), 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const today = todayStr()
      setState(s => {
        if (s.lastDailyReset === today) return s
        return {
          ...s,
          dailyClicksLeft: MAX_DAILY_CLICKS,
          lastDailyReset: today,
          completedChallenges: [],
          completedVipWorkouts: [],
        }
      })
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  const level = getLevel(state.totalPower)
  useEffect(() => {
    if (state.streak >= 7) unlock('streak_7')
    else if (state.streak >= 3) unlock('streak_3')
  }, [state.streak, unlock])
  useEffect(() => {
    if (level.label === 'Спортсмен') unlock('level_sportsman')
    else if (level.label === 'Начинающий') unlock('level_amateur')
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

  const handleVipComplete = useCallback((id: string, reward: number) => {
    setState(s => {
      if (s.completedVipWorkouts.includes(id)) return s
      return {
        ...s,
        power: s.power + reward,
        totalPower: s.totalPower + reward,
        completedVipWorkouts: [...s.completedVipWorkouts, id],
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

    const totalAfter = stateRef.current.totalClicks + 1
    if (totalAfter === 1) unlock('first_click')
    if (totalAfter === 50) unlock('clicks_50')
    if (totalAfter === 500) unlock('clicks_500')
    if (c >= 5 && c < 6) unlock('combo_x2')
    if (c >= 10 && c < 11) unlock('combo_x3')

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
      const allDone = newCompleted.length === DAILY_CHALLENGES.length
      if (allDone) {
        setTimeout(() => unlock('all_challenges'), 100)
        setTimeout(() => unlock('vip_unlocked'), 200)
      }
      return {
        ...s,
        power: s.power + ch.reward,
        totalPower: s.totalPower + ch.reward,
        completedChallenges: newCompleted,
        dailyAllDoneDate: allDone ? todayStr() : s.dailyAllDoneDate,
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

  const selectedProg = PROGRAMS.find(p => p.id === state.selectedProgram)
  const todayMidnight = todayMidnightMs()
  const programDone = selectedProg
    ? selectedProg.trainerIds
        .filter(id => state.trainers.find(t => t.id === id && t.count > 0))
        .every(id => (state.trainerLastWorkout[id] ?? 0) > todayMidnight)
    : false
  const programAlreadyClaimed = state.programLastCompleted === todayStr()

  const vipUnlocked = state.dailyAllDoneDate === todayStr()

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
        <span className="app-title">✦ FitLife</span>
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
            <StatusBanner
              totalPower={state.totalPower}
              completedChallenges={state.completedChallenges}
            />
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
            <VipWorkouts
              vipUnlocked={vipUnlocked}
              completedVipWorkouts={state.completedVipWorkouts}
              onComplete={handleVipComplete}
            />
          </>
        )}

        {tab === 'challenges' && (
          <DailyChallenges
            completedChallenges={state.completedChallenges}
            onComplete={handleCompleteChallenge}
            vipJustUnlocked={vipUnlocked && state.completedChallenges.length === DAILY_CHALLENGES.length}
          />
        )}

        {tab === 'leaderboard' && (
          <Leaderboard
            totalPower={state.totalPower}
            userName={state.userName}
            streak={state.streak}
          />
        )}

        {tab === 'rewards' && (
          <>
            <RewardsPanel
              unlockedIds={state.achievements}
              totalClicks={state.totalClicks}
              streak={state.streak}
            />
            <ProgressDiary
              state={state}
              onBuyFreeze={handleBuyFreeze}
            />
          </>
        )}
      </div>

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
