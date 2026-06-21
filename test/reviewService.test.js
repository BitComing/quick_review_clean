const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { POLISH_AGENT } = require("../src/core/actions");
const { handleGetCurrentDate } = require("../src/llm/tools/dateTool");
const {
  DEFAULT_TAVILY_API_URL,
  DEFAULT_TAVILY_MAX_RESULTS,
} = require("../src/llm/tools/webSearchTool");
const { loadWithMocks } = require("./helpers/loadWithMocks");

const { ReviewService } = loadWithMocks(
  path.resolve(__dirname, "../src/services/reviewService.js"),
  {
    obsidian: {
      requestUrl: async () => {
        throw new Error("requestUrl should be mocked in model client tests only");
      },
    },
  },
);

function createPlugin(overrides = {}) {
  return {
    settings: {
      responseLanguage: "简体中文",
    },
    getReviewAgents() {
      return [
        {
          id: "fact-check",
          label: "事实",
          title: "事实核验",
          tools: ["current-date"],
          systemRole: "事实系统角色",
          focus: "核查事实",
        },
        {
          id: "writing",
          label: "表述",
          title: "中文编辑",
          tools: [{ type: "function", function: { name: "outline_rewrite" } }],
          systemRole: "表述系统角色",
          focus: "优化表述",
        },
      ];
    },
    getReviewAgent(actionId) {
      return this.getReviewAgents().find((agent) => agent.id === actionId);
    },
    getScopeLabel(scope) {
      return scope === "selection" ? "选中文本" : "整篇笔记";
    },
    ...overrides,
  };
}

test("runSingleReview sends agent system role and generated review prompt", async () => {
  const service = new ReviewService(createPlugin());
  let capturedPayload;
  service.callModel = async (payload) => {
    capturedPayload = payload;
    return "ok";
  };

  const agent = service.getReviewAgent("fact-check");
  const context = { scope: "selection", title: "标题", text: "正文" };
  const result = await service.runSingleReview(agent, context);

  assert.equal(result, "ok");
  assert.equal(capturedPayload.systemPrompt, "事实系统角色");
  assert.equal(capturedPayload.tools[0]?.type, "function");
  assert.equal(capturedPayload.tools[0]?.function?.name, "get_current_date");
  assert.match(capturedPayload.userPrompt, /Obsidian 选中文本/);
  assert.match(capturedPayload.userPrompt, /文稿标题：标题/);
});

test("runReviewContinuation uses continuation prompt builder", async () => {
  const service = new ReviewService(createPlugin());
  let capturedPayload;
  service.callModel = async (payload) => {
    capturedPayload = payload;
    return "continued";
  };

  const agent = service.getReviewAgent("writing");
  const result = await service.runReviewContinuation(
    agent,
    { scope: "document", title: "整篇", text: "内容" },
    "初审意见",
  );

  assert.equal(result, "continued");
  assert.equal(capturedPayload.systemPrompt, "表述系统角色");
  assert.deepEqual(capturedPayload.tools, [{ type: "function", function: { name: "outline_rewrite" } }]);
  assert.match(capturedPayload.userPrompt, /## 优先修改方案/);
  assert.match(capturedPayload.userPrompt, /初审意见/);
});

test("runPolish uses built-in polish system role", async () => {
  const service = new ReviewService(createPlugin());
  let capturedPayload;
  service.callModel = async (payload) => {
    capturedPayload = payload;
    return "polished";
  };

  const result = await service.runPolish({
    scope: "selection",
    title: "待润色",
    text: "原文",
  });

  assert.equal(result, "polished");
  assert.equal(capturedPayload.systemPrompt, POLISH_AGENT.systemRole);
  assert.deepEqual(capturedPayload.tools, []);
  assert.match(capturedPayload.userPrompt, /## 润色说明/);
});

test("runAllReviews combines all agent results into a single markdown document", async () => {
  const service = new ReviewService(createPlugin());
  service.runSingleReview = async (agent) => `${agent.label}建议`;

  const result = await service.runAllReviews({
    scope: "document",
    title: "整篇",
    text: "内容",
  });

  assert.match(result, /^# 综合审阅结果/);
  assert.match(result, /## 事实/);
  assert.match(result, /事实建议/);
  assert.match(result, /## 表述/);
  assert.match(result, /表述建议/);
  assert.match(result, /---/);
});

test("runAllReviewContinuation uses fixed chief-editor system prompt", async () => {
  const service = new ReviewService(createPlugin());
  let capturedPayload;
  service.callModel = async (payload) => {
    capturedPayload = payload;
    return "final plan";
  };

  const result = await service.runAllReviewContinuation(
    { scope: "document", title: "整篇", text: "内容" },
    "综合初审",
  );

  assert.equal(result, "final plan");
  assert.match(capturedPayload.systemPrompt, /你是一名总编辑/);
  assert.match(capturedPayload.userPrompt, /## 最高优先级问题/);
  assert.match(capturedPayload.userPrompt, /综合初审/);
});

test("callModel forwards tool handlers to model client", async () => {
  const handlers = {
    get_current_date: handleGetCurrentDate,
  };
  const service = new ReviewService(createPlugin({ toolHandlers: handlers }));
  let forwarded;

  service.callModel = async (payload) => {
    forwarded = payload;
    return "ok";
  };

  await service.runSingleReview(service.getReviewAgent("fact-check"), {
    scope: "selection",
    title: "标题",
    text: "正文",
  }, {
    toolHandlers: handlers,
  });

  assert.equal(forwarded.toolHandlers, handlers);
});

test("runSingleReview forwards onToolCall to model client", async () => {
  const service = new ReviewService(createPlugin());
  const onToolCall = () => {};
  let forwarded;

  service.callModel = async (payload) => {
    forwarded = payload;
    return "ok";
  };

  await service.runSingleReview(
    service.getReviewAgent("fact-check"),
    {
      scope: "selection",
      title: "标题",
      text: "正文",
    },
    {
      onToolCall,
    },
  );

  assert.equal(forwarded.onToolCall, onToolCall);
});

test("runSingleReview resolves anthropic tool schema when providerType is anthropic", async () => {
  const service = new ReviewService(createPlugin({
    settings: {
      responseLanguage: "简体中文",
      providerType: "anthropic",
    },
  }));
  let capturedPayload;
  service.callModel = async (payload) => {
    capturedPayload = payload;
    return "ok";
  };

  await service.runSingleReview(service.getReviewAgent("fact-check"), {
    scope: "selection",
    title: "标题",
    text: "正文",
  });

  assert.equal(capturedPayload.tools[0]?.name, "get_current_date");
  assert.equal(capturedPayload.tools[0]?.input_schema?.type, "object");
});

test("web search defaults are exported for plugin settings", () => {
  assert.equal(DEFAULT_TAVILY_API_URL, "https://api.tavily.com/search");
  assert.equal(DEFAULT_TAVILY_MAX_RESULTS, 5);
});
