function buildAnthropicMessages(userPrompt, messages) {
  if (Array.isArray(messages) && messages.length > 0) {
    return messages;
  }

  return [{ role: "user", content: userPrompt }];
}

function buildAnthropicRequest(settings, systemPrompt, messages, tools) {
  const body = {
    model: settings.model,
    system: systemPrompt,
    messages,
    max_tokens: settings.maxTokens,
    temperature: settings.temperature,
  };

  if (Array.isArray(tools) && tools.length > 0) {
    body.tools = tools;
  }

  return body;
}

function extractAnthropicToolUses(json) {
  return Array.isArray(json.content)
    ? json.content.filter((part) => part && part.type === "tool_use")
    : [];
}

function extractAnthropicAssistantMessage(json) {
  if (!Array.isArray(json.content) || json.content.length === 0) {
    return null;
  }

  return {
    role: "assistant",
    content: json.content,
  };
}

function extractAnthropicText(json) {
  return Array.isArray(json.content)
    ? json.content
        .map((part) => (part && typeof part.text === "string" ? part.text : ""))
        .filter(Boolean)
        .join("\n")
    : "";
}

function extractAnthropicStreamDelta(payload) {
  if (payload?.type === "content_block_delta") {
    return payload.delta?.text || "";
  }

  return "";
}

module.exports = {
  buildAnthropicMessages,
  buildAnthropicRequest,
  extractAnthropicAssistantMessage,
  extractAnthropicStreamDelta,
  extractAnthropicText,
  extractAnthropicToolUses,
};
