# TribeCRM MCP Server

Model Context Protocol (MCP) server for TribeCRM API integration. This server enables AI assistants like Claude to interact with TribeCRM entities, perform searches, and manage connectors.

## Features

### Tools
- **Entity Management**: Create, read, update, and delete CRM entities (contacts, companies, deals, etc.)
- **Search & Query**: Search across entities with filters and pagination
- **Connector Management**: Manage integration connectors

### Resources
- **Entity Types**: Access available entity type definitions
- **Entity Data**: Read entity records as MCP resources

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure your TribeCRM API credentials in `.env`:
```env
TRIBECRM_API_URL=https://your-api-url.com
TRIBECRM_CLIENT_ID=your_client_id
TRIBECRM_CLIENT_SECRET=your_client_secret
```

## Usage

### Build
```bash
npm run build
```

### Run
```bash
npm start
```

### Development
```bash
npm run dev
```

## MCP Client Configuration

Add to your MCP client settings (e.g., Claude Desktop config):

```json
{
  "mcpServers": {
    "tribecrm": {
      "command": "node",
      "args": ["/path/to/tribecrm-mcp-server/dist/index.js"],
      "env": {
        "TRIBECRM_API_URL": "https://your-api-url.com",
        "TRIBECRM_CLIENT_ID": "your_client_id",
        "TRIBECRM_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

## Available Tools

### Entity Operations

#### `tribecrm_get_entity`
Retrieve a specific entity by ID

**Parameters:**
- `entityType` (string): Entity type (e.g., 'contact', 'company')
- `entityId` (string): Entity ID

#### `tribecrm_create_entity`
Create a new entity

**Parameters:**
- `entityType` (string): Entity type
- `data` (object): Entity data

#### `tribecrm_update_entity`
Update an existing entity

**Parameters:**
- `entityType` (string): Entity type
- `entityId` (string): Entity ID
- `data` (object): Updated entity data

#### `tribecrm_delete_entity`
Delete an entity

**Parameters:**
- `entityType` (string): Entity type
- `entityId` (string): Entity ID

### Search Operations

#### `tribecrm_search_entities`
Search for entities with filters

**Parameters:**
- `entityType` (string): Entity type to search
- `query` (string, optional): Search query
- `filters` (object, optional): Filter criteria
- `page` (number, optional): Page number
- `pageSize` (number, optional): Results per page

### Connector Operations

#### `tribecrm_list_connectors`
List available connectors

#### `tribecrm_get_connector`
Get connector details

**Parameters:**
- `connectorId` (string): Connector ID

## License

MIT
