import { useState, useRef, useCallback } from 'react'
import { Trainer, CharacterStats, PROGRAMS, getTrainerCost, formatNumber } from '../store/gameStore'
import './TrainersList.css'

type WorkoutType = 'tap' | 'hold'
interface TrainerWorkout {
  type: WorkoutType; label: string
  target?: number; timeLimit?: number; duration?: number; reward: number
}

const TRAINER_WORKOUTS: Record<string, TrainerWorkout> = {
  rope:      { type: 'tap',  label: 'Прыжки', target: 15, timeLimit: 12, reward: 80  },
  dumbbells: { type: 'hold', label: 'Жим',    duration: 4,               reward: 150 },
  treadmill: { type: 'tap',  label: 'Бег',    target: 25, timeLimit: 18, reward: 120 },
  bike:      { type: 'tap',  label: 'Кардио', target: 20, timeLimit: 15, reward: 100 },
  trainer:   { type: 'tap',  label: 'Комплекс', target: 30, timeLimit: 20, reward: 300 },
  pool:      { type: 'hold', label: 'Заплыв', duration: 6,               reward: 500 },
}

// ── Tap mini-game ─────────────────────────────────────────────────────────────
function TapWorkout({ target, timeLimit, reward, onDone }: {
  target: number; timeLimit: number; reward: number; onDone: (ok: boolean) => void
}) {
  const [count, setCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const finished = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // start timer once on mount
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
    <div className="minigame">
      <div className="mg-row">
        <div className="mg-bars">
          <div className="mg-bar"><div className="mg-fill taps" style={{ width: `${(count / target) * 100}%` }} /></div>
          <div className="mg-bar"><div className="mg-fill time" style={{ width: `${(timeLeft / timeLimit) * 100}%` }} /></div>
        </div>
        <div className="mg-info">
          <span className="mg-count">{count}<em>/{target}</em></span>
          <span className={`mg-timer ${timeLeft <= 3 ? 'red' : ''}`}>{timeLeft}с</span>
        </div>
      </div>
      <button className="mg-tap-btn" onPointerDown={tap}>👊 ТАП! <span className="mg-reward">+{reward}💪</span></button>
    </div>
  )
}

// ── Hold mini-game ────────────────────────────────────────────────────────────
function HoldWorkout({ duration, reward, onDone }: {
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
    <div className="minigame hold-game">
      <div className="hold-wrap">
        <svg className="hold-svg" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="30" className="hold-bg" />
          <circle cx="36" cy="36" r="30" className="hold-fg"
            style={{ strokeDashoffset: circ - (circ * progress) / 100 }} />
        </svg>
        <span className="hold-pct">{Math.round(progress)}%</span>
      </div>
      <button
        className={`mg-hold-btn ${holding ? 'on' : ''}`}
        onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold}
      >
        {holding ? '🔥 Держи!' : '✊ Удержи'} <span className="mg-reward">+{reward}💪</span>
      </button>
    </div>
  )
}

// ── Trainer row ───────────────────────────────────────────────────────────────
function TrainerRow({ trainer, workedOutToday, isActive, onToggle, onComplete }: {
  trainer: Trainer; workedOutToday: boolean; isActive: boolean
  onToggle: () => void; onComplete: (reward: number) => void
}) {
  const [result, setResult] = useState<'ok' | 'fail' | null>(null)
  const w = TRAINER_WORKOUTS[trainer.id]

  const handleDone = useCallback((ok: boolean) => {
    setResult(ok ? 'ok' : 'fail')
    if (ok) onComplete(w.reward)
    setTimeout(() => setResult(null), 1800)
  }, [onComplete, w])

  const desc = workedOutToday ? '✅ Выполнено' :
    w.type === 'tap' ? `👊 ${w.target} раз за ${w.timeLimit}с` : `✊ Держи ${w.duration}с`

  return (
    <div className={`t-row ${isActive ? 'active' : ''} ${workedOutToday ? 'done' : ''}`}>
      <div className="t-main">
        <span className="t-emoji">{trainer.emoji}</span>
        <div className="t-info">
          <span className="t-name">{trainer.name}</span>
          <span className="t-desc">{desc}</span>
        </div>
        <div className="t-action">
          {workedOutToday    ? <span className="t-badge done">✓</span>
          : result === 'ok'  ? <span className="t-badge ok">+{w.reward}💪</span>
          : result === 'fail'? <span className="t-badge fail">😅</span>
          : isActive         ? <span className="t-badge running">…</span>
          :                    <button className="t-btn" onClick={onToggle}>Начать</button>}
        </div>
      </div>
      {isActive && !result && (
        w.type === 'tap'
          ? <TapWorkout target={w.target!} timeLimit={w.timeLimit!} reward={w.reward} onDone={handleDone} />
          : <HoldWorkout duration={w.duration!} reward={w.reward} onDone={handleDone} />
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface Props {
  trainers: Trainer[]; power: number; characterStats: CharacterStats
  trainerLastWorkout: Record<string, number>
  selectedProgram: string | null; programDone: boolean; programAlreadyClaimed: boolean
  onBuy: (id: string) => void
  onWorkoutComplete: (trainerId: string, reward: number) => void
  onSelectProgram: (id: string) => void
  onProgramComplete: (id: string) => void
}

export function TrainersList({
  trainers, power, characterStats, trainerLastWorkout,
  selectedProgram, programDone, programAlreadyClaimed,
  onBuy, onWorkoutComplete, onSelectProgram, onProgramComplete,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const midnight = new Date().setHours(0, 0, 0, 0)
  const doneToday = (id: string) => (trainerLastWorkout[id] ?? 0) > midnight

  const owned  = trainers.filter(t => t.count > 0)
  const locked = trainers.filter(t => t.count === 0)

  const selProg = PROGRAMS.find(p => p.id === selectedProgram)
  const progOwned = selProg ? selProg.trainerIds.filter(id => trainers.find(t => t.id === id && t.count > 0)) : []
  const progDoneN = progOwned.filter(id => doneToday(id)).length

  const handleComplete = useCallback((id: string, reward: number) => {
    setActiveId(null)
    onWorkoutComplete(id, reward)
  }, [onWorkoutComplete])

  return (
    <div className="tl-wrap">

      {/* ── Stats + Programs (single card) ── */}
      <div className="prog-card">
        {/* Stat chips */}
        <div className="stat-chips">
          <div className="stat-chip">
            <span>💪</span>
            <div className="chip-text">
              <span className="chip-name">Сила</span>
              <span className="chip-val">+{characterStats.strength}/клик</span>
            </div>
            <span className="chip-lv">Ур.{characterStats.strength}</span>
          </div>
          <div className="stat-chip-sep" />
          <div className="stat-chip">
            <span>🏃</span>
            <div className="chip-text">
              <span className="chip-name">Выносл.</span>
              <span className="chip-val">+{characterStats.endurance * 30}/день</span>
            </div>
            <span className="chip-lv">Ур.{characterStats.endurance}</span>
          </div>
        </div>

        <div className="prog-divider" />

        {/* Program tabs */}
        <div className="prog-tabs">
          {PROGRAMS.map(prog => {
            const unlocked = prog.trainerIds.some(id => trainers.find(t => t.id === id && t.count > 0))
            const sel = selectedProgram === prog.id
            return (
              <button
                key={prog.id}
                className={`prog-tab ${sel ? 'sel' : ''} ${!unlocked ? 'locked' : ''}`}
                onClick={() => unlocked && onSelectProgram(prog.id)}
                disabled={!unlocked}
              >
                {prog.emoji} {prog.name}{!unlocked ? ' 🔒' : ''}
              </button>
            )
          })}
        </div>

        {/* Program progress */}
        {selProg && (
          <div className="prog-progress">
            <div className="prog-prog-row">
              <span className="prog-desc">{selProg.desc}</span>
              <span className="prog-frac">{progDoneN}/{progOwned.length}</span>
            </div>
            <div className="prog-bar"><div className="prog-bar-fill" style={{
              width: `${progOwned.length ? (progDoneN / progOwned.length) * 100 : 0}%`
            }} /></div>
            {programDone && !programAlreadyClaimed && (
              <button className="prog-claim" onClick={() => onProgramComplete(selProg.id)}>
                🎉 Забрать +{selProg.powerBonus} 💪
              </button>
            )}
            {programAlreadyClaimed && <div className="prog-done">✅ Программа выполнена!</div>}
          </div>
        )}
      </div>

      {/* ── Owned trainers ── */}
      {owned.length > 0 && (
        <div className="t-section">
          <div className="t-section-title">Мои тренажёры</div>
          {owned.map(t => (
            <TrainerRow key={t.id} trainer={t}
              workedOutToday={doneToday(t.id)}
              isActive={activeId === t.id}
              onToggle={() => setActiveId(activeId === t.id ? null : t.id)}
              onComplete={(r) => handleComplete(t.id, r)}
            />
          ))}
        </div>
      )}

      {/* ── Buy trainers ── */}
      {locked.length > 0 && (
        <div className="t-section">
          <div className="t-section-title">Купить тренажёры</div>
          {locked.map(t => {
            const cost = getTrainerCost(t, t.count)
            const can = power >= cost
            const w = TRAINER_WORKOUTS[t.id]
            return (
              <div key={t.id} className={`t-row buy-row ${can ? 'can' : ''}`}>
                <span className="t-emoji">{t.emoji}</span>
                <div className="t-info">
                  <span className="t-name">{t.name}</span>
                  <span className="t-desc">
                    {w.type === 'tap'
                      ? `👊 ${w.target}×  → +${w.reward}💪`
                      : `✊ ${w.duration}с → +${w.reward}💪`}
                  </span>
                </div>
                <button className="buy-btn" disabled={!can} onClick={() => onBuy(t.id)}>
                  <span className="buy-cost">💪 {formatNumber(cost)}</span>
                  <span className="buy-lbl">Купить</span>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
