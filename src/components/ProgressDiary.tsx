import { GameState, LEVELS, PROGRAMS, getDailyChallenges, getLevel, formatNumber } from '../store/gameStore'
import './ProgressDiary.css'

interface Props {
  state: GameState
  onBuyFreeze: () => void
}

const FREEZE_COST = 200

export function ProgressDiary({ state, onBuyFreeze }: Props) {
  const level = getLevel(state.totalPower)
  const currentLevelIdx = LEVELS.findIndex(l => l.label === level.label)
  const nextLevel = LEVELS[currentLevelIdx + 1]
  const progress = nextLevel
    ? Math.min(100, ((state.totalPower - level.min) / (nextLevel.min - level.min)) * 100)
    : 100

  const todayChallenges = getDailyChallenges()
  const challengesDone = todayChallenges.filter(c => state.completedChallenges.includes(c.id)).length
  const challengesTotal = todayChallenges.length

  const midnight = new Date().setHours(0, 0, 0, 0)
  const workoutsDoneToday = state.trainers.filter(
    t => t.count > 0 && (state.trainerLastWorkout[t.id] ?? 0) > midnight
  ).length
  const workoutsTotal = state.trainers.filter(t => t.count > 0).length

  const selProg = PROGRAMS.find(p => p.id === state.selectedProgram)

  return (
    <div className="diary">

      {/* ── Streak block ── */}
      <div className="diary-card streak-card">
        <div className="streak-card-top">
          <div className="streak-main">
            <span className="streak-fire">🔥</span>
            <div>
              <div className="streak-days">{state.streak} {pluralDays(state.streak)}</div>
              <div className="streak-label">серия активности</div>
            </div>
          </div>
          <div className="streak-freeze">
            <span className="freeze-icon">🧊</span>
            <span className="freeze-count">{state.streakFreezes}</span>
          </div>
        </div>
        {state.streakFreezes === 0 && (
          <button
            className="freeze-btn"
            onClick={onBuyFreeze}
            disabled={state.power < FREEZE_COST}
          >
            Купить заморозку — {FREEZE_COST} 💪
          </button>
        )}
      </div>

      {/* ── Level progress ── */}
      <div className="diary-card level-card">
        <div className="level-row">
          <span className="level-emoji">{level.emoji}</span>
          <div className="level-info">
            <div className="level-name">{level.label}</div>
            {nextLevel
              ? <div className="level-next">до «{nextLevel.label}» — {formatNumber(nextLevel.min - state.totalPower)} 💪</div>
              : <div className="level-next">Максимальный уровень!</div>
            }
          </div>
          <div className="level-pct">{Math.round(progress)}%</div>
        </div>
        <div className="diary-progress-bar">
          <div className="diary-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="level-milestones">
          {LEVELS.map((l, i) => (
            <div key={l.label} className={`milestone ${state.totalPower >= l.min ? 'done' : ''} ${l.label === level.label ? 'current' : ''}`}>
              <span>{l.emoji}</span>
              <span className="ms-label">{l.label}</span>
              {i < LEVELS.length - 1 && <div className="ms-line" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Today's activity ── */}
      <div className="diary-card activity-card">
        <div className="activity-title">Сегодня</div>
        <div className="activity-rows">
          <div className="activity-row">
            <span className="act-icon">📋</span>
            <span className="act-label">Задания</span>
            <div className="act-bar-wrap">
              <div className="act-bar" style={{ width: `${challengesTotal ? (challengesDone / challengesTotal) * 100 : 0}%` }} />
            </div>
            <span className="act-frac">{challengesDone}/{challengesTotal}</span>
          </div>
          <div className="activity-row">
            <span className="act-icon">🏋️</span>
            <span className="act-label">Тренажёры</span>
            <div className="act-bar-wrap">
              <div className="act-bar" style={{ width: `${workoutsTotal ? (workoutsDoneToday / workoutsTotal) * 100 : 0}%` }} />
            </div>
            <span className="act-frac">{workoutsDoneToday}/{workoutsTotal || '–'}</span>
          </div>
          {selProg && (
            <div className="activity-row">
              <span className="act-icon">{selProg.emoji}</span>
              <span className="act-label">{selProg.name}</span>
              <div className="act-bar-wrap">
                <div className="act-bar" style={{ width: state.programLastCompleted === new Date().toISOString().slice(0, 10) ? '100%' : '0%' }} />
              </div>
              <span className="act-frac">{state.programLastCompleted === new Date().toISOString().slice(0, 10) ? '✅' : '–'}</span>
            </div>
          )}
          <div className="activity-row">
            <span className="act-icon">👆</span>
            <span className="act-label">Клики</span>
            <div className="act-bar-wrap">
              <div className="act-bar clicks" style={{ width: `${Math.min(100, ((100 - state.dailyClicksLeft) / 100) * 100)}%` }} />
            </div>
            <span className="act-frac">{100 - state.dailyClicksLeft}/100</span>
          </div>
        </div>
      </div>

      {/* ── Character stats ── */}
      <div className="diary-card stats-card">
        <div className="stats-title">Характеристики</div>
        <div className="stats-grid">
          <div className="stat-block">
            <div className="stat-icon">💪</div>
            <div className="stat-val">+{state.characterStats.strength}</div>
            <div className="stat-name">Сила / клик</div>
            <div className="stat-hint">прокачивается через тренировки</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-block">
            <div className="stat-icon">🏃</div>
            <div className="stat-val">+{state.characterStats.endurance * 30}</div>
            <div className="stat-name">Клики / день</div>
            <div className="stat-hint">Выносливость ур.{state.characterStats.endurance}</div>
          </div>
        </div>
      </div>

      {/* ── All-time totals ── */}
      <div className="diary-card totals-card">
        <div className="totals-title">Всего за всё время</div>
        <div className="totals-row">
          <div className="total-item">
            <div className="total-val">{formatNumber(state.totalPower)}</div>
            <div className="total-label">💪 силы</div>
          </div>
          <div className="total-item">
            <div className="total-val">{formatNumber(state.totalClicks)}</div>
            <div className="total-label">👆 кликов</div>
          </div>
          <div className="total-item">
            <div className="total-val">{state.achievements.length}</div>
            <div className="total-label">🏆 наград</div>
          </div>
        </div>
      </div>

    </div>
  )
}

function pluralDays(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 19) return 'дней'
  const r = n % 10
  if (r === 1) return 'день'
  if (r >= 2 && r <= 4) return 'дня'
  return 'дней'
}
