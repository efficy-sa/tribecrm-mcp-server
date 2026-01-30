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
  authUrl: process.env.TRIBECRM_AUTH_URL || '',
  clientId: process.env.TRIBECRM_CLIENT_ID || '',
  clientSecret: process.env.TRIBECRM_CLIENT_SECRET || '',
  organizationId: process.env.TRIBECRM_ORGANIZATION_ID,
};

if (!config.apiUrl || !config.authUrl || !config.clientId || !config.clientSecret) {
  console.error('Error: Missing required environment variables');
  console.error('Required: TRIBECRM_API_URL, TRIBECRM_AUTH_URL, TRIBECRM_CLIENT_ID, TRIBECRM_CLIENT_SECRET');
  console.error('Optional: TRIBECRM_ORGANIZATION_ID');
  process.exit(1);
}

// Initialize client
const client = new TribeCRMClient(config);

// Initialize MCP server
const server = new Server(
  {
    name: process.env.MCP_SERVER_NAME || 'tribecrm',
    version: '0.3.0',
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
        description: 'Get a single entity by ID. Common entity types: Relation_Organization, Relation_Person, Activity_Invoice, Product',
        inputSchema: {
          type: 'object',
          properties: {
            entityType: {
              type: 'string',
              description: 'OData entity type (e.g., Relation_Organization, Relation_Person, Activity_Invoice)',
            },
            entityId: {
              type: 'string',
              description: 'Entity UUID',
            },
            expand: {
              type: 'string',
              description: 'Optional $expand parameter (e.g., "Address", "InvoiceAddress($expand=Country)")',
            },
            select: {
              type: 'string',
              description: 'Optional $select parameter (e.g., "Name,EmailAddress,PhoneNumber")',
            },
          },
          required: ['entityType', 'entityId'],
        },
      },
      {
        name: 'tribecrm_query_entities',
        description: 'Query entities with OData filters. Supports $filter, $select, $expand, $orderby, $top, $skip, $count',
        inputSchema: {
          type: 'object',
          properties: {
            entityType: {
              type: 'string',
              description: 'OData entity type to query',
            },
            filter: {
              type: 'string',
              description: 'OData $filter expression (e.g., "Name eq \'John\' or contains(Name,\'tech\')")',
            },
            select: {
              type: 'string',
              description: 'Comma-separated list of fields to return',
            },
            expand: {
              type: 'string',
              description: 'Related entities to expand',
            },
            orderby: {
              type: 'string',
              description: 'Field to sort by with optional desc (e.g., "Name desc")',
            },
            top: {
              type: 'number',
              description: 'Number of records to return (pagination)',
            },
            skip: {
              type: 'number',
              description: 'Number of records to skip (pagination)',
            },
            count: {
              type: 'boolean',
              description: 'Include total count in response',
            },
          },
          required: ['entityType'],
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
              description: 'OData entity type',
            },
            data: {
              type: 'object',
              description: 'Entity data (do not include ID)',
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
              description: 'OData entity type',
            },
            entityId: {
              type: 'string',
              description: 'Entity UUID to update',
            },
            data: {
              type: 'object',
              description: 'Updated entity data',
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
              description: 'OData entity type',
            },
            entityId: {
              type: 'string',
              description: 'Entity UUID to delete',
            },
          },
          required: ['entityType', 'entityId'],
        },
      },
      {
        name: 'tribecrm_get_current_employee',
        description: 'Get information about the currently authenticated employee',
        inputSchema: {
          type: 'object',
          properties: {
            expand: {
              type: 'string',
              description: 'Optional $expand parameter (e.g., "Person")',
            },
          },
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
        const { entityType, entityId, expand, select } = args as {
          entityType: string;
          entityId: string;
          expand?: string;
          select?: string;
        };
        const entity = await client.getEntity(entityType, entityId, expand, select);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(entity, null, 2),
            },
          ],
        };
      }

      case 'tribecrm_query_entities': {
        const { entityType, filter, select, expand, orderby, top, skip, count } = args as {
          entityType: string;
          filter?: string;
          select?: string;
          expand?: string;
          orderby?: string;
          top?: number;
          skip?: number;
          count?: boolean;
        };
        const results = await client.queryEntities(entityType, {
          filter,
          select,
          expand,
          orderby,
          top,
          skip,
          count,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
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
              text: `Entity created successfully:\\n${JSON.stringify(entity, null, 2)}`,
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
              text: `Entity updated successfully:\\n${JSON.stringify(entity, null, 2)}`,
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

      case 'tribecrm_get_current_employee': {
        const { expand } = args as { expand?: string };
        const employee = await client.getCurrentEmployee(expand);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(employee, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.response?.data?.error?.message || error.message}`,
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
        description: `Entity type: ${type.name}`,
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
  } catch (error: any) {
    throw new Error(`Error reading resource: ${error.message}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('TribeCRM MCP Server v0.3.0 running on stdio');
  console.error('Connected to:', config.apiUrl);
  console.error('Auth URL:', config.authUrl);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
