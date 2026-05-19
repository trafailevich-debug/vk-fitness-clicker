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

export interface Achievement {
  id: string
  emoji: string
  name: string
  desc: string
}

export interface CharacterStats {
  strength: number   // +N силы за клик
  endurance: number  // +30 дневных кликов за уровень
}

export interface Program {
  id: string
  name: string
  emoji: string
  desc: string
  trainerIds: string[]
  statBonus: Partial<CharacterStats>
  powerBonus: number
}

export interface GameState {
  power: number
  totalPower: number
  totalClicks: number
  powerPerSecond: number
  userName: string
  trainers: Trainer[]
  dailyClicksLeft: number
  lastDailyReset: string
  completedChallenges: string[]
  streak: number
  lastLoginDate: string
  streakFreezes: number
  achievements: string[]
  lastActiveTime: number
  characterStats: CharacterStats
  trainerLastWorkout: Record<string, number>  // trainerId → timestamp ms
  selectedProgram: string | null
  programLastCompleted: string  // todayStr() когда была засчитана программа
}

export const MAX_DAILY_CLICKS = 100
export const MAX_OFFLINE_SECONDS = 8 * 3600
export const ENDURANCE_CLICKS_PER_LEVEL = 30

export const PROGRAMS: Program[] = [
  {
    id: 'cardio',
    name: 'Кардио',
    emoji: '🔥',
    desc: 'Выносливость +1 → +30 кликов/день навсегда',
    trainerIds: ['rope', 'treadmill', 'bike'],
    statBonus: { endurance: 1 },
    powerBonus: 300,
  },
  {
    id: 'strength',
    name: 'День силы',
    emoji: '💪',
    desc: 'Сила +1 → +1 сила за клик навсегда',
    trainerIds: ['dumbbells', 'trainer'],
    statBonus: { strength: 1 },
    powerBonus: 500,
  },
  {
    id: 'fullbody',
    name: 'Full Body',
    emoji: '⚡',
    desc: 'Сила+1, Выносливость+1 + мега-бонус',
    trainerIds: ['rope', 'dumbbells', 'treadmill', 'bike', 'trainer', 'pool'],
    statBonus: { strength: 1, endurance: 1 },
    powerBonus: 2000,
  },
]

export const DAILY_CHALLENGES: Challenge[] = [
  { id: 'water',   emoji: '💧', name: 'Выпей воду',   description: '2 стакана воды прямо сейчас', reward: 50 },
  { id: 'stretch', emoji: '🧘', name: 'Потянись',      description: 'Растяжка 3 минуты',           reward: 75 },
  { id: 'squat',   emoji: '🦵', name: 'Приседания',    description: '15 приседаний',               reward: 150 },
  { id: 'pushup',  emoji: '💪', name: 'Отжимания',     description: '10 отжиманий от пола',        reward: 200 },
  { id: 'walk',    emoji: '🚶', name: 'Прогулка',      description: 'Пройди 1000 шагов на улице',  reward: 300 },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_click',     emoji: '👟', name: 'Первый шаг',      desc: 'Сделал первый клик' },
  { id: 'clicks_50',       emoji: '💪', name: '50 кликов',       desc: 'Накликал 50 раз' },
  { id: 'clicks_500',      emoji: '🔥', name: '500 кликов',      desc: 'Настоящий кликер' },
  { id: 'first_trainer',   emoji: '🪢', name: 'Первый тренажёр', desc: 'Купил скакалку' },
  { id: 'first_challenge', emoji: '✅', name: 'Первое задание',   desc: 'Выполнил задание' },
  { id: 'all_challenges',  emoji: '🌟', name: 'Все задания',      desc: 'Все задания за день' },
  { id: 'level_amateur',   emoji: '🥈', name: 'Любитель',        desc: 'Достиг уровня Любитель' },
  { id: 'level_sportsman', emoji: '🥇', name: 'Спортсмен',       desc: 'Достиг уровня Спортсмен' },
  { id: 'streak_3',        emoji: '🔥', name: '3 дня подряд',    desc: 'Серия 3 дня' },
  { id: 'streak_7',        emoji: '🗓️', name: 'Неделя!',         desc: 'Серия 7 дней' },
  { id: 'combo_x2',        emoji: '⚡', name: 'COMBO x2',        desc: 'Достиг комбо x2' },
  { id: 'combo_x3',        emoji: '🌪️', name: 'COMBO x3',        desc: 'Достиг комбо x3' },
  { id: 'freeze_used',     emoji: '🧊', name: 'Заморозка!',      desc: 'Использовал заморозку серии' },
  { id: 'offline_1h',      emoji: '⏰', name: 'Без тебя работали', desc: 'Собрал доход за 1+ час' },
]

export const TRAINERS: Omit<Trainer, 'count'>[] = [
  { id: 'rope',      name: 'Скакалка',           emoji: '🪢', baseCost: 100,    baseIncome: 0.2 },
  { id: 'dumbbells', name: 'Гантели',             emoji: '🏋️', baseCost: 500,    baseIncome: 1 },
  { id: 'treadmill', name: 'Беговая дорожка',     emoji: '🏃', baseCost: 2000,   baseIncome: 4 },
  { id: 'bike',      name: 'Велотренажёр',        emoji: '🚴', baseCost: 10000,  baseIncome: 20 },
  { id: 'trainer',   name: 'Персональный тренер', emoji: '👨‍🏫', baseCost: 50000, baseIncome: 100 },
  { id: 'pool',      name: 'Бассейн',             emoji: '🏊', baseCost: 250000, baseIncome: 500 },
]

export const LEVELS = [
  { min: 0,       label: 'Новичок',   emoji: '🧍', character: '🧍' },
  { min: 1000,    label: 'Любитель',  emoji: '🚶', character: '🚶' },
  { min: 10000,   label: 'Спортсмен', emoji: '🏃', character: '🏃' },
  { min: 100000,  label: 'Атлет',     emoji: '🏋️', character: '🏋️' },
  { min: 1000000, label: 'Чемпион',   emoji: '🥇', character: '🥇' },
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

export function todayMidnightMs(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}ч ${m}м`
  return `${m}м`
}

const SAVE_KEY = 'fitness_clicker_v4'

export function saveGame(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      power: state.power,
      totalPower: state.totalPower,
      totalClicks: state.totalClicks,
      trainers: state.trainers.map(t => ({ id: t.id, count: t.count })),
      dailyClicksLeft: state.dailyClicksLeft,
      lastDailyReset: state.lastDailyReset,
      completedChallenges: state.completedChallenges,
      streak: state.streak,
      lastLoginDate: state.lastLoginDate,
      streakFreezes: state.streakFreezes,
      achievements: state.achievements,
      lastActiveTime: Date.now(),
      characterStats: state.characterStats,
      trainerLastWorkout: state.trainerLastWorkout,
      selectedProgram: state.selectedProgram,
      programLastCompleted: state.programLastCompleted,
    }))
  } catch {}
}

export function loadGame(): (Partial<GameState> & { lastActiveTime?: number }) | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}
