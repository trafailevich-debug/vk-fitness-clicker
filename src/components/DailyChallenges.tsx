import { useState, useEffect } from 'react'
import { getDailyChallenges } from '../store/gameStore'
import './DailyChallenges.css'

interface Props {
  completedChallenges: string[]
  onComplete: (id: string) => void
  vipJustUnlocked: boolean
}

const CHALLENGE_DURATIONS: Record<string, number> = {
  water:         12,
  herbal_tea:    15,
  water_lemon:   12,
  headrotate:    20,
  neck_stretch:  25,
  shoulder_roll: 20,
  wrist_rotation:15,
  ankle_rotation:15,
  arm_circles:   18,
  side_stretch:  25,
  hip_rotation:  20,
  toe_touch:     20,
  steps100:      30,
  walk:          60,
  calf_raises:   25,
  march_place:   40,
  jumping_jacks: 30,
  knee_raise:    25,
  squat:         45,
  pushup:        35,
  wall_sit:      35,
  balance_stand: 35,
  heel_raises:   25,
  stretch:       50,
  cat_cow:       30,
  chest_opener:  25,
  desk_stretch:  25,
  back_stretch:  30,
  breathe:       40,
  eye_rest:      30,
  posture:       25,
  fresh_air:     30,
  cold_wash:     20,
  no_phone:      50,
  massage_hands: 30,
}

const CHALLENGE_TIPS: Record<string, string> = {
  water:         'Пей медленно, маленькими глотками 💧',
  herbal_tea:    'Наслаждайся ароматом, не торопись 🍵',
  water_lemon:   'Лучше пить не ледяную, а комнатную 🍋',
  headrotate:    'Движения мягкие, без рывков 🔄',
  neck_stretch:  'Плечи расслаблены, не поднимай их 🦢',
  shoulder_roll: 'Большие круги, максимальная амплитуда 🔁',
  wrist_rotation:'Пальцы расслаблены, кисти свободны 🤲',
  ankle_rotation:'Сядь удобно, стопа полностью расслаблена 🦶',
  arm_circles:   'Рука прямая, круги максимально большие 🙆',
  side_stretch:  'Не наклоняйся вперёд — строго в сторону ↔️',
  hip_rotation:  'Колени чуть согнуты, корпус прямой 🌀',
  toe_touch:     'Не сгибай колени, тянись медленно 🖐️',
  steps100:      'Шагай ровно, считай вслух 👟',
  walk:          'Голова поднята, руки в движении 🚶',
  calf_raises:   'Задержись наверху — чувствуй напряжение икры 🦵',
  march_place:   'Колени выше — активнее кровоток 🥾',
  jumping_jacks: 'Руки до конца вверх — полная амплитуда 🤸',
  knee_raise:    'Спина прямая, не наклоняйся вперёд 🏃',
  squat:         'Спина ровная, колени за носки не заходят 🦵',
  pushup:        'Тело прямое как доска 💪',
  wall_sit:      'Угол 90° — бёдра параллельны полу 🪑',
  balance_stand: 'Найди точку фокуса взглядом — так легче 🧘',
  heel_raises:   'Удерживай баланс, не держись за стену если можешь 👣',
  stretch:       'Дыши глубоко, тянись плавно 🌬️',
  cat_cow:       'Синхронизируй движение с дыханием 🐱',
  chest_opener:  'Чувствуй раскрытие груди, не форсируй 🫁',
  desk_stretch:  'Медленно, не рвись — мышцы должны отдохнуть 💼',
  back_stretch:  'Расслабь поясницу, не держи её в напряжении 🦴',
  breathe:       'Вдох 4с → Задержка 4с → Выдох 6с 🌬️',
  eye_rest:      'Смотри в даль, не напрягай глаза 👁️',
  posture:       'Представь нитку, тянущую макушку вверх 🪆',
  fresh_air:     'Дыши медленно и глубоко носом 🌿',
  cold_wash:     'Смочи и запястья — там много нервных окончаний 🧊',
  no_phone:      'Замечай ощущения в теле и звуки вокруг 📵',
  massage_hands: 'Надавливай уверенно, прорабатывай каждый палец 🤝',
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

  const todayChallenges = getDailyChallenges()
  const allDone = todayChallenges.every(c => completedChallenges.includes(c.id))
  const totalReward = todayChallenges.reduce((s, c) => s + c.reward, 0)

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

  const doneCount = todayChallenges.filter(c => completedChallenges.includes(c.id)).length
  const total = todayChallenges.length
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
      {todayChallenges.map(c => {
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
