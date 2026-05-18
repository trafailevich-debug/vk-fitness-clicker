import { formatNumber, formatDuration } from '../store/gameStore'
import './OfflineEarnings.css'

interface Props {
  gain: number
  seconds: number
  onCollect: () => void
}

export function OfflineEarnings({ gain, seconds, onCollect }: Props) {
  return (
    <div className="offline-overlay">
      <div className="offline-card">
        <div className="offline-icon">🎁</div>
        <div className="offline-title">Пока тебя не было</div>
        <div className="offline-duration">{formatDuration(seconds)}</div>
        <div className="offline-gain">+{formatNumber(gain)} 💪</div>
        <div className="offline-sub">Тренажёры не стояли без дела</div>
        <button className="offline-btn" onClick={onCollect}>
          Забрать!
        </button>
      </div>
    </div>
  )
}
