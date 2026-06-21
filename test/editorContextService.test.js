const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { createEditorContextFixture, FakeMarkdownView } = require("./helpers/editorContextFixture.cjs");
const { loadWithMocks } = require("./helpers/loadWithMocks");

const { EditorContextService, extractPolishedText } = loadWithMocks(
  path.resolve(__dirname, "../src/services/editorContextService.js"),
  {
    obsidian: {
      MarkdownView: FakeMarkdownView,
    },
  },
);

function createFixture() {
  const fixture = createEditorContextFixture();
  return {
    ...fixture,
    service: new EditorContextService(fixture.plugin),
  };
}

test("extractPolishedText reads hidden polished markers", () => {
  assert.equal(
    extractPolishedText("a<!--POLISHED_TEXT_START-->结果<!--POLISHED_TEXT_END-->b"),
    "结果",
  );
  assert.equal(extractPolishedText("no markers"), "");
});

test("getActionContext returns selection context", () => {
  const fixture = createFixture();

  const context = fixture.service.getActionContext("selection");

  assert.equal(context.title, "other");
  assert.equal(context.text, "选中文本");
  assert.deepEqual(context.selectionRange, {
    from: { line: 1, ch: 2 },
    to: { line: 3, ch: 4 },
  });
});

test("getActionContext rejects empty document content", () => {
  const fixture = createFixture();
  fixture.editor.documentText = "   ";

  assert.throws(
    () => fixture.service.getActionContext("document"),
    /当前笔记没有可处理的内容/,
  );
});

test("restoreContextEditor reopens the original file and activates the leaf", async () => {
  const fixture = createFixture();

  const result = await fixture.service.restoreContextEditor({
    file: fixture.originalFile,
    view: fixture.leaf.view,
    selectionRange: {
      from: { line: 1, ch: 2 },
      to: { line: 3, ch: 4 },
    },
  });

  assert.deepEqual(fixture.openFileCalls, [fixture.originalFile]);
  assert.equal(result.view.file, fixture.originalFile);
  assert.deepEqual(fixture.activeLeafCalls, [
    {
      targetLeaf: fixture.leaf,
      options: { focus: true },
    },
  ]);
});

test("locateSelectionInEditor restores the editor and keeps focus on the original selection", async () => {
  const fixture = createFixture();

  await fixture.service.locateSelectionInEditor({
    file: fixture.originalFile,
    view: fixture.leaf.view,
    selectionRange: {
      from: { line: 1, ch: 2 },
      to: { line: 3, ch: 4 },
    },
  });

  assert.deepEqual(fixture.selectionCalls, [
    {
      from: { line: 1, ch: 2 },
      to: { line: 3, ch: 4 },
    },
  ]);
  assert.equal(fixture.editor.focusCalls, 1);
  assert.deepEqual(fixture.notices, []);
});

test("applyPolishedText replaces the original selection and shows success notice", async () => {
  const fixture = createFixture();

  await fixture.service.applyPolishedText(
    {
      file: fixture.originalFile,
      view: fixture.leaf.view,
      selectionRange: {
        from: { line: 0, ch: 0 },
        to: { line: 0, ch: 4 },
      },
    },
    "<!--POLISHED_TEXT_START-->润色结果<!--POLISHED_TEXT_END-->",
  );

  assert.deepEqual(fixture.selectionCalls, [
    {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 4 },
    },
  ]);
  assert.deepEqual(fixture.replaceCalls, ["润色结果"]);
  assert.equal(fixture.notices.at(-1), "已将润色结果应用到原文。");
});
