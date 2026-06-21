function coerceMessageContent(content) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item.text === "string") {
          return item.text;
        }

        if (item && typeof item.content === "string") {
          return item.content;
        }

        return "";
      })
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function buildOpenAIRequest(settings, messages, tools) {
  const body = {
    model: settings.model,
    messages,
    max_tokens: settings.maxTokens,
    temperature: settings.temperature,
  };

  if (Array.isArray(tools) && tools.length > 0) {
    body.tools = tools;
  }

  return body;
}

function extractOpenAIToolCalls(json) {
  const choice = Array.isArray(json.choices) ? json.choices[0] : null;
  return Array.isArray(choice?.message?.tool_calls) ? choice.message.tool_calls : [];
}

function extractOpenAIAssistantMessage(json) {
  const choice = Array.isArray(json.choices) ? json.choices[0] : null;
  return choice?.message || null;
}

function extractOpenAIText(json) {
  const choice = Array.isArray(json.choices) ? json.choices[0] : null;
  return coerceMessageContent(choice?.message?.content || choice?.text || "");
}

function extractOpenAIStreamDelta(payload) {
  const choice = Array.isArray(payload?.choices) ? payload.choices[0] : null;
  return coerceMessageContent(choice?.delta?.content || choice?.text || "");
}

module.exports = {
  buildOpenAIRequest,
  coerceMessageContent,
  extractOpenAIAssistantMessage,
  extractOpenAIStreamDelta,
  extractOpenAIText,
  extractOpenAIToolCalls,
};
