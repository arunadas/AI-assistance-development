# Skill Authoring Guide

This guide teaches you how to create skills — reusable knowledge files that make Claude smarter in specific domains.

## What is a Skill?

A **skill** is a Markdown file that encodes domain expertise and guides Claude's behavior. When you invoke a skill, Claude applies that knowledge to produce higher-quality output.

**Example**: The `frontend-design.md` skill teaches Claude about typography, color systems, and animations. When used, it prevents generic UI patterns and produces distinctive, intentional designs.

## Anatomy of a Skill File

Here's the standard structure:

```markdown
# Skill Name

## Purpose
One paragraph explaining what this skill helps with.

## Core Principles
1. First principle with explanation
2. Second principle with explanation
3. ...

## Implementation Patterns
### Pattern 1: Description
Code example showing how to implement this pattern.

### Pattern 2: Description
Code example.

## Design Checklist
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] ...

## Anti-Patterns to Avoid
- Anti-pattern 1: Why it's bad
- Anti-pattern 2: Why it's bad

## When to Apply
When you need this skill, use it for:
- Scenario 1
- Scenario 2

## Success Metrics
How to know if your output succeeded:
- Metric 1
- Metric 2

## References
Links to external resources
```

## Step-by-Step: Creating Your First Skill

### Step 1: Choose Your Domain

Pick something you know well — something where you have strong opinions about what "good" looks like.

**Examples:**
- Testing in React
- API error handling
- Data visualization
- Documentation writing
- Code review practices
- Accessible component design

**Question to ask**: "What makes output in this domain feel professional vs. amateur?"

### Step 2: Extract Core Principles

Identify the 5-7 most important rules or guidelines in your domain.

**Example: Testing Skill**
1. Test behavior, not implementation
2. Keep tests focused and isolated
3. Use descriptive test names
4. Avoid test fixtures that are too smart
5. Test error cases, not just happy paths
6. Keep assertions simple and specific

**How to find principles:**
- What do code reviews always mention?
- What mistakes do you see repeatedly?
- What's the difference between code that feels "right" and "wrong"?
- What would you teach someone new in this domain?

### Step 3: Document Each Principle

For each principle, provide:
1. **What it is**: Clear definition
2. **Why it matters**: The reasoning
3. **How to do it**: Implementation guidance
4. **What to avoid**: Anti-patterns

**Example:**

```markdown
### Principle 2: Keep Tests Focused and Isolated

Each test should verify ONE thing. If a test is testing multiple behaviors,
it's harder to debug when it fails.

**Good:**
```python
def test_user_can_login_with_valid_credentials():
    user = create_user('alice@example.com', password='secure')
    result = login('alice@example.com', 'secure')
    assert result.success == True
    assert result.user.email == 'alice@example.com'
```

**Bad:**
```python
def test_login_and_profile_and_settings():
    # Too many things happening, hard to debug failure
    user = login(...)
    profile = get_profile(...)
    settings = update_settings(...)
    assert everything_works()
```
```

### Step 4: Create Implementation Patterns

Show concrete code examples of how to apply each principle.

**Template:**

```markdown
## Implementation Patterns

### Pattern 1: [Brief Description]
Explanation of when and why to use this pattern.

**Example:**
[Code snippet showing the pattern]

### Pattern 2: [Brief Description]
Explanation.

**Example:**
[Code snippet]
```

### Step 5: Build a Checklist

Create a practical checklist that someone can use to verify they've applied the skill correctly.

**Example: Frontend Design Skill Checklist**

```markdown
## Implementation Checklist

- [ ] Define CSS variables for colors, spacing, typography
- [ ] Implement 2+ custom Google Fonts with clear hierarchy
- [ ] Create gradient effects that serve purpose
- [ ] Add entrance animations with staggered delays
- [ ] Include hover/focus states on interactive elements
- [ ] Use backdrop-filter or creative backgrounds
- [ ] Ensure mobile responsiveness with @media queries
- [ ] Test contrast ratios with accessibility tools
```

Each checkbox should be something verifiable — someone should be able to look at code/design and check it off.

### Step 6: Document Anti-Patterns

List what NOT to do. Anti-patterns are as important as patterns.

**Example: API Design Anti-Patterns**

```markdown
## Anti-Patterns to Avoid

- **Verb-based endpoints**: Use `/users` not `/getUsers`
- **Inconsistent response formats**: Same structure for all responses
- **HTTP 200 for errors**: Use proper status codes (400, 404, 500)
- **No validation**: Validate input before business logic
- **Exposing stack traces**: Never send error details to clients
```

### Step 7: Define When to Apply

Be explicit about when this skill is relevant.

```markdown
## When to Apply

Use this skill when you need to:
- Build new UI components or pages
- Redesign existing interfaces that feel generic
- Create marketing landing pages
- Elevate visual hierarchy in dashboards
- Add polish and personality to applications

**Not for:**
- Utilities (this skill doesn't apply)
- Command-line tools (different design paradigm)
```

### Step 8: Success Metrics

Define how you'll know the skill was applied successfully.

```markdown
## Success Metrics

The output should meet these criteria:

1. **Visual distinctiveness**: Does it feel intentional, not AI-generated?
2. **Typography hierarchy**: Can you identify 2+ fonts with clear hierarchy?
3. **Color system**: Are colors defined via variables or semantic naming?
4. **Responsive design**: Does it work on mobile (320px) to desktop (1920px)?
5. **Accessibility**: Does it pass contrast and keyboard navigation checks?
```

## Advanced: Creating Before/After Examples

The most effective skills include before/after examples that show the dramatic impact.

### Step 1: Create a "Before" Example

Build a basic version using generic patterns or anti-patterns from the skill.

**Example: Frontend Design Skill**
- Generic Inter font
- Purple gradient with no purpose
- Static, no animations
- Generic emoji icons
- Result: Looks like AI slop

### Step 2: Create an "After" Example

Transform it using the skill's principles.

**Example: Frontend Design Skill**
- Custom typography (Playfair Display + Sohne)
- CSS variable-based color system
- Orchestrated animations with staggered delays
- Custom icons, hover states on every element
- Result: Distinctive, intentional, professional

### Step 3: Document the Differences

Explain what changed and why:

```markdown
## Transformation Details

### Typography
**Before**: Single font (Inter) at fixed sizes
**After**: Two fonts (serif + sans-serif) with responsive sizing via clamp()

### Color
**Before**: Random hex values scattered in CSS
**After**: CSS variables with semantic naming (--color-primary, --color-accent)

### Animation
**Before**: No motion or interaction
**After**: Staggered entrance animations, hover states on every interactive element
```

## Folder Structure for a Complete Skill

```
2.X-demo-skill-name/
├── .claude/
│   └── skills/
│       ├── skill-one.md          # The skill file
│       └── skill-two.md          # Optional: multiple skills
├── before/
│   └── index.html                # Example without skill
├── after/
│   └── index.html                # Example with skill applied
├── examples/
│   ├── example1.ts               # Code samples
│   └── example2.ts
├── SKILL_AUTHORING_GUIDE.md      # How to create skills (this file)
├── CLAUDE.md                      # Claude-focused usage guide
└── README.md                      # High-level overview
```

## Testing Your Skill

### Test 1: Single Item Test

Create a minimal example and ask Claude to apply your skill:

```
Ask Claude: "Apply the api-design skill to improve this Express server"
Provide: A messy API without the skill's principles
Evaluate: Does Claude's output match your skill's principles?
```

### Test 2: Consistency Test

Apply the skill multiple times and verify consistency:

```
Create 3 different components/services
Ask Claude to apply the skill to each
Verify: All 3 follow the same principles
```

### Test 3: Gap Analysis

Review the output for gaps:

```
What did Claude miss from the skill?
What principles weren't applied?
Why? (Missing from skill file, unclear language, etc.)
Update the skill file to address gaps
```

## Skill Versioning

Skills evolve. Document versions:

```markdown
# Skill Name (v1.2)

## Changelog

### v1.2 (2024-03-10)
- Added section on error handling patterns
- Updated anti-patterns based on common mistakes

### v1.1 (2024-02-15)
- Clarified principle 3 with additional examples

### v1.0 (2024-01-01)
- Initial release
```

## Common Pitfalls

### Pitfall 1: Too Many Principles
**Problem**: Skill covers 15 principles, too much to remember
**Solution**: Focus on 5-7 core principles; relegate rest to "Advanced" section

### Pitfall 2: Vague Language
**Problem**: "Write good code" — too subjective
**Solution**: "Use camelCase for variables; use UPPER_SNAKE_CASE for constants"

### Pitfall 3: No Examples
**Problem**: Principles without code samples
**Solution**: Every principle needs a concrete code example

### Pitfall 4: Anti-Patterns Only
**Problem**: Only showing what NOT to do
**Solution**: Always pair anti-patterns with correct patterns

### Pitfall 5: No Clear Trigger
**Problem**: When should this skill be used? Unclear
**Solution**: Include "When to Apply" section with specific scenarios

## Templates

### Minimal Skill Template

```markdown
# [Skill Name]

## Purpose
[1 paragraph]

## Principles
1. [Principle with explanation]
2. [Principle with explanation]
3. [Principle with explanation]

## Implementation Patterns
### Pattern 1
[Explanation + code example]

### Pattern 2
[Explanation + code example]

## Checklist
- [ ] [Requirement]
- [ ] [Requirement]
- [ ] [Requirement]

## When to Apply
[List scenarios]

## Success Metrics
[List success criteria]
```

### Complete Skill Template

See `.claude/skills/frontend-design.md` and `.claude/skills/api-design.md` in this demo for complete examples.

## Real-World Skill Creation Workflow

### Week 1: Discovery
1. Identify domain (choose something you know well)
2. Extract 5-7 core principles
3. Collect examples (good and bad)
4. Write first draft

### Week 2: Refinement
1. Get feedback: "Does this match your real-world experience?"
2. Update principles based on feedback
3. Add more examples
4. Create before/after comparison

### Week 3: Testing
1. Use the skill with Claude 2-3 times
2. Document what worked and what didn't
3. Update skill file based on results
4. Create the final version

### Week 4: Documentation
1. Write CLAUDE.md (how to use the skill)
2. Write README.md (context and overview)
3. Create folders and organize examples
4. Version control: commit to repository

## Advanced: Composing Multiple Skills

Skills work together. Example:

```
Ask Claude: "Apply frontend-design and api-design skills to build a dashboard"
```

Claude will:
1. Create a beautiful UI using frontend-design principles
2. Build a clean API using api-design principles
3. Integrate them together

The skill acts as guardrails, preventing both generic UI and messy APIs.

## Sharing Your Skills

Once you've created and tested a skill:

```
1. Place in .claude/skills/ folder
2. Include README explaining the skill
3. Share with your team
4. Iterate based on feedback
5. Version and maintain over time
```

## Key Principles of Effective Skills

1. **Specificity**: Address a specific domain, not everything
2. **Clarity**: Use concrete language, not vague concepts
3. **Examples**: Every principle needs a code/design example
4. **Testing**: Verify the skill works as intended
5. **Iteration**: Skills improve over time
6. **Documentation**: Include when, why, and how to use
7. **Composability**: Works alongside other skills

## Conclusion

Skills are how you scale expertise. By encoding your knowledge in skill files, you create guardrails that help Claude produce consistently excellent output.

Start simple. Choose one domain. Extract 5-7 principles. Create examples. Test with Claude. Iterate.

The skills you create today become the foundation for your AI-assisted development tomorrow.

---

**Next Steps:**
1. Read `.claude/skills/api-design.md` to see a complete, real example
2. Examine the before/after comparison in `examples/api-before/` and `examples/api-after/`
3. Create your own skill following this guide
4. Test it with Claude
5. Share with your team
