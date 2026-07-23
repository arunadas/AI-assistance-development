# 2.2 Demo: MCP Server (Clean Starting Point)

This is the **starting point** for the MCP Server demo. You'll build a Model Context Protocol server that exposes internal tools to Claude Code.

## What You'll Build

Implement `src/server.ts` with three high-ROI tools:

1. **Feature Flag Reader** — Get feature flag status and metadata
   - Tool: `get-feature-flag`
   - Input: Feature flag name (string)
   - Output: Flag status, rollout percentage, description

2. **Service Health Monitor** — Check health of internal services
   - Tool: `check-service-health`
   - Input: Optional service name (omit for all)
   - Output: Service status, latency, error rate

3. **API Documentation Lookup** — Find endpoint details
   - Tool: `list-api-endpoints` or `get-endpoint-docs`
   - Input: Optional endpoint filter
   - Output: Available endpoints with methods and descriptions

## How MCP Servers Work

An MCP server:
- Runs as a subprocess (Node.js process)
- Communicates with Claude Code via stdio
- Exposes "tools" that Claude can call
- Each tool has a name, description, and input schema

## Getting Started

1. Review `src/server.ts` — note the TODO comments
2. Implement the three tool handlers using `server.tool()`
3. Add mock data to `featureFlags`, `serviceHealth`, and `apiDocumentation`
4. Ask Claude Code to complete the implementation

## Running the Server

```bash
npm install
npm run build
npm start
```

## Integrating with Claude Code

Add this to your Claude Code settings (`.claude/settings.json` or via CLI config):

```json
{
  "mcp": {
    "servers": {
      "internal-tools": {
        "command": "node",
        "args": ["dist/server.js"]
      }
    }
  }
}
```

## Server Structure

```
McpServer
├── Tool 1: get-feature-flag
│   ├── Input: { flagName: string }
│   └── Output: { enabled, rolloutPercent, description }
├── Tool 2: check-service-health
│   ├── Input: { serviceName?: string }
│   └── Output: { status, latencyMs, errorRate }
└── Tool 3: list-api-endpoints
    ├── Input: (none or filter)
    └── Output: List of endpoints with methods & descriptions
```

## Key Learning Goals

- Understand how MCP servers extend Claude Code's capabilities
- Learn to build tools that expose internal systems safely
- See how well-designed tools enable AI agents to be more helpful
- Experience the power of connecting AI to your infrastructure

## What's Different from the Complete Version

The complete version (2.2-demo-mcp-server) has fully implemented `src/server.ts` with all three tools, mock data, and proper schemas. This clean version provides a stub with TODO comments.

## Best Practices

- **Tool Naming**: Use kebab-case for tool names
- **Descriptions**: Clear, concise descriptions help Claude understand what each tool does
- **Schemas**: Use Zod for input validation and TypeScript inference
- **Error Handling**: Return user-friendly errors, not stack traces
- **Performance**: Keep tool latency low; cache expensive operations
- **Security**: Never expose sensitive data; validate all inputs

---

This demo teaches that **MCP servers are force multipliers for AI agents**. By exposing the right tools, you can make Claude Code dramatically more capable within your specific context.
