const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { loadWithMocks } = require("./helpers/loadWithMocks");

const {
  extractJsonObject,
  finalizeGeneratedAgent,
  normalizeGeneratedAgent,
  sanitizeAgentId,
} = loadWithMocks(path.resolve(__dirname, "../src/settings/agentSection.js"), {
  obsidian: {
    Modal: class FakeModal {},
    Notice: class FakeNotice {},
    Setting: class FakeSetting {},
    setIcon() {},
  },
});

test("extractJsonObject parses plain JSON text", () => {
  assert.deepEqual(extractJsonObject('{"id":"fact-check","tools":["web-search"]}'), {
    id: "fact-check",
    tools: ["web-search"],
  });
});

test("extractJsonObject parses JSON inside markdown code fences", () => {
  assert.deepEqual(
    extractJsonObject('```json\n{"id":"style-editor","label":"风格"}\n```'),
    {
      id: "style-editor",
      label: "风格",
    },
  );
});

test("extractJsonObject extracts the first JSON object from wrapped text", () => {
  assert.deepEqual(
    extractJsonObject('下面是结果：\n{"id":"logic-reviewer","title":"逻辑审阅"}\n请查收。'),
    {
      id: "logic-reviewer",
      title: "逻辑审阅",
    },
  );
});

test("extractJsonObject rejects invalid JSON text", () => {
  assert.throws(() => extractJsonObject("not json"), /合法 JSON|可解析的文本/);
});

test("sanitizeAgentId normalizes case whitespace and special characters", () => {
  assert.equal(sanitizeAgentId("  Logic Reviewer V2!  "), "logic-reviewer-v2");
  assert.equal(sanitizeAgentId("中文 Agent 名称"), "agent");
});

test("normalizeGeneratedAgent trims strings and filters unsupported tools", () => {
  assert.deepEqual(
    normalizeGeneratedAgent({
      id: "  Style Coach  ",
      label: "  风格  ",
      title: "  风格教练 ",
      tools: ["web-search", "unknown-tool", 123, "current-date"],
      systemRole: "  负责统一文风  ",
      focus: "  关注措辞、语气与节奏  ",
    }),
    {
      id: "style-coach",
      label: "风格",
      title: "风格教练",
      tools: ["web-search", "current-date"],
      systemRole: "负责统一文风",
      focus: "关注措辞、语气与节奏",
    },
  );
});

test("finalizeGeneratedAgent rejects duplicate ids", () => {
  assert.throws(
    () =>
      finalizeGeneratedAgent(
        {
          id: "fact-check",
          label: "事实",
          title: "事实核验",
          tools: [],
          systemRole: "",
          focus: "",
        },
        [{ id: "fact-check" }],
      ),
    /已存在/,
  );
});

test("finalizeGeneratedAgent fills missing label and title defaults", () => {
  assert.deepEqual(
    finalizeGeneratedAgent(
      {
        id: "logic-reviewer",
        label: "",
        title: "",
        tools: ["current-date"],
        systemRole: "检查逻辑漏洞",
        focus: "优先指出推理断层",
      },
      [],
    ),
    {
      id: "logic-reviewer",
      label: "logic-reviewer",
      title: "logic-reviewer",
      tools: ["current-date"],
      systemRole: "检查逻辑漏洞",
      focus: "优先指出推理断层",
    },
  );
});

test("finalizeGeneratedAgent rejects missing normalized id", () => {
  assert.throws(
    () =>
      finalizeGeneratedAgent(
        {
          id: "",
          label: "风格",
          title: "风格教练",
          tools: [],
          systemRole: "",
          focus: "",
        },
        [],
      ),
    /缺少合法的 id/,
  );
});
