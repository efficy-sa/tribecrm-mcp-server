# Troubleshooting Guide

## Common Issues

### Authentication Errors

**Problem:** `Authentication failed` error

**Solutions:**
1. Verify your credentials in `.env`:
   - Check `TRIBECRM_API_URL` is correct
   - Verify `TRIBECRM_CLIENT_ID` is valid
   - Verify `TRIBECRM_CLIENT_SECRET` is correct
2. Ensure the API URL includes the protocol (https://)
3. Check if your credentials have expired
4. Verify network connectivity to the API

### Entity Not Found

**Problem:** `Entity not found` error

**Solutions:**
1. Verify the entity ID is correct
2. Check if you have permission to access the entity
3. Ensure the entity type is spelled correctly (case-sensitive)
4. Confirm the entity exists in TribeCRM

### Connection Timeout

**Problem:** Requests timing out

**Solutions:**
1. Check your network connection
2. Verify the API URL is accessible
3. Check if there are any firewall rules blocking the connection
4. Try increasing the timeout in `src/client.ts`

### Invalid Tool Parameters

**Problem:** `Invalid parameters` error

**Solutions:**
1. Ensure all required parameters are provided
2. Check parameter types match the schema
3. Verify JSON formatting for complex objects
4. Review the tool documentation in README.md

### MCP Server Not Responding

**Problem:** Server starts but doesn't respond to requests

**Solutions:**
1. Check server logs for errors
2. Verify the server is properly configured in your MCP client
3. Ensure the build is up to date: `npm run build`
4. Try restarting the MCP client

### TypeScript Build Errors

**Problem:** Build fails with TypeScript errors

**Solutions:**
1. Ensure you're using Node.js 18 or higher
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clear the build cache: `rm -rf dist`
4. Check for syntax errors in your changes

## Debugging

### Enable Verbose Logging

Add console.log statements in `src/index.ts` to debug:

```typescript
console.error('Debug: Tool called:', name);
console.error('Debug: Arguments:', JSON.stringify(args));
```

### Test API Connectivity

Test your API connection with curl:

```bash
curl -X POST https://your-api-url.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_ID&client_secret=YOUR_SECRET"
```

### Check MCP Client Configuration

Verify your MCP client configuration (e.g., in Claude Desktop):

```json
{
  "mcpServers": {
    "tribecrm": {
      "command": "node",
      "args": ["/absolute/path/to/tribecrm-mcp-server/dist/index.js"],
      "env": {
        "TRIBECRM_API_URL": "your-url",
        "TRIBECRM_CLIENT_ID": "your-id",
        "TRIBECRM_CLIENT_SECRET": "your-secret"
      }
    }
  }
}
```

## Getting Help

If you're still experiencing issues:

1. Check the [GitHub Issues](https://github.com/jnorsa-efficy/tribecrm-mcp-server/issues)
2. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Relevant logs (remove sensitive information)
