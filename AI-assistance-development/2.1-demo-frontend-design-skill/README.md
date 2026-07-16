# 2.1 Frontend Design Skill Demo

## Overview

This demo teaches **how skills work** by examining one complete, real-world skill: the Frontend Design Skill. You'll learn how skills encode domain knowledge, guide Claude's behavior, and dramatically improve output quality.

## What is a Skill?

A **skill** is a reusable knowledge file that teaches Claude about best practices in a specific domain. Skills:

1. **Encode expertise**: Distill human knowledge into actionable patterns
2. **Guide Claude's behavior**: When invoked, they shape how Claude approaches tasks
3. **Are composable**: Multiple skills can be used together
4. **Are versionable**: You can create custom versions for your domain

## The Frontend Design Skill

This skill teaches Claude how to create **distinctive, memorable frontends** that don't feel like generic AI output. It covers:

- **Typography**: How to use custom fonts for personality and hierarchy
- **Color Systems**: CSS variables for cohesive color management
- **Motion & Animation**: Purposeful animations that enhance UX
- **Micro-Interactions**: Hover states, transitions, and feedback
- **Accessibility**: WCAG compliance by default
- **Anti-Patterns**: What makes design feel like "AI slop"

## Before → After Comparison

The two landing pages in this demo are **identical in structure** but worlds apart in execution.

### before/index.html
Generic, uninspiring design:
- Default Inter font, no personality
- Purple gradient for no reason
- Static content, no animations
- Gray emoji icons in gray boxes
- Zero micro-interactions
- White background, gray text
- Generic marketing copy

**Result**: Looks like every other AI-generated landing page

### after/index.html
Distinctive, intentional design:
- Custom typography (Playfair Display + Sohne) with hierarchy
- CSS variables for color system (primary, accent, background)
- Orchestrated animations with staggered delays
- Animated icons on hover, floating backgrounds
- Navigation with animated underlines
- Glassmorphic header with backdrop blur
- Responsive, accessible, memorable

**Result**: Feels crafted, not generated

### Side-by-side View

Open both files in your browser:

```
Before:  before/index.html
After:   after/index.html
```

Notice:
1. **Typography transformation**: Serif + sans-serif vs. single generic font
2. **Color sophistication**: Variable-based system vs. random hex values
3. **Animation flow**: Staggered entrance animations vs. static load
4. **Interactive feedback**: Hover states on every element vs. static blocks
5. **Visual hierarchy**: Clear emphasis through size, weight, color vs. flat layout

## Key Principles in Action

### 1. CSS Variables for Cohesion

**Before**: Colors scattered as hex codes
```css
.header { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); }
.button { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); }
.footer { background: #1f2937; }
```

**After**: Centralized, semantic variables
```css
:root {
    --color-primary: #2563eb;
    --color-accent: #f97316;
    --color-text: #0f172a;
}
.button { background: var(--color-primary); }
```

**Benefit**: Change the primary color once, update everywhere

### 2. Distinctive Typography

**Before**: One font (Inter) at generic sizes
```css
body { font-family: 'Inter', sans-serif; }
h2 { font-size: 48px; }
```

**After**: Two fonts with semantic pairing
```css
h1, h2, h3 { font-family: 'Playfair Display', serif; }
body { font-family: 'Sohne', sans-serif; }
h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); }
```

**Benefit**: Instantly recognizable, responsive, professional

### 3. Orchestrated Motion

**Before**: No animations
```css
/* Nothing moves */
```

**After**: Staggered entrance animations
```css
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.hero h2 { animation: fadeInUp 0.8s ease-out 0.1s both; }
.hero p { animation: fadeInUp 0.8s ease-out 0.3s both; }
.button { animation: fadeInUp 0.8s ease-out 0.4s both; }
```

**Benefit**: Content appears in sequence, guiding viewer attention

### 4. Micro-Interactions

**Before**: Static, unresponsive
```css
.button:hover { /* nothing */ }
```

**After**: Visual feedback on every interaction
```css
.button:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(37, 99, 235, 0.3);
}

nav a::after {
    content: '';
    width: 0;
    transition: width 0.3s ease;
}
nav a:hover::after {
    width: 100%;
}
```

**Benefit**: Interface feels alive and responsive

### 5. Layout Sophistication

**Before**: Fixed pixels, rigid layouts
```css
padding: 20px 40px;
margin-bottom: 20px;
width: 80px;
```

**After**: Responsive spacing with variables
```css
--spacing-md: 1.5rem;
--spacing-lg: 2rem;
padding: var(--spacing-lg) var(--spacing-xl);
font-size: clamp(1rem, 2vw, 1.25rem);
```

**Benefit**: Scales beautifully from 320px (mobile) to 1920px (desktop)

## How Skills Improve Output

### Without a Skill

You ask Claude: *"Design a landing page for a SaaS product"*

Claude produces: A functional but generic page with default patterns, no personality, no micro-interactions.

### With the Frontend Design Skill

You invoke the skill and ask: *"Design a landing page using the frontend-design skill"*

Claude produces: A distinctive page with:
- Custom typography that feels intentional
- Cohesive color system via CSS variables
- Orchestrated animations that guide attention
- Micro-interactions on every interactive element
- Accessibility built-in
- Mobile-responsive and production-ready

**The skill acts as a guardrail**, preventing generic patterns and guiding toward excellence.

## Anatomy of a Skill File

Look at `.claude/skills/frontend-design.md`:

```markdown
# Skill Name
Frontend Design Skill

## Purpose
What this skill helps with

## Principles
1. Distinctive Typography
2. Cohesive Color Systems
3. ...

## Implementation Checklist
[ ] Do this
[ ] Then that

## Example Patterns
Code snippets showing best practices

## When to Apply
When you need this skill

## Success Metrics
How to know if you succeeded
```

This structure ensures Claude:
1. Understands the purpose
2. Learns the key principles
3. Has concrete examples to follow
4. Knows when to apply the skill
5. Can evaluate success

## Creating Your Own Skills

This demo is a **template for skill creation**. To create a custom skill:

1. **Identify the domain**: What expertise do you want to encode?
2. **Extract principles**: What makes good output in this domain?
3. **Document patterns**: Show code examples of best practices
4. **List anti-patterns**: What mistakes should be avoided?
5. **Create examples**: Include before/after comparisons
6. **Test and refine**: Iterate based on results

## Files in This Demo

```
2.1-demo-frontend-design-skill/
├── before/
│   └── index.html                    # Generic AI slop version
├── after/
│   └── index.html                    # Intentional design version
├── .claude/
│   └── skills/
│       └── frontend-design.md        # The skill file (core learning)
├── CLAUDE.md                         # Claude-focused guide
├── README.md                         # This file
```

## How to Use This Demo

### For Learning

1. Read `.claude/skills/frontend-design.md` to understand the skill
2. Open `before/index.html` in a browser
3. Open `after/index.html` in another tab
4. Compare side-by-side, noting every difference
5. Read the CLAUDE.md file to understand each change
6. Reference the HTML files to see implementation details

### For Building Your Skills

1. Copy the structure of this skill
2. Replace domain (Frontend Design → Your Domain)
3. Document the 5-7 key principles
4. Provide code examples
5. Create before/after demos
6. Test with Claude using the skill

## Testing the Skill

To verify the skill works as intended:

```
1. Open before/index.html
2. Open after/index.html
3. Ask Claude: "Using the frontend-design.md skill, improve this basic HTML page"
4. Compare Claude's output to after/index.html
5. Note where Claude applies principles from the skill
```

## Advanced: Customizing the Skill

You can customize this skill for your needs:

**Typography**: Change Google Fonts
```css
/* Try: Sohne + Georgia, Inter + Crimson Pro, etc. */
```

**Colors**: Adjust the CSS variable palette
```css
--color-primary: #your-color;
--color-accent: #your-color;
```

**Motion**: Modify animation timing and easing
```css
/* Change 0.8s to 0.5s for snappier feel */
/* Change cubic-bezier for different personality */
```

**Anti-patterns**: Add domain-specific patterns to avoid

## Key Takeaways

1. **Skills are knowledge crystallized**: They distill expertise into actionable patterns
2. **They shape Claude's output**: Using a skill dramatically improves quality
3. **They're composable**: You can use multiple skills together
4. **They're customizable**: Adapt them to your specific needs
5. **They're versionable**: Iterate and improve over time
6. **They're the future of AI-assisted development**: As your team builds skills, your AI assistance gets smarter

## References

- `.claude/skills/frontend-design.md` — The skill file
- `CLAUDE.md` — Claude-specific implementation guide
- `before/index.html` — Example of what to avoid
- `after/index.html` — Example of intentional design

---

**Next Steps**: Create your own skill based on this template!
