const WEB_SEARCH_TOOL_NAME = "web_search";
const DEFAULT_TAVILY_API_URL = "https://api.tavily.com/search";
const DEFAULT_TAVILY_MAX_RESULTS = 5;

function getRequestUrl() {
  const { requestUrl } = require("obsidian");
  return requestUrl;
}

function resolveRequestUrl(context) {
  if (typeof context?.requestUrl === "function") {
    return context.requestUrl;
  }

  return getRequestUrl();
}

function buildWebSearchParameters() {
  return {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "要搜索的问题或关键词。",
      },
    },
    required: ["query"],
    additionalProperties: false,
  };
}

function buildWebSearchTool(providerType = "openai") {
  const description =
    "联网搜索最新公开信息，并返回简明摘要与来源列表。适合需要核实最新事件、数据、规则和时间敏感信息的场景。";

  if (providerType === "anthropic") {
    return {
      name: WEB_SEARCH_TOOL_NAME,
      description,
      input_schema: buildWebSearchParameters(),
    };
  }

  return {
    type: "function",
    function: {
      name: WEB_SEARCH_TOOL_NAME,
      description,
      parameters: buildWebSearchParameters(),
    },
  };
}

async function handleWebSearch({ query } = {}) {
  const normalizedQuery = typeof query === "string" ? query.trim() : "";

  if (!normalizedQuery) {
    throw new Error("web_search 工具需要提供 query 参数。");
  }

  const settings = this?.settings || {};
  const apiUrl = (settings.searchApiBaseUrl || DEFAULT_TAVILY_API_URL).trim();
  const apiKey = (settings.searchApiKey || "").trim();
  const maxResults = Number.isFinite(Number(settings.searchMaxResults))
    ? Math.max(1, Math.min(10, Number(settings.searchMaxResults)))
    : DEFAULT_TAVILY_MAX_RESULTS;

  const headers = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  } else {
    headers["X-Tavily-Access-Mode"] = "keyless";
  }

  const response = await resolveRequestUrl(this)({
    url: apiUrl,
    method: "POST",
    headers,
    body: JSON.stringify({
      query: normalizedQuery,
      topic: "general",
      search_depth: "basic",
      include_answer: true,
      include_raw_content: false,
      max_results: maxResults,
    }),
  });

  const payload = response?.json || {};
  const results = Array.isArray(payload.results)
    ? payload.results.map((item) => ({
        title: typeof item?.title === "string" ? item.title : "",
        url: typeof item?.url === "string" ? item.url : "",
        snippet: typeof item?.content === "string" ? item.content : "",
        score: typeof item?.score === "number" ? item.score : null,
      }))
    : [];

  return {
    query: normalizedQuery,
    summary:
      (typeof payload.answer === "string" && payload.answer.trim()) ||
      (results.length
        ? `已检索到 ${results.length} 条相关结果，请结合来源继续核实。`
        : "未检索到明确结果。"),
    results,
  };
}

module.exports = {
  DEFAULT_TAVILY_API_URL,
  DEFAULT_TAVILY_MAX_RESULTS,
  WEB_SEARCH_TOOL_NAME,
  buildWebSearchTool,
  handleWebSearch,
};
