import { useEffect, useRef, useState, useCallback } from 'react'
import bridge from '@vkontakte/vk-bridge'
import { StatsBar } from './components/StatsBar'
import { ClickButton } from './components/ClickButton'
import { TrainersList } from './components/TrainersList'
import { DailyChallenges } from './components/DailyChallenges'
import { TabBar } from './components/TabBar'
import {
  GameState, Trainer, TRAINERS, LEVELS, DAILY_CHALLENGES, MAX_DAILY_CLICKS,
  getLevel, getTrainerCost, saveGame, loadGame, todayStr,
} from './store/gameStore'
import './App.css'

const TICK_MS = 200
const COMBO_RESET_MS = 1500

export type Tab = 'train' | 'challenges' | 'upgrades'

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
  if (lastLogin === today) {
    // already counted today
  } else if (lastLogin === yesterdayStr) {
    streak = streak + 1
  } else {
    streak = 1
  }

  return {
    power: saved?.power ?? 0,
    totalPower: saved?.totalPower ?? 0,
    powerPerSecond: pps,
    userName: '',
    trainers,
    dailyClicksLeft,
    lastDailyReset: today,
    completedChallenges,
    streak,
    lastLoginDate: today,
  }
}

export default function App() {
  const [state, setState] = useState<GameState>(buildInitialState)
  const [tab, setTab] = useState<Tab>('train')
  const [comboCount, setComboCount] = useState(0)
  const comboCountRef = useRef(0)
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    bridge.send('VKWebAppInit').catch(() => {})
    bridge.send('VKWebAppGetUserInfo')
      .then(u => setState(s => ({ ...s, userName: u.first_name })))
      .catch(() => {})
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
        return { ...s, dailyClicksLeft: MAX_DAILY_CLICKS, lastDailyReset: today, completedChallenges: [] }
      })
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = useCallback(() => {
    comboCountRef.current += 1
    const c = comboCountRef.current
    setComboCount(c)

    const multiplier = c >= 10 ? 3 : c >= 5 ? 2 : 1

    setState(s => {
      if (s.dailyClicksLeft <= 0) return s
      return {
        ...s,
        power: s.power + multiplier,
        totalPower: s.totalPower + multiplier,
        dailyClicksLeft: s.dailyClicksLeft - 1,
      }
    })

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current)
    comboTimerRef.current = setTimeout(() => {
      comboCountRef.current = 0
      setComboCount(0)
    }, COMBO_RESET_MS)
  }, [])

  const handleCompleteChallenge = useCallback((id: string) => {
    setState(s => {
      if (s.completedChallenges.includes(id)) return s
      const ch = DAILY_CHALLENGES.find(c => c.id === id)
      if (!ch) return s
      return {
        ...s,
        power: s.power + ch.reward,
        totalPower: s.totalPower + ch.reward,
        completedChallenges: [...s.completedChallenges, id],
      }
    })
  }, [])

  const handleBuy = useCallback((id: string) => {
    setState(s => {
      const idx = s.trainers.findIndex(t => t.id === id)
      if (idx === -1) return s
      const t = s.trainers[idx]
      const cost = getTrainerCost(t, t.count)
      if (s.power < cost) return s
      const newTrainers = s.trainers.map((tr, i) =>
        i === idx ? { ...tr, count: tr.count + 1 } : tr
      )
      const pps = newTrainers.reduce((sum, tr) => sum + tr.baseIncome * tr.count, 0)
      return { ...s, power: s.power - cost, trainers: newTrainers, powerPerSecond: pps }
    })
  }, [])

  const level = getLevel(state.totalPower)
  const currentLevelIdx = LEVELS.findIndex(l => l.label === level.label)
  const nextLevel = LEVELS[currentLevelIdx + 1]
  const progress = nextLevel
    ? Math.min(100, ((state.totalPower - level.min) / (nextLevel.min - level.min)) * 100)
    : 100

  const comboMultiplier = comboCount >= 10 ? 3 : comboCount >= 5 ? 2 : 1

  return (
    <div className="app">
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
        />

        {tab === 'train' && (
          <ClickButton
            level={level}
            comboMultiplier={comboMultiplier}
            comboCount={comboCount}
            dailyClicksLeft={state.dailyClicksLeft}
            maxDailyClicks={MAX_DAILY_CLICKS}
            onСlick={handleClick}
          />
        )}

        {tab === 'challenges' && (
          <DailyChallenges
            completedChallenges={state.completedChallenges}
            onComplete={handleCompleteChallenge}
          />
        )}

        {tab === 'upgrades' && (
          <TrainersList
            trainers={state.trainers}
            power={state.power}
            onBuy={handleBuy}
          />
        )}
      </div>

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
