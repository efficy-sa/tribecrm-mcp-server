# OData Query Guide for TribeCRM

TribeCRM uses OData (Open Data Protocol) for querying data. This guide covers the most common query operations.

## Common Entity Types

### Relations
- `Relation_Organization` - Companies/Organizations
- `Relation_Person` - Individual persons

### Relationships
- `Relationship_Organization_CommercialRelationship_Customer` - Customer relationships
- `Relationship_Organization_CommercialRelationship_Lead` - Lead relationships
- `Relationship_Person_Contact_Standard` - Contact person relationships
- `Relationship_Person_CommercialRelationship_Customer` - Personal customer relationships

### Activities
- `Activity_Invoice` - Invoices
- `Activity_Appointment` - Appointments
- `Activity_SalesOpportunity` - Sales opportunities

### Other
- `Product` - Products
- `ProductLine` - Product lines in activities
- `Address` - Addresses
- `Attachment` - File attachments

## Query Parameters

### $select - Choose specific fields
Return only specified fields to reduce payload size.

```
$select=Name,EmailAddress,PhoneNumber
```

### $expand - Include related entities
Expand navigation properties to include related data.

```
$expand=Address
$expand=Address($expand=Country)
$expand=InvoiceAddress($select=City;$expand=Country($select=Name))
```

### $filter - Filter results
Filter entities using logical operators and functions.

#### Comparison Operators
- `eq` - Equal to: `Name eq 'John'`
- `ne` - Not equal: `Status ne 'Inactive'`
- `gt` - Greater than: `Amount gt 1000`
- `lt` - Less than: `Amount lt 5000`
- `ge` - Greater or equal: `CreationDate ge 2021-01-01T00:00:00Z`
- `le` - Less or equal: `CreationDate le 2021-12-31T23:59:59Z`

#### Logical Operators
- `and` - Both conditions true: `(FirstName eq 'John') and (LastName eq 'Doe')`
- `or` - Either condition true: `Status eq 'Active' or Status eq 'Pending'`
- `not` - Negation: `not (Status eq 'Deleted')`

#### String Functions
- `contains(field, 'text')` - Contains text: `contains(Name, 'tech')`
- `startswith(field, 'text')` - Starts with: `startswith(Name, 'Tri')`
- `endswith(field, 'text')` - Ends with: `endswith(Email, '@example.com')`

#### Examples
```
# Filter by exact match
$filter=Number eq 1601

# Filter by date
$filter=CreationDate gt 2021-05-17T12:43:48Z

# Filter with contains
$filter=contains(Name, 'tech')

# Complex filter with AND
$filter=(FirstName eq 'John') and (LastName eq 'Doe')

# Filter by related entity
$filter=Phase/Code eq 'Sent'
```

### $orderby - Sort results
Sort by one or more fields, ascending (default) or descending.

```
$orderby=Name
$orderby=LastName desc
$orderby=CreationDate desc,Name asc
```

### $top and $skip - Pagination
Limit results and skip records for pagination.

```
$top=20
$skip=40
$top=10&$skip=10
```

### $count - Include total count
Get the total number of matching records.

```
$count=true
```

## Complete Examples

### Get organizations with address details
```
EntityType: Relation_Organization
Expand: InvoiceAddress($expand=Country)
Select: Name,DebtorNumber,PhoneNumber
```

### Search for customers by name
```
EntityType: Relationship_Organization_CommercialRelationship_Customer
Filter: contains(Name, 'tech')
Expand: Organization($select=Name,PhoneNumber)
```

### Get recent invoices
```
EntityType: Activity_Invoice
Filter: CreationDate gt 2024-01-01T00:00:00Z and Phase/Code ne 'Paid'
Expand: Phase,Relationship
OrderBy: CreationDate desc
Top: 50
```

### Find person by email
```
EntityType: Relationship_Person_Contact_Standard
Filter: EmailAddress eq 'john@example.com'
Expand: Person,Relation
```

### Get products with pagination
```
EntityType: Product
Select: Name,Price
OrderBy: Name
Top: 20
Skip: 0
Count: true
```

## Special Characters

### Escaping single quotes
Double single quotes to escape them:
```
$filter=Name eq 'Peter''s company'
```

### Date/Time format
Use ISO 8601 format with timezone:
```
2021-05-17T12:43:48Z
2024-01-01T00:00:00+01:00
```

## Tips

1. **Use $select to reduce payload** - Only request fields you need
2. **Expand related entities** - Reduce number of API calls by expanding related data
3. **Filter server-side** - Use $filter instead of filtering in code
4. **Paginate large results** - Use $top and $skip for large datasets
5. **Add $count for pagination UI** - Know total results for pagination controls

## References

- [OData Documentation](https://www.odata.org/documentation/)
- TribeCRM API Postman Collection
- Contact support@tribecrm.nl for API questions
