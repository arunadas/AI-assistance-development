# Three.js Animal Herd Simulation

## Project Overview

A performant 3D scene featuring a herd of low-poly animals running across a desert landscape with environmental effects.

## Technology Stack

- **Framework**: Three.js (loaded from CDN — v125 or latest)
- **Target Environment**: Single HTML file (index.html), no build step required
- **Runtime**: Modern browser (Chrome, Firefox, Safari, Edge)
- **No dependencies** — Three.js via CDN, all JS inline

## Core Requirements

### Visual Elements
- Desert terrain with sand-colored geometry
- Low-poly animal models (stylized geometric shapes representing animals like deer, gazelles, or cattle)
- Dust particle system triggered by animal movement
- Dynamic shadows cast by animals and from directional lighting
- Sunset sky gradient (warm oranges, pinks, purples transitioning to deep blue)
- Configurable animal count via HTML slider (range: 1–50)

### Interactivity
- Slider UI to control how many animals spawn/despawn
- Real-time count display
- Smooth transitions when count changes

### Performance Targets
- Maintain 60 FPS minimum with up to 50 animals
- Use instancing or vertex pooling for animals if needed
- Efficient particle system (limit particle count or use pooling)

### Behavior
- Animals move in realistic patterns (herd-like locomotion, occasional direction changes)
- Dust particles emit from animal positions during movement
- Lighting should be dynamic (optional: time-of-day cycle)

## Deliverable

- Single `index.html` file
- All CSS and JavaScript embedded (no external assets except Three.js CDN)
- Responsive canvas (fills viewport)
- Runs with `npx serve` or any local HTTP server
