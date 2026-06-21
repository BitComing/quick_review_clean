const test = require("node:test");
const assert = require("node:assert/strict");

const {
  ALL_REVIEW_ACTION,
  DEFAULT_REVIEW_AGENTS,
  POLISH_AGENT,
  REVIEW_SCOPES,
  buildCommandDefinitions,
  getActionTitle,
  getDocumentActions,
  getSelectionActions,
  isAllReviewAction,
  isPolishAction,
  resolveAgentTools,
} = require("../src/core/actions");

const sampleAgents = [
  {
    id: "agent-a",
    label: "甲",
    title: "甲标题",
    tools: ["search"],
    systemRole: "role-a",
    focus: "focus-a",
  },
  {
    id: "agent-b",
    label: "乙",
    title: "乙标题",
    tools: [],
    systemRole: "role-b",
    focus: "focus-b",
  },
];

test("getSelectionActions includes all review action, custom agents, and polish", () => {
  const actions = getSelectionActions(sampleAgents);

  assert.equal(actions[0], ALL_REVIEW_ACTION);
  assert.deepEqual(actions.slice(1, -1), sampleAgents);
  assert.equal(actions.at(-1), POLISH_AGENT);
});

test("getDocumentActions excludes polish action", () => {
  const actions = getDocumentActions(sampleAgents);

  assert.equal(actions[0], ALL_REVIEW_ACTION);
  assert.deepEqual(actions.slice(1), sampleAgents);
  assert.equal(actions.includes(POLISH_AGENT), false);
});

test("getActionTitle resolves built-in, custom, and unknown actions", () => {
  assert.equal(getActionTitle(ALL_REVIEW_ACTION.id, sampleAgents), ALL_REVIEW_ACTION.title);
  assert.equal(getActionTitle(POLISH_AGENT.id, sampleAgents), POLISH_AGENT.title);
  assert.equal(getActionTitle("agent-b", sampleAgents), "乙标题");
  assert.equal(getActionTitle("missing", sampleAgents), "审阅");
});

test("isAllReviewAction and isPolishAction only match their own ids", () => {
  assert.equal(isAllReviewAction(ALL_REVIEW_ACTION.id), true);
  assert.equal(isAllReviewAction(POLISH_AGENT.id), false);
  assert.equal(isPolishAction(POLISH_AGENT.id), true);
  assert.equal(isPolishAction(ALL_REVIEW_ACTION.id), false);
});

test("buildCommandDefinitions creates selection/document commands plus built-ins", () => {
  const commands = buildCommandDefinitions(sampleAgents);

  assert.equal(commands.length, sampleAgents.length * 2 + 3);
  assert.deepEqual(commands[0], {
    id: `agent-a-${REVIEW_SCOPES.SELECTION}`,
    name: "甲：审阅选中文本",
    actionId: "agent-a",
    scope: REVIEW_SCOPES.SELECTION,
  });
  assert.deepEqual(commands[1], {
    id: `agent-a-${REVIEW_SCOPES.DOCUMENT}`,
    name: "甲：审阅整篇笔记",
    actionId: "agent-a",
    scope: REVIEW_SCOPES.DOCUMENT,
  });
  assert.deepEqual(commands.at(-1), {
    id: `${POLISH_AGENT.id}-${REVIEW_SCOPES.SELECTION}`,
    name: "一键润色：润色选中文本",
    actionId: POLISH_AGENT.id,
    scope: REVIEW_SCOPES.SELECTION,
  });
});

test("default fact-check agent enables current-date tool alias", () => {
  assert.deepEqual(DEFAULT_REVIEW_AGENTS[0].tools, ["current-date"]);
});

test("resolveAgentTools maps current-date alias to provider-specific tool schema", () => {
  const openaiTools = resolveAgentTools({ tools: ["current-date"] }, "openai");
  const anthropicTools = resolveAgentTools({ tools: ["current-date"] }, "anthropic");

  assert.equal(openaiTools[0]?.type, "function");
  assert.equal(openaiTools[0]?.function?.name, "get_current_date");
  assert.equal(anthropicTools[0]?.name, "get_current_date");
  assert.equal(anthropicTools[0]?.input_schema?.type, "object");
});

test("resolveAgentTools maps supported aliases and keeps supported tool definitions", () => {
  const customTool = { type: "function", function: { name: "read_note" } };
  const resolvedTools = resolveAgentTools(
    { tools: ["current-date", "web-search", customTool, null] },
    "openai",
  );

  assert.equal(resolvedTools.length, 3);
  assert.equal(resolvedTools[0]?.function?.name, "get_current_date");
  assert.equal(resolvedTools[1]?.function?.name, "web_search");
  assert.equal(resolvedTools[2], customTool);
});
