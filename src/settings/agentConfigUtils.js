function getAvailableAgentTools() {
  return [
    {
      id: "current-date",
      name: "当前日期",
      description: "允许 Agent 获取当前本地日期、星期、时区与 UTC 偏移。",
    },
    {
      id: "web-search",
      name: "联网搜索",
      description: "允许 Agent 联网检索最新公开信息。当前为可接入骨架，需在代码中配置真实搜索实现。",
    },
  ];
}

function extractJsonObject(text) {
  if (typeof text !== "string") {
    throw new Error("AI 没有返回可解析的文本。");
  }

  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch ? fencedMatch[1].trim() : trimmed;

  try {
    return JSON.parse(candidate);
  } catch (_error) {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1));
    }
    throw new Error("AI 返回内容不是合法 JSON。");
  }
}

function sanitizeAgentId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeGeneratedAgent(data) {
  const toolOptions = new Set(getAvailableAgentTools().map((tool) => tool.id));
  const normalizedTools = Array.isArray(data?.tools)
    ? data.tools.filter((toolId) => typeof toolId === "string" && toolOptions.has(toolId))
    : [];
  const id = sanitizeAgentId(data?.id);

  return {
    id,
    label: String(data?.label || "").trim(),
    title: String(data?.title || "").trim(),
    tools: normalizedTools,
    systemRole: String(data?.systemRole || "").trim(),
    focus: String(data?.focus || "").trim(),
  };
}

function finalizeGeneratedAgent(generatedAgent, existingAgents = []) {
  if (!generatedAgent?.id) {
    throw new Error("AI 生成结果缺少合法的 id。");
  }

  const idExists = existingAgents.some((agent) => agent.id === generatedAgent.id);
  if (idExists) {
    throw new Error(`AI 生成的 id "${generatedAgent.id}" 已存在，请重试。`);
  }

  return {
    ...generatedAgent,
    label: generatedAgent.label || generatedAgent.id,
    title: generatedAgent.title || generatedAgent.label || generatedAgent.id,
    tools: Array.isArray(generatedAgent.tools) ? [...generatedAgent.tools] : [],
  };
}

module.exports = {
  extractJsonObject,
  finalizeGeneratedAgent,
  getAvailableAgentTools,
  normalizeGeneratedAgent,
  sanitizeAgentId,
};
