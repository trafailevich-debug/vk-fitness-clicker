import { useState, useCallback } from 'react'
import './ClickButton.css'

interface Props {
  level: { label: string; emoji: string }
  powerPerClick: number
  onСlick: () => void
}

export function ClickButton({ level, powerPerClick, onСlick }: Props) {
  const [pressed, setPressed] = useState(false)
  const [floats, setFloats] = useState<{ id: number; x: number; y: number }[]>([])

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    onСlick()
    setPressed(true)
    setTimeout(() => setPressed(false), 100)

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now() + Math.random()
    setFloats(prev => [...prev, { id, x, y }])
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 700)
  }, [onСlick])

  return (
    <div className="click-area">
      <button
        className={`click-btn ${pressed ? 'pressed' : ''}`}
        onClick={handleClick}
        aria-label="Тренироваться"
      >
        <span className="click-emoji">{level.emoji}</span>
        <span className="click-label">{level.label}</span>
        <span className="click-hint">+{powerPerClick} силы</span>
      </button>
      {floats.map(f => (
        <div
          key={f.id}
          className="float-text"
          style={{ left: f.x, top: f.y }}
        >
          +{powerPerClick}💪
        </div>
      ))}
    </div>
  )
}
