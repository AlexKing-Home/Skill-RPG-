import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const outputDir = `${root}public/ui`;
const outputFile = `${outputDir}/swamp-location.webp`;

const chunks = await Promise.all(
  Array.from({ length: 6 }, (_, index) =>
    import(`../src/data/swampLocationChunks/swamp-0${index + 1}.js`).then(
      (module) => module.default,
    ),
  ),
);

const base64 = chunks.join("");
const image = Buffer.from(base64, "base64");

if (!image.length || image.subarray(0, 4).toString("ascii") !== "RIFF") {
  throw new Error("Swamp artwork source is invalid");
}

await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, image);
console.log(`Prepared swamp artwork: ${image.length} bytes`);
