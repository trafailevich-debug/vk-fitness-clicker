import { useState, useEffect } from 'react'
import { DAILY_CHALLENGES } from '../store/gameStore'
import './DailyChallenges.css'

interface Props {
  completedChallenges: string[]
  onComplete: (id: string) => void
}

const CHALLENGE_DURATIONS: Record<string, number> = {
  water:   12,
  stretch: 30,
  squat:   45,
  pushup:  35,
  walk:    60,
}

const CHALLENGE_TIPS: Record<string, string> = {
  water:   'Пей медленно, маленькими глотками 💧',
  stretch: 'Дыши глубоко, тянись плавно 🌬️',
  squat:   'Спина ровная, колени за носки не заходят 🦵',
  pushup:  'Тело прямое как доска, грудь касается пола 💪',
  walk:    'Шагай активно, руки в движении 🚶',
}

export function DailyChallenges({ completedChallenges, onComplete }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [readyIds, setReadyIds] = useState<string[]>([])

  const allDone = completedChallenges.length === DAILY_CHALLENGES.length
  const totalReward = DAILY_CHALLENGES.reduce((s, c) => s + c.reward, 0)

  // Countdown tick
  useEffect(() => {
    if (!activeId) return
    if (timeLeft <= 0) {
      setReadyIds(prev => [...prev, activeId])
      setActiveId(null)
      return
    }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [activeId, timeLeft])

  const handleStart = (id: string) => {
    setActiveId(id)
    setTimeLeft(CHALLENGE_DURATIONS[id] ?? 30)
  }

  const handleFinish = (id: string) => {
    setReadyIds(prev => prev.filter(r => r !== id))
    onComplete(id)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}с`
  }

  return (
    <div className="challenges">
      <div className="challenges-header">
        <div>
          <div className="challenges-title">Ежедневные задания</div>
          <div className="challenges-subtitle">+{totalReward} силы за все</div>
        </div>
        <span className="challenges-reset">сброс в 00:00</span>
      </div>

      {allDone && (
        <div className="challenges-done-banner">
          🎉 Все задания выполнены! Приходи завтра.
        </div>
      )}

      {DAILY_CHALLENGES.map(c => {
        const done = completedChallenges.includes(c.id)
        const isActive = activeId === c.id
        const isReady = readyIds.includes(c.id)
        const duration = CHALLENGE_DURATIONS[c.id] ?? 30
        const progress = isActive ? ((duration - timeLeft) / duration) * 100 : 0

        return (
          <div key={c.id} className={`challenge-row ${done ? 'done' : ''} ${isActive ? 'active' : ''} ${isReady ? 'ready' : ''}`}>
            <div className="challenge-emoji">{done ? '✅' : c.emoji}</div>
            <div className="challenge-info">
              <div className="challenge-name">{c.name}</div>
              <div className="challenge-desc">
                {isActive ? CHALLENGE_TIPS[c.id] ?? c.description : c.description}
              </div>

              {isActive && (
                <div className="timer-bar-wrap">
                  <div className="timer-bar" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>

            <div className="challenge-right">
              <div className="challenge-reward">+{c.reward} 💪</div>

              {done ? (
                <div className="challenge-done-badge">✓ Готово</div>
              ) : isActive ? (
                <div className="challenge-timer">{formatTime(timeLeft)}</div>
              ) : isReady ? (
                <button className="challenge-btn finish" onClick={() => handleFinish(c.id)}>
                  Зачесть! ✓
                </button>
              ) : (
                <button className="challenge-btn start" onClick={() => handleStart(c.id)}>
                  Начать
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
