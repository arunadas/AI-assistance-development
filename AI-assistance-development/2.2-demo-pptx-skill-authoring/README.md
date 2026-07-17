# 2.2 Skill Authoring Demo

## Overview

This demo teaches **how to create and use skills** by examining two domains:

1. **PPTX Presentations** — A real-world skill showing how to create professional PowerPoint presentations
2. **API Design** — A custom skill you'll learn to author, showing before/after transformation

This demo answers: *How do you distill domain knowledge into a skill that makes Claude smarter?*

## What You'll Learn

- How to structure a skill file (purpose, principles, patterns, checklist)
- How skills guide Claude's behavior toward excellence
- The dramatic before/after impact of applying a skill
- How to create your own skills for any domain

## Files in This Demo

```
2.2-demo-pptx-skill-authoring/
├── .claude/skills/
│   ├── pptx-presentation.md      # PPTX skill (example to study)
│   └── api-design.md             # API Design skill (skill to learn)
├── examples/
│   ├── sample-presentation/
│   │   └── create_presentation.py   # Demonstrates PPTX skill
│   ├── api-before/
│   │   └── server.ts             # Messy API (before skill)
│   └── api-after/
│       └── server.ts             # Clean API (after skill)
├── SKILL_AUTHORING_GUIDE.md      # How to create skills (step-by-step)
├── README.md                      # This file
└── package.json
```

## Part 1: Study the PPTX Skill

### What is This Skill?

The `pptx-presentation.md` skill teaches Claude how to create professional PowerPoint presentations using python-pptx (a Python library).

### Key Principles Covered

1. **Slide Layout Architecture** — Structure of different slide types
2. **Typography System** — Font choices, sizes, hierarchy
3. **Color System** — Semantic color naming, accessibility
4. **Composition & Visual Hierarchy** — White space, alignment, visual weight
5. **Content Organization** — One idea per slide, logical flow
6. **Data Visualization** — Charts, labels, clarity

### Study It

Read `.claude/skills/pptx-presentation.md` and note:

1. **Structure**: How is it organized? (Purpose, Principles, Patterns, Checklist, Anti-Patterns)
2. **Specificity**: What makes it targeted to presentations? (Not general design)
3. **Examples**: Does it include code samples?
4. **When to Apply**: Clear guidance on when to use this skill
5. **Anti-Patterns**: What mistakes should be avoided?

### See It in Action

Run the sample presentation generator:

```bash
# Install dependencies
pip install python-pptx

# Run the script
python examples/sample-presentation/create_presentation.py

# Output: sample-presentation.pptx
# Open in PowerPoint/Google Slides to see the result
```

The generated presentation demonstrates:
- Consistent color palette (defined once, used everywhere)
- Typography hierarchy (large titles, readable body)
- Proper spacing and margins
- Slide layouts that follow the skill's principles

## Part 2: Study the API Design Skill (Before/After)

### The Skill File

Open `.claude/skills/api-design.md`. This is a skill about building clean, consistent REST APIs.

### Key Principles

1. **RESTful Conventions** — Nouns not verbs, proper HTTP methods
2. **Request/Response Format** — Consistent JSON structure
3. **Error Handling** — Semantic error codes + status codes
4. **Pagination** — Standardized list endpoints
5. **Versioning** — URL-based API versions
6. **Authentication & Security** — Bearer tokens, HTTPS

### Before: Messy API

Open `examples/api-before/server.ts` and read it.

Notice the problems:

1. **Verb-based endpoints**: `/getUsers`, `/createUser` (should be `/users`)
2. **Inconsistent response formats**: Some return `{ message, user }`, others `{ error }`
3. **No error handling**: Returns `undefined` for missing users
4. **HTTP 200 for errors**: Should be 400, 404, 500
5. **No validation**: Accepts bad data
6. **No pagination**: List endpoints return everything
7. **Exposed stack traces**: Sends error details to clients
8. **Inconsistent methods**: Uses GET for deletion (`/removeUser`)

**Result**: It works but feels unprofessional, inconsistent, and fragile.

### After: Clean API

Open `examples/api-after/server.ts` and compare.

Notice what's improved:

1. **RESTful conventions**: `/api/v1/users`, `/api/v1/users/:id`
2. **Proper HTTP methods**: GET, POST, PUT, DELETE
3. **Correct status codes**: 201 for create, 204 for delete, 404 for not found
4. **Consistent response format**:
   ```json
   {
     "success": true,
     "data": { /* resource */ },
     "pagination": { /* metadata */ }
   }
   ```
5. **Comprehensive validation**: Checks input before business logic
6. **Semantic error codes**: VALIDATION_ERROR, NOT_FOUND, SERVER_ERROR
7. **No stack traces**: Safe error messages only
8. **Pagination support**: `?page=1&limit=20`

**Result**: Professional, maintainable, safe for production.

### Side-by-Side Comparison

| Aspect | Before | After |
|--------|--------|-------|
| **Endpoint Style** | `/getUsers` | `/api/v1/users` |
| **HTTP Methods** | GET for deletion | Proper methods (DELETE) |
| **Status Codes** | Always 200 | 201, 204, 400, 404, 500 |
| **Error Format** | Inconsistent | Consistent with codes |
| **Validation** | None | Comprehensive |
| **Pagination** | No | Yes, with metadata |
| **Security** | Stack traces exposed | Safe error messages |

## Part 3: Learn Skill Authoring

### The Guide

Read `SKILL_AUTHORING_GUIDE.md` for a complete step-by-step guide on creating skills.

### Key Sections

1. **Anatomy of a Skill** — Standard structure and sections
2. **Step-by-Step Creation** — How to build your own skill
3. **Before/After Examples** — Why and how to create comparisons
4. **Testing Your Skill** — How to verify it works
5. **Common Pitfalls** — Mistakes to avoid
6. **Templates** — Ready-to-use templates

### Workshop: Create a Testing Skill

Try creating a skill from scratch:

**Choose the Domain**: Testing (unit tests in any language)

**Extract Principles**:
1. Test behavior, not implementation
2. Keep tests focused and isolated
3. Use descriptive test names
4. Avoid over-engineered test fixtures
5. Test error cases, not just happy paths
6. Keep assertions simple

**Document Each Principle**: Add explanation + code example

**Create Anti-Patterns**:
- Testing implementation details
- Mega-tests that do too much
- Vague test names
- Complex test setups
- Only happy path tests
- Multiple assertions per test

**Write the File**: Create `.claude/skills/testing.md` following the template

**Test It**: Ask Claude to improve a messy test file using your skill

## Key Insights

### 1. Skills Encode Expertise

A skill crystallizes knowledge from books, experience, and best practices into actionable patterns that guide Claude's behavior.

### 2. Skills Are Specific

The best skills focus on one domain, not everything. "API Design" is better than "Good Code."

### 3. Skills Have Structure

Effective skills follow a consistent structure: Purpose → Principles → Patterns → Checklist → Anti-Patterns

### 4. Skills Are Testable

You can verify a skill works by:
- Before/after comparison
- Checklist verification
- Testing with Claude
- Measuring quality improvement

### 5. Skills Are Composable

Use multiple skills together:
```
"Build a dashboard using frontend-design + api-design skills"
```

Claude will apply both, creating a beautiful UI with a clean backend.

## Practical Exercises

### Exercise 1: Skill Analysis

Pick one skill file (`.claude/skills/api-design.md` or `pptx-presentation.md`).

For 15 minutes, analyze:
1. What's the core purpose?
2. What are the 5-7 main principles?
3. What patterns does it teach?
4. What anti-patterns does it avoid?
5. When would you use this skill?

### Exercise 2: Before/After Review

Compare the API files:
1. List 10 differences between before and after
2. For each difference, note which principle from the skill it addresses
3. Rate the "before" API (1-10). Rate the "after" API (1-10).
4. What percentage of your rating difference is due to skill application?

### Exercise 3: Skill Creation

Follow SKILL_AUTHORING_GUIDE.md and create a skill for:
- Code review practices
- Documentation writing
- Database design
- Component libraries
- Error handling

**Minimum viable skill**:
- Purpose (1 paragraph)
- 5-7 Principles (with explanations)
- 3-5 Implementation Patterns (with code)
- Checklist (8-10 items)
- Anti-Patterns (5-7 items)

### Exercise 4: Test Your Skill

1. Ask Claude: "Apply [your-skill] to improve this code"
2. Provide messy example code
3. Compare output to skill principles
4. Did Claude apply 80% of the principles?
5. What gaps exist? Update the skill.

## Advanced: Skill Composition

Skills work together. Example workflow:

```
Scenario: Build a new SaaS dashboard

Skills to apply:
1. frontend-design.md — Beautiful, responsive UI
2. accessibility.md — WCAG AA compliant
3. api-design.md — Clean backend API
4. testing.md — Comprehensive test coverage

Ask Claude:
"Build a SaaS dashboard using frontend-design, accessibility,
api-design, and testing skills. The dashboard should show user
metrics in real-time."

Result: Claude produces a complete, high-quality implementation
that applies all four skills together.
```

## Success Criteria

After this demo, you should be able to:

1. **Explain what a skill is** — Reusable knowledge that guides Claude
2. **Identify skill components** — Purpose, Principles, Patterns, Checklist, Anti-Patterns
3. **Analyze a skill** — Understand its domain and applicability
4. **Compare before/after** — See the dramatic impact of skill application
5. **Create a skill** — Structure, document, and test your own skill
6. **Compose skills** — Use multiple skills together for better results

## References

- `SKILL_AUTHORING_GUIDE.md` — Complete guide to creating skills
- `.claude/skills/api-design.md` — Example skill file
- `.claude/skills/pptx-presentation.md` — Another example skill
- `examples/api-before/server.ts` — Messy implementation
- `examples/api-after/server.ts` — Clean implementation

## Next Steps

1. **Study**: Read both skill files in depth
2. **Understand**: Trace through before/after examples
3. **Practice**: Create your own skill following the guide
4. **Test**: Verify your skill with Claude
5. **Iterate**: Refine based on results
6. **Share**: Deploy your skill to your team

---

**Remember**: Skills are how you scale expertise. As you build more skills, your AI assistance gets smarter, faster, and more aligned with your team's standards.

Every domain has "best practices." When you crystallize those into a skill, you've automated the transfer of expertise from humans to Claude.

That's the power of skills.
