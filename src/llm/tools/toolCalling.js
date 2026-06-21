function parseJsonArguments(value, toolName) {
  if (value == null || value === "") {
    return {};
  }

  if (typeof value === "object") {
    return value;
  }

  if (typeof value !== "string") {
    throw new Error(`工具 ${toolName} 的参数格式无效。`);
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    throw new Error(`工具 ${toolName} 的参数不是合法 JSON。`);
  }
}

function serializeToolResult(result) {
  if (typeof result === "string") {
    return result;
  }

  if (result == null) {
    return "";
  }

  return JSON.stringify(result);
}

async function executeOpenAIToolCalls(toolCalls, toolHandlers, onToolCall) {
  const results = [];

  for (const toolCall of toolCalls) {
    const toolName = toolCall?.function?.name;
    const handler = toolHandlers?.[toolName];
    if (typeof handler !== "function") {
      throw new Error(`模型请求调用未注册的工具：${toolName || "unknown"}`);
    }

    const args = parseJsonArguments(toolCall.function?.arguments, toolName);
    onToolCall?.(toolName, args);
    const output = await handler(args);
    results.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: serializeToolResult(output),
    });
  }

  return results;
}

async function executeAnthropicToolUses(toolUses, toolHandlers, onToolCall) {
  const results = [];

  for (const toolUse of toolUses) {
    const toolName = toolUse?.name;
    const handler = toolHandlers?.[toolName];
    if (typeof handler !== "function") {
      throw new Error(`模型请求调用未注册的工具：${toolName || "unknown"}`);
    }

    const args = parseJsonArguments(toolUse.input, toolName);
    onToolCall?.(toolName, args);
    const output = await handler(args);
    results.push({
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: serializeToolResult(output),
        },
      ],
    });
  }

  return results;
}

module.exports = {
  executeAnthropicToolUses,
  executeOpenAIToolCalls,
  parseJsonArguments,
  serializeToolResult,
};
