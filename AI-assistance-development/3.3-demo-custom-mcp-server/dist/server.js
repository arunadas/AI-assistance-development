/**
 * Chapter 2.2: Building Custom Integrations
 *
 * A custom MCP server that exposes internal tools to AI coding agents.
 * This demonstrates three high-ROI use cases:
 *   1. Internal API querying (feature flags, user data)
 *   2. Monitoring integration (error rates, health)
 *   3. Documentation lookup
 *
 * To use with Claude Code, add to your MCP config:
 *   { "command": "node", "args": ["dist/server.js"] }
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
const server = new McpServer({
    name: 'internal-tools',
    version: '1.0.0',
});
// --- Simulated internal data ---
const featureFlags = {
    'new-checkout': { enabled: true, rolloutPercent: 50, description: 'New checkout flow with Stripe Elements' },
    'dark-mode': { enabled: false, rolloutPercent: 0, description: 'Dark mode UI theme' },
    'ai-recommendations': { enabled: true, rolloutPercent: 100, description: 'AI-powered product recommendations' },
};
const serviceHealth = {
    'api-gateway': { status: 'healthy', latencyMs: 45, errorRate: 0.01 },
    'payment-service': { status: 'healthy', latencyMs: 120, errorRate: 0.02 },
    'notification-service': { status: 'degraded', latencyMs: 890, errorRate: 0.15 },
};
// --- Tool 1: Feature Flag Reader ---
server.registerTool('get-feature-flag', {
    description: 'Get the status of a feature flag by name',
    inputSchema: { flagName: z.string().describe('The feature flag name (e.g., "new-checkout")') },
}, async ({ flagName }) => {
    const flag = featureFlags[flagName];
    if (!flag) {
        return { content: [{ type: 'text', text: `Feature flag "${flagName}" not found. Available: ${Object.keys(featureFlags).join(', ')}` }] };
    }
    return {
        content: [{ type: 'text', text: JSON.stringify(flag, null, 2) }],
    };
});
// --- Tool 2: Service Health Monitor ---
server.registerTool('check-service-health', {
    description: 'Check the health status of internal services',
    inputSchema: { serviceName: z.string().optional().describe('Specific service name, or omit for all services') },
}, async ({ serviceName }) => {
    if (serviceName) {
        const health = serviceHealth[serviceName];
        if (!health) {
            return { content: [{ type: 'text', text: `Service "${serviceName}" not found. Available: ${Object.keys(serviceHealth).join(', ')}` }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify({ [serviceName]: health }, null, 2) }] };
    }
    return { content: [{ type: 'text', text: JSON.stringify(serviceHealth, null, 2) }] };
});
// --- Tool 3: List All Feature Flags ---
server.registerTool('list-feature-flags', {
    description: 'List all available feature flags and their statuses',
    inputSchema: {},
}, async () => {
    return { content: [{ type: 'text', text: JSON.stringify(featureFlags, null, 2) }] };
});
// --- Start the server ---
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch(console.error);
