# TribeCRM MCP Server

[![npm version](https://img.shields.io/npm/v/@efficy/tribecrm-mcp-server)](https://www.npmjs.com/package/@efficy/tribecrm-mcp-server)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![MCP SDK](https://img.shields.io/badge/MCP%20SDK-1.0-green)](https://github.com/modelcontextprotocol)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Model Context Protocol (MCP) server for TribeCRM API integration. This server enables AI assistants like Claude to interact with TribeCRM entities, perform searches, and manage connectors.

## 🚀 Features

### Tools
- **Entity Management** (CRUD operations)
  - Create, read, update, and delete CRM entities
  - Support for contacts, companies, deals, activities, and more
- **Advanced Search & Query**
  - Search across entities with filters and pagination
  - Complex filter criteria support
- **Connector Management**
  - List available integration connectors
  - Get connector details and status

### Resources
- **Entity Type Definitions**: Access schema and field information for entity types
- **Dynamic Resources**: Entity data exposed as MCP resources for context

## 📋 Prerequisites

- Node.js 18 or higher
- TribeCRM API credentials (Client ID and Secret)
- Access to a TribeCRM instance

## 🔧 Installation

### Option 1: Using npx (Recommended)

No installation required! The server can be run directly using npx.

### Option 2: Local Development

```bash
git clone https://github.com/efficy-sa/tribecrm-mcp-server.git
cd tribecrm-mcp-server
npm install
npm run build
```

## ⚙️ Configuration

### Claude Desktop Configuration

Add to your Claude Desktop config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### Using npx (Recommended)

```json
{
  "mcpServers": {
    "tribecrm": {
      "command": "npx",
      "args": ["-y", "@efficy/tribecrm-mcp-server"],
      "env": {
        "TRIBECRM_API_URL": "https://api.tribecrm.nl",
        "TRIBECRM_AUTH_URL": "https://auth.tribecrm.nl",
        "TRIBECRM_CLIENT_ID": "your_client_id",
        "TRIBECRM_CLIENT_SECRET": "your_client_secret",
        "TRIBECRM_ORGANIZATION_ID": "your_org_id"
      }
    }
  }
}
```

#### Using Local Installation

```json
{
  "mcpServers": {
    "tribecrm": {
      "command": "node",
      "args": ["/absolute/path/to/tribecrm-mcp-server/dist/index.js"],
      "env": {
        "TRIBECRM_API_URL": "https://api.tribecrm.nl",
        "TRIBECRM_AUTH_URL": "https://auth.tribecrm.nl",
        "TRIBECRM_CLIENT_ID": "your_client_id",
        "TRIBECRM_CLIENT_SECRET": "your_client_secret",
        "TRIBECRM_ORGANIZATION_ID": "your_org_id"
      }
    }
  }
}
```

### Getting TribeCRM Credentials

1. Log in to your TribeCRM instance
2. Navigate to Settings > Integrations > OAuth2 Apps
3. Create a new OAuth2 application with "Service Account" type
4. Copy the Client ID and Client Secret
5. Add required scopes: `read write offline`

### Environment Variables

- `TRIBECRM_API_URL` (required): Your TribeCRM API URL (e.g., https://api.tribecrm.nl or https://api-staging.tribecrm.nl)
- `TRIBECRM_AUTH_URL` (required): Your TribeCRM OAuth2 authentication URL (e.g., https://auth.tribecrm.nl or https://auth-staging.tribecrm.nl)
- `TRIBECRM_CLIENT_ID` (required): OAuth2 Client ID
- `TRIBECRM_CLIENT_SECRET` (required): OAuth2 Client Secret
- `TRIBECRM_ORGANIZATION_ID` (optional): Organization UUID for multi-tenant setups

## 📚 Available Tools

### Entity Operations

#### `tribecrm_get_entity`
Retrieve a specific entity by ID

**Parameters:**
- `entityType` (string): Entity type (e.g., 'contact', 'company', 'deal')
- `entityId` (string): Unique entity identifier

**Example:**
```json
{
  "entityType": "contact",
  "entityId": "12345"
}
```

#### `tribecrm_create_entity`
Create a new entity

**Parameters:**
- `entityType` (string): Entity type to create
- `data` (object): Entity data as key-value pairs

**Example:**
```json
{
  "entityType": "contact",
  "data": {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

#### `tribecrm_update_entity`
Update an existing entity

**Parameters:**
- `entityType` (string): Entity type
- `entityId` (string): Entity ID to update
- `data` (object): Updated entity data

**Example:**
```json
{
  "entityType": "contact",
  "entityId": "12345",
  "data": {
    "email": "newemail@example.com"
  }
}
```

#### `tribecrm_delete_entity`
Delete an entity

**Parameters:**
- `entityType` (string): Entity type
- `entityId` (string): Entity ID to delete

### Search Operations

#### `tribecrm_search_entities`
Search for entities with filters and pagination

**Parameters:**
- `entityType` (string, required): Entity type to search
- `query` (string, optional): Search query string
- `filters` (object, optional): Filter criteria
- `page` (number, optional): Page number (default: 1)
- `pageSize` (number, optional): Results per page (default: 20, max: 100)

**Example:**
```json
{
  "entityType": "company",
  "query": "tech",
  "filters": {
    "location": "New York",
    "status": "active"
  },
  "page": 1,
  "pageSize": 20
}
```

### Connector Operations

#### `tribecrm_list_connectors`
List all available connectors

**Parameters:** None

#### `tribecrm_get_connector`
Get details of a specific connector

**Parameters:**
- `connectorId` (string): Connector ID

## 📖 Documentation

- [Usage Examples](docs/EXAMPLES.md) - Detailed usage examples and scenarios
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [Contributing](CONTRIBUTING.md) - Guidelines for contributing to this project

## 🏗️ Architecture

```
┌─────────────────┐
│  MCP Client     │
│  (Claude, etc.) │
└────────┬────────┘
         │
         │ MCP Protocol (stdio)
         │
┌────────▼────────────────┐
│  TribeCRM MCP Server    │
│  ┌──────────────────┐   │
│  │  Tool Handlers   │   │
│  │  - Entity CRUD   │   │
│  │  - Search        │   │
│  │  - Connectors    │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ Resource Handler │   │
│  │ - Entity Types   │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │  API Client      │   │
│  │  - OAuth2 Auth   │   │
│  │  - HTTP Requests │   │
│  └──────────────────┘   │
└────────┬────────────────┘
         │
         │ HTTPS + OAuth2
         │
┌────────▼────────────┐
│  TribeCRM API       │
│  (REST API)         │
└─────────────────────┘
```

## 🔐 Authentication

The server uses OAuth2 Client Credentials flow:
1. Authenticates with TribeCRM API using client credentials
2. Obtains access token
3. Automatically refreshes token before expiry
4. Includes token in all API requests

## 🛠️ Development

### Project Structure

```
tribecrm-mcp-server/
├── src/
│   ├── index.ts          # Main MCP server implementation
│   ├── client.ts         # TribeCRM API client
│   └── types.ts          # TypeScript type definitions
├── docs/
│   ├── EXAMPLES.md       # Usage examples
│   └── TROUBLESHOOTING.md # Troubleshooting guide
├── dist/                 # Compiled JavaScript (generated)
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Tech Stack

- **TypeScript** - Type-safe development
- **@modelcontextprotocol/sdk** - MCP protocol implementation
- **axios** - HTTP client for API requests
- **dotenv** - Environment variable management

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see LICENSE file for details

## 🔗 Links

- [TribeCRM](https://tribecrm.com) - Official TribeCRM website
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP documentation
- [GitHub Repository](https://github.com/efficy-sa/tribecrm-mcp-server)

## 📧 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/efficy-sa/tribecrm-mcp-server/issues)
- Check the [Troubleshooting Guide](docs/TROUBLESHOOTING.md)

---

**Note:** This is an unofficial MCP server for TribeCRM. For official API documentation, please refer to your TribeCRM instance documentation.
