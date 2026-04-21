# Context Primer: Minimal Node.js CLI Best Practices

Patterns and conventions demonstrated by the `explained-by-my-dog` project. Use this as a reference when starting a similar zero-dependency CLI.

---

## Project Layout

```
project/
├── src/
│   ├── main.js          # CLI entrypoint — arg parsing, calls core logic
│   └── coreLogic.js     # Pure exported function — no CLI concerns
├── tests/
│   └── coreLogic.test.js
├── package.json
├── .gitignore
└── README.md
```

**Key rule:** Keep the entrypoint thin. `main.js` should do one thing — read arguments and call the logic function. All testable behavior lives in the logic module.

---

## package.json Conventions

```json
{
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "node src/main.js",
    "test": "node --test tests/"
  }
}
```

- `"type": "module"` enables ES module syntax (`import`/`export`) project-wide without `.mjs` extensions.
- Pin a minimum Node version in `engines` — `node:test` requires >=18, stable API from >=20.
- Pass an explicit path to `node --test` rather than relying on auto-discovery.
- `check` as an alias for `test` is redundant — pick one.

---

## CLI Argument Handling

```js
// src/main.js
const topic = process.argv.slice(2).join(" ") || "default value";
```

- `process.argv[0]` = node binary, `[1]` = script path — always slice from index 2.
- `.join(" ")` handles multi-word arguments passed without quotes.
- The `|| "default"` fallback belongs in the entrypoint, not in the logic function.

---

## Exported Logic Function

```js
// src/coreLogic.js
export function doThing(input) {
  const cleaned = input.trim();
  if (!cleaned) return "fallback message";
  return `result using ${cleaned}`;
}
```

**Best practices:**
- Export named functions, not default exports — easier to tree-shake and test.
- Validate/clean input at the top of the function (`trim()`, type checks).
- Add a null/undefined guard if the function is exported and may be called by consumers other than your own CLI:
  ```js
  if (!input || typeof input !== "string") return "fallback message";
  ```
- Keep logic functions pure (no `console.log`, no `process.exit`) — that belongs in `main.js`.

---

## Testing with `node:test`

```js
import test from "node:test";
import assert from "node:assert/strict";
import { doThing } from "../src/coreLogic.js";

test("returns fallback on empty input", () => {
  assert.match(doThing("   "), /fallback/);
});

test("includes input in output", () => {
  const result = doThing("TypeScript");
  assert.match(result, /TypeScript/);
});
```

**Useful assertions:**
| Method | Use for |
|--------|---------|
| `assert.strictEqual(a, b)` | Exact equality (`===`) |
| `assert.match(str, /regex/)` | Pattern in string output |
| `assert.deepStrictEqual(a, b)` | Deep object/array equality |
| `assert.throws(() => fn(), /msg/)` | Expected errors |

**Coverage checklist for a logic function:**
- [ ] Happy path: valid input produces expected output
- [ ] Empty/whitespace input triggers fallback
- [ ] Null/undefined input doesn't throw (or throws predictably)
- [ ] Edge cases specific to the domain

---

## ES Module Import Conventions

When using `"type": "module"`, always include the file extension in local imports:

```js
import { doThing } from "./coreLogic.js";   // correct
import { doThing } from "./coreLogic";       // fails in Node ESM
```

This applies even when importing from `.ts` source — if you're running TypeScript via a loader (e.g. `tsx`), check its specific resolution rules.

---

## TypeScript Alongside JavaScript

If you want TypeScript types without a full compile step:

**Option A — JSDoc types (no `.ts` files needed):**
```js
/**
 * @param {string} topic
 * @returns {string}
 */
export function explainLikeMyDog(topic) { ... }
```
Works with VS Code IntelliSense and `tsc --checkJs` with no build step.

**Option B — Full TypeScript pipeline:**
- Add `tsconfig.json` with `"outDir": "dist"` and `"rootDir": "src"`
- Change `dev` script to compile first: `"dev": "tsc && node dist/main.js"`
- Source of truth is `.ts`; `.js` output goes to `dist/` (gitignored)
- Never maintain parallel `.js` and `.ts` files with identical content

**Do not** commit `.ts` files that have no associated compiler configuration — they create confusion without benefit.

---

## .gitignore Essentials for a Node CLI

```
node_modules/
dist/
coverage/
.env
.DS_Store
npm-debug.log*
```

---

## README Minimum Bar

1. One-sentence description
2. How to run (`npm run dev -- "arg"`)
3. How to test (`npm test`)
4. Project structure (list files with their purpose)

Omit badges, contribution guides, license blocks, and changelogs for personal/starter projects — they add noise without value at this scale.
