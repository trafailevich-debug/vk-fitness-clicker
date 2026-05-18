import { Trainer, getTrainerCost, formatNumber } from '../store/gameStore'
import './TrainersList.css'

interface Props {
  trainers: Trainer[]
  power: number
  onBuy: (id: string) => void
}

export function TrainersList({ trainers, power, onBuy }: Props) {
  return (
    <div className="trainers">
      <div className="trainers-title">Тренажёры</div>
      {trainers.map(t => {
        const cost = getTrainerCost(t, t.count)
        const canAfford = power >= cost
        return (
          <div key={t.id} className={`trainer-row ${canAfford ? 'affordable' : 'locked'}`}>
            <div className="trainer-emoji">{t.emoji}</div>
            <div className="trainer-info">
              <div className="trainer-name">{t.name}</div>
              <div className="trainer-desc">
                +{formatNumber(t.baseIncome * Math.max(1, t.count + 1))} силы/сек
                {t.count > 0 && <span className="trainer-count"> × {t.count}</span>}
              </div>
            </div>
            <button
              className="trainer-buy-btn"
              disabled={!canAfford}
              onClick={() => onBuy(t.id)}
            >
              <span className="buy-cost">💪 {formatNumber(cost)}</span>
              <span className="buy-label">Купить</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
