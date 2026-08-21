import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const outputDir = `${root}public/ui`;
const floorMapOutputFile = `${outputDir}/floor-one-map.webp`;
const swampOutputFile = `${outputDir}/swamp-location.webp`;
const ruinsOutputFile = `${outputDir}/ruins-location.webp`;

async function loadChunks(directory, prefix, count) {
  return Promise.all(
    Array.from({ length: count }, (_, index) =>
      import(`../src/data/${directory}/${prefix}-0${index + 1}.js`).then(
        (module) => module.default,
      ),
    ),
  );
}

function decodeWebp(chunks, label) {
  const image = Buffer.from(chunks.join(""), "base64");
  const declaredSize = image.length >= 8 ? image.readUInt32LE(4) + 8 : 0;

  if (
    image.length < 12 ||
    image.subarray(0, 4).toString("ascii") !== "RIFF" ||
    image.subarray(8, 12).toString("ascii") !== "WEBP" ||
    declaredSize !== image.length
  ) {
    throw new Error(`${label} artwork source is invalid`);
  }

  return image;
}

const floorMapImage = decodeWebp(await loadChunks("mapChunks", "floor1", 8), "Floor map");
const swampImage = decodeWebp(await loadChunks("swampLocationChunks", "swamp", 6), "Swamp");
const ruinsImage = decodeWebp(await loadChunks("ruinsLocationChunks", "ruins", 8), "Ruins");

await mkdir(outputDir, { recursive: true });
await writeFile(floorMapOutputFile, floorMapImage);
await writeFile(swampOutputFile, swampImage);
await writeFile(ruinsOutputFile, ruinsImage);
console.log(`Prepared floor map artwork: ${floorMapImage.length} bytes`);
console.log(`Prepared swamp artwork: ${swampImage.length} bytes`);
console.log(`Prepared ruins artwork: ${ruinsImage.length} bytes`);
