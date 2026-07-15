# Claude Code Power User Setup

You've mastered the basics. Now let's unlock the advanced features that separate casual users from power users. This guide covers five critical areas: memory management, automation hooks, workflow optimization, parallel sessions, and configuration.

## 1. Memory & Context: CLAUDE.md Hierarchy

Claude Code reads context from `.claude/CLAUDE.md` files at multiple levels, merging them from most general to most specific:

1. **Home Directory** (`~/.claude/CLAUDE.md`)
   - Organization-wide defaults: your coding standards, team norms, preferred libraries
   - Examples: "We use Jest for testing", "All code comments in English", "Prefer functional patterns"

2. **Project Root** (`.claude/CLAUDE.md`)
   - Project-specific context: stack, architecture, quality bar, known issues
   - Examples: "This is a Next.js + Postgres monorepo", "Database migrations in /migrations", "Feature flags in config.json"

3. **Nested Directories** (`.claude/CLAUDE.md` in subdirectories)
   - Feature or module-specific context
   - Examples: In `src/components/.claude/CLAUDE.md`: "All components use TypeScript, Tailwind CSS, Storybook"

**Claude Code reads all three, with nested directories overriding parent levels.** This layering lets you be specific where needed without repeating yourself.

### Bootstrap with `/init`

When starting a new project, don't manually create CLAUDE.md from scratch. Use:

```
/init
```

Claude Code will:
1. Analyze your project structure
2. Detect your stack (dependencies, file patterns, configs)
3. Generate an appropriate `.claude/CLAUDE.md` file
4. Ask if you want to customize it

This saves 10 minutes and ensures good structure from the start.

### Keep CLAUDE.md Lean & Fresh

CLAUDE.md grows over time. Prune it regularly:

- **Remove obsolete info** — "We used to use webpack, now we use Vite" → delete the webpack section
- **Archive old decisions** — Move "Evaluated libraries X, Y, Z; chose Z" to a separate `DECISIONS.md` if it's long
- **Update quality bars** — "Target performance: 50ms First Contentful Paint" might need updating

A lean CLAUDE.md (under 50 lines) is often better than a comprehensive one. It forces you to capture only what matters.

### Multi-Agent Memory: AGENTS.md

For projects where multiple Claude Code sessions collaborate, use `.claude/AGENTS.md`:

```yaml
# Active Sessions

## Agent A: Backend API Development
- Task: Implement user authentication
- Status: In progress, working on /api/auth
- Context: See src/backend/.claude/CLAUDE.md

## Agent B: Frontend Components
- Task: Build dashboard UI
- Status: Blocked on API schema
- Context: See src/frontend/.claude/CLAUDE.md
```

Each agent reads AGENTS.md to understand what others are doing, preventing conflicts and enabling coordination.

---

## 2. Hooks: Automation Triggers

Claude Code hooks are like GitHub Actions but for your local workflow. They're automation rules that fire before/after specific events.

### PreCommit Hooks (Lint & Format)

```json
{
  "PreCommit": [
    {
      "matcher": "*.ts",
      "command": "npx eslint --fix ${file} && npx prettier --write ${file}"
    },
    {
      "matcher": "*.tsx",
      "command": "npx eslint --fix ${file} && npx prettier --write ${file}"
    },
    {
      "matcher": "*.json",
      "command": "npx prettier --write ${file}"
    }
  ]
}
```

Every time Claude Code creates or modifies a TypeScript file, these hooks run automatically. No manual linting needed.

### PostFileWrite Hooks (Auto-Test)

```json
{
  "PostFileWrite": [
    {
      "matcher": "src/**/*.test.ts",
      "command": "npx jest --findRelatedTests ${file}"
    }
  ]
}
```

When a test file is written, run it immediately. Catch bugs before you even review the code.

### Notification Hooks (Desktop Alerts)

```json
{
  "OnTaskComplete": [
    {
      "command": "osascript -e 'display notification \"Build complete\" with title \"Claude Code\"'"
    }
  ]
}
```

Get a desktop notification when a long-running task finishes.

### Example: Complete hooks.json

See `.claude/hooks.json` in this directory for a production-ready example.

---

## 3. Slash Commands & Workflow

Claude Code includes built-in slash commands. Master these for 10x productivity:

### `/compact`
Summarize and compress the current conversation. Use when context gets too long:
```
/compact
```
Claude Code will create a summary of what's been done and reset context, keeping you under token limits on long sessions.

### `/clear`
Start fresh. Clears all context in the current session:
```
/clear
```
Useful when switching projects or starting a new task.

### `/model`
Switch between Claude models for different tasks:
```
/model sonnet
```
Use Sonnet for quick tasks (faster output, lower cost). Use Opus for complex reasoning:
```
/model opus
```

### `/cost`
View token usage for the session:
```
/cost
```
Helps you track spend and optimize expensive operations.

### Custom Slash Commands

Create reusable commands in `.claude/commands/`:

**File**: `.claude/commands/review.md`
```markdown
# /review

Review the current git diff for:
1. Security vulnerabilities
2. Performance issues
3. Missing error handling
4. Test coverage gaps

Format findings as a prioritized list with severity ratings.
```

Now you can use `/review` and Claude Code will run that command. Great for code reviews, testing protocols, documentation checks, etc.

See `.claude/commands/review.md` in this directory for a real example.

---

## 4. Subagents & Parallel Sessions

For large projects, run multiple Claude Code instances in parallel:

### Scenario: Frontend + Backend Development

**Terminal 1** (Frontend Agent):
```bash
claude -p "Build the React dashboard component for the analytics page"
```

**Terminal 2** (Backend Agent):
```bash
claude -p "Implement the /api/analytics endpoint with caching"
```

Both agents can run simultaneously. They read the shared `.claude/CLAUDE.md` and `AGENTS.md` to stay coordinated.

**Note**: Subagents and multi-agent patterns are a preview of Chapter 4 material. We'll explore agentic workflows and coordination strategies in depth there. For now, know that Claude Code supports these patterns natively — you can leverage them when working on larger systems.

### Using the Task Tool for Delegation

Inside Claude Code, delegate work to subagents:

```
Use the Task tool to delegate the following to a subagent:
- Build unit tests for the auth module
- Run the test suite and report coverage gaps
- Return a summary of test results
```

Claude Code will spawn a new session (if needed) and handle the delegation.

### Headless Mode for CI/CD

Run Claude Code non-interactively in your CI/CD pipeline:

```bash
claude -p "Run the test suite and report results" --output-format stream-json
```

Perfect for:
- Automated testing on every commit
- Generating reports
- Running code quality checks before deployment

---

## 5. Settings That Matter: .claude/settings.json

Project-level configuration lives in `.claude/settings.json`:

```json
{
  "model": "claude-opus-4-6",
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run lint)",
      "Bash(npm run dev)",
      "Bash(git commit)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)",
      "Bash(npm publish)"
    ]
  },
  "context": {
    "maxTokens": 100000,
    "autoCompact": true
  }
}
```

### Key Settings

- **model** — Force a specific Claude model for this project (useful for AI-heavy projects that benefit from Opus)
- **permissions.allow** — Whitelist specific commands Claude Code can run (fail-safe: if allow list exists, only these run)
- **permissions.deny** — Blacklist dangerous commands (rm, force push, npm publish)
- **context.maxTokens** — Cap context size to avoid expensive runs
- **context.autoCompact** — Automatically compress context when approaching token limits

### Pro Tip: Deny List for Safety

Always use a deny list for destructive operations:

```json
{
  "permissions": {
    "deny": [
      "Bash(rm -rf *)",
      "Bash(rm -rf /)",
      "Bash(git reset --hard)",
      "Bash(git clean -fd)",
      "Bash(npm publish)"
    ]
  }
}
```

See `.claude/settings.json` in this directory for a production-ready example.

---

## Putting It All Together

A power user's workflow looks like:

1. **Project start**: Run `/init` to scaffold `.claude/CLAUDE.md`
2. **Configure**: Set up `.claude/hooks.json` (linting, testing), `.claude/settings.json` (permissions), and custom commands in `.claude/commands/`
3. **Context setup**: Write a clear `.claude/CLAUDE.md` (quality bar, stack, decisions)
4. **Advanced workflows**: Give Claude Code a spec; let it build using advanced vibe coding patterns
5. **Iterate**: Use `/model sonnet` for quick refinements, `/review` for QA, `/cost` to track spend
6. **Scale**: Spin up parallel agents for large tasks (covered in depth in Chapter 4)

This setup turns Claude Code from a helpful assistant into a true development partner.
