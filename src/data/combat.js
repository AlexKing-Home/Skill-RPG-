export const ENEMY_ATTACK_INTERVAL_MS = 4500;
export const ENEMY_WARNING_MS = 2000;
export const PARRY_WINDOW_MS = 1200;

const skillPower = {
  slant: 0.65,
  vertical: 0.7,
  horizontal: 0.65,
  uppercut: 0.7,
  "rage-spike": 0.9,
  "sonic-leap": 0.95,
  "vertical-arc": 1,
  "sharp-nail": 1.1,
  "savage-fulcrum": 1.15,
  "horizontal-square": 1.2,
  "vertical-square": 1.25,
  "vorpal-strike": 1.4,
  "deadly-sins": 1.5,
  "howling-octave": 1.65,
  "nova-ascension": 1.8,
};

export function createBattle(encounter, now = Date.now()) {
  return {
    ...encounter,
    currentHealth: encounter.maxHealth,
    status: "active",
    nextAttackAt: now + ENEMY_ATTACK_INTERVAL_MS,
    guard: null,
    log: ["Противник готовится к бою."],
  };
}

export function resumeBattle(encounter, health, now = Date.now()) {
  if (!encounter || !Number.isFinite(encounter.maxHealth) || encounter.maxHealth <= 0) return null;
  const currentHealth = Math.min(
    encounter.maxHealth,
    Math.max(0, Number(encounter.currentHealth) || 0),
  );
  return {
    ...encounter,
    currentHealth,
    status: health <= 0 ? "defeat" : currentHealth <= 0 ? "victory" : "active",
    nextAttackAt: now + ENEMY_ATTACK_INTERVAL_MS,
    guard: null,
    log: Array.isArray(encounter.log) ? encounter.log.slice(-4) : [],
  };
}

function withLog(encounter, message) {
  return { ...encounter, log: [...(encounter.log ?? []), message].slice(-4) };
}

export function resolvePlayerAction(snapshot, action, now = Date.now()) {
  const enemy = snapshot.activeEncounter;
  if (enemy?.status !== "active" || snapshot.currentHealth <= 0) {
    return { accepted: false, message: "Нет активного боя." };
  }
  const skill = action?.skill;
  const direction = action?.direction;
  if (!skill && !["left", "right", "up", "down"].includes(direction)) {
    return { accepted: false, message: "Неизвестное действие." };
  }
  const cost = skill
    ? Math.max(0, Number(skill.staminaCost) || 0)
    : direction === "up"
      ? 1
      : direction === "down"
        ? 2
        : 0;
  if (snapshot.currentStamina < cost) {
    return { accepted: false, message: "НЕДОСТАТОЧНО ВЫНОСЛИВОСТИ!" };
  }
  let nextEnemy = { ...enemy, guard: null };
  let message;
  if (!skill && direction === "up") {
    nextEnemy.guard = { type: "block" };
    message = "Блок: следующий удар ослаблен на 75%. −1 ВЫН.";
  } else if (!skill && direction === "down") {
    nextEnemy.guard = { type: "parry", expiresAt: now + PARRY_WINDOW_MS };
    message = "Парирование: окно 1,2 сек. −2 ВЫН.";
  } else {
    const attack =
      Math.max(1, Number(snapshot.stats.attack) || 1) +
      Math.max(0, Number(snapshot.stats.strength) || 0);
    const multiplier = skill ? (skillPower[skill.id] ?? 0.65) : 0.4;
    const damage = Math.min(
      enemy.currentHealth,
      Math.max(1, Math.round(attack * multiplier) - (enemy.defense ?? 2)),
    );
    nextEnemy.currentHealth = Math.max(0, enemy.currentHealth - damage);
    nextEnemy.status = nextEnemy.currentHealth === 0 ? "victory" : "active";
    message = `${skill?.name ?? (direction === "left" ? "Удар слева" : "Удар справа")}: −${damage} HP противнику.`;
  }
  return {
    accepted: true,
    message,
    changes: {
      currentStamina: snapshot.currentStamina - cost,
      activeEncounter: withLog(nextEnemy, message),
    },
  };
}

export function resolveEnemyAttack(snapshot, now = Date.now()) {
  const enemy = snapshot.activeEncounter;
  if (enemy?.status !== "active" || now < enemy.nextAttackAt || snapshot.currentHealth <= 0)
    return null;
  const guard = enemy.guard;
  const parried = guard?.type === "parry" && now <= guard.expiresAt;
  const defense = Math.max(0, Number(snapshot.stats.defense) || 0);
  let damage = Math.max(1, Math.round((enemy.attack ?? 18) - defense * 0.5));
  if (guard?.type === "block") damage = Math.max(1, Math.ceil(damage * 0.25));
  if (parried) damage = 0;
  const counterDamage = parried ? Math.min(enemy.currentHealth, 4) : 0;
  const currentHealth = Math.max(0, snapshot.currentHealth - damage);
  const enemyHealth = Math.max(0, enemy.currentHealth - counterDamage);
  const status = currentHealth === 0 ? "defeat" : enemyHealth === 0 ? "victory" : "active";
  const message = parried
    ? `Удар парирован! Контрудар: −${counterDamage} HP противнику.`
    : `${guard?.type === "block" ? "Блок! " : ""}${enemy.name}: −${Math.min(snapshot.currentHealth, damage)} HP герою.`;
  return {
    currentHealth,
    activeEncounter: withLog(
      {
        ...enemy,
        currentHealth: enemyHealth,
        status,
        guard: null,
        nextAttackAt: now + ENEMY_ATTACK_INTERVAL_MS,
      },
      message,
    ),
  };
}
