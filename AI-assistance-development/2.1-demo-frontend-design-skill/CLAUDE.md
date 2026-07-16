# Using the Frontend Design Skill

## About This Demo

This demo teaches how skills encode domain knowledge and help Claude produce higher-quality, more intentional output. The `frontend-design.md` skill file contains principles, patterns, and anti-patterns for creating distinctive frontends.

## The Before → After Transformation

Open **before/index.html** and **after/index.html** in a browser to see the dramatic contrast:

### Before (Generic AI Slop)
- Purple gradient header with no purpose
- "Inter" font, totally generic
- White background, gray text
- Static emoji icons in gray boxes
- No animations, no interactivity
- Generic marketing copy ("Streamline Your Workflow")
- No visual hierarchy or emphasis

### After (Intentional Design)
- **Distinctive Typography**: Playfair Display serif for headlines, Sohne sans-serif for body
- **Color System**: CSS variables defining primary, accent, background colors with semantic meaning
- **Motion & Animation**:
  - Staggered entrance animations (h2 → p → buttons)
  - Floating background elements (pseudo-elements with @keyframes)
  - Hover states that provide feedback (scale, shadow, color shift)
  - Smooth link underlines
- **Micro-Interactions**:
  - Icon rotation and scale on hover
  - Button shine effect on hover
  - Feature cards with top border on hover
  - Navigation links with animated underlines
- **Visual Hierarchy**: Clear emphasis through size, weight, spacing, and color
- **Responsive Design**: Mobile-first with clamp() for fluid scaling
- **Cohesive Spacing**: CSS variables (--spacing-xs through --spacing-2xl) used throughout

## Key Design Principles Demonstrated

### 1. CSS Variables for Cohesion
All colors, spacing, and typography defined once in `:root`:
```css
:root {
    --color-primary: #2563eb;
    --color-accent-warm: #f97316;
    --color-text-primary: #0f172a;
}
```

### 2. Staggered Animations Create Flow
Elements don't appear all at once—each has an offset delay:
```css
.hero h2 { animation: fadeInUp 0.8s ease-out 0.1s both; }
.hero p { animation: fadeInUp 0.8s ease-out 0.3s both; }
.cta-button { animation: fadeInUp 0.8s ease-out 0.4s both; }
```

### 3. Purposeful Gradients
Gradients are used for:
- The logo/brand text (combining primary + accent colors)
- Button backgrounds (visual weight)
- Background ornamentation (blurred radial gradients in hero)
- Never random or decorative

### 4. Hover States Invite Interaction
Every interactive element provides visual feedback:
- Buttons lift with shadow and subtle color shift
- Links show animated underlines
- Cards grow subtle shadow and shift up
- Icons rotate and scale

### 5. Accessibility Built-In
- Color contrast ratios meet WCAG AA
- Semantic HTML structure
- Focus states for keyboard navigation
- Responsive design that doesn't break on mobile
- Readable font sizes with proper line-height

## How to Use This Skill

When Claude produces design output, reference this skill to get:
- **Higher intention**: Every element serves a purpose
- **Consistency**: Variables ensure cohesive color and spacing
- **Personality**: Typography and motion make it memorable
- **Professionalism**: Avoids generic patterns that scream "AI-generated"
- **Accessibility**: WCAG compliance by default

## Trigger Patterns

Use the skill when you need Claude to:
- "Design a landing page with personality"
- "Create a dashboard that feels premium"
- "Build a UI component library with distinctive style"
- "Redesign this generic interface"
- "Make this feel less like AI and more intentional"

## Customization

The skill is a foundation. Customize by:
- Changing Google Fonts (try Inter + Crimson Pro, or Sohne + Georgia)
- Adjusting color palette (blue + orange, purple + teal, etc.)
- Modifying animation timing and easing
- Extending spacing variables for your design system
- Adding new principles (dark mode, glassmorphism, etc.)

## Testing & Validation

To verify the design achieves the skill's goals:

1. **Visual Check**: Does it feel distinctive and intentional?
2. **Typography**: Are there 2+ fonts with clear hierarchy?
3. **Color System**: Can you find CSS variables defining all colors?
4. **Motion**: Do animations have purpose and staggered delays?
5. **Accessibility**: Run through a11y tools (no contrast errors, keyboard nav works)
6. **Responsiveness**: Resize browser from 320px to 1920px—does it adapt gracefully?

## Files in This Demo

```
2.1-demo-frontend-design-skill/
├── before/
│   └── index.html          # Generic AI slop version
├── after/
│   └── index.html          # Transformed using design skill
├── .claude/
│   └── skills/
│       └── frontend-design.md    # The skill file
├── CLAUDE.md               # This file
└── README.md               # High-level overview
```

## Appendix: Design System Variables

The "after" version defines a complete design system in CSS variables:

**Colors**: 9 variables (primary, secondary, accent, background, text, borders)
**Spacing**: 8 variables (xs through 2xl) for consistent margins/padding
**Typography**: Playfair Display + Sohne with semantic sizing
**Effects**: backdrop-filter, shadows, borders, gradients
**Timing**: 0.3s, 0.4s, 0.6s, 0.8s for consistent animations

This allows changes to cascade throughout the entire design with one variable update.
