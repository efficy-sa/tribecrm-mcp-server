#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { TribeCRMClient } from './client.js';
import { TribeCRMConfig } from './types.js';

// Load environment variables
dotenv.config();

// Validate configuration
const config: TribeCRMConfig = {
  apiUrl: process.env.TRIBECRM_API_URL || '',
  clientId: process.env.TRIBECRM_CLIENT_ID || '',
  clientSecret: process.env.TRIBECRM_CLIENT_SECRET || '',
  organizationId: process.env.TRIBECRM_ORGANIZATION_ID,
};

if (!config.apiUrl || !config.clientId || !config.clientSecret) {
  console.error('Error: Missing required environment variables');
  console.error('Required: TRIBECRM_API_URL, TRIBECRM_CLIENT_ID, TRIBECRM_CLIENT_SECRET');
  process.exit(1);
}

// Initialize client
const client = new TribeCRMClient(config);

// Initialize MCP server
const server = new Server(
  {
    name: process.env.MCP_SERVER_NAME || 'tribecrm',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'tribecrm_get_entity',
        description: 'Retrieve a specific entity by ID from TribeCRM',
        inputSchema: {
          type: 'object',
          properties: {
            entityType: {
              type: 'string',
              description: 'Entity type (e.g., contact, company, deal)',
            },
            entityId: {
              type: 'string',
              description: 'Entity ID',
            },
          },
          required: ['entityType', 'entityId'],
        },
      },
      {
        name: 'tribecrm_create_entity',
        description: 'Create a new entity in TribeCRM',
        inputSchema: {
          type: 'object',
          properties: {
            entityType: {
              type: 'string',
              description: 'Entity type (e.g., contact, company, deal)',
            },
            data: {
              type: 'object',
              description: 'Entity data as key-value pairs',
            },
          },
          required: ['entityType', 'data'],
        },
      },
      {
        name: 'tribecrm_update_entity',
        description: 'Update an existing entity in TribeCRM',
        inputSchema: {
          type: 'object',
          properties: {
            entityType: {
              type: 'string',
              description: 'Entity type',
            },
            entityId: {
              type: 'string',
              description: 'Entity ID',
            },
            data: {
              type: 'object',
              description: 'Updated entity data as key-value pairs',
            },
          },
          required: ['entityType', 'entityId', 'data'],
        },
      },
      {
        name: 'tribecrm_delete_entity',
        description: 'Delete an entity from TribeCRM',
        inputSchema: {
          type: 'object',
          properties: {
            entityType: {
              type: 'string',
              description: 'Entity type',
            },
            entityId: {
              type: 'string',
              description: 'Entity ID',
            },
          },
          required: ['entityType', 'entityId'],
        },
      },
      {
        name: 'tribecrm_search_entities',
        description: 'Search for entities in TribeCRM with optional filters',
        inputSchema: {
          type: 'object',
          properties: {
            entityType: {
              type: 'string',
              description: 'Entity type to search',
            },
            query: {
              type: 'string',
              description: 'Search query string',
            },
            filters: {
              type: 'object',
              description: 'Filter criteria as key-value pairs',
            },
            page: {
              type: 'number',
              description: 'Page number (default: 1)',
              default: 1,
            },
            pageSize: {
              type: 'number',
              description: 'Results per page (default: 20)',
              default: 20,
            },
          },
          required: ['entityType'],
        },
      },
      {
        name: 'tribecrm_list_connectors',
        description: 'List all available connectors in TribeCRM',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'tribecrm_get_connector',
        description: 'Get details of a specific connector',
        inputSchema: {
          type: 'object',
          properties: {
            connectorId: {
              type: 'string',
              description: 'Connector ID',
            },
          },
          required: ['connectorId'],
        },
      },
    ],
  };
});

// Register call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'tribecrm_get_entity': {
        const { entityType, entityId } = args as { entityType: string; entityId: string };
        const entity = await client.getEntity(entityType, entityId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(entity, null, 2),
            },
          ],
        };
      }

      case 'tribecrm_create_entity': {
        const { entityType, data } = args as { entityType: string; data: Record<string, any> };
        const entity = await client.createEntity(entityType, data);
        return {
          content: [
            {
              type: 'text',
              text: `Entity created successfully:\n${JSON.stringify(entity, null, 2)}`,
            },
          ],
        };
      }

      case 'tribecrm_update_entity': {
        const { entityType, entityId, data } = args as {
          entityType: string;
          entityId: string;
          data: Record<string, any>;
        };
        const entity = await client.updateEntity(entityType, entityId, data);
        return {
          content: [
            {
              type: 'text',
              text: `Entity updated successfully:\n${JSON.stringify(entity, null, 2)}`,
            },
          ],
        };
      }

      case 'tribecrm_delete_entity': {
        const { entityType, entityId } = args as { entityType: string; entityId: string };
        await client.deleteEntity(entityType, entityId);
        return {
          content: [
            {
              type: 'text',
              text: `Entity ${entityId} deleted successfully`,
            },
          ],
        };
      }

      case 'tribecrm_search_entities': {
        const { entityType, query, filters, page, pageSize } = args as {
          entityType: string;
          query?: string;
          filters?: Record<string, any>;
          page?: number;
          pageSize?: number;
        };
        const results = await client.searchEntities(
          entityType,
          query,
          filters,
          page || 1,
          pageSize || 20
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'tribecrm_list_connectors': {
        const connectors = await client.listConnectors();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(connectors, null, 2),
            },
          ],
        };
      }

      case 'tribecrm_get_connector': {
        const { connectorId } = args as { connectorId: string };
        const connector = await client.getConnector(connectorId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(connector, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Register resource handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  try {
    const entityTypes = await client.listEntityTypes();
    return {
      resources: entityTypes.map((type) => ({
        uri: `tribecrm://entity-types/${type.code}`,
        name: type.name,
        description: `Entity type definition for ${type.name}`,
        mimeType: 'application/json',
      })),
    };
  } catch (error) {
    console.error('Error listing resources:', error);
    return { resources: [] };
  }
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    if (uri.startsWith('tribecrm://entity-types/')) {
      const entityTypeCode = uri.replace('tribecrm://entity-types/', '');
      const entityTypes = await client.listEntityTypes();
      const entityType = entityTypes.find((t) => t.code === entityTypeCode);

      if (!entityType) {
        throw new Error(`Entity type not found: ${entityTypeCode}`);
      }

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(entityType, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown resource URI: ${uri}`);
  } catch (error) {
    throw new Error(`Error reading resource: ${error instanceof Error ? error.message : String(error)}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('TribeCRM MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
