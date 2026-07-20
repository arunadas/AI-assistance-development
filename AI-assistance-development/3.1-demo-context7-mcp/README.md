# 3.1: Context7 MCP Demo

## What is Context7?

Context7 is an MCP (Model Context Protocol) server that automatically pulls the latest library documentation and framework APIs into your Claude Code session. It solves a fundamental problem in AI-assisted development: **outdated API hallucinations**.

### The Problem It Solves

When you ask Claude to write code for a library, Claude's knowledge is frozen at the training cutoff date. For fast-moving libraries like Next.js, React, Supabase, or Astro, this means:

- Claude may suggest deprecated APIs
- Claude may miss new features released after training
- Claude may recommend patterns that are no longer best practice
- Claude may suggest code that simply won't work with the latest version

For example:
- Next.js 15 introduced significant changes to middleware handling and app router patterns
- Supabase's realtime API was completely rewritten
- React 19 introduced new hooks and server component patterns
- Tailwind CSS adds new utilities in every release

### How Context7 Fixes This

Context7 automatically:
1. Identifies which libraries your prompt mentions
2. Fetches the latest official documentation for those libraries
3. Injects this documentation into Claude's context
4. Claude writes code using the current API, not the training-data API

Result: Always-current, production-ready code.

## Why It Matters

For any production project, outdated code is worse than no code. You'd rather Claude say "I don't know" than confidently suggest code that doesn't work. Context7 ensures Claude always has the right information.

## How to Set It Up

### 1. Create the MCP Configuration

Create or update `.claude/settings.json` in your project:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### 2. Install Dependencies (Optional)

Context7 is installed on-demand via npx. No need to add it to `package.json`. However, for offline or enterprise setups, you can pre-install:

```bash
npm install @upstash/context7-mcp
```

### 3. Start Claude Code

When you start Claude Code in this directory, it will:
1. Read `.claude/settings.json`
2. Automatically start the Context7 MCP server
3. Make the latest documentation available to Claude

### 4. Use in Prompts

When you ask Claude to write code, mention the library name in your prompt. Context7 automatically fetches the docs:

```
Using context7, create a Next.js 15 middleware that checks JWT in cookies.
```

Or just be explicit:
```
Create a Next.js middleware. Use context7 to get the latest API documentation.
```

## What's in This Demo

### Examples

1. **nextjs-auth/** — A Next.js 15 middleware example using Context7
   - Shows modern Next.js patterns (App Router, middleware.ts, Edge Runtime)
   - Includes the exact prompt used
   - Shows JWT extraction from cookies

2. **supabase-realtime/** — A Supabase realtime subscription example
   - Shows current Supabase realtime channel API
   - Demonstrates reactive chat room functionality
   - Uses TypeScript for type safety

### Files

- `.claude/settings.json` — The MCP configuration
- `examples/*/PROMPT.md` — The exact prompts used to generate each example
- `DEMO_WALKTHROUGH.md` — Step-by-step instructions to run the demo

## Quick Start

1. Copy `.claude/settings.json` to your project root
2. Start Claude Code: `npx claude`
3. In Claude, paste a PROMPT.md from one of the examples
4. Claude will auto-fetch the latest docs and generate working code
5. Compare the output to what's in `examples/*/`

## The Clean Version

`3.1-demo-context7-mcp-clean/` contains:
- Just the README
- The `.claude/settings.json` template
- The PROMPT.md files
- No example outputs (so you can generate them fresh)

Perfect for following along with the walkthrough.

## Key Takeaways

- Context7 = Fresh documentation in every Claude session
- No more "that API doesn't exist" errors
- Works with any library that publishes documentation
- Just add the MCP config and mention the library in your prompt
- Transformative for keeping AI-generated code current
