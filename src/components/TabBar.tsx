import type { Tab } from '../App'
import './TabBar.css'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: 'train',      emoji: '🏋️', label: 'Тренировка' },
  { id: 'challenges', emoji: '📋', label: 'Задания'    },
  { id: 'upgrades',   emoji: '⚡', label: 'Прокачка'  },
]

export function TabBar({ active, onChange }: Props) {
  return (
    <div className="tab-bar">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`tab-item ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="tab-emoji">{t.emoji}</span>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </div>
  )
}
