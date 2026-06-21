const test = require("node:test");
const assert = require("node:assert/strict");

const { createRequestModuleLoader } = require("./helpers/requestModuleLoader.cjs");
const { parseSseMessages } = require("../src/llm/streaming/sse");

const loadModelClient = createRequestModuleLoader("src/llm/modelClient.js");

test("parseCustomHeaders returns empty object for blank input", () => {
  const { parseCustomHeaders } = loadModelClient(async () => {
    throw new Error("should not call requestUrl");
  });

  assert.deepEqual(parseCustomHeaders({ customHeaders: "   " }), {});
});

test("parseCustomHeaders accepts valid JSON object and rejects invalid shapes", () => {
  const { parseCustomHeaders } = loadModelClient(async () => {
    throw new Error("should not call requestUrl");
  });

  assert.deepEqual(parseCustomHeaders({ customHeaders: '{"x-test":"ok"}' }), {
    "x-test": "ok",
  });
  assert.throws(() => parseCustomHeaders({ customHeaders: "[]" }), /合法的 JSON 对象/);
  assert.throws(() => parseCustomHeaders({ customHeaders: "{bad json}" }), /合法的 JSON 对象/);
});

test("validateSettings rejects missing required fields", () => {
  const { validateSettings } = loadModelClient(async () => {
    throw new Error("should not call requestUrl");
  });

  assert.throws(() => validateSettings({ apiUrl: "", model: "m", apiKey: "k" }), /API URL/);
  assert.throws(() => validateSettings({ apiUrl: "u", model: "", apiKey: "k" }), /模型名称/);
  assert.throws(() => validateSettings({ apiUrl: "u", model: "m", apiKey: "" }), /API Key/);
});

test("callModel builds OpenAI-compatible request and trims returned text", async () => {
  let capturedRequest;
  const { callModel } = loadModelClient(async (request) => {
    capturedRequest = request;
    return {
      json: {
        choices: [
          {
            message: {
              content: [{ text: " 第一行 " }, { content: "第二行" }],
            },
          },
        ],
      },
    };
  });

  const result = await callModel(
    {
      providerType: "openai",
      apiUrl: "https://example.com/v1/chat/completions",
      apiKey: "secret",
      model: "gpt-test",
      maxTokens: 1024,
      temperature: 0.3,
      customHeaders: '{"x-extra":"1"}',
    },
    {
      systemPrompt: "system text",
      userPrompt: "user text",
      tools: ["web-search", { type: "function", function: { name: "read_note" } }],
    },
  );

  assert.equal(result, "第一行 \n第二行");
  assert.equal(capturedRequest.url, "https://example.com/v1/chat/completions");
  assert.equal(capturedRequest.method, "POST");
  assert.equal(capturedRequest.headers.Authorization, "Bearer secret");
  assert.equal(capturedRequest.headers["x-extra"], "1");

  const body = JSON.parse(capturedRequest.body);
  assert.equal(body.model, "gpt-test");
  assert.deepEqual(body.messages, [
    { role: "system", content: "system text" },
    { role: "user", content: "user text" },
  ]);
  assert.deepEqual(body.tools, ["web-search", { type: "function", function: { name: "read_note" } }]);
});

test("callModel builds Anthropic request and uses default version header", async () => {
  let capturedRequest;
  const { callModel } = loadModelClient(async (request) => {
    capturedRequest = request;
    return {
      json: {
        content: [{ text: " Anthropic output " }],
      },
    };
  });

  const result = await callModel(
    {
      providerType: "anthropic",
      apiUrl: "https://example.com/v1/messages",
      apiKey: "secret",
      model: "claude-test",
      maxTokens: 2048,
      temperature: 0.2,
      customHeaders: "{}",
    },
    {
      systemPrompt: "anthropic system",
      userPrompt: "anthropic user",
      tools: [{ name: "vault_search", description: "Search Obsidian vault", input_schema: { type: "object" } }],
    },
  );

  assert.equal(result, "Anthropic output");
  assert.equal(capturedRequest.headers["x-api-key"], "secret");
  assert.equal(capturedRequest.headers["anthropic-version"], "2023-06-01");

  const body = JSON.parse(capturedRequest.body);
  assert.equal(body.system, "anthropic system");
  assert.deepEqual(body.messages, [{ role: "user", content: "anthropic user" }]);
  assert.deepEqual(body.tools, [
    { name: "vault_search", description: "Search Obsidian vault", input_schema: { type: "object" } },
  ]);
});

test("buildRequest omits invalid tools and only sends normalized entries", () => {
  const { buildRequest } = loadModelClient(async () => ({
    json: {},
  }));

  const { body } = buildRequest(
    {
      providerType: "openai",
      apiUrl: "https://example.com/v1/chat/completions",
      apiKey: "secret",
      model: "gpt-test",
      maxTokens: 1024,
      temperature: 0.3,
      customHeaders: "{}",
    },
    {
      systemPrompt: "system text",
      userPrompt: "user text",
      tools: [null, "", "web-search", { type: "function", function: { name: "read_note" } }],
    },
    false,
  );

  assert.deepEqual(body.tools, ["web-search", { type: "function", function: { name: "read_note" } }]);
});

test("callModel surfaces provider errors when no usable text is returned", async () => {
  const { callModel } = loadModelClient(async () => ({
    json: {
      error: { message: "provider failed" },
      choices: [],
    },
  }));

  await assert.rejects(
    () =>
      callModel(
        {
          providerType: "openai",
          apiUrl: "https://example.com",
          apiKey: "secret",
          model: "gpt-test",
          maxTokens: 1,
          temperature: 0,
          customHeaders: "{}",
        },
        {
          systemPrompt: "system",
          userPrompt: "user",
        },
      ),
    /provider failed/,
  );
});

test("parseSseMessages returns complete events and keeps trailing remainder", () => {
  const { messages, remainder } = parseSseMessages(
    'data: {"choices":[{"delta":{"content":"A"}}]}\n\n' +
      'data: {"choices":[{"delta":{"content":"B"}}]}\n' +
      "\n" +
      'data: {"choices":[{"delta":{"content":"C"}}]}',
  );

  assert.deepEqual(messages, [
    '{"choices":[{"delta":{"content":"A"}}]}',
    '{"choices":[{"delta":{"content":"B"}}]}',
  ]);
  assert.equal(remainder, 'data: {"choices":[{"delta":{"content":"C"}}]}');
});

test("callModel streams OpenAI-compatible responses through fetch", async () => {
  const originalFetch = global.fetch;
  let capturedRequest;
  global.fetch = async (url, options) => {
    capturedRequest = { url, ...options };
    const encoder = new TextEncoder();
    return {
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode('data: {"choices":[{"delta":{"content":"你好"}}]}\n\n'),
          );
          controller.enqueue(
            encoder.encode('data: {"choices":[{"delta":{"content":"，世界"}}]}\n\n'),
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      }),
    };
  };

  try {
    const { callModel } = loadModelClient(async () => {
      throw new Error("should use fetch in streaming mode");
    });
    const snapshots = [];

    const result = await callModel(
      {
        providerType: "openai",
        apiUrl: "https://example.com/v1/chat/completions",
        apiKey: "secret",
        model: "gpt-test",
        maxTokens: 1024,
        temperature: 0.3,
        customHeaders: "{}",
      },
      {
        systemPrompt: "system text",
        userPrompt: "user text",
        onChunk: (fullText) => snapshots.push(fullText),
      },
    );

    assert.equal(result, "你好，世界");
    assert.deepEqual(snapshots, ["你好", "你好，世界"]);
    assert.equal(capturedRequest.url, "https://example.com/v1/chat/completions");

    const body = JSON.parse(capturedRequest.body);
    assert.equal(body.stream, true);
  } finally {
    global.fetch = originalFetch;
  }
});

test("callModel executes OpenAI tool calls and returns final text", async () => {
  const requests = [];
  const { callModel } = loadModelClient(async (request) => {
    requests.push(JSON.parse(request.body));

    if (requests.length === 1) {
      return {
        json: {
          choices: [
            {
              message: {
                role: "assistant",
                content: "",
                tool_calls: [
                  {
                    id: "call_1",
                    type: "function",
                    function: {
                      name: "read_note",
                      arguments: '{"path":"daily.md"}',
                    },
                  },
                ],
              },
            },
          ],
        },
      };
    }

    return {
      json: {
        choices: [
          {
            message: {
              content: "工具执行完成",
            },
          },
        ],
      },
    };
  });

  const result = await callModel(
    {
      providerType: "openai",
      apiUrl: "https://example.com/v1/chat/completions",
      apiKey: "secret",
      model: "gpt-test",
      maxTokens: 1024,
      temperature: 0.3,
      customHeaders: "{}",
    },
    {
      systemPrompt: "system text",
      userPrompt: "user text",
      tools: [{ type: "function", function: { name: "read_note" } }],
      toolHandlers: {
        read_note: async ({ path }) => `content:${path}`,
      },
    },
  );

  assert.equal(result, "工具执行完成");
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[1].messages, [
    { role: "system", content: "system text" },
    { role: "user", content: "user text" },
    {
      role: "assistant",
      content: "",
      tool_calls: [
        {
          id: "call_1",
          type: "function",
          function: {
            name: "read_note",
            arguments: '{"path":"daily.md"}',
          },
        },
      ],
    },
    {
      role: "tool",
      tool_call_id: "call_1",
      content: "content:daily.md",
    },
  ]);
});

test("callModel reports OpenAI tool calls through onToolCall", async () => {
  const { callModel } = loadModelClient(async (request) => {
    const body = JSON.parse(request.body);

    if (Array.isArray(body.messages) && body.messages.length === 2) {
      return {
        json: {
          choices: [
            {
              message: {
                role: "assistant",
                content: "",
                tool_calls: [
                  {
                    id: "call_1",
                    type: "function",
                    function: {
                      name: "get_current_date",
                      arguments: "{}",
                    },
                  },
                ],
              },
            },
          ],
        },
      };
    }

    return {
      json: {
        choices: [
          {
            message: {
              content: "done",
            },
          },
        ],
      },
    };
  });

  const calls = [];
  const result = await callModel(
    {
      providerType: "openai",
      apiUrl: "https://example.com/v1/chat/completions",
      apiKey: "secret",
      model: "gpt-test",
      maxTokens: 1024,
      temperature: 0.3,
      customHeaders: "{}",
    },
    {
      systemPrompt: "system text",
      userPrompt: "user text",
      tools: [{ type: "function", function: { name: "get_current_date" } }],
      toolHandlers: {
        get_current_date: async () => ({ isoDate: "2026-06-20" }),
      },
      onToolCall: (toolName, args) => {
        calls.push({ toolName, args });
      },
    },
  );

  assert.equal(result, "done");
  assert.deepEqual(calls, [{ toolName: "get_current_date", args: {} }]);
});

test("callModel executes Anthropic tool use blocks and returns final text", async () => {
  const requests = [];
  const { callModel } = loadModelClient(async (request) => {
    requests.push(JSON.parse(request.body));

    if (requests.length === 1) {
      return {
        json: {
          content: [
            {
              type: "tool_use",
              id: "toolu_1",
              name: "vault_search",
              input: { query: "PKM" },
            },
          ],
        },
      };
    }

    return {
      json: {
        content: [{ type: "text", text: "Anthropic final" }],
      },
    };
  });

  const result = await callModel(
    {
      providerType: "anthropic",
      apiUrl: "https://example.com/v1/messages",
      apiKey: "secret",
      model: "claude-test",
      maxTokens: 1024,
      temperature: 0.3,
      customHeaders: "{}",
    },
    {
      systemPrompt: "system text",
      userPrompt: "user text",
      tools: [{ name: "vault_search", input_schema: { type: "object" } }],
      toolHandlers: {
        vault_search: async ({ query }) => ({ hits: [query] }),
      },
    },
  );

  assert.equal(result, "Anthropic final");
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[1].messages, [
    { role: "user", content: "user text" },
    {
      role: "assistant",
      content: [
        {
          type: "tool_use",
          id: "toolu_1",
          name: "vault_search",
          input: { query: "PKM" },
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_1",
          content: '{"hits":["PKM"]}',
        },
      ],
    },
  ]);
});

test("callModel rejects when model requests a missing tool handler", async () => {
  const { callModel } = loadModelClient(async () => ({
    json: {
      choices: [
        {
          message: {
            role: "assistant",
            tool_calls: [
              {
                id: "call_1",
                type: "function",
                function: {
                  name: "missing_tool",
                  arguments: "{}",
                },
              },
            ],
          },
        },
      ],
    },
  }));

  await assert.rejects(
    () =>
      callModel(
        {
          providerType: "openai",
          apiUrl: "https://example.com/v1/chat/completions",
          apiKey: "secret",
          model: "gpt-test",
          maxTokens: 1024,
          temperature: 0.3,
          customHeaders: "{}",
        },
        {
          systemPrompt: "system text",
          userPrompt: "user text",
          tools: [{ type: "function", function: { name: "missing_tool" } }],
        },
      ),
    /missing_tool/,
  );
});
