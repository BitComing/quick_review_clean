const test = require("node:test");
const assert = require("node:assert/strict");

const { getSelectionActions } = require("../src/core/actions");
const {
  DEFAULT_SETTINGS,
  cloneDefaultAgents,
  createEmptyAgent,
  normalizeSettings,
  normalizeToolbarActionOrder,
  parseNumber,
  removeAgentReferences,
  renameAgentReferences,
} = require("../src/settings/settingsStore");

test("cloneDefaultAgents returns detached copies", () => {
  const firstClone = cloneDefaultAgents();
  const secondClone = cloneDefaultAgents();

  firstClone[0].label = "已修改";
  firstClone[0].tools.push("web-search");

  assert.notEqual(firstClone, secondClone);
  assert.notEqual(firstClone[0], secondClone[0]);
  assert.equal(secondClone[0].label, DEFAULT_SETTINGS.reviewAgents[0].label);
  assert.deepEqual(secondClone[0].tools, DEFAULT_SETTINGS.reviewAgents[0].tools);
});

test("createEmptyAgent returns the expected agent shape", () => {
  const agent = createEmptyAgent();

  assert.match(agent.id, /^agent-\d+$/);
  assert.equal(agent.label, "新 Agent");
  assert.equal(agent.title, "新 Agent");
  assert.deepEqual(agent.tools, []);
  assert.equal(agent.systemRole, "");
  assert.equal(agent.focus, "");
});

test("parseNumber falls back for invalid values", () => {
  assert.equal(parseNumber("12", 5), 12);
  assert.equal(parseNumber("bad", 5), 5);
});

test("normalizeToolbarActionOrder keeps known ids and appends missing actions", () => {
  const actions = [
    { id: "all-review" },
    { id: "fact-check" },
    { id: "writing" },
  ];

  assert.deepEqual(normalizeToolbarActionOrder(["writing", "missing"], actions), [
    "writing",
    "all-review",
    "fact-check",
  ]);
});

test("normalizeSettings restores defaults and normalizes toolbar order", () => {
  const settings = normalizeSettings(
    {
      providerType: "anthropic",
      reviewAgents: [],
      hiddenToolbarButtons: ["writing"],
      toolbarActionOrder: ["writing", "missing", "all-review"],
    },
    { getSelectionActions },
  );

  assert.equal(settings.providerType, "anthropic");
  assert.deepEqual(settings.hiddenToolbarButtons, ["writing"]);
  assert.equal(settings.reviewAgents.length > 0, true);
  const expectedToolbarActionOrder = normalizeToolbarActionOrder(
    ["writing", "missing", "all-review"],
    getSelectionActions(cloneDefaultAgents()),
  );
  assert.deepEqual(settings.toolbarActionOrder, expectedToolbarActionOrder);
});

test("renameAgentReferences updates hidden and ordered action ids", () => {
  const settings = {
    hiddenToolbarButtons: ["agent-a", "agent-b"],
    toolbarActionOrder: ["all-review", "agent-a", "polish"],
  };

  renameAgentReferences(settings, "agent-a", "agent-renamed");

  assert.deepEqual(settings.hiddenToolbarButtons, ["agent-renamed", "agent-b"]);
  assert.deepEqual(settings.toolbarActionOrder, ["all-review", "agent-renamed", "polish"]);
});

test("removeAgentReferences removes agent ids from toolbar preferences", () => {
  const settings = {
    hiddenToolbarButtons: ["agent-a", "agent-b"],
    toolbarActionOrder: ["all-review", "agent-a", "polish"],
  };

  removeAgentReferences(settings, "agent-a");

  assert.deepEqual(settings.hiddenToolbarButtons, ["agent-b"]);
  assert.deepEqual(settings.toolbarActionOrder, ["all-review", "polish"]);
});
