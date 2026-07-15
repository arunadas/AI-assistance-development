# 1.1 Demo: Orchestrator Intro (Clean Starting Point)

This is the **starting point** for the Animal Herd Simulation demo. Use the specification in `CLAUDE.md` to generate a complete, working Three.js simulation.

## What You'll Build

You should ask Claude Code to generate `index.html` — a single-file Three.js application that features:

- A desert landscape with sand-textured terrain
- 5-50 low-poly animals (stylized with basic geometries)
- Herd behavior: animals move together with occasional direction changes
- Dust particle system following animal movement
- Dynamic sunset sky gradient
- Configurable animal count slider (1-50)
- Smooth camera following the herd
- 60 FPS performance target

## Getting Started

1. Review `CLAUDE.md` for the full specification
2. Ask Claude Code: "Use CLAUDE.md to generate index.html for this Three.js animal herd simulation"
3. Run with: `npx serve` or similar HTTP server
4. Interact with the animal count slider to see the herd grow/shrink

## What's Different from the Complete Version

The complete version (1.1-demo-orchestrator-intro) includes the finished `index.html`. This clean version omits it so you can experience the full process of generating it from scratch.

## Key Points

- Single HTML file with embedded CSS and JavaScript
- No build step required
- Three.js loaded from CDN (r128)
- Responsive canvas fills the viewport
- Real-time FPS and particle count display

---

This demo teaches the "vibe coding" approach: a well-written spec enables AI to make autonomous decisions about geometry, animation, lighting, and performance.
