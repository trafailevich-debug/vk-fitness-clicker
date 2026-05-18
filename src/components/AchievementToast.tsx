import { useEffect, useState } from 'react'
import { ACHIEVEMENTS } from '../store/gameStore'
import './AchievementToast.css'

interface Props {
  achievementId: string | null
}

export function AchievementToast({ achievementId }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (achievementId) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2800)
      return () => clearTimeout(t)
    }
  }, [achievementId])

  const ach = achievementId ? ACHIEVEMENTS.find(a => a.id === achievementId) : null
  if (!ach || !visible) return null

  return (
    <div className="ach-toast">
      <span className="ach-emoji">{ach.emoji}</span>
      <div className="ach-text">
        <div className="ach-label">Достижение!</div>
        <div className="ach-name">{ach.name}</div>
      </div>
    </div>
  )
}
