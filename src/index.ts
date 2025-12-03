import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import clipboardy from "clipboardy";

const server = new Server(
  {
    name: "newline-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "format_multiline_command",
        description: "Formats a multi-line shell command by appending ' \' to each line to prevent immediate execution and allow single-block pasting.",
        inputSchema: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description: "The multi-line command to format.",
            },
          },
          required: ["command"],
        },
      },
      {
        name: "read_clipboard",
        description: "Reads the current content from the system clipboard. Useful when the user wants to process multi-line text or code without pasting it directly into the terminal.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "format_multiline_command") {
    const args = request.params.arguments as any;
    const command = args.command;

    if (!command) {
      return {
        content: [
          {
            type: "text",
            text: "Error: Command string is required.",
          },
        ],
        isError: true,
      };
    }

    // Split the command into lines
    const lines = command.split(/\r?\n/);
    
    // Append " \" to each line. 
    // Note: We trim trailing whitespace from the original line to keep it clean, then add the continuation.
    const formattedLines = lines.map((line: string) => `${line.trimEnd()} \\`);
    
    // Join back with newlines
    const result = formattedLines.join("\n");

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }

  if (request.params.name === "read_clipboard") {
    try {
      const clipboardContent = await clipboardy.read();
      return {
        content: [
          {
            type: "text",
            text: clipboardContent,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading clipboard: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
