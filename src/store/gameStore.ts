export interface Trainer {
  id: string
  name: string
  emoji: string
  baseCost: number
  baseIncome: number
  count: number
}

export interface Challenge {
  id: string
  emoji: string
  name: string
  description: string
  reward: number
}

export interface GameState {
  power: number
  totalPower: number
  powerPerSecond: number
  userName: string
  trainers: Trainer[]
  dailyClicksLeft: number
  lastDailyReset: string
  completedChallenges: string[]
  streak: number
  lastLoginDate: string
}

export const MAX_DAILY_CLICKS = 100

export const DAILY_CHALLENGES: Challenge[] = [
  { id: 'water',   emoji: '💧', name: 'Выпей воду',   description: '2 стакана воды прямо сейчас', reward: 50 },
  { id: 'stretch', emoji: '🧘', name: 'Потянись',      description: 'Растяжка 3 минуты',           reward: 75 },
  { id: 'squat',   emoji: '🦵', name: 'Приседания',    description: '15 приседаний',               reward: 150 },
  { id: 'pushup',  emoji: '💪', name: 'Отжимания',     description: '10 отжиманий от пола',        reward: 200 },
  { id: 'walk',    emoji: '🚶', name: 'Прогулка',      description: 'Пройди 1000 шагов на улице',  reward: 300 },
]

export const TRAINERS: Omit<Trainer, 'count'>[] = [
  { id: 'rope',      name: 'Скакалка',           emoji: '🪢', baseCost: 100,    baseIncome: 1 },
  { id: 'dumbbells', name: 'Гантели',             emoji: '🏋️', baseCost: 500,    baseIncome: 5 },
  { id: 'treadmill', name: 'Беговая дорожка',     emoji: '🏃', baseCost: 2000,   baseIncome: 20 },
  { id: 'bike',      name: 'Велотренажёр',        emoji: '🚴', baseCost: 10000,  baseIncome: 100 },
  { id: 'trainer',   name: 'Персональный тренер', emoji: '👨‍🏫', baseCost: 50000, baseIncome: 500 },
  { id: 'pool',      name: 'Бассейн',             emoji: '🏊', baseCost: 250000, baseIncome: 2500 },
]

export const LEVELS = [
  { min: 0,       label: 'Новичок',   emoji: '🥉' },
  { min: 1000,    label: 'Любитель',  emoji: '🥈' },
  { min: 10000,   label: 'Спортсмен', emoji: '🥇' },
  { min: 100000,  label: 'Атлет',     emoji: '🏅' },
  { min: 1000000, label: 'Чемпион',   emoji: '🏆' },
]

export function getLevel(totalPower: number) {
  let current = LEVELS[0]
  for (const lvl of LEVELS) {
    if (totalPower >= lvl.min) current = lvl
  }
  return current
}

export function getTrainerCost(trainer: Omit<Trainer, 'count'>, count: number) {
  return Math.floor(trainer.baseCost * Math.pow(1.15, count))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return Math.floor(n).toString()
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

const SAVE_KEY = 'fitness_clicker_v2'

export function saveGame(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      power: state.power,
      totalPower: state.totalPower,
      trainers: state.trainers.map(t => ({ id: t.id, count: t.count })),
      dailyClicksLeft: state.dailyClicksLeft,
      lastDailyReset: state.lastDailyReset,
      completedChallenges: state.completedChallenges,
      streak: state.streak,
      lastLoginDate: state.lastLoginDate,
    }))
  } catch {}
}

export function loadGame(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}
