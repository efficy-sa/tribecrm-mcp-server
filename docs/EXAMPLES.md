# TribeCRM MCP Server - Usage Examples

## Getting Started

After installing and configuring the MCP server, you can use it with any MCP-compatible client (like Claude Desktop).

## Example 1: Retrieving an Entity

```
User: Can you get the contact with ID "12345" from TribeCRM?

Assistant uses: tribecrm_get_entity
Parameters:
- entityType: "contact"
- entityId: "12345"

Result: Returns the contact details including name, email, phone, etc.
```

## Example 2: Creating a New Contact

```
User: Create a new contact in TribeCRM:
- Name: John Smith
- Email: john.smith@example.com
- Phone: +1234567890

Assistant uses: tribecrm_create_entity
Parameters:
- entityType: "contact"
- data: {
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890"
  }

Result: Returns the newly created contact with its ID
```

## Example 3: Searching for Companies

```
User: Find all companies in TribeCRM that are located in New York

Assistant uses: tribecrm_search_entities
Parameters:
- entityType: "company"
- filters: {
    "location": "New York"
  }
- page: 1
- pageSize: 20

Result: Returns a list of companies matching the criteria
```

## Example 4: Updating an Entity

```
User: Update contact 12345 to change their email to newemail@example.com

Assistant uses: tribecrm_update_entity
Parameters:
- entityType: "contact"
- entityId: "12345"
- data: {
    "email": "newemail@example.com"
  }

Result: Returns the updated contact information
```

## Example 5: Listing Connectors

```
User: What integration connectors are available in TribeCRM?

Assistant uses: tribecrm_list_connectors

Result: Returns a list of all configured connectors (e.g., Slack, Microsoft Exchange, etc.)
```

## Example 6: Complex Search with Multiple Filters

```
User: Find all deals that are:
- In "negotiation" stage
- Worth more than $10,000
- Assigned to sales team

Assistant uses: tribecrm_search_entities
Parameters:
- entityType: "deal"
- filters: {
    "stage": "negotiation",
    "value_gte": 10000,
    "team": "sales"
  }
- pageSize: 50

Result: Returns matching deals with pagination info
```

## Tips

- Always specify the correct `entityType` - common types include: `contact`, `company`, `deal`, `activity`
- Use pagination for large result sets to improve performance
- Filters support various operators depending on field types
- Entity IDs are typically strings, not numbers
