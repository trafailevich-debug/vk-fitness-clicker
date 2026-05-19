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
  howTo: string[]
  healthBenefit: string
  category: 'mobility' | 'strength' | 'cardio' | 'hydration' | 'recovery'
  reward: number
}

export interface Achievement {
  id: string
  emoji: string
  name: string
  desc: string
}

export interface CharacterStats {
  strength: number
  endurance: number
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

export interface VipWorkout {
  id: string
  name: string
  emoji: string
  description: string
  howTo: string[]
  healthBenefit: string
  type: 'tap' | 'hold'
  target?: number
  timeLimit?: number
  duration?: number
  reward: number
}

export interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  totalPower: number
  streak: number
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
  trainerLastWorkout: Record<string, number>
  selectedProgram: string | null
  programLastCompleted: string
  completedVipWorkouts: string[]
  dailyAllDoneDate: string
}

export const MAX_DAILY_CLICKS = 100
export const MAX_OFFLINE_SECONDS = 8 * 3600
export const ENDURANCE_CLICKS_PER_LEVEL = 30

export const VIP_WORKOUTS: VipWorkout[] = [
  {
    id: 'yoga_flow',
    name: 'Йога-поток',
    emoji: '🧘‍♀️',
    description: 'Медитативный поток поз для тела и разума',
    howTo: [
      'Встань прямо, ноги на ширине плеч',
      'Поднимай руки вверх на вдохе, опускай на выдохе',
      'Переходи между позами плавно, без рывков',
      'Дыши глубоко и ровно всё время',
    ],
    healthBenefit: 'Снижает кортизол на 20%, улучшает гибкость позвоночника и успокаивает нервную систему',
    type: 'hold',
    duration: 8,
    reward: 600,
  },
  {
    id: 'sprint_series',
    name: 'Спринт-серия',
    emoji: '⚡',
    description: 'Взрывная HIIT-тренировка для максимального жиросжигания',
    howTo: [
      'Разомнись 30 секунд на месте',
      'Бег на месте с максимальной скоростью 10 секунд',
      'Отдых 20 секунд — ходьба',
      'Повтори цикл 5–8 раз',
    ],
    healthBenefit: 'HIIT ускоряет метаболизм на 24 часа, сжигает жир в 3× эффективнее обычного кардио',
    type: 'tap',
    target: 40,
    timeLimit: 25,
    reward: 800,
  },
  {
    id: 'plank_challenge',
    name: 'Планка-вызов',
    emoji: '🏆',
    description: 'Удержи идеальную планку до победного конца',
    howTo: [
      'Прими упор лёжа на предплечьях',
      'Тело — прямая линия от головы до пяток',
      'Напряги пресс и ягодицы',
      'Держи взгляд в пол, дыши ровно',
    ],
    healthBenefit: 'Укрепляет кор и стабилизаторы позвоночника — профилактика боли в спине',
    type: 'hold',
    duration: 10,
    reward: 1000,
  },
  {
    id: 'power_yoga',
    name: 'Силовая йога',
    emoji: '🌟',
    description: 'Интенсивная последовательность для силы и баланса',
    howTo: [
      'Воин I: выпад вперёд, руки вверх — 30 секунд',
      'Воин II: руки в стороны, взгляд вперёд — 30 секунд',
      'Планка → Чатуранга → Собака мордой вниз',
      'Повтори последовательность 3 раза',
    ],
    healthBenefit: 'Строит мышечную выносливость, улучшает баланс, координацию и осознанность тела',
    type: 'tap',
    target: 20,
    timeLimit: 20,
    reward: 700,
  },
]

export const LEADERBOARD_MOCK: LeaderboardEntry[] = [
  { rank: 1,  name: 'Александра К.',  avatar: '👑', totalPower: 5420000, streak: 45 },
  { rank: 2,  name: 'Дмитрий В.',     avatar: '🥈', totalPower: 4180000, streak: 38 },
  { rank: 3,  name: 'Мария С.',       avatar: '🥉', totalPower: 3950000, streak: 52 },
  { rank: 4,  name: 'Иван П.',        avatar: '⭐', totalPower: 2870000, streak: 29 },
  { rank: 5,  name: 'Наталья Ш.',     avatar: '⭐', totalPower: 2340000, streak: 21 },
  { rank: 6,  name: 'Андрей Т.',      avatar: '⭐', totalPower: 1980000, streak: 18 },
  { rank: 7,  name: 'Олеся М.',       avatar: '⭐', totalPower: 1650000, streak: 15 },
  { rank: 8,  name: 'Кирилл Б.',      avatar: '⭐', totalPower: 1420000, streak: 12 },
  { rank: 9,  name: 'Светлана Ж.',    avatar: '⭐', totalPower: 1190000, streak: 11 },
  { rank: 10, name: 'Роман Н.',       avatar: '⭐', totalPower: 980000,  streak: 9  },
  { rank: 11, name: 'Виктория Л.',    avatar: '⭐', totalPower: 820000,  streak: 8  },
  { rank: 12, name: 'Евгений К.',     avatar: '⭐', totalPower: 690000,  streak: 7  },
  { rank: 13, name: 'Юлия А.',        avatar: '⭐', totalPower: 580000,  streak: 6  },
  { rank: 14, name: 'Алексей С.',     avatar: '⭐', totalPower: 470000,  streak: 5  },
  { rank: 15, name: 'Татьяна В.',     avatar: '⭐', totalPower: 380000,  streak: 5  },
  { rank: 16, name: 'Сергей П.',      avatar: '⭐', totalPower: 290000,  streak: 4  },
  { rank: 17, name: 'Анастасия Г.',   avatar: '⭐', totalPower: 210000,  streak: 3  },
  { rank: 18, name: 'Михаил Ф.',      avatar: '⭐', totalPower: 150000,  streak: 3  },
  { rank: 19, name: 'Ирина Д.',       avatar: '⭐', totalPower: 95000,   streak: 2  },
  { rank: 20, name: 'Павел З.',       avatar: '⭐', totalPower: 52000,   streak: 1  },
]

export const PROGRAMS: Program[] = [
  {
    id: 'cardio',
    name: 'Кардио',
    emoji: '❤️',
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
  {
    id: 'water',
    emoji: '💧',
    name: 'Выпей воду',
    description: '2 стакана воды прямо сейчас',
    howTo: [
      'Налей 2 стакана чистой воды',
      'Выпивай медленно, небольшими глотками',
      'Не торопись — дай телу усвоить',
    ],
    healthBenefit: 'Запускает метаболизм, улучшает кожу и очищает организм от токсинов',
    category: 'hydration',
    reward: 50,
  },
  {
    id: 'headrotate',
    emoji: '🔄',
    name: 'Покрути головой',
    description: '10 вращений в каждую сторону',
    howTo: [
      'Встань прямо, расслабь плечи',
      'Медленно поверни голову вправо — максимально',
      'Затем влево. Повтори 10 раз в каждую сторону',
    ],
    healthBenefit: 'Снимает напряжение шеи, улучшает кровообращение мозга и уменьшает головную боль',
    category: 'mobility',
    reward: 75,
  },
  {
    id: 'steps100',
    emoji: '👟',
    name: 'Пройди 100 шагов',
    description: 'Встань и пройди 100 шагов',
    howTo: [
      'Встань с кресла или дивана',
      'Пройдись по комнате или по коридору',
      'Считай каждый шаг до 100',
    ],
    healthBenefit: 'Движение каждые 30 минут снижает риск диабета и улучшает циркуляцию крови',
    category: 'cardio',
    reward: 100,
  },
  {
    id: 'stretch',
    emoji: '🧘',
    name: 'Потянись',
    description: 'Растяжка 3 минуты',
    howTo: [
      'Потяни руки вверх — задержи 15 секунд',
      'Наклонись вперёд, дотянись до ног — задержи 20с',
      'Скрути торс в стороны — по 15с каждую',
    ],
    healthBenefit: 'Уменьшает боли в спине, повышает гибкость и снижает риск травм',
    category: 'recovery',
    reward: 75,
  },
  {
    id: 'squat',
    emoji: '🦵',
    name: 'Приседания',
    description: '15 приседаний',
    howTo: [
      'Стой прямо, ноги на ширине плеч',
      'Опускайся до параллели бёдер с полом',
      'Спина ровная, колени не заходят за носки',
      'Встань — это 1 повторение',
    ],
    healthBenefit: 'Укрепляет квадрицепсы, ягодицы и кор. Улучшает гормональный фон',
    category: 'strength',
    reward: 150,
  },
  {
    id: 'pushup',
    emoji: '💪',
    name: 'Отжимания',
    description: '10 отжиманий от пола',
    howTo: [
      'Упрись ладонями чуть шире плеч',
      'Тело прямое как доска — не прогибай поясницу',
      'Опускай грудь до касания пола',
      'Выжми себя вверх — это 1 повторение',
    ],
    healthBenefit: 'Развивает грудь, трицепсы, плечи и укрепляет стабилизаторы корпуса',
    category: 'strength',
    reward: 200,
  },
  {
    id: 'breathe',
    emoji: '🌬️',
    name: 'Дыхание',
    description: 'Глубокое дыхание 1 минуту',
    howTo: [
      'Вдох через нос — 4 секунды',
      'Задержи дыхание — 4 секунды',
      'Выдох через рот — 6 секунд',
      'Повтори 6–8 раз',
    ],
    healthBenefit: 'Снижает кортизол (стресс-гормон), нормализует давление и улучшает фокус',
    category: 'recovery',
    reward: 80,
  },
  {
    id: 'walk',
    emoji: '🚶',
    name: 'Прогулка',
    description: 'Пройди 1000 шагов на улице',
    howTo: [
      'Выйди на улицу или длинный коридор',
      'Шагай активно — руки двигаются в такт',
      'Дыши носом, держи голову поднятой',
      'Поддерживай темп ~120 шагов в минуту',
    ],
    healthBenefit: 'Тысяча шагов = сожжённые калории, свежий воздух и выброс серотонина',
    category: 'cardio',
    reward: 300,
  },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_click',     emoji: '👟', name: 'Первый шаг',      desc: 'Сделал первый клик' },
  { id: 'clicks_50',       emoji: '💪', name: '50 кликов',       desc: 'Накликал 50 раз' },
  { id: 'clicks_500',      emoji: '🔥', name: '500 кликов',      desc: 'Настоящий кликер' },
  { id: 'first_trainer',   emoji: '🪢', name: 'Первый тренажёр', desc: 'Купил первый тренажёр' },
  { id: 'first_challenge', emoji: '✅', name: 'Первое задание',   desc: 'Выполнил первое задание' },
  { id: 'all_challenges',  emoji: '🌟', name: 'Все задания',      desc: 'Все задания за день' },
  { id: 'vip_unlocked',    emoji: '👑', name: 'VIP доступ',      desc: 'Открыл ВИП-тренировки' },
  { id: 'level_amateur',   emoji: '🥈', name: 'Начинающий',      desc: 'Достиг уровня Начинающий' },
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
  {
    min: 0,
    label: 'Новичок',
    emoji: '🌱',
    character: '🌱',
    color: '#34d399',
    nextLevelHint: 'Выпей воду, пройди 100 шагов и покрути головой',
    nextRequiredChallenges: ['water', 'steps100', 'headrotate'],
  },
  {
    min: 1000,
    label: 'Начинающий',
    emoji: '🏃',
    character: '🏃',
    color: '#60a5fa',
    nextLevelHint: 'Добавь растяжку, приседания и дыхание',
    nextRequiredChallenges: ['stretch', 'squat', 'breathe'],
  },
  {
    min: 10000,
    label: 'Спортсмен',
    emoji: '💪',
    character: '💪',
    color: '#a78bfa',
    nextLevelHint: 'Выполни отжимания и прогулку',
    nextRequiredChallenges: ['pushup', 'walk'],
  },
  {
    min: 100000,
    label: 'Атлет',
    emoji: '🏋️',
    character: '🏋️',
    color: '#f59e0b',
    nextLevelHint: 'Выполняй все задания каждый день',
    nextRequiredChallenges: [],
  },
  {
    min: 1000000,
    label: 'Чемпион',
    emoji: '🥇',
    character: '🥇',
    color: '#fbbf24',
    nextLevelHint: 'Ты на вершине!',
    nextRequiredChallenges: [],
  },
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

const SAVE_KEY = 'fitness_clicker_v5'

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
      completedVipWorkouts: state.completedVipWorkouts,
      dailyAllDoneDate: state.dailyAllDoneDate,
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
