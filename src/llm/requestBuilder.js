const {
  buildAnthropicMessages,
  buildAnthropicRequest,
} = require("./modelProviders/anthropicProvider");
const { buildOpenAIRequest } = require("./modelProviders/openaiProvider");

function parseCustomHeaders(settings) {
  const value = (settings.customHeaders || "{}").trim();
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      throw new Error();
    }
    return parsed;
  } catch (_error) {
    throw new Error("自定义 Headers 不是合法的 JSON 对象。");
  }
}

function validateSettings(settings) {
  if (!settings.apiUrl) {
    throw new Error("请先在插件设置中填写 API URL。");
  }

  if (!settings.model) {
    throw new Error("请先在插件设置中填写模型名称。");
  }

  if (!settings.apiKey) {
    throw new Error("请先在插件设置中填写 API Key。");
  }
}

function normalizeTools(tools) {
  if (!Array.isArray(tools)) {
    return [];
  }

  return tools.filter((tool) => {
    if (!tool) {
      return false;
    }

    if (typeof tool === "string") {
      return tool.trim().length > 0;
    }

    return typeof tool === "object";
  });
}

function buildMessages(settings, { systemPrompt, userPrompt, messages }) {
  if (Array.isArray(messages) && messages.length > 0) {
    return messages;
  }

  if (settings.providerType === "anthropic") {
    return buildAnthropicMessages(userPrompt, messages);
  }

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

function buildRequest(settings, { systemPrompt, userPrompt, tools, messages }, useStreaming) {
  const customHeaders = parseCustomHeaders(settings);
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };
  const normalizedTools = normalizeTools(tools);
  const normalizedMessages = buildMessages(settings, { systemPrompt, userPrompt, messages });

  let body;
  if (settings.providerType === "anthropic") {
    headers["x-api-key"] = settings.apiKey;
    headers["anthropic-version"] = headers["anthropic-version"] || "2023-06-01";
    body = buildAnthropicRequest(settings, systemPrompt, normalizedMessages, normalizedTools);
  } else {
    headers.Authorization = headers.Authorization || `Bearer ${settings.apiKey}`;
    body = buildOpenAIRequest(settings, normalizedMessages, normalizedTools);
  }

  if (useStreaming) {
    body.stream = true;
  }

  return {
    headers,
    body,
  };
}

function createCallContext(
  settings,
  { systemPrompt, userPrompt, tools, toolHandlers, onChunk, onToolCall } = {},
) {
  validateSettings(settings);

  const normalizedTools = normalizeTools(tools);
  const toolHandlerMap = toolHandlers && typeof toolHandlers === "object" ? toolHandlers : {};
  const shouldUseTools = normalizedTools.length > 0;

  return {
    systemPrompt,
    userPrompt,
    tools: normalizedTools,
    toolHandlerMap,
    onChunk,
    onToolCall,
    canStream: typeof onChunk === "function" && !shouldUseTools,
    messages: buildMessages(settings, { systemPrompt, userPrompt }),
  };
}

module.exports = {
  buildMessages,
  buildRequest,
  createCallContext,
  normalizeTools,
  parseCustomHeaders,
  validateSettings,
};
