import { formatNumber } from '../store/gameStore'
import './StatsBar.css'

interface Props {
  power: number
  powerPerSecond: number
  totalPower: number
  userName: string
  streakFreezes: number
  onBuyFreeze: () => void
}

const FREEZE_COST = 200

export function StatsBar({ power, powerPerSecond, totalPower, userName, streakFreezes, onBuyFreeze }: Props) {
  const canBuyFreeze = power >= FREEZE_COST && streakFreezes === 0

  return (
    <div className="stats-bar">
      <div className="stats-top">
        <span className="stats-greeting">
          {userName ? `Привет, ${userName}! 👋` : 'Добро пожаловать! 👋'}
        </span>
        <button
          className={`freeze-btn ${streakFreezes > 0 ? 'has-freeze' : ''} ${!canBuyFreeze && streakFreezes === 0 ? 'disabled' : ''}`}
          onClick={canBuyFreeze ? onBuyFreeze : undefined}
          title={streakFreezes > 0 ? 'Заморозка активна' : `Купить заморозку серии за ${FREEZE_COST} силы`}
        >
          🧊 {streakFreezes > 0 ? 'Заморозка' : `${FREEZE_COST} 💪`}
        </button>
      </div>
      <div className="stats-main">
        <div className="stat-item">
          <span className="stat-value">💪 {formatNumber(power)}</span>
          <span className="stat-label">сила</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">⚡ {formatNumber(powerPerSecond)}/с</span>
          <span className="stat-label">доход</span>
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
