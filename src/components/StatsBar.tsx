import { formatNumber } from '../store/gameStore'
import './StatsBar.css'

interface Props {
  power: number
  powerPerSecond: number
  totalPower: number
  userName: string
}

export function StatsBar({ power, powerPerSecond, totalPower, userName }: Props) {
  return (
    <div className="stats-bar">
      <div className="stats-greeting">Привет, {userName || 'спортсмен'}! 👋</div>
      <div className="stats-main">
        <div className="stat-item">
          <span className="stat-value">💪 {formatNumber(power)}</span>
          <span className="stat-label">сила</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">⚡ {formatNumber(powerPerSecond)}/с</span>
          <span className="stat-label">автодоход</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">🏅 {formatNumber(totalPower)}</span>
          <span className="stat-label">всего</span>
        </div>
      </div>
    </div>
  )
}
