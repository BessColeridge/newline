"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
const server = new index_js_1.Server({
    name: "newline-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
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
        ],
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    if (request.params.name === "format_multiline_command") {
        const args = request.params.arguments;
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
        const formattedLines = lines.map((line) => `${line.trimEnd()} \\`);
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
    throw new Error(`Tool not found: ${request.params.name}`);
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map