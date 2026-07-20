# Next.js Auth Middleware Prompt

## The Prompt Used (with Context7)

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

## What This Demonstrates

This example shows how Context7 ensures Claude has access to:
- The correct `middleware.ts` file structure (not older patterns)
- Current Next.js 15 Edge Runtime APIs
- Modern request/response handling with `next/server`
- Proper routing patterns for App Router
- Current best practices for authentication

Without Context7, Claude might suggest:
- Outdated middleware patterns from older Next.js versions
- Deprecated API usage
- Patterns that don't work with App Router

With Context7, the generated code works immediately with Next.js 15.
