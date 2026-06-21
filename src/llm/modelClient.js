const { requestUrl } = require("obsidian");

const {
  buildMessages,
  buildRequest,
  createCallContext,
  normalizeTools,
  parseCustomHeaders,
  validateSettings,
} = require("./requestBuilder");
const {
  extractStreamDelta,
  handleAnthropicResponse,
  handleModelResponse,
  handleOpenAIResponse,
} = require("./responseHandler");
const { requestModelOnce, runToolLoop } = require("./toolLoopCoordinator");

async function callModel(
  settings,
  { systemPrompt, userPrompt, tools, toolHandlers, onChunk, onToolCall } = {},
) {
  const context = createCallContext(settings, {
    systemPrompt,
    userPrompt,
    tools,
    toolHandlers,
    onChunk,
    onToolCall,
  });

  return await runToolLoop(settings, context, requestUrl);
}

module.exports = {
  buildRequest,
  buildMessages,
  callModel,
  extractStreamDelta,
  parseCustomHeaders,
  normalizeTools,
  validateSettings,
};
