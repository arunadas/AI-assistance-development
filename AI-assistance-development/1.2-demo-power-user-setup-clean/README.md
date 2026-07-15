# 1.2 Demo: Power User Setup (Clean Starting Point)

This is the **starting point** for the Power User Setup demo. You'll implement an Express.js application while demonstrating Claude Code's configuration and automation capabilities.

## What You'll Build

Implement `src/app.ts` with the following endpoints:

- `GET /health` — Return server health status
- `GET /features` — Return list of feature flags
- `POST /tasks` — Create a new task
- `GET /tasks/:id` — Retrieve a task by ID

And implement corresponding tests in `src/app.test.ts`.

## Key Configuration Features to Explore

This project includes powerful Claude Code configurations in the `.claude/` directory that you should examine:

### 1. Hooks (`.claude/hooks.json`)
- **PreCommit**: Automatically lint and format TypeScript files before commits
- **PostFileWrite**: Run tests when test files are modified
- **OnTaskComplete**: Desktop notifications when builds complete

### 2. Settings (`.claude/settings.json`)
- **Model Selection**: Uses `claude-opus-4-6` for maximum capability
- **Permission Rules**: Explicitly allows safe commands (npm, git) and denies dangerous ones
- **Context Management**: Automatic compaction when token count gets high

### 3. Custom Commands (`.claude/commands/`)
- Extend Claude Code with project-specific shortcuts

## Getting Started

1. Review the configuration files in `.claude/`
2. Implement the endpoints in `src/app.ts`
3. Implement tests in `src/app.test.ts`
4. Run: `npm test` — watch the PostFileWrite hook automatically run tests
5. Commit changes — watch the PreCommit hook automatically format code

## What's Different from the Complete Version

The complete version (1.2-demo-power-user-setup) includes fully implemented `src/app.ts` and `src/app.test.ts` files. This clean version provides stubs with TODO comments so you experience the full development workflow with hooks and automation.

## Key Learning Goals

- Understand how hooks automate code quality (linting, testing)
- Learn how to configure Claude Code permissions
- See how settings enable better AI assistance with the right model
- Experience the power of context management for large projects

---

This demo teaches the importance of **configuration as enablement**: the right settings transform Claude Code from a simple assistant into a trusted team member with clear boundaries and responsibilities.
