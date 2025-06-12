# MCP (Model Context Protocol) Setup Guide for Claude Code

## Overview

MCP (Model Context Protocol) servers allow Claude Code to connect to external tools and services, extending its capabilities beyond the built-in tools.

## Available MCP Commands

### Core Commands

- `claude mcp add <name> <commandOrUrl> [args...]` - Add a new MCP server
- `claude mcp remove <name>` - Remove an MCP server
- `claude mcp list` - List all configured MCP servers
- `claude mcp get <name>` - Get details about a specific MCP server

### Advanced Commands

- `claude mcp serve` - Start the Claude Code MCP server
- `claude mcp add-json <name> <json>` - Add an MCP server (stdio or SSE) with a JSON string
- `claude mcp add-from-claude-desktop` - Import MCP servers from Claude Desktop (Mac and WSL only)
- `claude mcp reset-project-choices` - Reset all approved and rejected project-scoped (.mcp.json) servers within this project

### Getting Help

- `claude mcp --help` - Display general MCP help
- `claude mcp <command> --help` - Display help for a specific command

## Basic Setup Steps

1. **Add an MCP server**: Use `claude mcp add` to configure a new server
2. **List servers**: Use `claude mcp list` to verify your configuration
3. **Test connection**: Restart Claude Code to load the new configuration

## Examples

```bash
# List current MCP servers
claude mcp list

# Add a new MCP server
claude mcp add myserver command-or-url

# Remove an MCP server
claude mcp remove myserver

# Get details about a server
claude mcp get myserver
```

## Notes

- MCP servers extend Claude Code's functionality with additional tools
- Configuration changes require restarting Claude Code
- Project-scoped servers can be configured using `.mcp.json` files
- Claude Desktop configurations can be imported on Mac and WSL systems