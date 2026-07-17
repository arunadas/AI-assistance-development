# 2.2 Skill Authoring — Clean Version

## Overview

This is the **starting point** for the Skill Authoring demo. You have example skills to study and a "before" API to practice with — your goal is to understand how skills work and learn to create your own.

## What You Have

- `.claude/skills/pptx-presentation.md` — A complete PPTX skill to study
- `.claude/skills/api-design.md` — An API Design skill to study
- `examples/api-before/server.ts` — A messy API implementation (before applying the skill)

## What You'll Do

1. **Study** the existing skills to understand their structure (Purpose, Principles, Patterns, Checklist, Anti-Patterns)
2. **Apply** the API Design skill to transform the messy `server.ts` into a clean, RESTful API
3. **Create** your own skill for a domain you care about

## Getting Started

1. Read `.claude/skills/api-design.md` to understand the skill structure
2. Read `examples/api-before/server.ts` to see the messy API
3. Ask Claude: *"Using the api-design skill, refactor examples/api-before/server.ts to follow REST best practices"*
4. Compare the result to the principles in the skill

## Files

```
2.2-demo-pptx-skill-authoring-clean/
├── .claude/skills/
│   ├── pptx-presentation.md      # PPTX skill (study this)
│   └── api-design.md             # API Design skill (study this)
├── examples/
│   └── api-before/
│       └── server.ts             # Messy API to transform
└── README.md                     # This file
```

## See the Completed Version

Check `2.2-demo-pptx-skill-authoring/` for the finished examples, authoring guide, and before/after comparison.
