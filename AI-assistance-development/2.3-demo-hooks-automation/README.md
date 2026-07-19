# Custom Slash Commands & Workflow Automation

## What Are Slash Commands?

**Slash commands** are custom markdown files in `.claude/commands/` that turn repeated prompts into single, reliable actions. If you type the same prompt twice, it should probably become a command.

Think of them as:
- **Macros** for your AI workflow
- **Team-shareable** prompt templates
- **Deterministic** multi-step workflows
- **One-word shortcuts** for complex tasks

### Commands vs. Skills vs. Hooks

| Concept | Purpose | Example |
|---------|---------|---------|
| **Skills** | What Claude knows about your codebase | "Use semantic HTML in components" |
| **Hooks** | Automatic triggers on tool actions | "Auto-lint after writing code" |
| **Commands** | Explicit workflows you invoke by name | "/verify — run tests + lint + summarize" |

Commands are the **workflow layer** that turns multi-step processes into repeatable actions.

---

## Three Practical Commands

### Command 1: /verify

Run tests and lint, then summarize results.

**File:** `.claude/commands/verify.md`

**What it does:**
1. Runs `npm test` and captures output
2. Runs `npm run lint` and captures output
3. Outputs a structured summary (pass/fail, counts, suggested fixes)

**When to use:** Before committing, after a refactor, or as a quick sanity check.

---

### Command 2: /review

Structured code review with severity levels.

**File:** `.claude/commands/review.md`

**What it does:**
1. Reads all source files
2. Checks for security issues, performance problems, and code style
3. Outputs a table with severity (HIGH/MEDIUM/LOW), file paths, and suggestions

**When to use:** Before opening a PR, onboarding to a new codebase, or periodic quality checks.

---

### Command 3: /scaffold

Generate a new feature module with route and test files.

**File:** `.claude/commands/scaffold.md`

**What it does:**
1. Reads existing code patterns from server.ts
2. Creates a new route file matching the existing structure
3. Creates a matching test file
4. Shows how to wire it into the app

**When to use:** Starting any new feature — ensures consistent patterns across the codebase.

---

## Writing Good Commands

### Three Principles

1. **Explicit steps** — Don't say "review the code." Say "check security, then performance, then style, then output a summary with severity levels."

2. **Structured output** — Ask for tables, severity levels, pass/fail summaries. Consistent format means you can scan results quickly.

3. **Clear success criteria** — Tell Claude what "done" looks like. For /verify: "all tests pass and zero lint errors."

### Command File Structure

```markdown
# /command-name $ARGUMENTS

Description of what this command does.

## Steps

1. First action
2. Second action
3. Output format specification

## Success Criteria

What "done" looks like.
```

---

## Demo: Running the Example Project

This demo includes a simple Express server (`src/example-project/server.ts`) with three custom slash commands.

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Open in Claude Code:**
   ```bash
   claude
   ```

3. **Try the commands:**
   - Type `/verify` — runs tests + lint and summarizes results
   - Type `/review` — structured code review of the project
   - Type `/scaffold tags` — generates a new tags feature module

---

## Sharing Commands Across Your Team

Commands are just markdown files in your repo. Commit them and everyone gets the same workflows:

```
.claude/
└── commands/
    ├── verify.md      # Test + lint pipeline
    ├── review.md      # Code review checklist
    └── scaffold.md    # Feature generator
```

Treat commands like code: review them, version them, evolve them over time.

---

## Next Steps

1. **Start with /verify** — test + lint is universally useful
2. **Add /review** — consistent code reviews across the team
3. **Create project-specific commands** — /scaffold, /release, /deploy-check
4. **Commit to repo** — share with your team
5. **Iterate** — refine commands based on real usage
