# Your Dog Already Knows How to Debug

*A case for simplicity, rubber ducks, and zero-dependency CLIs*

---

There's a moment every developer knows. You've been staring at the same problem for two hours. You open a new chat window, start typing out the context — and halfway through the explanation, you see it. The bug. You close the tab without sending.

You didn't need the other person. You needed to explain it out loud.

This is the Feynman Technique, or rubber duck debugging, or just good old "talking it through." The act of translating a problem into plain language forces you to confront what you actually understand versus what you've been assuming. It's one of the most reliable thinking tools in software, and it requires absolutely nothing — no IDE plugin, no AI assistant, no senior engineer on call.

Which is exactly why building a tiny CLI that does this — even as a joke, even with hardcoded output — is more instructive than it first appears.

---

## The Joke That Isn't

`explained-by-my-dog` does one thing: it takes a technical topic and returns a three-step framework in the voice of an enthusiastic dog.

```
🐶 Okay human, here's dependency injection:
1) Sniff around first (gather context).
2) Focus on the squeaky part (the core problem).
3) Repeat with tail wags until it clicks (iterate fast).
```

The output is always the same. The topic doesn't matter. And that's the point.

Because the three steps — gather context, isolate the core problem, iterate — are genuinely good debugging advice. They apply to almost any technical problem you'll face. The dog is just a delivery mechanism that makes you read them again instead of dismissing them.

Humor lowers resistance. A sentence you'd skim past in a README lands differently when a cartoon dog says it.

---

## What Zero Dependencies Actually Means

Modern JavaScript projects have a reputation. Clone a repo, run `npm install`, watch 400MB of `node_modules` materialize for a project that logs "Hello world." The tooling has become the project.

`explained-by-my-dog` has no dependencies. Not "few dependencies" — none. It runs with `node src/main.js`. Tests run with `node --test`. The whole thing works immediately after `git clone`, on any machine with Node.js 20+.

This forces an interesting constraint: you have to actually know what the platform gives you.

Node.js ships with a capable standard library that most developers underuse because npm exists. The built-in `node:test` runner handles assertions, async tests, and structured output. `process.argv` handles CLI arguments. ES modules handle imports. You don't need `jest`, `commander`, `yargs`, `dotenv`, or `chalk` to write a functioning, tested CLI tool.

The discipline of going zero-dependency isn't about being purist. It's about learning where the floor is. Once you know what the runtime actually provides, you can make deliberate choices about what to add — instead of reaching for a package because it's familiar.

---

## The Entrypoint Pattern

The most transferable idea in this project is its structure: a thin entrypoint that handles I/O, and a pure function that handles logic.

```js
// main.js — knows about the CLI, knows nothing about dogs
const topic = process.argv.slice(2).join(" ") || "project setup";
console.log(explainLikeMyDog(topic));

// dogExplainer.js — knows about dogs, knows nothing about the CLI
export function explainLikeMyDog(topic) {
  const cleaned = topic.trim();
  if (!cleaned) return "Woof? Give me a topic and I'll explain it for treats.";
  return [ `🐶 Okay human, here's ${cleaned}:`, ... ].join("\n");
}
```

`explainLikeMyDog` takes a string and returns a string. No `process.argv`, no `console.log`, no side effects. You can call it from a test, from another function, from a web handler, without modification.

This separation — logic divorced from its delivery mechanism — is the same principle behind hexagonal architecture, ports and adapters, clean architecture, and a dozen other patterns with more impressive names. At its core, it's just: don't tangle "what to compute" with "how to receive input and emit output."

The dog project demonstrates this in about 15 lines of code.

---

## What Tests Look Like When You Trust Your Tools

```js
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
```

No test framework config. No `describe` blocks. No `beforeEach`. No mocking library. Two tests that run in under 200ms with `node --test`.

The tests verify behavior, not implementation. They don't care how `explainLikeMyDog` constructs its output — they care that the output contains the right things. This means you can refactor the internals freely without touching the tests, which is the whole point of having tests.

---

## The Concept Under the Concept

There's a reason rubber duck debugging works, and it's not magic. When you explain something to someone who knows nothing — a colleague, a rubber duck, a dog — you can't lean on shared context. You have to be explicit about every assumption. That explicitness is where the bugs hide.

A tool that forces you to name the topic, even if it can't actually respond to it, is a forcing function for that first step: articulating what you're looking at. Sometimes that's enough.

The best developer tools are often the ones that change how you think, not just what you can do. A linter that catches a mistake is useful. A linter that teaches you to stop making the mistake is better. A silly CLI that reminds you to slow down, gather context, and find the squeaky part — even once — earns its keep.

---

## Building Your Own

If you want to build a similar zero-dependency CLI:

1. **Start with the logic function.** Write it as a pure function first, test it, then wire up the CLI around it.
2. **Use `node:test` before reaching for Jest.** It's good enough for most use cases and adds zero overhead.
3. **Keep `main.js` under 10 lines.** If it grows, the logic is leaking in from the wrong place.
4. **Default arguments gracefully.** `process.argv.slice(2).join(" ") || "default"` is all the argument handling most small CLIs need.
5. **Ship it broken before making it clever.** A CLI that runs and returns the wrong thing is easier to improve than one that doesn't run yet.

The dog doesn't care if your code is good. But explaining it to the dog might help you figure out that it isn't.

---

*This document was written as a narrative companion to the project's PRD and context primer, offering a different lens on the same concepts.*
