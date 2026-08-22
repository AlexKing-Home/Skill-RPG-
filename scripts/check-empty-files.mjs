import { readdir, stat } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const ignoredDirectories = new Set([".git", "dist", "node_modules"]);

async function findEmptyFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const emptyFiles = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      emptyFiles.push(...(await findEmptyFiles(entryPath)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const fileStats = await stat(entryPath);
    if (fileStats.size === 0) {
      emptyFiles.push(relative(root, entryPath));
    }
  }

  return emptyFiles;
}

const emptyFiles = await findEmptyFiles(root);

if (emptyFiles.length > 0) {
  console.error("Repository contains empty tracked files:");
  for (const file of emptyFiles) {
    console.error(`- ${file}`);
  }
  process.exitCode = 1;
} else {
  console.log("Repository hygiene check passed: no empty files found.");
}
