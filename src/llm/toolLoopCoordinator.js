const { buildRequest } = require("./requestBuilder");
const { extractStreamDelta, handleModelResponse } = require("./responseHandler");
const { readStreamResponse } = require("./streaming/sse");

async function requestModelOnce(settings, payload, useStreaming, requestUrlImpl) {
  const { headers, body } = buildRequest(settings, payload, useStreaming);

  if (useStreaming && typeof fetch === "function") {
    const response = await fetch(settings.apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const text = await readStreamResponse(
      response,
      settings.providerType,
      payload.onChunk,
      extractStreamDelta,
    );
    return { text, json: null };
  }

  const response = await requestUrlImpl({
    url: settings.apiUrl,
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return { text: null, json: response.json };
}

async function runToolLoop(settings, context, requestUrlImpl) {
  const maxToolRounds = 8;

  for (let round = 0; round <= maxToolRounds; round += 1) {
    const { text, json } = await requestModelOnce(
      settings,
      {
        systemPrompt: context.systemPrompt,
        userPrompt: context.userPrompt,
        tools: context.tools,
        messages: context.messages,
        onChunk: context.onChunk,
      },
      context.canStream,
      requestUrlImpl,
    );

    if (text != null) {
      return text.trim();
    }

    const finalText = await handleModelResponse(settings, json, context);
    if (finalText != null) {
      return finalText;
    }
  }

  throw new Error("工具调用轮次过多，已停止继续请求模型。");
}

module.exports = {
  requestModelOnce,
  runToolLoop,
};
