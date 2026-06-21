function parseSseMessages(buffer) {
  const normalized = buffer.replace(/\r\n/g, "\n");
  const chunks = normalized.split("\n\n");
  const complete = chunks.slice(0, -1);
  const remainder = chunks[chunks.length - 1] || "";

  const messages = complete
    .map((chunk) =>
      chunk
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("\n"),
    )
    .filter(Boolean);

  return { messages, remainder };
}

async function readStreamResponse(response, providerType, onChunk, extractStreamDelta) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `模型接口请求失败（${response.status}）。`);
  }

  if (!response.body) {
    throw new Error("当前环境不支持读取流式响应。");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

    const { messages, remainder } = parseSseMessages(buffer);
    buffer = remainder;

    for (const message of messages) {
      if (message === "[DONE]") {
        continue;
      }

      let payload;
      try {
        payload = JSON.parse(message);
      } catch (_error) {
        continue;
      }

      const errorMessage = payload.error?.message || payload.error?.error?.message;
      if (errorMessage) {
        throw new Error(errorMessage);
      }

      const delta = extractStreamDelta(providerType, payload);
      if (delta) {
        fullText += delta;
        onChunk?.(fullText, delta);
      }
    }

    if (done) {
      break;
    }
  }

  if (!fullText.trim()) {
    throw new Error(
      providerType === "anthropic"
        ? "Anthropic 接口没有返回可用文本。"
        : "模型接口没有返回可用文本。",
    );
  }

  return fullText.trim();
}

module.exports = {
  parseSseMessages,
  readStreamResponse,
};
