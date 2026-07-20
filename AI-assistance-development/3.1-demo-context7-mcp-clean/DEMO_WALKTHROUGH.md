# Context7 MCP Demo Walkthrough

Follow this step-by-step guide to see Context7 in action.

## Step 1: Set Up the Project

Start fresh with the clean version:

```bash
cp -r 3.1-demo-context7-mcp-clean my-context7-demo
cd my-context7-demo
```

## Step 2: Verify MCP Configuration

Check that `.claude/settings.json` exists and contains:

```bash
cat .claude/settings.json
```

You should see:

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

This configuration tells Claude Code to automatically start the Context7 MCP server when you begin a session.

## Step 3: Start Claude Code

Start Claude in this directory:

```bash
npx claude
```

Claude will automatically:
1. Read `.claude/settings.json`
2. Start the Context7 MCP server in the background
3. Initialize your session with documentation-fetching capability

## Step 4: Generate the Next.js Auth Middleware

In Claude, open `examples/nextjs-auth/PROMPT.md`:

```bash
cat examples/nextjs-auth/PROMPT.md
```

Copy the prompt from the "The Prompt Used" section. In Claude, paste it:

```
Using context7 to fetch the latest Next.js 15 documentation:

Create a Next.js 15 middleware (middleware.ts) that:
1. Checks for a JWT token in request cookies (named 'auth_token')
2. If the token exists and is valid, allow the request to proceed
3. If the token is missing or invalid, redirect to /login
4. Should run on all routes except /login and /api/*
5. Use next/server for EdgeRuntime compatibility
6. Include basic JWT verification (check expiration via 'exp' claim)
7. TypeScript with proper types
```

Watch what happens:

1. Claude processes your request
2. Context7 detects "Next.js 15" in your prompt
3. Context7 automatically fetches the latest Next.js 15 documentation
4. Claude uses that fresh documentation to generate code
5. The code works with the current Next.js 15 APIs (not old ones)

Claude should generate code using current Next.js 15 APIs.

## Step 5: Review the Generated Middleware

Key things to look for:
- It uses `next/server` imports (current API)
- It uses `EdgeRuntime` config (current best practice)
- The JWT verification pattern matches current Next.js 15 best practices
- The matcher config uses modern patterns

## Step 6: Generate the Supabase Realtime Chat

Now open `examples/supabase-realtime/PROMPT.md`:

```bash
cat examples/supabase-realtime/PROMPT.md
```

Copy and paste the prompt into Claude. This will trigger Context7 to fetch the latest Supabase v2 documentation.

Claude should generate TypeScript code that:
- Uses the Channels API (not deprecated methods)
- Includes proper TypeScript types
- Shows modern Supabase connection patterns
- Handles realtime events correctly

## Step 7: Observe Context7 in Action

Notice the difference:

**Without Context7:**
- Claude might suggest `RealtimeSubscription` (deprecated)
- Might use old initialization patterns
- Code might not compile with current Supabase
- You'd need to manually update the code

**With Context7:**
- Claude automatically knows the current Channels API
- Uses modern patterns
- Code works immediately
- No guesswork or manual corrections needed

## Step 8: Try Your Own Library

Now try Context7 with any library you work with. In Claude, ask:

```
Using context7, create a React 19 component that uses the new useOptimistic hook.
```

Or:

```
Using context7, write Astro 4 code that uses the new View Transitions API.
```

Context7 will fetch the latest docs for:
- React 19
- Astro 4
- Any other library you mention

And Claude will generate working code against current APIs.

## Key Insights

1. **Automatic Documentation Fetching** — You don't manually fetch docs. Context7 does it automatically based on your prompt.

2. **Always Current** — Even if a library released a major update yesterday, Context7 will fetch the latest docs.

3. **No More Hallucinations** — Claude won't suggest outdated APIs because it has fresh documentation.

4. **Works with Any Library** — Context7 can fetch docs for any library with published documentation.

5. **Seamless Integration** — Just add one line to `.claude/settings.json` and you're done.

## Troubleshooting

### Context7 Not Starting?

Check that Node.js and npm are installed:

```bash
node --version
npm --version
```

Verify `.claude/settings.json` exists:

```bash
ls -la .claude/settings.json
```

### Claude Not Finding Docs?

Make sure you mention the library explicitly in your prompt:

- ✅ "Create a Next.js 15 middleware..."
- ❌ "Create a middleware..." (Context7 won't know which library)

## Next Steps

Now that you understand Context7:

1. Add it to your real projects' `.claude/settings.json`
2. Use it whenever you ask Claude to write code for modern libraries
3. Notice how the code quality improves (no outdated APIs)
4. Share with your team — Context7 makes everyone more productive

This is one of the most powerful MCP tools for day-to-day AI-assisted development!
