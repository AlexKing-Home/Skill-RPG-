import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const outputDir = `${root}public/ui`;
const generatedDataDir = `${root}src/data/generated`;
const swampOutputFile = `${outputDir}/swamp-location.webp`;
const ruinsSourceFile = `${root}src/assets/ruins-location.webp`;
const ruinsOutputFile = `${outputDir}/ruins-location.webp`;
const ruinsDataModuleFile = `${generatedDataDir}/ruinsLocationArt.js`;

const chunks = await Promise.all(
  Array.from({ length: 6 }, (_, index) =>
    import(`../src/data/swampLocationChunks/swamp-0${index + 1}.js`).then(
      (module) => module.default,
    ),
  ),
);

const base64 = chunks.join("");
const swampImage = Buffer.from(base64, "base64");

if (
  !swampImage.length ||
  swampImage.subarray(0, 4).toString("ascii") !== "RIFF" ||
  swampImage.subarray(8, 12).toString("ascii") !== "WEBP"
) {
  throw new Error("Swamp artwork source is invalid");
}

const ruinsImage = await readFile(ruinsSourceFile);

if (
  !ruinsImage.length ||
  ruinsImage.subarray(0, 4).toString("ascii") !== "RIFF" ||
  ruinsImage.subarray(8, 12).toString("ascii") !== "WEBP"
) {
  throw new Error("Ruins artwork source is invalid");
}

const ruinsBase64 = ruinsImage.toString("base64");
const ruinsDataModule = `export const ruinsLocationArt = "data:image/webp;base64,${ruinsBase64}";\n`;

await mkdir(outputDir, { recursive: true });
await mkdir(generatedDataDir, { recursive: true });
await writeFile(swampOutputFile, swampImage);
await writeFile(ruinsOutputFile, ruinsImage);
await writeFile(ruinsDataModuleFile, ruinsDataModule, "utf8");
console.log(`Prepared swamp artwork: ${swampImage.length} bytes`);
console.log(`Prepared ruins artwork: ${ruinsImage.length} bytes`);
console.log("Prepared inline ruins artwork module");
