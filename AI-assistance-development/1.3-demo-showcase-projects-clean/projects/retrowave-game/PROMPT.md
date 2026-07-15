# Retrowave Racing Game — Advanced Vibe Coding Exercise

This is a showcase of advanced vibe coding: a single, well-written spec that produces a complete, impressive game with no scaffolding or partial work. Notice how the AI makes autonomous decisions about geometry, animation, particle systems, and performance — you set the goal, it figures out the how.

## The Spec

```
Build a high-octane 3D retrowave racing game with endless synthwave aesthetics, neon visuals,
and intense arcade driving action. Single HTML file using Three.js. Arrow keys for steering,
speed increases over time, neon grid road, synthwave color palette (purple, pink, cyan),
score based on distance.
```

## What to Look For in the Output

### Visual Elements
- **Neon Grid Road**: A stylized road with glowing grid lines (cyan/pink color)
- **Synthwave Sky**: Gradient background with purples, pinks, and cyans
- **Neon Obstacles**: Bright obstacles with glow effects (cubes, walls, or geometric shapes)
- **Camera Movement**: Smooth camera following or third-person view of the car

### Game Mechanics
- **Keyboard Control**: Arrow keys (or WASD) for steering, movement feels responsive
- **Acceleration**: Speed increases automatically over time (or with throttle); feel the progression
- **Collision Detection**: Hitting obstacles stops the car or causes game over
- **Score/Distance**: Counter that increases as you move, visible on screen

### Code Quality
- **Single HTML File**: No external imports except Three.js from CDN
- **Inline CSS & JS**: Everything in one file, ready to run
- **Performance**: 60 FPS with smooth rendering

---

## Iteration Ideas (Try These)

1. **Add particle effects**: "When the car hits an obstacle, explode with neon particles."
2. **Add hazards**: "Add enemy cars or moving obstacles that patrol the road."
3. **Add music**: "Add a synthwave audio track from a royalty-free source (or generate one)."
4. **Difficulty progression**: "Make obstacles appear more frequently as the score increases."
5. **High score persistence**: "Save the top 3 scores to localStorage and display them on a game-over screen."

---

## Why This Spec Works

- **Specific**: Mentions Three.js, synthwave, specific colors, specific keys
- **Constrained**: Single HTML file = no ambiguity about architecture
- **Aesthetic**: Adjectives ("high-octane", "neon") guide the visual feel
- **Measurable**: "60 FPS", "arrow keys", "score based on distance" are verifiable

---

## Lessons

This project demonstrates:
- How a single, well-written prompt produces a complete, playable game with no scaffolding
- How adjectives ("synthwave", "neon", "high-octane") guide hundreds of autonomous decisions (color choices, lighting, particle behavior)
- How specifying a library (Three.js) constrains the solution helpfully; the AI applies expert knowledge
- How single-file constraints encourage clean, focused architecture that the AI maintains automatically
- Agentic engineering in action: you describe the goal, the AI figures out geometry, animation, and performance
