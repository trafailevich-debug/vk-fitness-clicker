import { DAILY_CHALLENGES } from '../store/gameStore'
import './DailyChallenges.css'

interface Props {
  completedChallenges: string[]
  onComplete: (id: string) => void
}

export function DailyChallenges({ completedChallenges, onComplete }: Props) {
  const allDone = completedChallenges.length === DAILY_CHALLENGES.length
  const totalReward = DAILY_CHALLENGES.reduce((s, c) => s + c.reward, 0)

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
        return (
          <div key={c.id} className={`challenge-row ${done ? 'done' : ''}`}>
            <div className="challenge-emoji">{c.emoji}</div>
            <div className="challenge-info">
              <div className="challenge-name">{c.name}</div>
              <div className="challenge-desc">{c.description}</div>
            </div>
            <div className="challenge-right">
              <div className="challenge-reward">+{c.reward} 💪</div>
              <button
                className={`challenge-btn ${done ? 'done' : ''}`}
                onClick={() => !done && onComplete(c.id)}
                disabled={done}
              >
                {done ? '✓ Готово' : 'Сделано!'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
