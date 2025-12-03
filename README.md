# Newline MCP

A Model Context Protocol (MCP) server that provides utilities for handling multi-line shell commands and clipboard operations.

## Tools

This MCP server exposes the following tools:

*   **`format_multiline_command`**: Takes a multi-line string and appends a backslash (`\`) to the end of each line. This is useful for formatting shell commands to be pasted as a single block without immediate execution of intermediate lines.
*   **`read_clipboard`**: Reads the current text content from the system clipboard.

## Setup & Installation

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Build the project**:
    ```bash
    npm run build
    ```

## Usage with Gemini CLI

To use this MCP server with the Gemini CLI, you need to add it to your MCP configuration file (usually found at `%USER%\.gemini\settings.json` or similar, depending on your specific setup).

Add the following entry to your `mcpServers` configuration:

```json
{
  "mcpServers": {
    "newline": {
      "command": "node",
      "args": ["/path/to/newline/dist/index.js"]
    }
  }
}
```

**Note:** Replace `/path/to/newline/dist/index.js` with the absolute path to the `dist/index.js` file in this project.

For example, if you cloned this repository to `C:\Users\Administrator\Desktop\newline`, the configuration would be:

```json
{
  "mcpServers": {
    "newline": {
      "command": "node",
      "args": ["C:\\Users\\Administrator\\Desktop\\newline\\dist\\index.js"]
    }
  }
}
```