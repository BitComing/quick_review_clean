const test = require("node:test");
const assert = require("node:assert/strict");

const { WorkspaceViewService } = require("../src/services/workspaceViewService");
const { installImmediateWindow } = require("./helpers/windowStub.cjs");

const restoreWindow = installImmediateWindow();

test.after(() => {
  restoreWindow();
});

function createFixture() {
  const activeLeafCalls = [];
  const popoutLeaves = [];
  function createPopoutLeaf() {
    const popoutWindow = {
      closed: false,
      screen: {
        availWidth: 1440,
        availHeight: 900,
      },
      moveTo() {},
      resizeTo() {},
    };
    const popoutLeafView = {
      containerEl: {
        ownerDocument: {
          defaultView: popoutWindow,
        },
      },
      setContentCalls: [],
      async setContent(state) {
        this.setContentCalls.push(state);
      },
    };
    const popoutLeaf = {
      view: popoutLeafView,
      setViewStateCalls: [],
      isDetached: false,
      async setViewState(state) {
        this.setViewStateCalls.push(state);
      },
    };
    popoutLeaves.push(popoutLeaf);
    return popoutLeaf;
  }
  const rightLeafView = {
    setOptionsCalls: [],
    setSessionCalls: [],
    setOptions(options) {
      this.setOptionsCalls.push(options);
    },
    setSession(session) {
      this.setSessionCalls.push(session);
    },
  };
  const rightLeaf = {
    view: rightLeafView,
    setViewStateCalls: [],
    async setViewState(state) {
      this.setViewStateCalls.push(state);
    },
  };
  const resultLeaf = { id: "result-leaf" };
  const chatLeaf = { id: "chat-leaf" };
  const editor = {
    focusCalls: 0,
    focus() {
      this.focusCalls += 1;
    },
  };
  const activeView = {
    editor,
    leaf: { id: "active-editor-leaf" },
  };

  const leavesByType = {
    "qreview-result-view": [resultLeaf],
    "qreview-chat-view": [chatLeaf],
  };

  const plugin = {
    app: {
      workspace: {
        getLeavesOfType(type) {
          return leavesByType[type] || [];
        },
        getRightLeaf() {
          return rightLeaf;
        },
        async openPopoutLeaf() {
          return createPopoutLeaf();
        },
        setActiveLeaf(leaf, options) {
          activeLeafCalls.push({ leaf, options });
        },
      },
    },
    getActiveMarkdownView() {
      return activeView;
    },
  };

  return {
    service: new WorkspaceViewService(plugin),
    plugin,
    activeView,
    activeLeafCalls,
    popoutLeaves,
    rightLeaf,
    rightLeafView,
    resultLeaf,
    chatLeaf,
    leavesByType,
  };
}

test("getExistingResultLeaf and getExistingChatLeaf return the first matching leaf", () => {
  const fixture = createFixture();

  assert.equal(fixture.service.getExistingResultLeaf(), fixture.resultLeaf);
  assert.equal(fixture.service.getExistingChatLeaf(), fixture.chatLeaf);
});

test("restoreEditorFocus focuses the editor when available", () => {
  const fixture = createFixture();

  fixture.service.restoreEditorFocus(fixture.activeView);

  assert.equal(fixture.activeView.editor.focusCalls, 1);
});

test("restoreActiveEditorLeaf reactivates the previous editor leaf without stealing focus", () => {
  const fixture = createFixture();

  fixture.service.restoreActiveEditorLeaf(fixture.activeView);

  assert.deepEqual(fixture.activeLeafCalls, [
    {
      leaf: fixture.activeView.leaf,
      options: { focus: false },
    },
  ]);
  assert.equal(fixture.activeView.editor.focusCalls, 1);
});

test("openResultView reuses an existing result leaf when available", async () => {
  const fixture = createFixture();
  const resultView = {
    setOptionsCalls: [],
    setOptions(options) {
      this.setOptionsCalls.push(options);
    },
  };
  fixture.resultLeaf.setViewStateCalls = [];
  fixture.resultLeaf.setViewState = async function setViewState(state) {
    this.setViewStateCalls.push(state);
  };
  fixture.resultLeaf.view = resultView;

  const view = await fixture.service.openResultView({ title: "结果" });

  assert.equal(view, resultView);
  assert.deepEqual(fixture.resultLeaf.setViewStateCalls, [
    { type: "qreview-result-view", active: true },
  ]);
  assert.deepEqual(resultView.setOptionsCalls, [{ title: "结果" }]);
});

test("openChatView falls back to the right leaf when no existing chat leaf is found", async () => {
  const fixture = createFixture();
  fixture.leavesByType["qreview-chat-view"] = [];

  const view = await fixture.service.openChatView({ title: "追问" });

  assert.equal(view, fixture.rightLeafView);
  assert.deepEqual(fixture.rightLeaf.setViewStateCalls, [
    { type: "qreview-chat-view", active: true },
  ]);
  assert.deepEqual(fixture.rightLeafView.setSessionCalls, [{ title: "追问" }]);
});

test("openTemporaryMarkdownView opens a pop-out leaf and passes the transient state", async () => {
  const fixture = createFixture();

  const view = await fixture.service.openTemporaryMarkdownView({
    title: "临时 Markdown",
    markdown: "# Hello",
  });

  assert.equal(view, fixture.popoutLeaves[0].view);
  assert.deepEqual(fixture.popoutLeaves[0].setViewStateCalls, [
    { type: "qreview-temporary-markdown-view", active: false },
  ]);
  assert.deepEqual(fixture.popoutLeaves[0].view.setContentCalls, [
    {
      title: "临时 Markdown",
      markdown: "# Hello",
    },
  ]);
});

test("openTemporaryMarkdownView reuses the same pop-out leaf for the same key", async () => {
  const fixture = createFixture();

  const firstView = await fixture.service.openTemporaryMarkdownView(
    { title: "卡片A", markdown: "# A1" },
    { key: "card-a" },
  );
  const secondView = await fixture.service.openTemporaryMarkdownView(
    { title: "卡片A", markdown: "# A2" },
    { key: "card-a" },
  );

  assert.equal(fixture.popoutLeaves.length, 1);
  assert.equal(firstView, secondView);
  assert.deepEqual(fixture.popoutLeaves[0].view.setContentCalls, [
    { title: "卡片A", markdown: "# A1" },
    { title: "卡片A", markdown: "# A2" },
  ]);
});

test("openTemporaryMarkdownView keeps separate pop-out leaves for different keys", async () => {
  const fixture = createFixture();

  await fixture.service.openTemporaryMarkdownView(
    { title: "卡片A", markdown: "# A" },
    { key: "card-a" },
  );
  await fixture.service.openTemporaryMarkdownView(
    { title: "卡片B", markdown: "# B" },
    { key: "card-b" },
  );

  assert.equal(fixture.popoutLeaves.length, 2);
  assert.deepEqual(fixture.popoutLeaves[0].view.setContentCalls, [
    { title: "卡片A", markdown: "# A" },
  ]);
  assert.deepEqual(fixture.popoutLeaves[1].view.setContentCalls, [
    { title: "卡片B", markdown: "# B" },
  ]);
});

test("openTemporaryMarkdownView recreates a keyed pop-out leaf after it is detached", async () => {
  const fixture = createFixture();

  await fixture.service.openTemporaryMarkdownView(
    { title: "卡片A", markdown: "# A1" },
    { key: "card-a" },
  );
  fixture.popoutLeaves[0].isDetached = true;

  const secondView = await fixture.service.openTemporaryMarkdownView(
    { title: "卡片A", markdown: "# A2" },
    { key: "card-a" },
  );

  assert.equal(fixture.popoutLeaves.length, 2);
  assert.equal(secondView, fixture.popoutLeaves[1].view);
  assert.deepEqual(fixture.popoutLeaves[1].view.setContentCalls, [
    { title: "卡片A", markdown: "# A2" },
  ]);
});

test("openTemporaryMarkdownView recreates a keyed pop-out leaf after its window is closed", async () => {
  const fixture = createFixture();

  await fixture.service.openTemporaryMarkdownView(
    { title: "卡片A", markdown: "# A1" },
    { key: "card-a" },
  );
  fixture.popoutLeaves[0].view.containerEl.ownerDocument.defaultView.closed = true;

  const secondView = await fixture.service.openTemporaryMarkdownView(
    { title: "卡片A", markdown: "# A2" },
    { key: "card-a" },
  );

  assert.equal(fixture.popoutLeaves.length, 2);
  assert.equal(secondView, fixture.popoutLeaves[1].view);
  assert.deepEqual(fixture.popoutLeaves[1].view.setContentCalls, [
    { title: "卡片A", markdown: "# A2" },
  ]);
});
