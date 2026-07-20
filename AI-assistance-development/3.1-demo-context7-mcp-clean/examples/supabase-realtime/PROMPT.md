# Supabase Realtime Chat Prompt

## The Prompt Used (with Context7)

```
Using context7 to fetch the latest Supabase v2 documentation:

Create a TypeScript module (realtime-chat.ts) that:
1. Connects to Supabase using the SupabaseClient
2. Sets up a realtime subscription to a 'messages' table in a specific room/channel
3. Listens for INSERT, UPDATE, and DELETE events
4. Provides methods to:
   - subscribe(roomId: string, callback: (message) => void)
   - sendMessage(roomId: string, text: string, userId: string)
   - unsubscribe()
5. Include proper TypeScript types for Message objects
6. Handle connection errors gracefully
7. Use the current Supabase realtime Channels API (not the deprecated RealtimeClient)
```

## What This Demonstrates

Context7 ensures Claude knows about:
- The new Supabase Channels API (rewritten in 2023+)
- Current client initialization patterns
- Modern event subscription patterns
- Type-safe message handling
- Proper cleanup and unsubscription

Without Context7, Claude might suggest:
- Deprecated RealtimeSubscription patterns
- Old connection methods
- Outdated type definitions
- Code that won't work with current Supabase

With Context7, the code uses the current, recommended Supabase APIs.
