const test = require("node:test");
const assert = require("node:assert/strict");

const { ActionOrchestrator, formatToolStatusLabel } = require("../src/core/actionOrchestrator");

function createResultView() {
  return {
    options: {},
    activeRequestId: null,
    loadingCalls: [],
    errorCalls: [],
    streamingCalls: [],
    loadingTextCalls: [],
    markdownCalls: [],
    setLoading(text) {
      this.loadingCalls.push(text);
      return 7;
    },
    setError(requestId, message) {
      this.errorCalls.push({ requestId, message });
    },
    updateStreamingMarkdown(requestId, markdown) {
      this.streamingCalls.push({ requestId, markdown });
    },
    updateLoadingText(requestId, text) {
      this.loadingTextCalls.push({ requestId, text });
    },
    async setMarkdown(requestId, markdown) {
      this.markdownCalls.push({ requestId, markdown });
    },
    getRequestState() {
      return { rawMarkdown: "已有审阅" };
    },
  };
}

function createPlugin(overrides = {}) {
  const resultView = overrides.resultView || createResultView();
  const plugin = {
    reviewService: {
      async runAllReviews() {
        return "all-review";
      },
      async runAllReviewContinuation() {
        return "all-review-next";
      },
      async runPolish() {
        return "polished";
      },
      async runSingleReview() {
        return "single-review";
      },
      async runReviewContinuation() {
        return "single-review-next";
      },
    },
    notices: [],
    openResultViewCalls: [],
    openFollowUpChatCalls: [],
    applyPolishedTextCalls: [],
    locateSelectionCalls: [],
    getActionContext() {
      return {
        file: { name: "note.md" },
        title: "note",
        scope: "selection",
        text: "content",
        selectionRange: { from: 1, to: 2 },
      };
    },
    async openResultView(options) {
      this.openResultViewCalls.push(options);
      resultView.options = options;
      return resultView;
    },
    getReviewAgents() {
      return [{ id: "agent-1", label: "Agent 1", title: "Agent One" }];
    },
    getReviewAgent(id) {
      return this.getReviewAgents().find((agent) => agent.id === id) || null;
    },
    getScopeLabel(scope) {
      return scope === "selection" ? "选中文本" : "整篇笔记";
    },
    formatError(error) {
      return error?.message || String(error);
    },
    showNotice(message) {
      this.notices.push(message);
    },
    locateSelectionInEditor(context) {
      this.locateSelectionCalls.push(context);
    },
    async openFollowUpChat(payload) {
      this.openFollowUpChatCalls.push(payload);
    },
    applyPolishedText(context, rawMarkdown) {
      this.applyPolishedTextCalls.push({ context, rawMarkdown });
    },
    ...overrides,
  };

  return { plugin, resultView };
}

test("formatToolStatusLabel normalizes tool names", () => {
  assert.equal(formatToolStatusLabel("get_current_date"), "current-date");
  assert.equal(formatToolStatusLabel("web_search"), "web-search");
  assert.equal(formatToolStatusLabel(""), "unknown");
});

test("runAction shows notice for context errors", async () => {
  const { plugin } = createPlugin({
    getActionContext() {
      const error = new Error("缺少上下文");
      error.isContextError = true;
      throw error;
    },
  });
  const orchestrator = new ActionOrchestrator(plugin);

  await orchestrator.runAction("agent-1", "selection");

  assert.deepEqual(plugin.notices, ["缺少上下文"]);
});

test("runAction opens fallback result view for unexpected errors", async () => {
  const { plugin, resultView } = createPlugin({
    getActionContext() {
      throw new Error("boom");
    },
  });
  const orchestrator = new ActionOrchestrator(plugin);

  await orchestrator.runAction("agent-1", "selection");

  assert.equal(plugin.openResultViewCalls.length, 1);
  assert.deepEqual(resultView.loadingCalls, ["处理失败"]);
  assert.deepEqual(resultView.errorCalls, [{ requestId: 7, message: "boom" }]);
});

test("runAction executes single-agent flow and wires continuation", async () => {
  const { plugin, resultView } = createPlugin();
  const singleReviewCalls = [];
  const continuationCalls = [];
  plugin.reviewService.runSingleReview = async (agent, context, options) => {
    singleReviewCalls.push({ agent, context });
    options.onChunk("streaming");
    options.onToolCall("get_current_date");
    return "single-review";
  };
  plugin.reviewService.runReviewContinuation = async (agent, context, markdown, options) => {
    continuationCalls.push({ agent, context, markdown, options });
    return "continued";
  };
  const orchestrator = new ActionOrchestrator(plugin);

  await orchestrator.runAction("agent-1", "selection");
  const continued = await resultView.options.onContinue({
    onChunk() {},
    onToolCall() {},
  });

  assert.equal(singleReviewCalls.length, 1);
  assert.deepEqual(resultView.loadingCalls, ["正在处理选中文本..."]);
  assert.deepEqual(resultView.streamingCalls, [{ requestId: 7, markdown: "streaming" }]);
  assert.deepEqual(resultView.loadingTextCalls, [
    { requestId: 7, text: "正在调用 current-date 工具" },
  ]);
  assert.deepEqual(resultView.markdownCalls, [{ requestId: 7, markdown: "single-review" }]);
  assert.equal(continued, "continued");
  assert.equal(continuationCalls.length, 1);
  assert.equal(continuationCalls[0].markdown, "single-review");
});

test("runAction executes polish flow and wires apply callback", async () => {
  const { plugin, resultView } = createPlugin();
  plugin.reviewService.runPolish = async () => "polished";
  const orchestrator = new ActionOrchestrator(plugin);

  await orchestrator.runAction("polish", "selection");
  resultView.rawMarkdown = "latest polished";
  resultView.options.onApply();

  assert.deepEqual(resultView.markdownCalls, [{ requestId: 7, markdown: "polished" }]);
  assert.deepEqual(plugin.applyPolishedTextCalls, [
    {
      context: plugin.getActionContext(),
      rawMarkdown: "latest polished",
    },
  ]);
});

test("runAction executes all-review flow and wires continuation", async () => {
  const { plugin, resultView } = createPlugin({
    getReviewAgents() {
      return [{ id: "agent-1", label: "Agent 1", title: "Agent One" }];
    },
  });
  const continuationCalls = [];
  plugin.reviewService.runAllReviews = async () => "all-review";
  plugin.reviewService.runAllReviewContinuation = async (context, markdown, options) => {
    continuationCalls.push({ context, markdown, options });
    return "all-review-next";
  };
  const orchestrator = new ActionOrchestrator(plugin);

  await orchestrator.runAction("all-review", "selection");
  const next = await resultView.options.onContinue({
    onChunk() {},
    onToolCall() {},
  });

  assert.deepEqual(resultView.markdownCalls, [{ requestId: 7, markdown: "all-review" }]);
  assert.equal(next, "all-review-next");
  assert.equal(continuationCalls.length, 1);
  assert.equal(continuationCalls[0].markdown, "all-review");
});
