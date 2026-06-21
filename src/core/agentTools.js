const { buildGetCurrentDateTool } = require("../llm/tools/dateTool");
const { buildWebSearchTool } = require("../llm/tools/webSearchTool");

function resolveAgentTools(agent, providerType = "openai") {
  if (!agent || !Array.isArray(agent.tools)) {
    return [];
  }

  return agent.tools
    .map((tool) => {
      if (tool && typeof tool === "object") {
        return tool;
      }

      if (typeof tool !== "string") {
        return null;
      }

      if (tool === "current-date") {
        return buildGetCurrentDateTool(providerType);
      }

      if (tool === "web-search") {
        return buildWebSearchTool(providerType);
      }

      return null;
    })
    .filter(Boolean);
}

module.exports = {
  resolveAgentTools,
};
