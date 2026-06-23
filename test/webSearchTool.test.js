const test = require("node:test");
const assert = require("node:assert/strict");

const { createRequestModuleLoader } = require("./helpers/requestModuleLoader.cjs");

const loadWebSearchTool = createRequestModuleLoader("src/llm/tools/webSearchTool.js");

test("buildWebSearchTool returns OpenAI function schema by default", () => {
  const { WEB_SEARCH_TOOL_NAME, buildWebSearchTool } = loadWebSearchTool(async () => {
    throw new Error("should not call requestUrl");
  });
  const tool = buildWebSearchTool();

  assert.equal(tool.type, "function");
  assert.equal(tool.function.name, WEB_SEARCH_TOOL_NAME);
  assert.equal(tool.function.parameters.type, "object");
  assert.equal(tool.function.parameters.required[0], "query");
});

test("buildWebSearchTool returns Anthropic schema when requested", () => {
  const { WEB_SEARCH_TOOL_NAME, buildWebSearchTool } = loadWebSearchTool(async () => {
    throw new Error("should not call requestUrl");
  });
  const tool = buildWebSearchTool("anthropic");

  assert.equal(tool.name, WEB_SEARCH_TOOL_NAME);
  assert.equal(tool.input_schema.type, "object");
  assert.equal(tool.input_schema.required[0], "query");
});

test("handleWebSearch calls Tavily with bearer auth and normalizes results", async () => {
  let capturedRequest;
  const { handleWebSearch } = loadWebSearchTool(async (request) => {
    capturedRequest = request;
    return {
      json: {
        answer: "这是简要答案",
        results: [
          {
            title: "结果 A",
            url: "https://example.com/a",
            content: "摘要 A",
            score: 0.91,
          },
        ],
      },
    };
  });

  const result = await handleWebSearch.call(
    {
      requestUrl: async (request) => {
        capturedRequest = request;
        return {
          json: {
            answer: "这是简要答案",
            results: [
              {
                title: "结果 A",
                url: "https://example.com/a",
                content: "摘要 A",
                score: 0.91,
              },
            ],
          },
        };
      },
      settings: {
        searchApiKey: "tvly-secret",
        searchApiBaseUrl: "https://api.tavily.com/search",
        searchMaxResults: 3,
      },
    },
    { query: "OpenAI 最新模型" },
  );

  assert.equal(capturedRequest.url, "https://api.tavily.com/search");
  assert.equal(capturedRequest.method, "POST");
  assert.equal(capturedRequest.headers.Authorization, "Bearer tvly-secret");

  const body = JSON.parse(capturedRequest.body);
  assert.equal(body.query, "OpenAI 最新模型");
  assert.equal(body.max_results, 3);
  assert.equal(body.include_answer, true);

  assert.equal(result.query, "OpenAI 最新模型");
  assert.equal(result.summary, "这是简要答案");
  assert.deepEqual(result.results, [
    {
      title: "结果 A",
      url: "https://example.com/a",
      snippet: "摘要 A",
      score: 0.91,
    },
  ]);
});

test("handleWebSearch uses keyless mode when api key is empty", async () => {
  let capturedRequest;
  const { handleWebSearch } = loadWebSearchTool(async (request) => {
    capturedRequest = request;
    return {
      json: {
        results: [],
      },
    };
  });

  await handleWebSearch.call(
    {
      requestUrl: async (request) => {
        capturedRequest = request;
        return {
          json: {
            results: [],
          },
        };
      },
      settings: {
        searchApiKey: "",
        searchApiBaseUrl: "https://api.tavily.com/search",
        searchMaxResults: 5,
      },
    },
    { query: "Obsidian 插件" },
  );

  assert.equal(capturedRequest.headers["X-Tavily-Access-Mode"], "keyless");
  assert.equal(capturedRequest.headers.Authorization, undefined);
});

test("handleWebSearch uses advanced depth when deep mode is enabled", async () => {
  let capturedRequest;
  const { handleWebSearch } = loadWebSearchTool(async (request) => {
    capturedRequest = request;
    return {
      json: {
        results: [],
      },
    };
  });

  await handleWebSearch.call(
    {
      requestUrl: async (request) => {
        capturedRequest = request;
        return {
          json: {
            results: [],
          },
        };
      },
      settings: {
        searchApiKey: "tvly-secret",
        searchApiBaseUrl: "https://api.tavily.com/search",
        searchMaxResults: 5,
        searchDeepMode: true,
      },
    },
    { query: "需要更深入内容的主题" },
  );

  const body = JSON.parse(capturedRequest.body);
  assert.equal(body.search_depth, "advanced");
});

test("handleWebSearch rejects empty query", async () => {
  const { handleWebSearch } = loadWebSearchTool(async () => {
    throw new Error("should not call requestUrl");
  });

  await assert.rejects(() => handleWebSearch({ query: "   " }), /query 参数/);
});
