export const EQUIPMENT_RARITIES = [
  { id: "common", label: "Обычный", fromLevel: 1, toLevel: 8, maxEnhancement: 3 },
  { id: "uncommon", label: "Необычный", fromLevel: 9, toLevel: 16, maxEnhancement: 4 },
  { id: "rare", label: "Редкий", fromLevel: 17, toLevel: 27, maxEnhancement: 6 },
  { id: "epic", label: "Эпический", fromLevel: 28, toLevel: 38, maxEnhancement: 8 },
  { id: "legendary", label: "Легендарный", fromLevel: 39, toLevel: 46, maxEnhancement: 10 },
  { id: "unique", label: "Уникальный", fromLevel: 47, toLevel: 50, maxEnhancement: 12 },
];

const COMMON_EFFECTS = [
  (tier) =>
    `Атакующие приёмы расходуют на ${Math.max(1, Math.floor(tier / 4))} ед. выносливости меньше (не ниже 1).`,
  (tier) => `После успешного приёма точность следующей атаки +${2 + tier}%.`,
  (tier) => `Критический урон повышен на ${5 + tier * 2}%.`,
  (tier) => `Первый удар в бою наносит +${4 + tier * 3}% урона.`,
  (tier) => `После идеального блока или парирования атака +${3 + tier * 2}% на 2 сек.`,
  (tier) => `При выносливости ниже 30% урон приёмов +${5 + tier * 2}%.`,
  (tier) =>
    `Каждый 4-й успешный приём восстанавливает ${1 + Math.min(3, Math.floor(tier / 2))} выносливости.`,
  (tier) => `Шанс ${3 + tier}% не потратить выносливость при использовании приёма.`,
  (tier) => `Урон по противнику с полным HP +${5 + tier * 2}%.`,
  (tier) => `После победы над врагом восстанавливается ${2 + tier} выносливости.`,
  (tier) => `Шанс критического удара после уклонения +${2 + tier}%.`,
  (tier) => `Последний приём комбинации получает +${4 + tier * 2}% урона.`,
];

const WEAPON_CATALOG_CONFIG = {
  oneHanded: {
    label: "Одноручный меч",
    bases: ["Клинок", "Меч", "Острие", "Сталь", "Фальшион"],
    themes: [
      "Рассвета",
      "Серого Волка",
      "Пепла",
      "Шторма",
      "Стража",
      "Сумерек",
      "Кровавой Луны",
      "Белого Пламени",
      "Бездны",
      "Короны",
    ],
    uniqueNames: [
      "Королевский клинок Астра",
      "Меч Небесного Предела",
      "Клык Вечного Стража",
      "Светоносец",
    ],
    uniqueEffects: [
      "Каждый третий атакующий приём получает +20% урона и не может быть прерван.",
      "При HP ниже 35% стоимость приёмов одноручного меча −1 и крит. шанс +6%.",
      "После парирования следующий приём наносит +30% урона.",
      "Раз в бой при падении HP ниже 20% мгновенно восстанавливает 5 выносливости.",
    ],
    attack: 0,
    accuracy: 1,
    crit: 0,
  },
  twoHanded: {
    label: "Двуручный меч",
    bases: ["Двуручник", "Клеймор", "Гранд-меч", "Исполин", "Разрушитель"],
    themes: [
      "Грома",
      "Горного Короля",
      "Обвала",
      "Железной Бури",
      "Титана",
      "Пепельной Крепи",
      "Красного Неба",
      "Черного Камня",
      "Последней Войны",
      "Предела",
    ],
    uniqueNames: ["Разлом Мира", "Клеймор Титана", "Последний Приговор", "Небесный Колосс"],
    uniqueEffects: [
      "Заряженные и завершающие приёмы наносят +25% урона, но стоят +1 выносливость.",
      "Первый тяжёлый приём в бою пробивает 20% защиты цели.",
      "Каждый 3-й тяжёлый удар вызывает ударную волну на 40% урона.",
      "При полной выносливости первый удар наносит +40% урона.",
    ],
    attack: 5,
    accuracy: -1,
    crit: 1,
  },
  rapier: {
    label: "Рапира",
    bases: ["Рапира", "Игла", "Шпага", "Стилет-рапира", "Дуэльный клинок"],
    themes: [
      "Сапфировой Розы",
      "Серебряной Нити",
      "Алого Танца",
      "Лунного Двора",
      "Белой Лилии",
      "Хрустального Шага",
      "Тихой Дуэли",
      "Звездной Искры",
      "Фиолетовой Грани",
      "Королевского Бала",
    ],
    uniqueNames: ["Роза Абсолюта", "Серебряный Пронзатель", "Звездная Игла", "Королева Дуэли"],
    uniqueEffects: [
      "После трёх попаданий подряд точность становится максимальной на следующий приём.",
      "Критический удар возвращает 1 выносливость, не чаще раза в 2 сек.",
      "Удары по одной цели подряд повышают урон на 4%, до 20%.",
      "Последний приём комбинации получает +35% критического урона.",
    ],
    attack: -1,
    accuracy: 4,
    crit: 2,
  },
  katana: {
    label: "Катана",
    bases: ["Катана", "Тати", "Одачи", "Клинок", "Сэйбер"],
    themes: [
      "Красного Клена",
      "Тихого Снега",
      "Лунной Воды",
      "Черного Журавля",
      "Алой Сакуры",
      "Грозового Облака",
      "Белого Лиса",
      "Пепельного Ветра",
      "Ночного Храма",
      "Небесного Дракона",
    ],
    uniqueNames: ["Аматэру", "Лунный Разрез", "Клык Небесного Дракона", "Сакура Вечности"],
    uniqueEffects: [
      "Первый приём после паузы 2 сек наносит +30% критического урона.",
      "После парирования следующий удар получает +15% крит. шанса.",
      "Каждый 5-й успешный удар создаёт дополнительный разрез на 25% урона.",
      "При HP ниже 30% атака +15%, а стоимость первого приёма в комбинации −1.",
    ],
    attack: 1,
    accuracy: 2,
    crit: 3,
  },
  spear: {
    label: "Копьё",
    bases: ["Копьё", "Пика", "Ланца", "Древко", "Пронзатель"],
    themes: [
      "Охотника",
      "Громового Поля",
      "Белого Волка",
      "Железного Ястреба",
      "Алого Рассвета",
      "Пустынного Ветра",
      "Ледяной Гряды",
      "Северной Башни",
      "Буревестника",
      "Небесного Копейщика",
    ],
    uniqueNames: [
      "Гунгнир Рассвета",
      "Пика Последнего Рубежа",
      "Небесный Пронзатель",
      "Копьё Тысячи Бурь",
    ],
    uniqueEffects: [
      "Первый удар по новой цели наносит +25% урона.",
      "Удары после блока игнорируют 15% защиты цели.",
      "Третий последовательный приём увеличивает дальность и урон на 20%.",
      "Завершающий выпад комбинации имеет +30% шанс критического удара.",
    ],
    attack: 2,
    accuracy: 3,
    crit: 1,
  },
  dagger: {
    label: "Кинжал",
    bases: ["Кинжал", "Клык", "Стилет", "Нож", "Теневая сталь"],
    themes: [
      "Ночной Кошки",
      "Тихого Яда",
      "Черной Розы",
      "Пепельной Тени",
      "Серого Вора",
      "Лунного Убийцы",
      "Алой Змеи",
      "Беззвучного Шага",
      "Бездонной Ночи",
      "Короля Теней",
    ],
    uniqueNames: ["Шепот Смерти", "Клык Нулевой Тени", "Безмолвный Приговор", "Ночь Без Следа"],
    uniqueEffects: [
      "Первый удар по цели имеет +25% крит. шанс.",
      "Критический удар снижает стоимость следующего приёма на 1.",
      "После уклонения следующий приём наносит +35% урона.",
      "Если цель ниже 20% HP, атакующие приёмы наносят +30% урона.",
    ],
    attack: -2,
    accuracy: 2,
    crit: 5,
  },
  bow: {
    label: "Лук",
    bases: ["Лук", "Длинный лук", "Композитный лук", "Охотничий лук", "Звездный лук"],
    themes: [
      "Зеленого Листа",
      "Северного Ветра",
      "Сокола",
      "Лунного Охотника",
      "Серебряной Тетивы",
      "Алой Кометы",
      "Горного Эха",
      "Небесной Стрелы",
      "Звездного Леса",
      "Последнего Лучника",
    ],
    uniqueNames: ["Лук Горизонта", "Тетива Созвездий", "Око Неба", "Последняя Комета"],
    uniqueEffects: [
      "Первый выстрел по новой цели наносит +30% урона.",
      "Каждый 4-й выстрел выпускает вторую стрелу на 50% урона.",
      "При полной выносливости крит. шанс выстрела +12%.",
      "Попадания подряд повышают урон на 3%, до 18%; промах сбрасывает эффект.",
    ],
    attack: 0,
    accuracy: 5,
    crit: 2,
  },
  dualWield: {
    label: "Парные мечи",
    bases: ["Парные клинки", "Двойные мечи", "Близнецы", "Два клыка", "Двойная сталь"],
    themes: [
      "Бури",
      "Черного Солнца",
      "Алой Луны",
      "Серебряного Танца",
      "Двух Волков",
      "Расколотого Неба",
      "Белого Пламени",
      "Звездного Потока",
      "Ночного Короля",
      "Затмения",
    ],
    uniqueNames: ["Близнецы Бездны", "Двойная Корона", "Звездный Поток", "Клинки Затмения"],
    uniqueEffects: [
      "Каждый второй успешный приём наносит дополнительный удар на 35% урона.",
      "Комбинации из 4+ вводов получают −1 к общей стоимости выносливости.",
      "Критический удар одним клинком повышает урон второго на 20% на 2 сек.",
      "Завершающий приём длинной комбинации наносит +40% урона.",
    ],
    attack: 1,
    accuracy: 2,
    crit: 4,
  },
};

function getRarity(level) {
  return EQUIPMENT_RARITIES.find(
    ({ fromLevel, toLevel }) => level >= fromLevel && level <= toLevel,
  );
}

function getMasteryRequirement(index) {
  return Math.round((((index - 1) / 49) * 1000) / 25) * 25;
}

function createNames(config) {
  const regularNames = config.themes
    .flatMap((theme) => config.bases.map((base) => `${base} ${theme}`))
    .slice(0, 46);

  return [...regularNames, ...config.uniqueNames];
}

function createWeaponItem(masteryKey, config, name, index) {
  const level = index + 1;
  const tier = 1 + Math.floor(index / 8);
  const rarity = getRarity(level);
  const isUnique = rarity.id === "unique";
  const specialEffect = isUnique
    ? config.uniqueEffects[level - 47]
    : COMMON_EFFECTS[index % COMMON_EFFECTS.length](tier);

  return {
    id: `${masteryKey}-weapon-${String(level).padStart(2, "0")}`,
    category: "weapon",
    slot: "weapon1",
    weaponType: masteryKey,
    typeLabel: config.label,
    name,
    level,
    rarity: rarity.id,
    rarityLabel: rarity.label,
    baseStats: {
      attack: Math.max(1, 3 + level + config.attack + tier),
    },
    bonusStats: {
      accuracy: Math.max(0, Math.floor(level / 6) + config.accuracy),
      critChancePercent: Math.max(0, Math.floor(level / 10) + config.crit),
    },
    durability: {
      current: 70 + level * 2 + tier * 5,
      max: 70 + level * 2 + tier * 5,
    },
    enhancement: {
      level: 0,
      max: rarity.maxEnhancement,
    },
    specialEffect,
    requirements: {
      heroLevel: Math.max(1, level - 3),
      mastery: {
        key: masteryKey,
        value: Math.min(1000, getMasteryRequirement(level)),
      },
    },
  };
}

export const EQUIPMENT_CATALOG = Object.entries(WEAPON_CATALOG_CONFIG).flatMap(
  ([masteryKey, config]) =>
    createNames(config).map((name, index) => createWeaponItem(masteryKey, config, name, index)),
);

export const EQUIPMENT_BY_ID = new Map(EQUIPMENT_CATALOG.map((item) => [item.id, item]));

export function getEquipmentById(itemId) {
  return EQUIPMENT_BY_ID.get(itemId) ?? null;
}

export function getWeaponsByMastery(masteryKey) {
  return EQUIPMENT_CATALOG.filter((item) => item.weaponType === masteryKey);
}

export function canMeetEquipmentRequirements(item, heroLevel, skillMastery = {}) {
  if (!item?.requirements) return false;

  const masteryRequirement = item.requirements.mastery;
  const currentMastery = skillMastery[masteryRequirement.key] ?? 0;

  return heroLevel >= item.requirements.heroLevel && currentMastery >= masteryRequirement.value;
}
