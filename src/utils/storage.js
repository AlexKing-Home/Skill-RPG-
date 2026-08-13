const SAVE_KEY = "skill-rpg.save.v1";

export function saveCharacter(character) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(character));
}

export function loadCharacter() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.nickname || !parsed?.skinId || !parsed?.stats) return null;
    return parsed;
  } catch {
    return null;
  }
}
