# TribeCRM MCP Server - Usage Examples

## Getting Started

After installing and configuring the MCP server, you can use it with any MCP-compatible client (like Claude Desktop).

## Example 1: Get an Organization by ID

```
User: Get the organization with ID "9fcb346f-bd58-423d-b7da-1952f9449827" from TribeCRM

Assistant uses: tribecrm_get_entity
Parameters:
- entityType: "Relation_Organization"
- entityId: "9fcb346f-bd58-423d-b7da-1952f9449827"
- expand: "InvoiceAddress($expand=Country)"
- select: "Name,PhoneNumber,Website"

Result: Returns organization details with invoice address and country information
```

## Example 2: Create a New Organization

```
User: Create a new organization in TribeCRM with name "Tech Solutions Inc"

Assistant uses: tribecrm_create_entity
Parameters:
- entityType: "Relation_Organization"
- data: {
    "Name": "Tech Solutions Inc",
    "Website": "https://techsolutions.com",
    "PhoneNumber": "+1234567890"
  }

Result: Returns the newly created organization with its UUID
```

## Example 3: Search for Organizations by Name

```
User: Find all organizations in TribeCRM that contain "tech" in their name

Assistant uses: tribecrm_query_entities
Parameters:
- entityType: "Relation_Organization"
- filter: "contains(Name, 'tech')"
- select: "ID,Name,PhoneNumber,Website"
- top: 20

Result: Returns list of matching organizations
```

## Example 4: Get Customer Relationships

```
User: Show me all customer relationships with their organization details

Assistant uses: tribecrm_query_entities
Parameters:
- entityType: "Relationship_Organization_CommercialRelationship_Customer"
- expand: "Organization($select=Name,PhoneNumber;$expand=VisitingAddress($expand=Country)),AccountManager"
- top: 50

Result: Returns customer relationships with expanded organization and address data
```

## Example 5: Update an Organization

```
User: Update organization 9fcb346f-bd58-423d-b7da-1952f9449827 to change the name to "New Company Name"

Assistant uses: tribecrm_update_entity
Parameters:
- entityType: "Relation_Organization"
- entityId: "9fcb346f-bd58-423d-b7da-1952f9449827"
- data: {
    "Name": "New Company Name",
    "Website": "https://newcompany.com"
  }

Result: Returns the updated organization information
```

## Example 6: Get Recent Invoices

```
User: Find all invoices created after January 1, 2024 that haven't been paid yet

Assistant uses: tribecrm_query_entities
Parameters:
- entityType: "Activity_Invoice"
- filter: "CreationDate gt 2024-01-01T00:00:00Z and Phase/Code ne 'Paid'"
- expand: "Phase($select=Name,Code),Relationship($select=Name)"
- orderby: "CreationDate desc"
- select: "ID,Number,Amount,Subject,CreationDate"
- top: 100

Result: Returns recent unpaid invoices with phase and relationship information
```

## Example 7: Find Contact Persons by Email

```
User: Find the contact person with email "john@example.com"

Assistant uses: tribecrm_query_entities
Parameters:
- entityType: "Relationship_Person_Contact_Standard"
- filter: "EmailAddress eq 'john@example.com'"
- expand: "Person($select=FirstName,LastName),Relation($select=Name)"

Result: Returns contact person with related person and organization data
```

## Example 8: Search for Persons by Phone Number

```
User: Find contacts with phone number 0123456789

Assistant uses: tribecrm_query_entities
Parameters:
- entityType: "Relationship_Person_Contact_Standard"
- filter: "PhoneNumber eq '0123456789' or MobilePhoneNumber eq '0123456789'"
- expand: "Person($select=FirstName,LastName,EmailAddress),Relation($select=Name)"
- select: "Department,PhoneNumber,MobilePhoneNumber"

Result: Returns matching contacts with person and organization details
```

## Example 9: Get Products with Pagination

```
User: List all products, 20 per page, starting from page 2

Assistant uses: tribecrm_query_entities
Parameters:
- entityType: "Product"
- select: "Name,Price,Description"
- orderby: "Name"
- top: 20
- skip: 20
- count: true

Result: Returns products 21-40 with total count for pagination
```

## Example 10: Complex Query - Active Customers in Specific City

```
User: Find all active customer relationships for organizations located in Amsterdam

Assistant uses: tribecrm_query_entities
Parameters:
- entityType: "Relationship_Organization_CommercialRelationship_Customer"
- filter: "Organization/VisitingAddress/City eq 'Amsterdam'"
- expand: "Organization($select=Name,PhoneNumber;$expand=VisitingAddress($select=Street,City,Postalcode))"
- select: "Name,PaymentTermInDays"

Result: Returns customer relationships for Amsterdam-based organizations
```

## Example 11: Get Current User Information

```
User: Who am I logged in as in TribeCRM?

Assistant uses: tribecrm_get_current_employee
Parameters:
- expand: "Person"

Result: Returns current employee information with person details
```

## Example 12: Create an Appointment

```
User: Create a new appointment for tomorrow at 2 PM with subject "Meeting with client"

Assistant uses: tribecrm_create_entity
Parameters:
- entityType: "Activity_Appointment"
- data: {
    "Subject": "Meeting with client",
    "StartDate": "2024-03-15T14:00:00Z",
    "EndDate": "2024-03-15T15:00:00Z"
  }

Result: Returns the newly created appointment
```

## Tips for Using OData Queries

1. **Entity Type Names**: Always use the exact OData entity type names (case-sensitive)
   - Organizations: `Relation_Organization`
   - Persons: `Relation_Person`
   - Customers: `Relationship_Organization_CommercialRelationship_Customer`

2. **Expand Related Data**: Use `$expand` to get related entities in one call
   - Simple: `expand: "Address"`
   - Nested: `expand: "Address($expand=Country)"`
   - With select: `expand: "Organization($select=Name,Phone)"`

3. **Filter Syntax**: Use OData filter expressions
   - Equals: `Name eq 'John'`
   - Contains: `contains(Name, 'tech')`
   - Greater than: `Amount gt 1000`
   - Dates: `CreationDate gt 2024-01-01T00:00:00Z`

4. **Pagination**: Always use `top` and `skip` for large result sets
   - First 20: `top: 20, skip: 0`
   - Second 20: `top: 20, skip: 20`
   - Include count: `count: true`

5. **Field Selection**: Use `$select` to reduce payload size
   - `select: "Name,EmailAddress,PhoneNumber"`

See [OData Guide](ODATA_GUIDE.md) for comprehensive query syntax documentation.
