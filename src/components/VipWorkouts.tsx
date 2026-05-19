import { useState, useRef, useCallback } from 'react'
import { VIP_WORKOUTS, VipWorkout } from '../store/gameStore'
import './VipWorkouts.css'

interface Props {
  vipUnlocked: boolean
  completedVipWorkouts: string[]
  onComplete: (id: string, reward: number) => void
}

function TapMiniGame({ target, timeLimit, reward, onDone }: {
  target: number; timeLimit: number; reward: number; onDone: (ok: boolean) => void
}) {
  const [count, setCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const finished = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useRef((() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current!)
          if (!finished.current) { finished.current = true; onDone(false) }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  })())

  const tap = useCallback(() => {
    if (finished.current) return
    setCount(c => {
      const next = c + 1
      if (next >= target) {
        clearInterval(timerRef.current!)
        if (!finished.current) { finished.current = true; onDone(true) }
      }
      return next
    })
  }, [target, onDone])

  return (
    <div className="vip-minigame">
      <div className="vip-mg-stats">
        <span className="vip-mg-count">{count}<em>/{target}</em></span>
        <span className={`vip-mg-timer ${timeLeft <= 4 ? 'urgent' : ''}`}>{timeLeft}с</span>
      </div>
      <div className="vip-mg-bars">
        <div className="vip-mg-bar"><div className="vip-mg-fill taps" style={{ width: `${(count / target) * 100}%` }} /></div>
        <div className="vip-mg-bar"><div className="vip-mg-fill time" style={{ width: `${(timeLeft / timeLimit) * 100}%` }} /></div>
      </div>
      <button className="vip-tap-btn" onPointerDown={tap}>
        ⚡ ТАП! <span className="vip-reward-tag">+{reward} 💪</span>
      </button>
    </div>
  )
}

function HoldMiniGame({ duration, reward, onDone }: {
  duration: number; reward: number; onDone: (ok: boolean) => void
}) {
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const finished = useRef(false)

  const startHold = useCallback(() => {
    setHolding(true)
    ivRef.current = setInterval(() => {
      setProgress(p => {
        const next = p + 100 / (duration * 10)
        if (next >= 100) {
          clearInterval(ivRef.current!)
          if (!finished.current) { finished.current = true; onDone(true) }
          return 100
        }
        return next
      })
    }, 100)
  }, [duration, onDone])

  const endHold = useCallback(() => {
    setHolding(false)
    if (ivRef.current) clearInterval(ivRef.current)
    if (!finished.current) setProgress(0)
  }, [])

  const circ = 213.6
  return (
    <div className="vip-minigame hold">
      <div className="vip-hold-wrap">
        <svg className="vip-hold-svg" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="30" className="vip-hold-bg" />
          <circle cx="36" cy="36" r="30" className="vip-hold-fg"
            style={{ strokeDashoffset: circ - (circ * progress) / 100 }} />
        </svg>
        <span className="vip-hold-pct">{Math.round(progress)}%</span>
      </div>
      <button
        className={`vip-hold-btn ${holding ? 'on' : ''}`}
        onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold}
      >
        {holding ? '🌟 Держи!' : '✋ Удержи'} <span className="vip-reward-tag">+{reward} 💪</span>
      </button>
    </div>
  )
}

function VipWorkoutCard({ workout, done, onComplete }: {
  workout: VipWorkout; done: boolean; onComplete: (reward: number) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [result, setResult] = useState<'ok' | 'fail' | null>(null)

  const handleDone = useCallback((ok: boolean) => {
    setResult(ok ? 'ok' : 'fail')
    if (ok) onComplete(workout.reward)
    setPlaying(false)
    setTimeout(() => setResult(null), 2200)
  }, [onComplete, workout.reward])

  return (
    <div className={`vip-card ${done ? 'done' : ''} ${playing ? 'playing' : ''}`}>
      <div className="vip-card-main" onClick={() => !playing && !done && setExpanded(e => !e)}>
        <div className="vip-card-emoji">{workout.emoji}</div>
        <div className="vip-card-info">
          <div className="vip-card-name">{workout.name}</div>
          <div className="vip-card-desc">{workout.description}</div>
        </div>
        <div className="vip-card-right">
          {done ? (
            <span className="vip-done-badge">✓</span>
          ) : result === 'ok' ? (
            <span className="vip-result ok">+{workout.reward}💪</span>
          ) : result === 'fail' ? (
            <span className="vip-result fail">😅</span>
          ) : (
            <div className="vip-reward">{workout.reward} 💪</div>
          )}
        </div>
      </div>

      {expanded && !done && !playing && (
        <div className="vip-detail">
          <div className="vip-how-to">
            <div className="vip-section-title">Как делать:</div>
            <ol className="vip-steps">
              {workout.howTo.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="vip-benefit">
            <span className="vip-benefit-icon">💚</span>
            <span className="vip-benefit-text">{workout.healthBenefit}</span>
          </div>
          <button className="vip-start-btn" onClick={() => { setExpanded(false); setPlaying(true) }}>
            🚀 Начать тренировку
          </button>
        </div>
      )}

      {playing && !done && (
        <div className="vip-game-wrap">
          {workout.type === 'tap'
            ? <TapMiniGame target={workout.target!} timeLimit={workout.timeLimit!} reward={workout.reward} onDone={handleDone} />
            : <HoldMiniGame duration={workout.duration!} reward={workout.reward} onDone={handleDone} />
          }
        </div>
      )}
    </div>
  )
}

export function VipWorkouts({ vipUnlocked, completedVipWorkouts, onComplete }: Props) {
  return (
    <div className="vip-section">
      <div className="vip-header">
        <div className="vip-header-left">
          <div className="vip-title">👑 VIP-тренировки</div>
          <div className="vip-subtitle">
            {vipUnlocked
              ? 'Открыты! Выполни все для бонусных очков'
              : 'Выполни все дневные задания чтобы открыть'}
          </div>
        </div>
        {vipUnlocked && (
          <div className="vip-badge-unlocked">ОТКРЫТО</div>
        )}
      </div>

      {!vipUnlocked ? (
        <div className="vip-locked-overlay">
          <div className="vip-lock-icon">🔒</div>
          <div className="vip-lock-text">Выполни все 8 заданий дня</div>
          <div className="vip-lock-hint">VIP-тренировки дают в 3× больше силы</div>
        </div>
      ) : (
        <div className="vip-list">
          {VIP_WORKOUTS.map(w => (
            <VipWorkoutCard
              key={w.id}
              workout={w}
              done={completedVipWorkouts.includes(w.id)}
              onComplete={(reward) => onComplete(w.id, reward)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
