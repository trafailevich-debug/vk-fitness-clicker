import { useEffect, useRef, useState, useCallback } from 'react'
import bridge from '@vkontakte/vk-bridge'
import { APP_ID } from './config'
import { StatsBar } from './components/StatsBar'
import { ClickButton } from './components/ClickButton'
import { TrainersList } from './components/TrainersList'
import {
  GameState, Trainer, TRAINERS, LEVELS,
  getLevel, getTrainerCost, saveGame, loadGame,
} from './store/gameStore'
import './App.css'

const TICK_MS = 200

function buildInitialState(): GameState {
  const saved = loadGame()
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

  return {
    power: saved?.power ?? 0,
    totalPower: saved?.totalPower ?? 0,
    powerPerClick: 1,
    powerPerSecond: pps,
    level: 0,
    userName: '',
    trainers,
    clickAnimations: [],
  }
}

export default function App() {
  const [state, setState] = useState<GameState>(buildInitialState)

  // VK Bridge: init + get user name
  useEffect(() => {
    void APP_ID // используется для VK Storage и лидерборда
    bridge.send('VKWebAppInit').catch(() => {})
    bridge.send('VKWebAppGetUserInfo')
      .then(u => setState(s => ({ ...s, userName: u.first_name })))
      .catch(() => {})
  }, [])

  // Idle tick
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const interval = setInterval(() => {
      setState(s => {
        if (s.powerPerSecond === 0) return s
        const gain = s.powerPerSecond * (TICK_MS / 1000)
        return {
          ...s,
          power: s.power + gain,
          totalPower: s.totalPower + gain,
        }
      })
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [])

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => saveGame(stateRef.current), 5000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = useCallback(() => {
    setState(s => {
      const gain = s.powerPerClick
      return {
        ...s,
        power: s.power + gain,
        totalPower: s.totalPower + gain,
      }
    })
  }, [])

  const handleBuy = useCallback((id: string) => {
    setState(s => {
      const trainerIdx = s.trainers.findIndex(t => t.id === id)
      if (trainerIdx === -1) return s
      const trainer = s.trainers[trainerIdx]
      const cost = getTrainerCost(trainer, trainer.count)
      if (s.power < cost) return s

      const newTrainers = s.trainers.map((t, i) =>
        i === trainerIdx ? { ...t, count: t.count + 1 } : t
      )
      const pps = newTrainers.reduce((sum, t) => sum + t.baseIncome * t.count, 0)

      return {
        ...s,
        power: s.power - cost,
        trainers: newTrainers,
        powerPerSecond: pps,
      }
    })
  }, [])

  const level = getLevel(state.totalPower)
  const nextLevel = LEVELS.find(l => l.min > state.totalPower)
  const progress = nextLevel
    ? Math.min(100, ((state.totalPower - (LEVELS[LEVELS.indexOf(level) ] ?.min ?? 0)) / (nextLevel.min - (level.min))) * 100)
    : 100

  return (
    <div className="app">
      <div className="app-header">
        <span className="app-title">🏋️ Фитнес-клуб</span>
        <span className="app-level">{level.emoji} {level.label}</span>
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

        <ClickButton
          level={level}
          powerPerClick={state.powerPerClick}
          onСlick={handleClick}
        />

        <TrainersList
          trainers={state.trainers}
          power={state.power}
          onBuy={handleBuy}
        />
      </div>
    </div>
  )
}
