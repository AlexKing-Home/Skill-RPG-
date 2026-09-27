const COMBO_TEMPLATES = [
  ["left", "down"],
  ["up", "down"],
  ["left", "right"],
  ["down", "up"],
  ["right", "right", "right"],
  ["up", "up", "down"],
  ["down", "up", "left", "down"],
  ["left", "right", "left", "down"],
  ["right", "left", "down", "right"],
  ["left", "right", "left", "right", "down"],
  ["up", "down", "up", "down", "right"],
  ["right", "right", "down", "right", "up"],
  ["left", "down", "right", "up", "down"],
  ["up", "right", "down", "left", "right"],
  ["down", "left", "up", "right", "down"],
];

function getMasteryRequirement(index, count) {
  if (index < 2 || count <= 2) return 0;
  if (index === count - 1) return 1000;

  const progress = (index - 1) / (count - 2);
  return Math.round((progress * 1000) / 25) * 25;
}

function getStaminaCost(index, count) {
  if (index < 2 || count <= 2) return 1;

  const progress = (index - 1) / (count - 2);
  return Math.max(2, Math.min(6, Math.round(2 + progress * 4)));
}

function createTechniqueList(definitions) {
  return definitions.map(([id, name, originalName], index) => ({
    id,
    name,
    originalName,
    description: `Оружейный приём «${name}».`,
    combo: COMBO_TEMPLATES[index],
    staminaCost: getStaminaCost(index, definitions.length),
    masteryRequired: getMasteryRequirement(index, definitions.length),
  }));
}

export function findSkillInList(skills, sequence) {
  return skills.find(
    (skill) =>
      skill.combo.length === sequence.length &&
      skill.combo.every((direction, index) => direction === sequence[index]),
  );
}

export const TWO_HANDED_SWORD_SKILLS = createTechniqueList([
  ["swordfall", "Падение меча", "Swordfall"],
  ["avalanche", "Лавина", "Avalanche"],
  ["cyclone", "Циклон", "Cyclone"],
  ["brave-leap", "Смелый прыжок", "Brave Leap"],
  ["blade-torrent", "Поток клинков", "Blade Torrent"],
  ["brutal-fang", "Жестокий клык", "Brutal Fang"],
  ["backlash", "Ответный удар", "Backlash"],
  ["piercing-blast", "Пронзающий взрыв", "Piercing Blast"],
  ["cascade", "Каскад", "Cascade"],
  ["vertical-blaster", "Вертикальный взрыв", "Vertical Blaster"],
]);

export const RAPIER_SKILLS = createTechniqueList([
  ["linear", "Линейный выпад", "Linear"],
  ["oblique", "Косой выпад", "Oblique"],
  ["parallel-sting", "Параллельный укол", "Parallel Sting"],
  ["triangular", "Треугольник", "Triangular"],
  ["shooting-star", "Падающая звезда", "Shooting Star"],
  ["quadruple-pain", "Четверная боль", "Quadruple Pain"],
  ["star-splash", "Звёздный всплеск", "Star Splash"],
  ["flashing-penetrator", "Сверкающий пронзатель", "Flashing Penetrator"],
]);

export const KATANA_SKILLS = createTechniqueList([
  ["tsujikaze", "Цудзикадзэ", "Tsujikaze"],
  ["gengetsu", "Гэнгэцу", "Gengetsu"],
  ["ukifune", "Укифунэ", "Ukifune"],
  ["tsumujiguruma", "Цумудзигурума", "Tsumujiguruma"],
  ["hiogi", "Хиоги", "Hiōgi"],
  ["iai", "Иай", "Iai"],
]);

export const SPEAR_SKILLS = createTechniqueList([
  ["sonic-charge", "Звуковой натиск", "Sonic Charge"],
  ["helical-twice", "Двойная спираль", "Helical Twice"],
  ["triple-thrust", "Тройной выпад", "Triple Thrust"],
  ["spin-slash", "Вращающийся разрез", "Spin Slash"],
  ["digger-glint", "Диггер Глинт", "Digger Glint"],
  ["forward-spiral", "Передняя спираль", "Forward Spiral"],
  ["blast-spear", "Взрывное копьё", "Blast Spear"],
  ["spiral-gate", "Спиральные врата", "Spiral Gate"],
  ["vulture-stinger", "Жало стервятника", "Vulture Stinger"],
  ["wild-twister", "Дикий вихрь", "Wild Twister"],
  ["fatal-thrust", "Смертельный выпад", "Fatal Thrust"],
]);

export const DAGGER_SKILLS = createTechniqueList([
  ["rapid-bite", "Быстрый укус", "Rapid Bite"],
  ["venom-bite", "Ядовитый укус", "Venom Bite"],
  ["quick-throw", "Быстрый бросок", "Quick Throw"],
  ["fade-edge", "Исчезающее лезвие", "Fade Edge"],
  ["mirage-fang", "Клык миража", "Mirage Fang"],
  ["paralyze-bite", "Парализующий укус", "Paralyze Bite"],
  ["reckless-tusk", "Безрассудный клык", "Reckless Tusk"],
  ["axel-raid", "Аксель-рейд", "Axel Raid"],
  ["lightning-ripper", "Молниеносный потрошитель", "Lightning Ripper"],
]);

export const DUAL_WIELD_SKILLS = createTechniqueList([
  ["double-circular", "Двойная окружность", "Double Circular"],
  ["gale-slicer", "Резак бури", "Gale Slicer"],
  ["end-revolver", "Финальный револьвер", "End Revolver"],
  ["cygnus-onslaught", "Натиск Лебедя", "Cygnus Onslaught"],
  ["specula-cross", "Зеркальный крест", "Specula Cross"],
  ["cross-combination", "Крестовая комбинация", "Cross Combination"],
  ["twin-blade-rush", "Рывок парных клинков", "Twin Blade Rush"],
  ["skill-explode", "Взрыв навыка", "Skill Explode"],
  ["starburst-stream", "Звёздный поток", "Starburst Stream"],
  ["the-eclipse", "Затмение", "The Eclipse"],
]);

export const BOW_SKILLS = createTechniqueList([
  ["aimed-shot", "Прицельный выстрел", "Aimed Shot"],
  ["double-shot", "Двойной выстрел", "Double Shot"],
  ["rapid-volley", "Быстрый залп", "Rapid Volley"],
  ["piercing-arrow", "Пробивающая стрела", "Piercing Arrow"],
  ["hawk-shot", "Соколиный выстрел", "Hawk Shot"],
  ["arrow-rain", "Дождь стрел", "Arrow Rain"],
  ["star-volley", "Звёздный залп", "Star Volley"],
  ["sky-comet", "Небесная комета", "Sky Comet"],
]);
