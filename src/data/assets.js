const baseUrl = import.meta.env?.BASE_URL ?? "/";
const asset = (path) => `${baseUrl}${path.replace(/^\//, "")}?v=approved-ui-v2`;

export const fantasyBackground = asset("/backgrounds/welcome-bg.jpg");

export const maleSwordsman = asset("/skins/male-swordsman.jpg");
export const maleSpearman = asset("/skins/male-spearman.jpg");
export const maleAssassin = asset("/skins/male-assassin.jpg");
export const maleArcher = asset("/skins/male-archer.jpg");
export const femaleSwordsman = asset("/skins/female-swordsman.jpg");
export const femaleSpearman = asset("/skins/female-spearman.avif");
export const femaleAssassin = asset("/skins/female-assassin.avif");
export const femaleArcher = asset("/skins/female-archer.avif");

export const worldMapArt = asset("/ui/world-map.webp");
export const locationMapArt = asset("/ui/location-map.webp");
export const uiCrest = asset("/ui/crest.webp");
export const creationCrest = asset("/ui/creation-crest.webp");
