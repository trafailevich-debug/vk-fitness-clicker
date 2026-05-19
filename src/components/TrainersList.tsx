import { useState, useEffect, useRef, useCallback } from 'react'
import { Trainer, CharacterStats, PROGRAMS, getTrainerCost, formatNumber } from '../store/gameStore'
import './TrainersList.css'

// ── Workout definitions ──────────────────────────────────────────────────────

type WorkoutType = 'tap' | 'hold'

interface TrainerWorkout {
  type: WorkoutType
  label: string
  target?: number     // tap: сколько нажатий
  timeLimit?: number  // tap: секунд на всё
  duration?: number   // hold: держать N секунд
  reward: number
}

const TRAINER_WORKOUTS: Record<string, TrainerWorkout> = {
  rope:      { type: 'tap',  label: 'Прыжки со скакалкой', target: 15, timeLimit: 12, reward: 80  },
  dumbbells: { type: 'hold', label: 'Жим гантелей',         duration: 4,               reward: 150 },
  treadmill: { type: 'tap',  label: 'Пробежка',             target: 25, timeLimit: 18, reward: 120 },
  bike:      { type: 'tap',  label: 'Велотренировка',       target: 20, timeLimit: 15, reward: 100 },
  trainer:   { type: 'tap',  label: 'Тренировка с тренером',target: 30, timeLimit: 20, reward: 300 },
  pool:      { type: 'hold', label: 'Заплыв в бассейне',    duration: 6,               reward: 500 },
}

// ── Mini-game: Tap challenge ─────────────────────────────────────────────────

function TapWorkout({ target, timeLimit, reward, onDone }: {
  target: number; timeLimit: number; reward: number
  onDone: (success: boolean) => void
}) {
  const [count, setCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const finished = useRef(false)

  useEffect(() => {
    if (count >= target) {
      if (!finished.current) { finished.current = true; onDone(true) }
      return
    }
    if (timeLeft <= 0) {
      if (!finished.current) { finished.current = true; onDone(false) }
      return
    }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, count, target, onDone])

  const pct = (count / target) * 100
  const timePct = (timeLeft / timeLimit) * 100

  return (
    <div className="minigame tap-game">
      <div className="mg-stats">
        <span className="mg-count">{count}<span className="mg-total">/{target}</span></span>
        <span className={`mg-timer ${timeLeft <= 3 ? 'danger' : ''}`}>{timeLeft}с</span>
      </div>
      <div className="mg-bar-row">
        <div className="mg-bar"><div className="mg-bar-fill taps" style={{ width: `${pct}%` }} /></div>
        <div className="mg-bar"><div className="mg-bar-fill time" style={{ width: `${timePct}%` }} /></div>
      </div>
      <button className="mg-tap-btn" onPointerDown={() => setCount(c => c + 1)}>
        👊 ТАП!
      </button>
      <div className="mg-reward-hint">+{reward} 💪 за выполнение</div>
    </div>
  )
}

// ── Mini-game: Hold challenge ────────────────────────────────────────────────

function HoldWorkout({ duration, reward, onDone }: {
  duration: number; reward: number; onDone: (success: boolean) => void
}) {
  const [progress, setProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const finished = useRef(false)

  const startHold = useCallback(() => {
    setHolding(true)
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        const next = p + 100 / (duration * 10)
        if (next >= 100) {
          clearInterval(intervalRef.current!)
          if (!finished.current) { finished.current = true; onDone(true) }
          return 100
        }
        return next
      })
    }, 100)
  }, [duration, onDone])

  const endHold = useCallback(() => {
    setHolding(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!finished.current) setProgress(0)
  }, [])

  return (
    <div className="minigame hold-game">
      <div className="hold-ring-wrap">
        <svg className="hold-ring" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" className="hold-ring-bg" />
          <circle
            cx="40" cy="40" r="34"
            className="hold-ring-fill"
            style={{ strokeDashoffset: 213.6 - (213.6 * progress) / 100 }}
          />
        </svg>
        <span className="hold-ring-label">{Math.round(progress)}%</span>
      </div>
      <button
        className={`mg-hold-btn ${holding ? 'holding' : ''}`}
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
      >
        {holding ? '🔥 Держи!' : '✊ Удержи'}
      </button>
      <div className="mg-reward-hint">Держи {duration}с → +{reward} 💪</div>
    </div>
  )
}

// ── Trainer row with inline mini-workout ─────────────────────────────────────

function TrainerRow({ trainer, workedOutToday, isActiveWorkout, onStartWorkout, onWorkoutComplete }: {
  trainer: Trainer
  workedOutToday: boolean
  isActiveWorkout: boolean
  onStartWorkout: () => void
  onWorkoutComplete: (reward: number) => void
}) {
  const [result, setResult] = useState<'success' | 'fail' | null>(null)
  const workout = TRAINER_WORKOUTS[trainer.id]

  const handleDone = useCallback((success: boolean) => {
    setResult(success ? 'success' : 'fail')
    if (success) onWorkoutComplete(workout.reward)
    setTimeout(() => setResult(null), 2200)
  }, [onWorkoutComplete, workout.reward])

  return (
    <div className={`trainer-row ${isActiveWorkout ? 'active-workout' : ''} ${workedOutToday ? 'done-today' : ''}`}>
      <div className="trainer-row-main">
        <div className="trainer-emoji">{trainer.emoji}</div>
        <div className="trainer-info">
          <div className="trainer-name">{trainer.name}</div>
          <div className="trainer-desc">
            {workedOutToday
              ? '✅ Тренировка выполнена сегодня'
              : workout
                ? workout.type === 'tap'
                  ? `👊 ${workout.target} нажатий за ${workout.timeLimit}с`
                  : `✊ Удержи ${workout.duration}с`
                : `+${formatNumber(trainer.baseIncome)}/сек`}
          </div>
        </div>
        <div className="trainer-right">
          {workedOutToday ? (
            <div className="trainer-done-badge">✓ Готово</div>
          ) : result === 'success' ? (
            <div className="trainer-result success">+{workout.reward} 💪</div>
          ) : result === 'fail' ? (
            <div className="trainer-result fail">Не успел 😅</div>
          ) : isActiveWorkout ? (
            <div className="trainer-active-label">Тренируется…</div>
          ) : (
            <button className="trainer-workout-btn" onClick={onStartWorkout}>
              Начать
            </button>
          )}
        </div>
      </div>

      {isActiveWorkout && !result && workout && (
        workout.type === 'tap' ? (
          <TapWorkout
            target={workout.target!}
            timeLimit={workout.timeLimit!}
            reward={workout.reward}
            onDone={handleDone}
          />
        ) : (
          <HoldWorkout
            duration={workout.duration!}
            reward={workout.reward}
            onDone={handleDone}
          />
        )
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  trainers: Trainer[]
  power: number
  characterStats: CharacterStats
  trainerLastWorkout: Record<string, number>
  selectedProgram: string | null
  programDone: boolean
  programAlreadyClaimed: boolean
  onBuy: (id: string) => void
  onWorkoutComplete: (trainerId: string, reward: number) => void
  onSelectProgram: (programId: string) => void
  onProgramComplete: (programId: string) => void
}

export function TrainersList({
  trainers, power, characterStats, trainerLastWorkout,
  selectedProgram, programDone, programAlreadyClaimed,
  onBuy, onWorkoutComplete, onSelectProgram, onProgramComplete,
}: Props) {
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null)

  const todayMidnight = new Date().setHours(0, 0, 0, 0)
  const isWorkedOutToday = (id: string) => (trainerLastWorkout[id] ?? 0) > todayMidnight

  const ownedTrainers = trainers.filter(t => t.count > 0)
  const lockedTrainers = trainers.filter(t => t.count === 0)

  const selectedProg = PROGRAMS.find(p => p.id === selectedProgram)
  const progOwnedIds = selectedProg
    ? selectedProg.trainerIds.filter(id => trainers.find(t => t.id === id && t.count > 0))
    : []
  const progDoneCount = progOwnedIds.filter(id => isWorkedOutToday(id)).length

  const handleWorkoutComplete = useCallback((trainerId: string, reward: number) => {
    setActiveWorkoutId(null)
    onWorkoutComplete(trainerId, reward)
  }, [onWorkoutComplete])

  return (
    <div className="trainers-wrap">

      {/* ── Character stats ── */}
      <div className="char-stats">
        <div className="char-stat">
          <span className="char-stat-icon">💪</span>
          <div className="char-stat-info">
            <span className="char-stat-label">Сила</span>
            <span className="char-stat-value">+{characterStats.strength} за клик</span>
          </div>
          <span className="char-stat-level">Ур.{characterStats.strength}</span>
        </div>
        <div className="char-stat-divider" />
        <div className="char-stat">
          <span className="char-stat-icon">🏃</span>
          <div className="char-stat-info">
            <span className="char-stat-label">Выносливость</span>
            <span className="char-stat-value">+{characterStats.endurance * 30} кликов/день</span>
          </div>
          <span className="char-stat-level">Ур.{characterStats.endurance}</span>
        </div>
      </div>

      {/* ── Programs ── */}
      <div className="programs-section">
        <div className="section-title">Программа дня</div>
        <div className="programs-row">
          {PROGRAMS.map(prog => {
            const ownedNeeded = prog.trainerIds.filter(id => trainers.find(t => t.id === id && t.count > 0))
            const isUnlocked = ownedNeeded.length > 0
            const isSelected = selectedProgram === prog.id
            return (
              <button
                key={prog.id}
                className={`program-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                onClick={() => isUnlocked && onSelectProgram(prog.id)}
                disabled={!isUnlocked}
              >
                <span className="prog-emoji">{prog.emoji}</span>
                <span className="prog-name">{prog.name}</span>
                <span className="prog-bonus">
                  {Object.entries(prog.statBonus).map(([k, v]) =>
                    k === 'strength' ? `💪+${v}` : `🏃+${v}`
                  ).join(' ')}
                </span>
                {!isUnlocked && <span className="prog-lock">🔒</span>}
              </button>
            )
          })}
        </div>

        {selectedProg && (
          <div className="program-progress-bar-wrap">
            <div className="program-progress-info">
              <span>{selectedProg.emoji} {selectedProg.name}</span>
              <span className="prog-count">{progDoneCount}/{progOwnedIds.length}</span>
            </div>
            <div className="program-progress-bar">
              <div
                className="program-progress-fill"
                style={{ width: `${progOwnedIds.length ? (progDoneCount / progOwnedIds.length) * 100 : 0}%` }}
              />
            </div>
            <div className="prog-desc">{selectedProg.desc}</div>
            {programDone && !programAlreadyClaimed && (
              <button className="prog-claim-btn" onClick={() => onProgramComplete(selectedProg.id)}>
                🎉 Забрать награду +{selectedProg.powerBonus} 💪
              </button>
            )}
            {programAlreadyClaimed && (
              <div className="prog-claimed">✅ Программа выполнена сегодня!</div>
            )}
          </div>
        )}
      </div>

      {/* ── Owned trainers with workouts ── */}
      {ownedTrainers.length > 0 && (
        <div className="trainers-section">
          <div className="section-title">Мои тренажёры</div>
          {ownedTrainers.map(t => (
            <TrainerRow
              key={t.id}
              trainer={t}
              workedOutToday={isWorkedOutToday(t.id)}
              isActiveWorkout={activeWorkoutId === t.id}
              onStartWorkout={() => setActiveWorkoutId(activeWorkoutId === t.id ? null : t.id)}
              onWorkoutComplete={(reward) => handleWorkoutComplete(t.id, reward)}
            />
          ))}
        </div>
      )}

      {/* ── Buy locked trainers ── */}
      {lockedTrainers.length > 0 && (
        <div className="trainers-section">
          <div className="section-title">Купить тренажёры</div>
          {lockedTrainers.map(t => {
            const cost = getTrainerCost(t, t.count)
            const canAfford = power >= cost
            const workout = TRAINER_WORKOUTS[t.id]
            return (
              <div key={t.id} className={`trainer-row buy-row ${canAfford ? 'affordable' : ''}`}>
                <div className="trainer-emoji">{t.emoji}</div>
                <div className="trainer-info">
                  <div className="trainer-name">{t.name}</div>
                  <div className="trainer-desc">
                    {workout
                      ? workout.type === 'tap'
                        ? `👊 ${workout.target} нажатий за ${workout.timeLimit}с → +${workout.reward} 💪`
                        : `✊ Держи ${workout.duration}с → +${workout.reward} 💪`
                      : ''}
                  </div>
                </div>
                <button
                  className="trainer-buy-btn"
                  disabled={!canAfford}
                  onClick={() => onBuy(t.id)}
                >
                  <span className="buy-cost">💪 {formatNumber(cost)}</span>
                  <span className="buy-label">Купить</span>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
