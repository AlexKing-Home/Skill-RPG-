import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const outputDir = resolve(root, "public/ui");

const artworkSources = [
  {
    label: "Floor map",
    directory: "mapChunks",
    prefix: "floor1",
    count: 8,
    outputFile: "floor-one-map.webp",
  },
  {
    label: "Swamp",
    directory: "swampLocationChunks",
    prefix: "swamp",
    count: 6,
    outputFile: "swamp-location.webp",
  },
  {
    label: "Ruins",
    directory: "ruinsLocationChunks",
    prefix: "ruins",
    count: 8,
    outputFile: "ruins-location.webp",
  },
];

async function loadChunks({ directory, prefix, count }) {
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

async function materializeArtwork(source) {
  const image = decodeWebp(await loadChunks(source), source.label);
  const outputFile = resolve(outputDir, source.outputFile);
  await writeFile(outputFile, image);
  console.log(`Prepared ${source.label.toLowerCase()} artwork: ${image.length} bytes`);
}

await mkdir(outputDir, { recursive: true });
for (const source of artworkSources) {
  await materializeArtwork(source);
}
