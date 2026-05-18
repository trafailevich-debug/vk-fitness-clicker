export interface Trainer {
  id: string
  name: string
  emoji: string
  description: string
  baseCost: number
  baseIncome: number
  count: number
}

export interface GameState {
  power: number
  totalPower: number
  powerPerClick: number
  powerPerSecond: number
  level: number
  userName: string
  trainers: Trainer[]
  clickAnimations: number[]
}

export const TRAINERS: Omit<Trainer, 'count'>[] = [
  { id: 'rope',      name: 'Скакалка',          emoji: '🪢', description: '+1 силы/сек',     baseCost: 100,    baseIncome: 1 },
  { id: 'dumbbells', name: 'Гантели',            emoji: '🏋️', description: '+5 силы/сек',     baseCost: 500,    baseIncome: 5 },
  { id: 'treadmill', name: 'Беговая дорожка',    emoji: '🏃', description: '+20 силы/сек',    baseCost: 2000,   baseIncome: 20 },
  { id: 'bike',      name: 'Велотренажёр',       emoji: '🚴', description: '+100 силы/сек',   baseCost: 10000,  baseIncome: 100 },
  { id: 'trainer',   name: 'Персональный тренер', emoji: '👨‍🏫', description: '+500 силы/сек', baseCost: 50000,  baseIncome: 500 },
  { id: 'pool',      name: 'Бассейн',            emoji: '🏊', description: '+2500 силы/сек',  baseCost: 250000, baseIncome: 2500 },
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

const SAVE_KEY = 'fitness_clicker_save'

export function saveGame(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      power: state.power,
      totalPower: state.totalPower,
      trainers: state.trainers.map(t => ({ id: t.id, count: t.count })),
    }))
  } catch {}
}

export function loadGame(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}
