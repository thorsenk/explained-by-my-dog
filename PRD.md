# PRD: explained-by-my-dog

## Overview

A novelty command-line tool that "explains" technical topics in the voice of a dog. The output is always the same three-step framework (sniff, focus, iterate), with the topic name injected into the greeting. The project's real purpose is as a minimal CLI starter that demonstrates Node.js project structure, ES module conventions, and built-in test tooling — with a low-friction, humorous theme to keep it approachable.

---

## Problem Statement

Boilerplate CLI projects are often cluttered with unnecessary dependencies, build complexity, or framework opinions. New developers or teams need a clean reference showing how to build and test a simple CLI with nothing but Node.js >=20.

---

## Goals

- Provide a working, runnable CLI from a fresh clone with zero setup
- Demonstrate a clean separation of CLI entrypoint from core logic
- Show how to write unit tests using only Node's built-in test runner
- Keep the dependency footprint at zero

## Non-Goals

- Dynamic or AI-generated explanations per topic
- A web UI or API surface
- TypeScript compilation pipeline (`.ts` files were present but non-functional — see Known Issues)
- Publishing to npm

---

## Target Users

Developers looking for a minimal Node.js CLI template, or anyone wanting a reference for:
- ES module project layout
- `node:test` / `node:assert` usage
- Zero-dependency CLI argument handling

---

## Features / Requirements

### Core

| ID | Requirement |
|----|-------------|
| F1 | Accept a topic as a CLI argument (`process.argv`) |
| F2 | Default to `"project setup"` when no argument is supplied |
| F3 | Return a fallback message when argument is empty/whitespace |
| F4 | Output a 3-step "dog explanation" with the topic in the greeting |

### CLI Interface

```
npm run dev -- "<topic>"
```

**Example output:**
```
🐶 Okay human, here's APIs:
1) Sniff around first (gather context).
2) Focus on the squeaky part (the core problem).
3) Repeat with tail wags until it clicks (iterate fast).
```

### Testing

- Tests use `node:test` and `node:assert/strict` — no external test frameworks
- Minimum coverage: fallback message, topic inclusion, step text inclusion

---

## Technical Constraints

- Node.js >=20 (required for stable `node:test`)
- ES modules (`"type": "module"` in package.json)
- No external npm dependencies

---

## Known Issues (at time of archival)

1. **Dead `.ts` files** — `src/main.ts` and `src/dogExplainer.ts` exist but there is no TypeScript compiler configuration. They are copies of the `.js` files and serve no functional purpose.
2. **No null guard in `explainLikeMyDog()`** — calling with `undefined` throws a `TypeError` at `.trim()`. Safe at the CLI entry point (default prevents it) but fragile as an exported function.
3. **Thin test coverage** — only 2 tests; the CLI entrypoint and edge-case inputs are untested.
4. **`npm test` uses implicit file discovery** — no explicit path passed to `node --test`.
5. **Stale `.gitkeep`** at repo root serves no purpose.

---

## Success Metrics

For a starter/template project of this scope:
- `npm run dev -- "topic"` produces expected output
- `npm test` passes with 0 failures
- No installation step required after clone
