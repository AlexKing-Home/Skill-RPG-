import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceDirectory = resolve(root, "src");

const legacyOverrideFiles = new Set([
  "device-regression-fixes.css",
  "navigation-reference-v2.css",
  "navigation-reference-v9.css",
  "parity-fixes.css",
  "reference-parity-final.css",
  "reference-ui-v8.css",
]);

const legacyNamePattern = /(?:fixes|final|-v\d+)\.css$/;
const cssFiles = (await readdir(sourceDirectory)).filter((file) => file.endsWith(".css")).sort();

const unexpectedLegacyFiles = cssFiles.filter(
  (file) => legacyNamePattern.test(file) && !legacyOverrideFiles.has(file),
);

const hashes = new Map();
const duplicateGroups = [];

for (const file of cssFiles) {
  const content = await readFile(resolve(sourceDirectory, file));
  const hash = createHash("sha256").update(content).digest("hex");
  const matchingFile = hashes.get(hash);

  if (matchingFile) {
    duplicateGroups.push([matchingFile, file]);
  } else {
    hashes.set(hash, file);
  }
}

if (unexpectedLegacyFiles.length > 0) {
  console.error("New legacy-style CSS override files are not allowed:");
  for (const file of unexpectedLegacyFiles) console.error(`- src/${file}`);
}

if (duplicateGroups.length > 0) {
  console.error("Duplicate root CSS files detected:");
  for (const [first, second] of duplicateGroups) {
    console.error(`- src/${first} == src/${second}`);
  }
}

if (unexpectedLegacyFiles.length > 0 || duplicateGroups.length > 0) {
  process.exitCode = 1;
} else {
  console.log(
    `CSS architecture check passed: ${cssFiles.length} root stylesheets, no exact duplicates or new override layers.`,
  );
}
