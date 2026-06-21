const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildAllReviewContinuationPrompt,
  buildFollowUpChatPrompt,
  buildPolishPrompt,
  buildReviewContinuationPrompt,
  buildReviewPrompt,
} = require("../src/core/prompts");

const settings = { responseLanguage: "简体中文" };
const agent = { title: "事实核验", focus: "核对事实与逻辑" };
const context = {
  scope: "selection",
  title: "测试标题",
  text: "这里是一段待处理文本。",
};
const getScopeLabel = (scope) => (scope === "selection" ? "选中文本" : "整篇笔记");

test("buildReviewPrompt injects scope, role, language, and source text", () => {
  const prompt = buildReviewPrompt(settings, getScopeLabel, agent, context);

  assert.match(prompt, /Obsidian 选中文本/);
  assert.match(prompt, /你的角色：事实核验/);
  assert.match(prompt, /输出语言：简体中文/);
  assert.match(prompt, /文稿标题：测试标题/);
  assert.match(prompt, /这里是一段待处理文本。/);
});

test("buildReviewContinuationPrompt includes required sections and initial review", () => {
  const prompt = buildReviewContinuationPrompt(settings, agent, context, "- 原始建议");

  assert.match(prompt, /## 优先修改方案/);
  assert.match(prompt, /## 示例修改/);
  assert.match(prompt, /初审结果：/);
  assert.match(prompt, /- 原始建议/);
});

test("buildPolishPrompt includes hidden markers exactly once", () => {
  const prompt = buildPolishPrompt(settings, getScopeLabel, context);

  assert.equal(prompt.includes("## 润色说明"), true);
  assert.equal(prompt.includes("## 润色结果"), true);
  assert.equal((prompt.match(/<!--POLISHED_TEXT_START-->/g) || []).length, 1);
  assert.equal((prompt.match(/<!--POLISHED_TEXT_END-->/g) || []).length, 1);
});

test("buildAllReviewContinuationPrompt includes execution-oriented sections", () => {
  const prompt = buildAllReviewContinuationPrompt(settings, context, "综合初审内容");

  assert.match(prompt, /## 最高优先级问题/);
  assert.match(prompt, /## 逐步修改方案/);
  assert.match(prompt, /## 示例改写与补充/);
  assert.match(prompt, /综合初审结果：/);
  assert.match(prompt, /综合初审内容/);
});

test("buildFollowUpChatPrompt normalizes transcript content and includes review context", () => {
  const session = {
    context,
    reviewMarkdown: "## 初审结论\n\n- 建议补充例子",
  };
  const messages = [
    { role: "user", content: "能举个例子吗？" },
    {
      role: "assistant",
      content: [
        { text: "可以，先补一个实际场景。" },
        { content: "再补一句结论承接。" },
      ],
    },
  ];

  const prompt = buildFollowUpChatPrompt(settings, session, messages);

  assert.match(prompt, /处理范围：选中文本/);
  assert.match(prompt, /当前关联的审阅结果：/);
  assert.match(prompt, /## 初审结论/);
  assert.match(prompt, /用户：能举个例子吗？/);
  assert.match(prompt, /助手：可以，先补一个实际场景。\n再补一句结论承接。/);
  assert.match(prompt, /文稿标题：测试标题/);
});
