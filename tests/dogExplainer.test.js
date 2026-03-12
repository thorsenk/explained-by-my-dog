import test from "node:test";
import assert from "node:assert/strict";
import { explainLikeMyDog } from "../src/dogExplainer.js";

test("returns fallback when topic is empty", () => {
  assert.match(explainLikeMyDog("   "), /Give me a topic/);
});

test("includes provided topic and guidance", () => {
  const result = explainLikeMyDog("TypeScript");
  assert.match(result, /TypeScript/);
  assert.match(result, /Sniff around first/);
});
