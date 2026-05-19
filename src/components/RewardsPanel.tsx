import { ACHIEVEMENTS } from '../store/gameStore'
import './RewardsPanel.css'

interface Props {
  unlockedIds: string[]
  totalClicks: number
  streak: number
}

const PROGRESS_ACHIEVEMENTS: Record<string, (props: { totalClicks: number; streak: number; unlockedIds: string[] }) => number> = {
  first_click:     ({ totalClicks }) => Math.min(100, totalClicks >= 1 ? 100 : 0),
  clicks_50:       ({ totalClicks }) => Math.min(100, (totalClicks / 50) * 100),
  clicks_500:      ({ totalClicks }) => Math.min(100, (totalClicks / 500) * 100),
  streak_3:        ({ streak }) => Math.min(100, (streak / 3) * 100),
  streak_7:        ({ streak }) => Math.min(100, (streak / 7) * 100),
  first_trainer:   ({ unlockedIds }) => unlockedIds.includes('first_trainer') ? 100 : 0,
  first_challenge: ({ unlockedIds }) => unlockedIds.includes('first_challenge') ? 100 : 0,
  all_challenges:  ({ unlockedIds }) => unlockedIds.includes('all_challenges') ? 100 : 0,
  level_amateur:   ({ unlockedIds }) => unlockedIds.includes('level_amateur') ? 100 : 0,
  level_sportsman: ({ unlockedIds }) => unlockedIds.includes('level_sportsman') ? 100 : 0,
  combo_x2:        ({ unlockedIds }) => unlockedIds.includes('combo_x2') ? 100 : 0,
  combo_x3:        ({ unlockedIds }) => unlockedIds.includes('combo_x3') ? 100 : 0,
  freeze_used:     ({ unlockedIds }) => unlockedIds.includes('freeze_used') ? 100 : 0,
  offline_1h:      ({ unlockedIds }) => unlockedIds.includes('offline_1h') ? 100 : 0,
}

export function RewardsPanel({ unlockedIds, totalClicks, streak }: Props) {
  const unlocked = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id))
  const locked = ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id))

  return (
    <div className="rewards">
      <div className="rewards-header">
        <div className="rewards-count">
          <span className="rewards-trophy">🏆</span>
          <div>
            <div className="rewards-num">{unlocked.length} / {ACHIEVEMENTS.length}</div>
            <div className="rewards-sub">наград получено</div>
          </div>
        </div>
        <div className="rewards-progress-ring">
          <svg viewBox="0 0 64 64" className="ring-svg">
            <circle cx="32" cy="32" r="26" className="ring-bg" />
            <circle
              cx="32" cy="32" r="26"
              className="ring-fg"
              style={{
                strokeDashoffset: 163.4 - (163.4 * unlocked.length) / ACHIEVEMENTS.length,
              }}
            />
          </svg>
          <span className="ring-pct">{Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%</span>
        </div>
      </div>

      {unlocked.length > 0 && (
        <div className="rewards-section">
          <div className="rewards-section-title">Получено</div>
          <div className="rewards-grid">
            {unlocked.map(a => (
              <div key={a.id} className="reward-card unlocked">
                <span className="reward-emoji">{a.emoji}</span>
                <div className="reward-name">{a.name}</div>
                <div className="reward-desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div className="rewards-section">
          <div className="rewards-section-title">Не получено</div>
          <div className="rewards-grid">
            {locked.map(a => {
              const pct = PROGRESS_ACHIEVEMENTS[a.id]?.({ totalClicks, streak, unlockedIds }) ?? 0
              return (
                <div key={a.id} className="reward-card locked">
                  <span className="reward-emoji locked-emoji">{a.emoji}</span>
                  <div className="reward-name">{a.name}</div>
                  <div className="reward-desc">{a.desc}</div>
                  {pct > 0 && pct < 100 && (
                    <div className="reward-progress-wrap">
                      <div className="reward-progress" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
