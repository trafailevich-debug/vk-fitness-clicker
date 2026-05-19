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

export const DAILY_CHALLENGES_COUNT = 5

export const ALL_DAILY_CHALLENGES: Challenge[] = [
  // ── Гидрация ──
  {
    id: 'water', emoji: '💧', name: 'Выпей воду', category: 'hydration', reward: 50,
    description: '2 стакана воды прямо сейчас',
    howTo: ['Налей 2 стакана чистой воды', 'Пей медленно, небольшими глотками', 'Не торопись — дай телу усвоить'],
    healthBenefit: 'Запускает метаболизм, улучшает кожу и очищает организм от токсинов',
  },
  {
    id: 'herbal_tea', emoji: '🍵', name: 'Травяной чай', category: 'hydration', reward: 60,
    description: 'Выпей чашку тёплого чая',
    howTo: ['Завари ромашку, мяту или имбирный чай', 'Пей небольшими глотками не спеша', 'Наслаждайся моментом без телефона'],
    healthBenefit: 'Ромашка снижает тревожность, мята улучшает пищеварение, имбирь поднимает иммунитет',
  },
  {
    id: 'water_lemon', emoji: '🍋', name: 'Вода с лимоном', category: 'hydration', reward: 55,
    description: 'Стакан воды с долькой лимона',
    howTo: ['Нарежь четверть лимона', 'Выжми сок в стакан воды комнатной температуры', 'Выпей натощак или между едой'],
    healthBenefit: 'Витамин C укрепляет иммунитет, лимон ощелачивает организм и поддерживает пищеварение',
  },
  // ── Мобильность ──
  {
    id: 'headrotate', emoji: '🔄', name: 'Покрути головой', category: 'mobility', reward: 75,
    description: '10 вращений в каждую сторону',
    howTo: ['Встань прямо, расслабь плечи', 'Медленно поверни голову вправо — максимально', 'Затем влево. Повтори 10 раз в каждую сторону'],
    healthBenefit: 'Снимает напряжение шеи, улучшает кровообращение мозга и уменьшает головную боль',
  },
  {
    id: 'neck_stretch', emoji: '🦢', name: 'Растяжка шеи', category: 'mobility', reward: 70,
    description: 'Наклоны шеи в 4 стороны',
    howTo: ['Медленно наклони голову вправо — ухо к плечу', 'Задержи 10 секунд', 'Повтори влево, вперёд и назад', 'По 10 секунд в каждую сторону'],
    healthBenefit: 'Расслабляет трапециевидную мышцу, снимает головную боль от напряжения',
  },
  {
    id: 'shoulder_roll', emoji: '🔁', name: 'Вращение плечами', category: 'mobility', reward: 65,
    description: '10 вращений вперёд и назад',
    howTo: ['Стой прямо, руки свободно вдоль тела', 'Подними плечи вверх, отведи назад, опусти вниз', 'Повтори 10 раз назад, затем 10 раз вперёд'],
    healthBenefit: 'Снимает зажимы в плечах от долгого сидения, улучшает осанку',
  },
  {
    id: 'wrist_rotation', emoji: '🤲', name: 'Вращение запястьями', category: 'mobility', reward: 60,
    description: '10 вращений каждым запястьем',
    howTo: ['Вытяни руки перед собой', 'Вращай кисти по часовой стрелке — 10 раз', 'Затем против — 10 раз'],
    healthBenefit: 'Предотвращает туннельный синдром, снимает усталость от клавиатуры и телефона',
  },
  {
    id: 'ankle_rotation', emoji: '🦶', name: 'Вращение лодыжками', category: 'mobility', reward: 65,
    description: '10 вращений каждой стопой',
    howTo: ['Сядь или стой, подними одну ногу', 'Вращай стопой по часовой — 10 раз', 'Затем против — 10 раз. Смени ногу'],
    healthBenefit: 'Улучшает кровообращение в ногах, снимает усталость и снижает риск варикоза',
  },
  {
    id: 'arm_circles', emoji: '🙆', name: 'Мельница руками', category: 'mobility', reward: 70,
    description: '10 больших кругов каждой рукой',
    howTo: ['Встань, ноги на ширине плеч', 'Вытяни правую руку и делай большие круги — 10 раз', 'Повтори левой рукой'],
    healthBenefit: 'Разогревает плечевой сустав, улучшает подвижность и снижает риск травм',
  },
  {
    id: 'side_stretch', emoji: '↔️', name: 'Боковые наклоны', category: 'mobility', reward: 80,
    description: '10 наклонов в каждую сторону',
    howTo: ['Встань прямо, ноги на ширине плеч', 'Подними правую руку над головой', 'Наклоняйся влево — тянись. 10 раз', 'Повтори с левой рукой вправо'],
    healthBenefit: 'Растягивает боковые мышцы торса, снимает напряжение в пояснице',
  },
  {
    id: 'hip_rotation', emoji: '🌀', name: 'Вращение бёдрами', category: 'mobility', reward: 75,
    description: '10 кругов бёдрами в каждую сторону',
    howTo: ['Встань, ноги шире плеч, руки на бёдрах', 'Делай большие круги бёдрами — 10 раз', 'Затем в обратную сторону — 10 раз'],
    healthBenefit: 'Разрабатывает тазобедренный сустав, помогает при сидячей работе',
  },
  {
    id: 'toe_touch', emoji: '🖐️', name: 'Наклоны к носкам', category: 'mobility', reward: 80,
    description: '10 наклонов вперёд, тянись к полу',
    howTo: ['Встань прямо, ноги вместе', 'Медленно наклоняйся вперёд, тянись руками к полу', 'Задержи 5 секунд, вернись. Повтори 10 раз'],
    healthBenefit: 'Растягивает заднюю поверхность бедра и поясницу — главные зоны напряжения',
  },
  // ── Кардио ──
  {
    id: 'steps100', emoji: '👟', name: 'Пройди 100 шагов', category: 'cardio', reward: 100,
    description: 'Встань и пройди 100 шагов',
    howTo: ['Встань с кресла или дивана', 'Пройдись по комнате или коридору', 'Считай каждый шаг до 100'],
    healthBenefit: 'Движение каждые 30 минут снижает риск диабета и улучшает циркуляцию крови',
  },
  {
    id: 'walk', emoji: '🚶', name: 'Прогулка', category: 'cardio', reward: 300,
    description: 'Пройди 1000 шагов на улице',
    howTo: ['Выйди на улицу или длинный коридор', 'Шагай активно — руки двигаются в такт', 'Дыши носом, держи голову поднятой'],
    healthBenefit: 'Тысяча шагов = сожжённые калории, свежий воздух и выброс серотонина',
  },
  {
    id: 'calf_raises', emoji: '🦵', name: 'Подъёмы на носки', category: 'cardio', reward: 90,
    description: '20 подъёмов на носки стоя',
    howTo: ['Встань у стены или стула для баланса', 'Медленно поднимись на носки — задержи 2 секунды', 'Опустись. Повтори 20 раз'],
    healthBenefit: 'Укрепляет икры, улучшает кровоток в ногах и снижает риск варикоза',
  },
  {
    id: 'march_place', emoji: '🥾', name: 'Шагаем на месте', category: 'cardio', reward: 85,
    description: 'Шагай на месте 1 минуту',
    howTo: ['Встань прямо', 'Поднимай колени попеременно до уровня бедра', 'Руки двигаются как при ходьбе', 'Темп — комфортный, дыши ровно'],
    healthBenefit: 'Разгоняет кровь, разминает суставы, подходит когда нет возможности выйти на улицу',
  },
  {
    id: 'jumping_jacks', emoji: '🤸', name: 'Прыжки Джек', category: 'cardio', reward: 120,
    description: '20 прыжков с расстановкой рук',
    howTo: ['Встань, ноги вместе, руки по швам', 'Прыгни — разведи ноги в стороны, подними руки над головой', 'Прыгни обратно в исходную позицию', 'Повтори 20 раз в бодром темпе'],
    healthBenefit: 'Разгоняет пульс за 30 секунд, активирует весь организм и сжигает калории',
  },
  {
    id: 'knee_raise', emoji: '🏃', name: 'Подъёмы колен', category: 'cardio', reward: 100,
    description: '20 подъёмов колен поочерёдно',
    howTo: ['Встань прямо, руки на поясе', 'Поднимай правое колено до уровня живота', 'Опусти, подними левое. Это 1 повторение', 'Повтори 20 раз в умеренном темпе'],
    healthBenefit: 'Укрепляет сгибатели бедра и пресс, улучшает баланс и координацию',
  },
  // ── Сила ──
  {
    id: 'squat', emoji: '🦵', name: 'Приседания', category: 'strength', reward: 150,
    description: '15 приседаний',
    howTo: ['Стой прямо, ноги на ширине плеч', 'Опускайся до параллели бёдер с полом', 'Спина ровная, колени не заходят за носки', 'Встань — это 1 повторение'],
    healthBenefit: 'Укрепляет квадрицепсы, ягодицы и кор. Улучшает гормональный фон',
  },
  {
    id: 'pushup', emoji: '💪', name: 'Отжимания', category: 'strength', reward: 200,
    description: '10 отжиманий от пола',
    howTo: ['Упрись ладонями чуть шире плеч', 'Тело прямое как доска', 'Опускай грудь до касания пола', 'Выжми себя вверх — это 1 повторение'],
    healthBenefit: 'Развивает грудь, трицепсы, плечи и укрепляет стабилизаторы корпуса',
  },
  {
    id: 'wall_sit', emoji: '🪑', name: 'Стульчик у стены', category: 'strength', reward: 130,
    description: 'Удержи позицию 30 секунд',
    howTo: ['Прислонись спиной к стене', 'Опустись до прямого угла в коленях (как сидишь на стуле)', 'Держи спину прямой, руки на коленях', 'Удерживай 30 секунд'],
    healthBenefit: 'Укрепляет квадрицепсы и ягодицы без нагрузки на суставы — подходит всем',
  },
  {
    id: 'balance_stand', emoji: '🧘', name: 'Стой на одной ноге', category: 'strength', reward: 110,
    description: '30 секунд на каждой ноге',
    howTo: ['Встань прямо рядом со стулом для страховки', 'Подними правую ногу, стой на левой — 30 секунд', 'Поменяй ногу. Для усложнения — закрой глаза'],
    healthBenefit: 'Улучшает баланс и проприоцепцию, укрепляет голеностоп и стабилизаторы',
  },
  {
    id: 'heel_raises', emoji: '👣', name: 'Подъёмы на пятки', category: 'strength', reward: 90,
    description: '20 подъёмов на пятки стоя',
    howTo: ['Встань прямо, руки вдоль тела', 'Подними носки — стой на пятках 2 секунды', 'Опусти обратно. Повтори 20 раз'],
    healthBenefit: 'Укрепляет переднюю часть голени, улучшает баланс и снижает риск спотыкания',
  },
  // ── Растяжка/восстановление ──
  {
    id: 'stretch', emoji: '🧘', name: 'Потянись', category: 'recovery', reward: 75,
    description: 'Растяжка 3 минуты',
    howTo: ['Потяни руки вверх — задержи 15 секунд', 'Наклонись вперёд, дотянись до ног — 20с', 'Скрути торс в стороны — по 15с'],
    healthBenefit: 'Уменьшает боли в спине, повышает гибкость и снижает риск травм',
  },
  {
    id: 'cat_cow', emoji: '🐱', name: 'Кошка-корова', category: 'recovery', reward: 80,
    description: '10 прогибов спины на четвереньках',
    howTo: ['Встань на четвереньки — ладони под плечами, колени под бёдрами', 'На вдохе — прогнись вниз (корова), голова вверх', 'На выдохе — округли спину вверх (кошка), голова вниз', 'Повтори 10 раз медленно'],
    healthBenefit: 'Снимает скованность позвоночника, улучшает кровоснабжение дисков',
  },
  {
    id: 'chest_opener', emoji: '🫁', name: 'Раскрытие груди', category: 'recovery', reward: 70,
    description: 'Растяжка грудных мышц 2 минуты',
    howTo: ['Встань в дверном проёме, руки на косяках', 'Медленно наклонись вперёд, раскрывая грудь', 'Задержи 15–20 секунд, почувствуй растяжение', 'Повтори 4–5 раз'],
    healthBenefit: 'Раскрывает грудной отдел, который сжимается от сидения — улучшает дыхание',
  },
  {
    id: 'desk_stretch', emoji: '💼', name: 'Растяжка за столом', category: 'recovery', reward: 65,
    description: 'Комплекс растяжек сидя',
    howTo: ['Сядь прямо, возьмись за подлокотники', 'Скрути корпус вправо — задержи 10с, затем влево', 'Потяни обе руки над головой — задержи 15с', 'Наклони голову к каждому плечу по 10с'],
    healthBenefit: 'Снимает усталость от рабочей позы за 3 минуты, не вставая со стула',
  },
  {
    id: 'back_stretch', emoji: '🦴', name: 'Растяжка спины', category: 'recovery', reward: 85,
    description: 'Потяни поясницу лёжа',
    howTo: ['Ляг на спину', 'Подтяни колени к груди, обхвати руками', 'Покачайся слева направо 10 раз', 'Задержи в центре — 20 секунд'],
    healthBenefit: 'Снимает компрессию поясничных позвонков, особенно эффективно после долгого сидения',
  },
  // ── Дыхание и ментальное ──
  {
    id: 'breathe', emoji: '🌬️', name: 'Дыхание 4-4-6', category: 'recovery', reward: 80,
    description: 'Глубокое дыхание 1 минуту',
    howTo: ['Вдох через нос — 4 секунды', 'Задержи дыхание — 4 секунды', 'Выдох через рот — 6 секунд', 'Повтори 6–8 раз'],
    healthBenefit: 'Снижает кортизол (стресс-гормон), нормализует давление и улучшает фокус',
  },
  {
    id: 'eye_rest', emoji: '👁️', name: 'Отдых для глаз', category: 'recovery', reward: 60,
    description: 'Правило 20-20-20 для глаз',
    howTo: ['Отвернись от экрана', 'Смотри на предмет в 6 метрах (на улицу или дальний угол)', 'Удерживай взгляд 20 секунд', 'Повтори 3 раза'],
    healthBenefit: 'Снимает усталость глаз от экрана, снижает риск миопии и синдрома сухого глаза',
  },
  {
    id: 'posture', emoji: '🪆', name: 'Правильная осанка', category: 'recovery', reward: 55,
    description: 'Сядь правильно на 2 минуты',
    howTo: ['Сядь на край стула, стопы на полу', 'Выпрями спину, плечи назад и вниз', 'Подбородок параллельно полу', 'Удерживай позицию 2 минуты, дыши ровно'],
    healthBenefit: 'Правильная осанка снижает нагрузку на позвоночник и улучшает работу внутренних органов',
  },
  {
    id: 'fresh_air', emoji: '🌿', name: 'Свежий воздух', category: 'recovery', reward: 70,
    description: 'Открой окно и подыши 2 минуты',
    howTo: ['Открой окно или выйди на балкон', 'Сделай 10 глубоких вдохов', 'Смотри вдаль — дай глазам отдохнуть', 'Почувствуй прохладу — это перезагрузка'],
    healthBenefit: 'Свежий воздух снижает CO₂ в помещении, повышает концентрацию и снимает сонливость',
  },
  {
    id: 'cold_wash', emoji: '🧊', name: 'Умойся холодной водой', category: 'recovery', reward: 75,
    description: 'Умойся прохладной водой',
    howTo: ['Пройди к умывальнику', 'Смочи лицо прохладной водой — 5–7 раз', 'Промокни полотенцем', 'При желании — смочи запястья'],
    healthBenefit: 'Холодная вода активирует нервную систему, снимает усталость и сужает поры',
  },
  {
    id: 'no_phone', emoji: '📵', name: 'Пауза без телефона', category: 'recovery', reward: 90,
    description: 'Отложи телефон на 5 минут',
    howTo: ['Убери телефон из поля зрения', 'Просто посиди — смотри в окно или закрой глаза', 'Заметь звуки и ощущения вокруг', 'Не тянись к телефону 5 минут'],
    healthBenefit: 'Снижает тревожность, даёт мозгу отдохнуть от потока информации и уведомлений',
  },
  {
    id: 'massage_hands', emoji: '🤝', name: 'Массаж кистей', category: 'recovery', reward: 65,
    description: 'Помассируй кисти рук 2 минуты',
    howTo: ['Надави большим пальцем на ладонь другой руки', 'Круговыми движениями проработай всю ладонь', 'Потяни каждый палец мягко', 'Повтори на другой руке'],
    healthBenefit: 'Снимает напряжение от печатания, улучшает кровоток и профилактирует туннельный синдром',
  },
]

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = Math.imul(s, 1664525) + 1013904223 | 0
    const j = Math.abs(s) % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function getDailyChallenges(): Challenge[] {
  const today = todayStr()
  const seed = today.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0)
  return seededShuffle(ALL_DAILY_CHALLENGES, seed).slice(0, DAILY_CHALLENGES_COUNT)
}

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
