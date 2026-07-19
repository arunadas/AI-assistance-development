# 2.3 Demo: Hooks Automation (Clean Starting Point)

This is the **starting point** for the Hooks Automation demo. You'll configure Claude Code hooks to automate linting, testing, and safety checks.

## What You'll Build

Create `.claude/hooks.json` to automate:

1. **PreCommit Hooks** — Lint and format code before commits
   - ESLint TypeScript files
   - Prettier formatting
   - JSON and Markdown formatting

2. **PostFileWrite Hooks** — Run tests automatically when test files are saved
   - Jest for TypeScript tests
   - Coverage reports

3. **OnTaskComplete Hooks** — Notifications when builds finish
   - Desktop notifications
   - Build completion tracking

## Project Structure

```
.
├── src/
│   └── example-project/
│       ├── server.ts          (Express.js app with endpoints)
│       └── server.test.ts     (Jest tests)
├── package.json              (npm dependencies)
├── tsconfig.json             (TypeScript config)
├── jest.config.json          (Jest config)
├── .eslintrc.json            (ESLint config)
└── .claude/
    └── hooks.json            (TODO: Create this)
```

## Getting Started

1. Review the existing files to understand the project
2. Create `.claude/hooks.json` with hook definitions
3. Ask Claude Code to generate the hooks configuration
4. Test by:
   - Running `npm test` to verify setup
   - Creating a new git commit to test PreCommit hooks
   - Modifying a test file to trigger PostFileWrite hooks

## Hook Configuration Format

Each hook consists of:
- `matcher`: Glob pattern for files to match
- `command`: Shell command to run (${file} is substituted)
- `description`: What the hook does

### Example PreCommit Hook

```json
{
  "matcher": "*.ts",
  "command": "npx eslint --fix ${file} && npx prettier --write ${file}"
}
```

### Example PostFileWrite Hook

```json
{
  "matcher": "src/**/*.test.ts",
  "command": "npx jest --findRelatedTests ${file}"
}
```

## What Hooks Enable

- **Consistency**: All code follows the same standards automatically
- **Quality**: Tests and linting run without manual intervention
- **Speed**: Developers get feedback immediately
- **Reliability**: Broken code can't be committed
- **Transparency**: Hooks show what Claude Code is doing

## Key Learning Goals

- Understand how hooks automate code quality
- See how PreCommit hooks prevent bad commits
- Learn how PostFileWrite hooks enable continuous testing
- Experience automation as a trust mechanism

## What's Different from the Complete Version

The complete version (2.3-demo-hooks-automation) has a pre-configured `.claude/hooks.json` file. This clean version requires you to create it from scratch.

## Best Practices for Hooks

1. **Keep hooks fast** — Long-running hooks hurt developer experience
2. **Use glob patterns** — Match specific file types to avoid running unnecessary commands
3. **Provide feedback** — Hooks should show clear success/failure messages
4. **Chain commands** — Use `&&` to run multiple commands in sequence
5. **Add descriptions** — Explain what each hook does

## Example .claude/hooks.json

```json
{
  "PreCommit": [
    {
      "matcher": "*.ts",
      "command": "npx eslint --fix ${file} && npx prettier --write ${file}"
    },
    {
      "matcher": "*.json",
      "command": "npx prettier --write ${file}"
    }
  ],
  "PostFileWrite": [
    {
      "matcher": "src/**/*.test.ts",
      "command": "npx jest --findRelatedTests ${file}"
    }
  ]
}
```

---

This demo teaches that **automation is a form of governance**. By defining hooks, you establish team standards that are enforced automatically, not through code reviews or manual processes.
