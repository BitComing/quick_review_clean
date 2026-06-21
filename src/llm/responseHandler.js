const {
  extractAnthropicAssistantMessage: extractAnthropicAssistantMessageFromProvider,
  extractAnthropicStreamDelta,
  extractAnthropicText: extractAnthropicTextFromProvider,
  extractAnthropicToolUses: extractAnthropicToolUsesFromProvider,
} = require("./modelProviders/anthropicProvider");
const {
  extractOpenAIAssistantMessage,
  extractOpenAIStreamDelta,
  extractOpenAIText: extractOpenAITextFromProvider,
  extractOpenAIToolCalls: extractOpenAIToolCallsFromProvider,
} = require("./modelProviders/openaiProvider");
const {
  executeAnthropicToolUses,
  executeOpenAIToolCalls,
} = require("./tools/toolCalling");

function extractStreamDelta(providerType, payload) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  if (providerType === "anthropic") {
    return extractAnthropicStreamDelta(payload);
  }

  return extractOpenAIStreamDelta(payload);
}

async function handleAnthropicResponse(json, messages, toolHandlerMap, onToolCall) {
  const toolUses = extractAnthropicToolUsesFromProvider(json);
  if (toolUses.length > 0) {
    messages.push(
      extractAnthropicAssistantMessageFromProvider(json),
      ...(await executeAnthropicToolUses(toolUses, toolHandlerMap, onToolCall)),
    );
    return null;
  }

  const finalText = extractAnthropicTextFromProvider(json);
  if (!finalText) {
    throw new Error(json.error?.message || "Anthropic 接口没有返回可用文本。");
  }

  return finalText.trim();
}

async function handleOpenAIResponse(json, messages, toolHandlerMap, onToolCall) {
  const toolCalls = extractOpenAIToolCallsFromProvider(json);
  if (toolCalls.length > 0) {
    messages.push(
      extractOpenAIAssistantMessage(json),
      ...(await executeOpenAIToolCalls(toolCalls, toolHandlerMap, onToolCall)),
    );
    return null;
  }

  const finalText = extractOpenAITextFromProvider(json);
  if (!finalText) {
    throw new Error(json.error?.message || "模型接口没有返回可用文本。");
  }

  return finalText.trim();
}

async function handleModelResponse(settings, json, context) {
  if (settings.providerType === "anthropic") {
    return await handleAnthropicResponse(
      json,
      context.messages,
      context.toolHandlerMap,
      context.onToolCall,
    );
  }

  return await handleOpenAIResponse(
    json,
    context.messages,
    context.toolHandlerMap,
    context.onToolCall,
  );
}

module.exports = {
  extractStreamDelta,
  handleAnthropicResponse,
  handleModelResponse,
  handleOpenAIResponse,
};
