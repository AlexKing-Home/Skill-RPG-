import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceDirectory = resolve(root, "src");

const expectedStylesheets = new Set([
  "battle.css",
  "game-interface.css",
  "styles/app-theme.css",
  "styles/foundation.css",
  "styles/compatibility.css",
  "styles/navigation.css",
  "styles/world.css",
  "styles/character.css",
  "styles/location-scenes.css",
]);

const legacyNamePattern = /(?:fixes|final|-v\d+)\.css$/;

async function collectCssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectCssFiles(absolutePath)));
    } else if (entry.isFile() && entry.name.endsWith(".css")) {
      files.push(relative(sourceDirectory, absolutePath).replaceAll("\\", "/"));
    }
  }

  return files;
}

const cssFiles = (await collectCssFiles(sourceDirectory)).sort();
const missingStylesheets = [...expectedStylesheets].filter((file) => !cssFiles.includes(file));
const unexpectedStylesheets = cssFiles.filter((file) => !expectedStylesheets.has(file));
const legacyNamedStylesheets = cssFiles.filter((file) => legacyNamePattern.test(file));

const hashes = new Map();
const duplicateGroups = [];

for (const file of cssFiles) {
  const content = await readFile(resolve(sourceDirectory, file));
  const hash = createHash("sha256").update(content).digest("hex");
  const matchingFile = hashes.get(hash);

  if (matchingFile) duplicateGroups.push([matchingFile, file]);
  else hashes.set(hash, file);
}

if (missingStylesheets.length > 0) {
  console.error("Required CSS domain files are missing:");
  for (const file of missingStylesheets) console.error(`- src/${file}`);
}

if (unexpectedStylesheets.length > 0) {
  console.error("Unexpected CSS files are outside the approved domain architecture:");
  for (const file of unexpectedStylesheets) console.error(`- src/${file}`);
}

if (legacyNamedStylesheets.length > 0) {
  console.error("Legacy-style CSS filenames are not allowed:");
  for (const file of legacyNamedStylesheets) console.error(`- src/${file}`);
}

if (duplicateGroups.length > 0) {
  console.error("Exact duplicate CSS files detected:");
  for (const [first, second] of duplicateGroups) console.error(`- src/${first} == src/${second}`);
}

const hasErrors =
  missingStylesheets.length > 0 ||
  unexpectedStylesheets.length > 0 ||
  legacyNamedStylesheets.length > 0 ||
  duplicateGroups.length > 0;

if (hasErrors) {
  process.exitCode = 1;
} else {
  console.log(
    `CSS architecture check passed: ${cssFiles.length} stylesheets across approved domains.`,
  );
}
