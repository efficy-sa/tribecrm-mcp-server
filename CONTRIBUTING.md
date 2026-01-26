# Contributing to TribeCRM MCP Server

Thank you for your interest in contributing! This document provides guidelines for contributing to the TribeCRM MCP Server project.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/tribecrm-mcp-server.git
   cd tribecrm-mcp-server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with your TribeCRM API credentials
5. Build the project:
   ```bash
   npm run build
   ```

## Development Workflow

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Build and test:
   ```bash
   npm run build
   npm start
   ```
4. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request

### Code Style

- Use TypeScript for all source code
- Follow existing code style and conventions
- Use meaningful variable and function names
- Add comments for complex logic

### Adding New Tools

To add a new MCP tool:

1. Add the tool definition in `src/index.ts` in the `ListToolsRequestSchema` handler
2. Implement the tool logic in the `CallToolRequestSchema` handler
3. If needed, add new methods to `TribeCRMClient` in `src/client.ts`
4. Update the README with the new tool documentation

### Adding New Resources

To add new MCP resources:

1. Update the `ListResourcesRequestSchema` handler in `src/index.ts`
2. Add resource reading logic in the `ReadResourceRequestSchema` handler
3. Update the README with the new resource documentation

## Testing

Before submitting a PR:

1. Test with a real TribeCRM instance
2. Verify all existing tools still work
3. Test your new functionality
4. Check for TypeScript errors: `npm run build`

## Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Include examples of how to use new features
- Update documentation as needed

## Questions?

Feel free to open an issue for questions or discussions!
