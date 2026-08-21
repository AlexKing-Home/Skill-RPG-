import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const characterScreenSource = await readFile(
  new URL("../src/screens/CharacterScreen.jsx", import.meta.url),
  "utf8",
);

test("battle tab always renders battle controls while encounters only add flee behavior", () => {
  assert.match(characterScreenSource, /else if \(activeTab === "battle"\) \{[\s\S]*?<BattleView/);
  assert.doesNotMatch(
    characterScreenSource,
    /activeEncounter \? \([\s\S]*?<BattleView[\s\S]*?: \([\s\S]*?<PlaceholderView type="battle"/,
  );
  assert.match(characterScreenSource, /encounter=\{activeEncounter\}/);
  assert.match(characterScreenSource, /onFlee=\{activeEncounter \? handleFleeBattle : undefined\}/);
});
