const SAVE_KEY = "skill-rpg.save.v1";
const CURRENT_CHARACTER_VERSION = 3;

export function normalizeCharacter(character) {
  if (!character || typeof character !== "object") return null;

  const { level: _legacyLevel, ...rest } = character;
  const rawExperience = Number(rest.experience);
  const experience = Number.isFinite(rawExperience) ? Math.max(0, Math.floor(rawExperience)) : 0;
  const rawVersion = Number(rest.version);
  const version = Math.max(
    CURRENT_CHARACTER_VERSION,
    Number.isFinite(rawVersion) ? Math.floor(rawVersion) : 1,
  );

  return {
    ...rest,
    version,
    experience,
  };
}

export function saveCharacter(character) {
  const normalized = normalizeCharacter(character);
  if (!normalized) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(normalized));
}

export function loadCharacter() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const normalized = normalizeCharacter(JSON.parse(raw));
    if (!normalized?.nickname || !normalized?.skinId || !normalized?.stats) return null;
    return normalized;
  } catch {
    return null;
  }
}
