import { useState, useEffect } from 'react'
import { DAILY_CHALLENGES } from '../store/gameStore'
import './DailyChallenges.css'

interface Props {
  completedChallenges: string[]
  onComplete: (id: string) => void
  vipJustUnlocked: boolean
}

const CHALLENGE_DURATIONS: Record<string, number> = {
  water:      12,
  headrotate: 20,
  steps100:   30,
  stretch:    50,
  squat:      45,
  pushup:     35,
  breathe:    40,
  walk:       60,
}

const CHALLENGE_TIPS: Record<string, string> = {
  water:      'Пей медленно, маленькими глотками 💧',
  headrotate: 'Движения мягкие, без рывков 🔄',
  steps100:   'Шагай ровно, считай вслух 👟',
  stretch:    'Дыши глубоко, тянись плавно 🌬️',
  squat:      'Спина ровная, колени за носки не заходят 🦵',
  pushup:     'Тело прямое как доска 💪',
  breathe:    'Вдох 4с → Задержка 4с → Выдох 6с 🌬️',
  walk:       'Голова поднята, руки в движении 🚶',
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  hydration: { bg: 'rgba(14,165,233,0.10)',  border: 'rgba(14,165,233,0.25)',  text: '#38bdf8' },
  mobility:  { bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.25)', text: '#a78bfa' },
  cardio:    { bg: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.25)',  text: '#34d399' },
  strength:  { bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.25)',  text: '#fcd34d' },
  recovery:  { bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.25)',  text: '#93c5fd' },
}

const CATEGORY_LABELS: Record<string, string> = {
  hydration: 'Гидрация',
  mobility:  'Мобильность',
  cardio:    'Кардио',
  strength:  'Сила',
  recovery:  'Восстановление',
}

export function DailyChallenges({ completedChallenges, onComplete, vipJustUnlocked }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [readyIds, setReadyIds] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const allDone = completedChallenges.length === DAILY_CHALLENGES.length
  const totalReward = DAILY_CHALLENGES.reduce((s, c) => s + c.reward, 0)

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
    setExpandedId(null)
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

  const doneCount = completedChallenges.length
  const total = DAILY_CHALLENGES.length
  const progressPct = (doneCount / total) * 100

  return (
    <div className="challenges">
      {/* Header */}
      <div className="challenges-header">
        <div>
          <div className="challenges-title">Дневные задания</div>
          <div className="challenges-subtitle">Выполни все — откроются VIP-тренировки!</div>
        </div>
        <span className="challenges-reset">сброс в 00:00</span>
      </div>

      {/* Progress */}
      <div className="challenges-progress">
        <div className="ch-prog-bar-wrap">
          <div className="ch-prog-bar">
            <div className="ch-prog-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <div className="ch-prog-labels">
          <span className="ch-prog-text">{doneCount} из {total} выполнено</span>
          <span className="ch-prog-reward">+{totalReward} 💪</span>
        </div>
      </div>

      {/* VIP unlocked banner */}
      {vipJustUnlocked && (
        <div className="challenges-vip-banner">
          <span>👑 VIP-тренировки открыты!</span>
          <span className="vip-banner-sub">Переходи в раздел «Тренировки»</span>
        </div>
      )}

      {allDone && !vipJustUnlocked && (
        <div className="challenges-done-banner">
          🎉 Все задания выполнены! До завтра.
        </div>
      )}

      {/* Challenge list */}
      {DAILY_CHALLENGES.map(c => {
        const done = completedChallenges.includes(c.id)
        const isActive = activeId === c.id
        const isReady = readyIds.includes(c.id)
        const isExpanded = expandedId === c.id
        const duration = CHALLENGE_DURATIONS[c.id] ?? 30
        const progress = isActive ? ((duration - timeLeft) / duration) * 100 : 0
        const catColor = CATEGORY_COLORS[c.category]

        return (
          <div key={c.id} className={`challenge-row ${done ? 'done' : ''} ${isActive ? 'active' : ''} ${isReady ? 'ready' : ''}`}>
            <div
              className="challenge-main-row"
              onClick={() => !isActive && !done && !isReady && setExpandedId(isExpanded ? null : c.id)}
            >
              <div className="challenge-emoji">{done ? '✅' : c.emoji}</div>
              <div className="challenge-info">
                <div className="challenge-name-row">
                  <span className="challenge-name">{c.name}</span>
                  <span
                    className="challenge-cat-tag"
                    style={{ background: catColor.bg, borderColor: catColor.border, color: catColor.text }}
                  >
                    {CATEGORY_LABELS[c.category]}
                  </span>
                </div>
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
                  <div className="challenge-done-badge">✓</div>
                ) : isActive ? (
                  <div className="challenge-timer">{formatTime(timeLeft)}</div>
                ) : isReady ? (
                  <button className="challenge-btn finish" onClick={e => { e.stopPropagation(); handleFinish(c.id) }}>
                    Зачесть ✓
                  </button>
                ) : (
                  <button className="challenge-btn start" onClick={e => { e.stopPropagation(); handleStart(c.id) }}>
                    Начать
                  </button>
                )}
              </div>
            </div>

            {/* Expandable detail */}
            {isExpanded && !done && !isActive && (
              <div className="challenge-detail">
                <div className="cd-section">
                  <div className="cd-section-title">Как делать:</div>
                  <ol className="cd-steps">
                    {c.howTo.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className="cd-benefit">
                  <span className="cd-benefit-icon">💚</span>
                  <span className="cd-benefit-text">{c.healthBenefit}</span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
