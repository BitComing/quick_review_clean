const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { createEditorContextFixture, FakeMarkdownView } = require("./helpers/editorContextFixture.cjs");
const { loadWithMocks } = require("./helpers/loadWithMocks");
const { installImmediateWindow } = require("./helpers/windowStub.cjs");

class FakePlugin {
  constructor(app) {
    this.app = app;
  }
}

class FakeItemView {}

const notices = [];
const restoreWindow = installImmediateWindow();

const QuickReviewPlugin = loadWithMocks(
  path.resolve(__dirname, "../src/main.js"),
  {
    "./core/actionOrchestrator": {
      ActionOrchestrator: class FakeActionOrchestrator {
        constructor(plugin) {
          this.plugin = plugin;
          this.calls = [];
        }

        async runAction(actionId, scope) {
          this.calls.push({ actionId, scope });
        }
      },
    },
    "./services/editorContextService": {
      EditorContextService: class FakeEditorContextService {
        constructor(plugin) {
          this.plugin = plugin;
        }

        getPreferredEditorLeaf(context) {
          const preferredLeaf = context?.view?.leaf;
          if (preferredLeaf?.view instanceof FakeMarkdownView) {
            return preferredLeaf;
          }

          const leaves = this.plugin.app.workspace.getLeavesOfType("markdown");
          if (context?.file?.path) {
            const matchedLeaf = leaves.find((leaf) => leaf?.view?.file?.path === context.file.path);
            if (matchedLeaf) {
              return matchedLeaf;
            }
          }

          return leaves[0] || null;
        }

        async restoreContextEditor(context) {
          if (!context?.file || !context?.selectionRange) {
            throw new Error("当前结果无法定位到原文。");
          }

          const leaf = this.getPreferredEditorLeaf(context);
          if (!leaf || typeof leaf.openFile !== "function") {
            throw new Error("未找到可用于打开原文的编辑视图。");
          }

          await leaf.openFile(context.file);
          const view = leaf.view;
          const editor = view?.editor;
          if (!(view instanceof FakeMarkdownView) || !editor) {
            throw new Error("原文所在编辑视图不可用。");
          }

          this.plugin.app.workspace.setActiveLeaf(leaf, { focus: true });
          return { leaf, view, editor };
        }

        async applyPolishedText(context, rawMarkdown) {
          const match = rawMarkdown.match(
            /<!--POLISHED_TEXT_START-->\s*([\s\S]*?)\s*<!--POLISHED_TEXT_END-->/,
          );
          const polishedText = match ? match[1].trim() : "";
          if (!polishedText) {
            this.plugin.showNotice("未找到可应用的润色结果。");
            return;
          }

          const { editor, view } = await this.restoreContextEditor(context);
          editor.setSelection(context.selectionRange.from, context.selectionRange.to);
          editor.replaceSelection(polishedText);
          this.plugin.restoreEditorFocus(view);
          this.plugin.showNotice("已将润色结果应用到原文。");
        }

        async locateSelectionInEditor(context) {
          const { editor, view } = await this.restoreContextEditor(context);
          editor.setSelection(context.selectionRange.from, context.selectionRange.to);
          this.plugin.restoreEditorFocus(view);
        }
      },
    },
    "./services/reviewService": {
      ReviewService: class FakeReviewService {},
    },
    "./views/reviewChatView": {
      ReviewChatView: class FakeReviewChatView {},
      REVIEW_CHAT_VIEW_TYPE: "qreview-chat-view",
    },
    "./views/temporaryMarkdownView": {
      TemporaryMarkdownView: class FakeTemporaryMarkdownView {},
      TEMPORARY_MARKDOWN_VIEW_TYPE: "qreview-temporary-markdown-view",
    },
    "./views/reviewResultView": {
      ReviewResultView: class FakeReviewResultView {},
    },
    "./settings/settingTab": {
      QuickReviewSettingTab: class FakeQuickReviewSettingTab {},
    },
    "./views/toolbarManager": {
      ToolbarManager: class FakeToolbarManager {},
    },
    obsidian: {
      ItemView: FakeItemView,
      MarkdownView: FakeMarkdownView,
      Notice: class FakeNotice {
        constructor(message) {
          notices.push(message);
        }
      },
      Plugin: FakePlugin,
    },
  },
);

test.after(() => {
  restoreWindow();
});

function createPluginFixture() {
  notices.length = 0;
  const fixture = createEditorContextFixture({
    plugin: {
      showNotice(message) {
        notices.push(message);
      },
    },
  });
  const app = { workspace: fixture.plugin.app.workspace };

  const plugin = new QuickReviewPlugin(app);
  plugin.initializeServices();
  return {
    ...fixture,
    plugin,
  };
}

test("locateSelectionInEditor reopens the original file before selecting text", async () => {
  const fixture = createPluginFixture();

  await fixture.plugin.locateSelectionInEditor({
    file: fixture.originalFile,
    view: fixture.leaf.view,
    selectionRange: {
      from: { line: 1, ch: 2 },
      to: { line: 3, ch: 4 },
    },
  });

  assert.deepEqual(fixture.openFileCalls, [fixture.originalFile]);
  assert.equal(fixture.leaf.view.file, fixture.originalFile);
  assert.deepEqual(fixture.selectionCalls, [
    {
      from: { line: 1, ch: 2 },
      to: { line: 3, ch: 4 },
    },
  ]);
  assert.deepEqual(fixture.activeLeafCalls, [
    {
      targetLeaf: fixture.leaf,
      options: { focus: true },
    },
  ]);
  assert.equal(notices.length, 0);
});

test("applyPolishedText reopens the original file before replacing the selection", async () => {
  const fixture = createPluginFixture();

  await fixture.plugin.applyPolishedText(
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

  assert.deepEqual(fixture.openFileCalls, [fixture.originalFile]);
  assert.deepEqual(fixture.selectionCalls, [
    {
      from: { line: 0, ch: 0 },
      to: { line: 0, ch: 4 },
    },
  ]);
  assert.deepEqual(fixture.replaceCalls, ["润色结果"]);
  assert.equal(notices.at(-1), "已将润色结果应用到原文。");
});

test("runAction delegates to action orchestrator", async () => {
  const fixture = createPluginFixture();
  fixture.plugin.actionOrchestrator = {
    calls: [],
    async runAction(actionId, scope) {
      this.calls.push({ actionId, scope });
    },
  };

  await fixture.plugin.runAction("agent-1", "selection");

  assert.deepEqual(fixture.plugin.actionOrchestrator.calls, [
    { actionId: "agent-1", scope: "selection" },
  ]);
});

test("openTemporaryMarkdownPopout delegates to workspace view service", async () => {
  const fixture = createPluginFixture();
  const calls = [];
  const expectedView = { id: "temporary-view" };
  fixture.plugin.workspaceViewService = {
    async openTemporaryMarkdownView(state, options) {
      calls.push({ state, options });
      return expectedView;
    },
  };

  const result = await fixture.plugin.openTemporaryMarkdownPopout({
    title: "临时 Markdown",
    markdown: "# Hello",
  }, { key: "sample-key" });

  assert.deepEqual(calls, [
    {
      state: {
        title: "临时 Markdown",
        markdown: "# Hello",
      },
      options: {
        key: "sample-key",
      },
    },
  ]);
  assert.equal(result, expectedView);
});

test("openResultMarkdownPopout uses the request markdown as transient popout content", async () => {
  const fixture = createPluginFixture();
  const calls = [];
  fixture.plugin.openTemporaryMarkdownPopout = async (state, options) => {
    calls.push({ state, options });
    return state;
  };

  const result = await fixture.plugin.openResultMarkdownPopout({
    requestId: "request-1",
    title: "事实核验",
    sourceFileName: "note.md",
    resultView: {
      getInstanceId() {
        return "result-view-1";
      },
      getRequestMarkdown(id) {
        assert.equal(id, "request-1");
        return "# 审阅结果";
      },
    },
  });

  assert.deepEqual(calls, [
    {
      state: {
        title: "note.md · 事实核验",
        markdown: "# 审阅结果",
      },
      options: {
        key: "result-view-1:request:request-1",
      },
    },
  ]);
  assert.deepEqual(result, calls[0].state);
});
