import { LEADERBOARD_MOCK, formatNumber } from '../store/gameStore'
import './Leaderboard.css'

interface Props {
  totalPower: number
  userName: string
  streak: number
}

export function Leaderboard({ totalPower, userName, streak }: Props) {
  const playerName = userName || 'Ты'

  const allEntries = [...LEADERBOARD_MOCK]
  const playerRank = allEntries.filter(e => e.totalPower > totalPower).length + 1
  const playerInTop20 = playerRank <= 20

  const displayEntries = playerInTop20
    ? allEntries.slice(0, 20).map((e, i) =>
        e.rank === playerRank
          ? { ...e, name: playerName, totalPower, streak, isPlayer: true }
          : { ...e, isPlayer: false }
      )
    : allEntries.slice(0, 20).map(e => ({ ...e, isPlayer: false }))

  const getMedal = (rank: number) => {
    if (rank === 1) return '👑'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  return (
    <div className="leaderboard">
      <div className="lb-header">
        <div>
          <div className="lb-title">Рейтинг игроков</div>
          <div className="lb-subtitle">Топ 20 по силе</div>
        </div>
        <div className="lb-your-rank">
          <div className="lb-rank-label">Ваше место</div>
          <div className="lb-rank-num">#{playerRank}</div>
        </div>
      </div>

      {!playerInTop20 && (
        <div className="lb-player-row lb-player-own">
          <div className="lb-rank-cell lb-rank-outside">#{playerRank}</div>
          <div className="lb-avatar lb-avatar-you">⭐</div>
          <div className="lb-player-info">
            <div className="lb-player-name">{playerName} <span className="lb-you-tag">Ты</span></div>
            <div className="lb-player-sub">🔥 {streak} дней</div>
          </div>
          <div className="lb-player-power">{formatNumber(totalPower)}</div>
        </div>
      )}

      <div className="lb-list">
        {displayEntries.map((entry, idx) => {
          const medal = getMedal(idx + 1)
          const isTop3 = idx < 3
          const isPlayer = (entry as any).isPlayer

          return (
            <div
              key={idx}
              className={`lb-row ${isTop3 ? 'top3' : ''} ${isPlayer ? 'is-player' : ''}`}
            >
              <div className={`lb-rank-cell ${isTop3 ? 'rank-top3' : ''}`}>
                {medal ? <span className="lb-medal">{medal}</span> : <span className="lb-rank-num-sm">{idx + 1}</span>}
              </div>
              <div className={`lb-avatar ${isTop3 ? 'avatar-top3' : ''}`}>
                {entry.avatar}
              </div>
              <div className="lb-player-info">
                <div className="lb-player-name">
                  {entry.name}
                  {isPlayer && <span className="lb-you-tag">Ты</span>}
                </div>
                <div className="lb-player-sub">🔥 {entry.streak} дней</div>
              </div>
              <div className={`lb-player-power ${isTop3 ? 'power-top3' : ''}`}>
                {formatNumber(entry.totalPower)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="lb-motivation">
        <div className="lb-mot-text">
          💪 Выполняй задания каждый день и поднимайся в рейтинге!
        </div>
      </div>
    </div>
  )
}
