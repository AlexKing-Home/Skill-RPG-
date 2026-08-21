import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const fromRoot = (path) => resolve(root, path);

const groups = [
  {
    output: "src/styles/app-theme.css",
    sources: ["src/reference-theme.css", "src/exact-reference.css"],
  },
  {
    output: "src/styles/foundation.css",
    sources: ["src/styles.css", "src/welcome-background.css"],
  },
  {
    output: "src/styles/compatibility.css",
    sources: [
      "src/parity-fixes.css",
      "src/device-regression-fixes.css",
      "src/reference-parity-final.css",
      "src/mobile-polish.css",
      "src/reference-ui-v8.css",
    ],
  },
  {
    output: "src/styles/navigation.css",
    sources: [
      "src/navigation-reference-v2.css",
      "src/navigation-reference-v9.css",
      "src/navigation-unified.css",
    ],
  },
  {
    output: "src/styles/world.css",
    sources: ["src/movement.css", "src/floor-map.css", "src/swamp-location.css", "src/image-quality.css"],
  },
  {
    output: "src/styles/character.css",
    sources: [
      "src/character-navigation-art.css",
      "src/character-stats.css",
      "src/character-stamina.css",
      "src/character-skills.css",
    ],
  },
  {
    output: "src/styles/location-scenes.css",
    sources: [
      "src/start-city-location.css",
      "src/meadow-location.css",
      "src/forest-location.css",
      "src/dungeon-location.css",
      "src/ruins-location.css",
      "src/settlement-location.css",
    ],
  },
];

async function combineGroup({ output, sources }) {
  const sections = [];

  for (const source of sources) {
    const content = await readFile(fromRoot(source), "utf8");
    sections.push(`/* Source section: ${source} */\n${content.trim()}\n`);
  }

  await mkdir(dirname(fromRoot(output)), { recursive: true });
  await writeFile(fromRoot(output), `${sections.join("\n")}\n`);
}

async function replaceInFile(path, replacements) {
  let content = await readFile(fromRoot(path), "utf8");

  for (const [before, after] of replacements) {
    content = content.replaceAll(before, after);
  }

  await writeFile(fromRoot(path), content);
}

for (const group of groups) await combineGroup(group);

await replaceInFile("src/App.jsx", [
  ['import "./reference-theme.css";\nimport "./exact-reference.css";', 'import "./styles/app-theme.css";'],
]);

await replaceInFile("src/main.jsx", [
  [
    'import "./styles.css";\nimport "./welcome-background.css";\nimport "./parity-fixes.css";\nimport "./device-regression-fixes.css";\nimport "./reference-parity-final.css";\nimport "./mobile-polish.css";\nimport "./reference-ui-v8.css";\nimport "./navigation-reference-v2.css";\nimport "./navigation-reference-v9.css";\nimport "./navigation-unified.css";\nimport "./movement.css";\nimport "./floor-map.css";\nimport "./swamp-location.css";\nimport "./image-quality.css";\nimport "./character-navigation-art.css";\nimport "./character-stats.css";\nimport "./character-stamina.css";\nimport "./character-skills.css";',
    'import "./styles/foundation.css";\nimport "./styles/compatibility.css";\nimport "./styles/navigation.css";\nimport "./styles/world.css";\nimport "./styles/character.css";',
  ],
]);

const locationComponents = [
  ["src/components/StartCityLocationView.jsx", 'import "../start-city-location.css";'],
  ["src/components/MeadowLocationView.jsx", 'import "../meadow-location.css";'],
  ["src/components/ForestLocationView.jsx", 'import "../forest-location.css";'],
  ["src/components/DungeonLocationView.jsx", 'import "../dungeon-location.css";'],
  ["src/components/RuinsLocationView.jsx", 'import "../ruins-location.css";'],
  ["src/components/SettlementLocationView.jsx", 'import "../settlement-location.css";'],
];

for (const [component, oldImport] of locationComponents) {
  await replaceInFile(component, [[oldImport, 'import "../styles/location-scenes.css";']]);
}

const testPathReplacements = new Map([
  ["../src/parity-fixes.css", "../src/styles/compatibility.css"],
  ["../src/device-regression-fixes.css", "../src/styles/compatibility.css"],
  ["../src/reference-parity-final.css", "../src/styles/compatibility.css"],
  ["../src/mobile-polish.css", "../src/styles/compatibility.css"],
  ["../src/reference-ui-v8.css", "../src/styles/compatibility.css"],
  ["../src/navigation-reference-v2.css", "../src/styles/navigation.css"],
  ["../src/navigation-reference-v9.css", "../src/styles/navigation.css"],
  ["../src/navigation-unified.css", "../src/styles/navigation.css"],
  ["../src/character-navigation-art.css", "../src/styles/character.css"],
  ["../src/character-stats.css", "../src/styles/character.css"],
  ["../src/character-stamina.css", "../src/styles/character.css"],
  ["../src/character-skills.css", "../src/styles/character.css"],
  ["../src/movement.css", "../src/styles/world.css"],
  ["../src/floor-map.css", "../src/styles/world.css"],
  ["../src/swamp-location.css", "../src/styles/world.css"],
  ["../src/image-quality.css", "../src/styles/world.css"],
  ["../src/styles.css", "../src/styles/foundation.css"],
  ["../src/welcome-background.css", "../src/styles/foundation.css"],
  ["../src/reference-theme.css", "../src/styles/app-theme.css"],
  ["../src/exact-reference.css", "../src/styles/app-theme.css"],
  ["../src/start-city-location.css", "../src/styles/location-scenes.css"],
  ["../src/meadow-location.css", "../src/styles/location-scenes.css"],
  ["../src/forest-location.css", "../src/styles/location-scenes.css"],
  ["../src/dungeon-location.css", "../src/styles/location-scenes.css"],
  ["../src/ruins-location.css", "../src/styles/location-scenes.css"],
  ["../src/settlement-location.css", "../src/styles/location-scenes.css"],
]);

const testFiles = (await readdir(fromRoot("tests"))).filter((file) => file.endsWith(".test.mjs"));
for (const file of testFiles) {
  const path = `tests/${file}`;
  await replaceInFile(path, [...testPathReplacements.entries()]);
}

await replaceInFile("tests/mobile-parity.test.mjs", [
  [
    'test("mobile polish loads after all parity layers", () => {\n  assert.match(mainSource, /import \\\"\\.\\/parity-fixes\\.css\\\"/);\n  assert.match(mainSource, /import \\\"\\.\\/device-regression-fixes\\.css\\\"/);\n  assert.match(mainSource, /import \\\"\\.\\/reference-parity-final\\.css\\\"/);\n  assert.match(mainSource, /import \\\"\\.\\/mobile-polish\\.css\\\"/);\n  assert.ok(\n    mainSource.indexOf(\'import "./mobile-polish.css"\') >\n      mainSource.indexOf(\'import "./reference-parity-final.css"\'),\n  );\n});',
    'test("compatibility styles stay between foundation and navigation layers", () => {\n  const foundation = mainSource.indexOf(\'import "./styles/foundation.css"\');\n  const compatibility = mainSource.indexOf(\'import "./styles/compatibility.css"\');\n  const navigation = mainSource.indexOf(\'import "./styles/navigation.css"\');\n  assert.ok(foundation >= 0);\n  assert.ok(compatibility > foundation);\n  assert.ok(navigation > compatibility);\n});',
  ],
]);

await replaceInFile("tests/navigation-unified.test.mjs", [
  [
    'test("unified tab skin loads after state-specific navigation artwork", () => {\n  const stateSpecific = mainSource.indexOf(\'import "./navigation-reference-v9.css"\');\n  const unified = mainSource.indexOf(\'import "./navigation-unified.css"\');\n  assert.ok(stateSpecific >= 0);\n  assert.ok(unified > stateSpecific);\n});\n\ntest("character artwork override loads after unified navigation", () => {\n  const unified = mainSource.indexOf(\'import "./navigation-unified.css"\');\n  const characterArtwork = mainSource.indexOf(\'import "./character-navigation-art.css"\');\n  assert.ok(unified >= 0);\n  assert.ok(characterArtwork > unified);\n});',
    'test("navigation and character layers keep their cascade order", () => {\n  const navigation = mainSource.indexOf(\'import "./styles/navigation.css"\');\n  const world = mainSource.indexOf(\'import "./styles/world.css"\');\n  const character = mainSource.indexOf(\'import "./styles/character.css"\');\n  assert.ok(navigation >= 0);\n  assert.ok(world > navigation);\n  assert.ok(character > world);\n});',
  ],
]);

const obsoleteFiles = new Set(groups.flatMap(({ sources }) => sources));
obsoleteFiles.add("src/stamina.css");

for (const file of obsoleteFiles) {
  await rm(fromRoot(file), { force: true });
}

console.log(`Consolidated ${obsoleteFiles.size} CSS files into ${groups.length} domain stylesheets.`);
