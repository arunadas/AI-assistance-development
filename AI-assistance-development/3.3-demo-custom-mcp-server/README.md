# MCP Servers — Extending Your Agent

## What is MCP?

**MCP** (Model Context Protocol) is an open standard for connecting AI agents to external systems. It lets Claude Code talk to your internal APIs, databases, monitoring systems, and services — making your agent more powerful and connected.

Think of it this way:
- **Claude Code alone** can work with files and run terminal commands
- **MCP servers** give Claude Code superpowers: access to your company's real-time data, systems, and business logic
- **Skills** (from Chapter 2.1) teach Claude HOW to work
- **MCP servers** teach Claude WHAT to access

## Why MCP Matters

Without MCP: Claude writes code blindly. "I'll create a payment flow, but I don't know your current feature flags or payment provider."

With MCP: Claude is context-aware. "Let me check the payment-service health, see if new-checkout is enabled, then generate the right integration code."

### High-ROI Use Cases

1. **Feature Flags** — Check rollout status before generating code for new features
2. **Service Health** — Verify API availability before writing integrations
3. **Documentation Lookup** — Access internal docs, API specs, runbooks
4. **Database Access** — Query schema, see production data samples
5. **Monitoring** — Check error rates, latency, recent deployments
6. **CI/CD** — Trigger builds, check test results, deploy
7. **Slack/GitHub** — Access team context, recent issues, pull request history

---

## How MCP Works

```
Your Project (Claude Code)
       ↓
Claude Agent
       ↓
    MCP Protocol
       ↓
MCP Server (your custom code)
       ↓
Your Internal Systems (APIs, DB, monitoring, Slack, etc.)
```

The MCP server acts as a bridge: it defines **tools** that Claude can call.

---

## Building an MCP Server: Three Tools

This demo server (`src/server.ts`) exposes three high-ROI tools:

### Tool 1: Get Feature Flag Status

```
Claude asks: "What's the status of the new-checkout flag?"
MCP server: Returns { enabled: true, rolloutPercent: 50, description: "..." }
Claude: "It's enabled for 50% of users. I'll generate code that respects the feature flag."
```

**Real use case:** Before building a checkout component, check if the feature is active.

### Tool 2: Check Service Health

```
Claude asks: "Is the payment-service healthy?"
MCP server: Returns { status: "healthy", latencyMs: 120, errorRate: 0.02 }
Claude: "Service is healthy but slightly slow. I'll add error boundaries and timeouts."
```

**Real use case:** Before integrating a service, verify it's not degraded.

### Tool 3: List Feature Flags

```
Claude asks: "What feature flags exist?"
MCP server: Returns all flags with descriptions
Claude: "I see new-checkout (50%), dark-mode (disabled), and ai-recommendations (enabled). I'll generate code that checks these."
```

**Real use case:** Understand the full feature matrix before coding.

---

## Registering MCP Servers with Claude Code

MCP servers are registered in `.claude/settings.json`:

```json
{
  "mcp": [
    {
      "name": "internal-tools",
      "command": "node",
      "args": ["path/to/dist/server.js"],
      "env": {
        "DATABASE_URL": "postgres://...",
        "API_KEY": "sk-..."
      }
    }
  ]
}
```

**How it works:**
1. Claude Code reads `.claude/settings.json`
2. Starts the MCP server process (node dist/server.js)
3. Communicates via stdio (stdin/stdout)
4. Tools become available to Claude immediately

---

## Building Your Own MCP Server

### Minimal Structure

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'my-tools',
  version: '1.0.0',
});

// Define a tool
server.tool(
  'tool-name',
  'Tool description',
  { param: z.string().describe('Param description') },
  async ({ param }) => {
    return { content: [{ type: 'text', text: `Result for ${param}` }] };
  }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Key Concepts

- **Tool name:** Unique identifier (e.g., `get-feature-flag`)
- **Description:** What the tool does (Claude reads this)
- **Input schema:** Zod schema defining parameters
- **Handler function:** Async function that executes the tool
- **Output:** Always returns `{ content: [{ type: 'text', text: '...' }] }`

---

## Example: Feature Flag Tool

```typescript
server.tool(
  'get-feature-flag',
  'Get the status of a feature flag by name',
  { flagName: z.string().describe('The feature flag name') },
  async ({ flagName }) => {
    const flag = featureFlags[flagName];
    if (!flag) {
      return { content: [{ type: 'text', text: `Flag "${flagName}" not found` }] };
    }
    return { content: [{ type: 'text', text: JSON.stringify(flag, null, 2) }] };
  }
);
```

When Claude calls this tool:
1. Claude decides: "I need to check feature flags"
2. Claude calls: `get-feature-flag(flagName: 'new-checkout')`
3. MCP server executes the handler
4. Claude gets back the flag status
5. Claude uses the data to inform code generation

---

## Tools in This Demo Server

### get-feature-flag(flagName: string)
Returns the configuration of a single feature flag.

**Simulated data:**
- `new-checkout`: enabled, 50% rollout
- `dark-mode`: disabled
- `ai-recommendations`: enabled, 100% rollout

### check-service-health(serviceName?: string)
Returns the health of internal services (latency, error rate, status).

**Simulated services:**
- `api-gateway`: healthy, 45ms latency
- `payment-service`: healthy, 120ms latency
- `notification-service`: degraded, 890ms latency, 15% errors

### list-feature-flags()
Lists all feature flags with descriptions.

---

## Running This Demo

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the server:**
   ```bash
   npm run build
   ```

3. **Start the server (for testing):**
   ```bash
   npm run start
   ```

4. **Register with Claude Code:**
   - Create `.claude/settings.json`:
     ```json
     {
       "mcp": [
         {
           "name": "internal-tools",
           "command": "node",
           "args": ["path/to/dist/server.js"]
         }
       ]
     }
     ```

5. **Use in Claude Code:**
   - Open a file in your project
   - Ask Claude: "Check if the new-checkout feature flag is enabled"
   - Claude will call your MCP tool automatically

---

## Advanced: Production MCP Servers

In production, MCP servers typically:

- **Connect to real databases** (PostgreSQL, MongoDB, etc.)
- **Call external APIs** (Stripe, DataDog, PagerDuty, Slack)
- **Implement authentication** (API keys, OAuth, etc.)
- **Cache results** to avoid rate limits
- **Handle errors gracefully** with meaningful messages
- **Log tool usage** for auditing

Example with real API:
```typescript
server.tool(
  'get-payment-methods',
  'Fetch payment methods from Stripe',
  { customerId: z.string() },
  async ({ customerId }) => {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
    });
    return { content: [{ type: 'text', text: JSON.stringify(paymentMethods, null, 2) }] };
  }
);
```

---

## Popular Community MCP Servers

- **GitHub MCP** — Access repos, issues, PRs, workflows
- **Slack MCP** — Send messages, query channels, look up docs
- **Stripe MCP** — Query customers, payments, disputes
- **Notion MCP** — Query/update databases, pages
- **PagerDuty MCP** — Check incidents, on-call schedule
- **DataDog MCP** — Query metrics, logs, alerts
- **Linear MCP** — Access issues, projects, documents

Install community servers: `npm install @modelcontextprotocol/server-[name]`

---

## Security Considerations

**Never expose secrets in MCP servers:**
- Use environment variables for API keys
- Validate all inputs (Claude can be tricked)
- Implement rate limiting
- Log sensitive operations
- Restrict MCP server access to safe operations only

**Good:** `read-only` tools (query feature flags, check health)
**Bad:** `destructive` tools without confirmation (delete database, trigger deployments)

---

## Composing with Skills

MCP servers + Skills create a complete agent system:

```
Feature Request: "Add dark mode support"

1. Claude's knowledge (Skills + CLAUDE.md)
   - How to structure React components
   - How to test components

2. Claude's context (MCP server)
   - Check: Is dark-mode feature flag enabled?
   - Check: What services depend on this?

3. Result: Claude generates code that's:
   - Respects feature flags (thanks to MCP)
   - Follows component patterns (thanks to Skills)
   - Well-tested (thanks to Skills)
   - Ready to deploy
```

---

## Next Steps

1. **Build an MCP server** for your internal systems (API, database, monitoring)
2. **Register it** in `.claude/settings.json`
3. **Test it** by asking Claude to use a tool
4. **Expand it** as you discover high-ROI use cases

MCP servers are how you give Claude Code access to your company's real systems and data.
