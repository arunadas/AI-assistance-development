# What's Possible: Advanced Vibe Coding

## The Mindset Shift

In Course 1, you learned to **collaborate with AI** — asking Claude for help, iterating on suggestions, and refining ideas together. That collaborative mindset was essential.

Now, in Course 2, we push the boundary of what's possible with a single well-crafted prompt. Welcome to **advanced vibe coding** — the practice of combining crystal-clear specifications with powerful AI models to produce impressive, complete projects from a single prompt.

Advanced vibe coding is different from basic vibe coding because you've now mastered the fundamentals from Course 1: you understand how to write good specs, set meaningful constraints, and iterate effectively. This course asks: how far can we take it? What becomes possible when you apply those skills to a capable AI with agentic capabilities?

The difference is subtle but powerful:

- **Basic vibe coding**: "Claude, build me a website."
- **Advanced vibe coding**: "Build me a Three.js animal herd simulation with these specific constraints and quality bar. I'll know it's done when X, Y, Z are true."

## The Demo: Three.js Animal Herd Simulation

Here's what advanced vibe coding looks like in practice. Give Claude Code this single prompt:

> **Create a Three.js scene with a herd of low-poly animals running across a desert landscape. The number of animals should be configurable via a slider. Include dust particles, dynamic shadows, and a sunset sky gradient.**

Watch what happens. Claude Code will:

1. Generate a complete HTML file with Three.js imported from CDN
2. Build a desert terrain with proper lighting
3. Create low-poly animal models (or use efficient geometry)
4. Implement a particle system for dust
5. Add a sunset sky gradient
6. Create a slider UI to control animal count
7. Handle performance considerations for 50+ animals

**You didn't write a single line of code.** You wrote a clear spec, and the AI built it.

## The Agentic Engineering Behind the Magic

What you're witnessing isn't magic — it's **agentic engineering**. Claude Code is making hundreds of autonomous decisions:

- Geometry choices: What polygon count for animals? How to tessellate the terrain?
- Animation: What motion blending produces realistic herd behavior?
- Particle systems: What emission rates and lifetimes create convincing dust?
- Performance: How to use instancing or pooling to maintain 60 FPS?

You set the goal ("herd of low-poly animals"). Claude Code figures out the how. That's the agentic pattern: you orchestrate intent, the AI executes with autonomy.

## The Limits of Advanced Vibe Coding

Here's what's important to understand: **this approach scales to a point.**

Advanced vibe coding works beautifully for self-contained projects:
- Single-page applications (landing pages, dashboards, games)
- Focused tools (a data visualizer, a converter, a simulator)
- Self-contained components with clear inputs and outputs

Advanced vibe coding struggles with:
- Large, multi-file codebases with complex interdependencies
- Projects spanning multiple domains (frontend, backend, database, DevOps)
- Systems that require careful orchestration of multiple moving parts

For those cases, later chapters will introduce the **conductor pattern** (Chapter 2) and **orchestrator pattern** (Chapter 3), which provide frameworks for coordinating AI across larger systems. Those patterns build on the vibe coding mindset but add structure.

For now, embrace the possibilities: a single, well-crafted prompt can produce complete, impressive projects. Let's see how far we can push it.

## The Key to Success

Advanced vibe coding hinges on three things:

1. **Write specs** — Be clear about what "done" looks like. Use specific adjectives: "low-poly", "dynamic", "configurable". Specify constraints: libraries, performance targets, file format.

2. **Set constraints** — Tell Claude Code what tools it can use, what technologies matter, and what the quality bar is. In this demo: "single HTML file, 60fps with 50 animals, no external build tools."

3. **Review output** — Don't just accept the first result. Run it. Test it. Ask for refinements if needed.

The advanced vibe coder doesn't write code. The advanced vibe coder thinks in specs and knows what makes a spec great.

## What's in This Demo

- `CLAUDE.md` — Project context for Claude Code (library stack, requirements, quality bar)
- `package.json` — Minimal setup for a local dev server
- This demo is intentionally simple so you can focus on understanding advanced vibe coding, not code complexity

## Next Steps

1. Review `CLAUDE.md` to see how to frame requirements for Claude Code
2. Run the dev server: `npm run dev`
3. Give Claude Code the animal herd prompt (copy it from above)
4. Watch it build. Notice what it does well, what might need refinement
5. Ask it to iterate: "Make the animals move more realistically" or "Add a day/night cycle"
6. Reflect: How much did the AI decide autonomously? How much did your spec guide it?

That's advanced vibe coding in action.
