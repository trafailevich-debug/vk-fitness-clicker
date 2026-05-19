import { useState, useCallback } from 'react'
import './ClickButton.css'

const EXERCISES = [
  'Отжимание!', 'Присед!', 'Выпад!', 'Планка!', 'Берпи!',
  'Прыжок!', 'Скручивание!', 'Бег на месте!', 'Подтягивание!', 'Махи!',
]

const MOTIVATIONS = [
  'Давай!', 'Жги!', 'Вперёд!', 'Сильнее!', 'Не сдавайся!',
  'Ты можешь!', 'Огонь!', 'Ещё раз!', 'Пробивай!', 'Максимум!',
]

interface Props {
  level: { label: string; character: string }
  comboMultiplier: number
  comboCount: number
  dailyClicksLeft: number
  maxDailyClicks: number
  onСlick: () => void
}

export function ClickButton({ level, comboMultiplier, comboCount, dailyClicksLeft, maxDailyClicks, onСlick }: Props) {
  const [pressed, setPressed] = useState(false)
  const [exercise, setExercise] = useState('')
  const [motivation, setMotivation] = useState('')
  const [floats, setFloats] = useState<{ id: number; x: number; y: number; value: number }[]>([])
  const [burstKey, setBurstKey] = useState(0)
  const isExhausted = dailyClicksLeft <= 0

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (isExhausted) return
    onСlick()
    setPressed(true)
    setBurstKey(k => k + 1)

    const ex = EXERCISES[Math.floor(Math.random() * EXERCISES.length)]
    const mot = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]
    setExercise(ex)
    setMotivation(mot)

    setTimeout(() => setPressed(false), 120)
    setTimeout(() => { setExercise(''); setMotivation('') }, 700)

    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now() + Math.random()
    setFloats(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top, value: comboMultiplier }])
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 800)
  }, [onСlick, isExhausted, comboMultiplier])

  const progressPercent = (dailyClicksLeft / maxDailyClicks) * 100

  return (
    <div className="click-area">
      {comboMultiplier > 1 && (
        <div className="combo-badge" key={comboCount}>
          {'🔥'.repeat(comboMultiplier - 1)} COMBO ×{comboMultiplier}
        </div>
      )}

      <div className="btn-wrapper">
        <div className={`energy-ring ring-outer ${comboMultiplier > 1 ? 'active' : ''}`} />
        <div className={`energy-ring ring-inner ${comboMultiplier > 1 ? 'active' : ''}`} />
        {pressed && <div className="burst-ring" key={burstKey} />}

        <button
          className={`click-btn ${pressed ? 'pressed' : ''} ${isExhausted ? 'exhausted' : ''}`}
          onClick={handleClick}
        >
          <span className={`click-character ${pressed ? 'jump' : ''}`}>
            {isExhausted ? '😴' : level.character}
          </span>

          {exercise ? (
            <span className="exercise-label">{exercise}</span>
          ) : (
            <span className="click-hint">
              {isExhausted ? 'Выполни задание →' : `+${comboMultiplier} силы`}
            </span>
          )}

          {motivation && <span className="motivation-label">{motivation}</span>}
        </button>
      </div>

      <div className="daily-progress">
        <div className="daily-bar">
          <div
            className={`daily-fill ${progressPercent < 20 ? 'low' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="daily-text">
          {isExhausted
            ? '🌙 Клики на сегодня закончились'
            : `⚡ ${dailyClicksLeft} / ${maxDailyClicks} кликов`}
        </span>
      </div>

      {floats.map(f => (
        <div key={f.id} className="float-text" style={{ left: f.x, top: f.y }}>
          +{f.value}💪
        </div>
      ))}
    </div>
  )
}
