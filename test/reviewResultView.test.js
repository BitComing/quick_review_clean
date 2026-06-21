const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { FakeItemView, getEntryActions } = require("./helpers/fakeDom.cjs");
const { loadWithMocks } = require("./helpers/loadWithMocks");
const { installImmediateWindow } = require("./helpers/windowStub.cjs");

const restoreWindow = installImmediateWindow();

const { ReviewResultView } = loadWithMocks(
  path.resolve(__dirname, "../src/views/reviewResultView.js"),
  {
    obsidian: {
      ItemView: FakeItemView,
      MarkdownRenderer: {
        async renderMarkdown(markdown, element) {
          element.empty();
          element.textContent = markdown;
          element.renderedMarkdown = markdown;
        },
      },
    },
  },
);

test.after(() => {
  restoreWindow();
});

function createView() {
  const view = new ReviewResultView({}, {});
  view.render();
  return view;
}

test("concurrent requests keep streaming output isolated to their own entries", async () => {
  const view = createView();

  view.setOptions({ title: "事实核验", scope: "selection" });
  const requestA = view.setLoading("正在处理A");
  view.setOptions({ title: "中文编辑", scope: "selection" });
  const requestB = view.setLoading("正在处理B");

  view.updateStreamingMarkdown(requestA, "A-片段");
  view.updateStreamingMarkdown(requestB, "B-片段");

  assert.equal(view.getRequestEntryBodyEl(requestA).renderedMarkdown, "A-片段");
  assert.equal(view.getRequestEntryBodyEl(requestB).renderedMarkdown, "B-片段");

  await view.setMarkdown(requestB, "B-最终");
  await view.setMarkdown(requestA, "A-最终");

  assert.equal(view.getRequestEntryBodyEl(requestA).renderedMarkdown, "A-最终");
  assert.equal(view.getRequestEntryBodyEl(requestB).renderedMarkdown, "B-最终");
  assert.notEqual(
    view.getRequestEntryBodyEl(requestA).renderedMarkdown,
    view.getRequestEntryBodyEl(requestB).renderedMarkdown,
  );
});

test("setError updates the existing request entry instead of creating a new one", () => {
  const view = createView();
  const requestId = view.setLoading("正在处理中");
  const entryCountBefore = view.bodyInnerEl.children.length;

  view.setError(requestId, "请求失败");

  assert.equal(view.bodyInnerEl.children.length, entryCountBefore);
  assert.equal(view.getRequestEntryBodyEl(requestId).children.length, 1);
  assert.equal(view.getRequestEntryBodyEl(requestId).children[0].textContent, "请求失败");
});

test("updateLoadingText updates the existing loading copy in place", () => {
  const view = createView();
  const requestId = view.setLoading("正在处理选中文本...");

  view.updateLoadingText(requestId, "正在调用 current-date 工具");

  assert.equal(view.getRequestLoadingTextEl(requestId).textContent, "正在调用 current-date 工具");
  assert.match(view.getRequestEntryBodyEl(requestId).textContent, /正在调用 current-date 工具/);
});

test("rawMarkdown proxies the active request state", async () => {
  const view = createView();
  const requestA = view.setLoading("正在处理A");
  const requestB = view.setLoading("正在处理B");

  await view.setMarkdown(requestA, "A-最终");
  await view.setMarkdown(requestB, "B-最终");

  assert.equal(view.rawMarkdown, "B-最终");
  view.rawMarkdown = "B-覆盖";

  assert.equal(view.getRequestMarkdown(requestA), "A-最终");
  assert.equal(view.getRequestMarkdown(requestB), "B-覆盖");
  assert.equal(view.rawMarkdown, "B-覆盖");
});

test("selection entries render popout and locate buttons before collapse and trigger callbacks", () => {
  const locateCalls = [];
  const popoutCalls = [];
  const view = createView();
  view.setOptions({
    title: "事实核验",
    scope: "selection",
    sourceFileName: "note.md",
    onLocate: ({ requestId }) => locateCalls.push(requestId),
    onPopout: (payload) => popoutCalls.push(payload),
  });

  const requestId = view.setLoading("正在处理中");
  const entryEl = view.bodyInnerEl.children[0];
  const actionsEl = getEntryActions(entryEl);
  const popoutButton = actionsEl.children[0];
  const locateButton = actionsEl.children[1];
  const collapseButton = actionsEl.children[2];

  assert.equal(popoutButton.attributes["aria-label"], "在独立窗口中打开");
  assert.equal(locateButton.attributes["aria-label"], "定位到原文");
  assert.equal(collapseButton.attributes["aria-label"], "折叠消息");

  popoutButton.listeners.click();
  locateButton.listeners.click();

  assert.deepEqual(popoutCalls, [
    {
      requestId,
      title: "事实核验",
      sourceFileName: "note.md",
    },
  ]);
  assert.deepEqual(locateCalls, [requestId]);
});

test("document entries render popout button but not locate button", () => {
  const view = createView();
  view.setOptions({
    title: "事实核验",
    scope: "document",
    onPopout: () => {},
    onLocate: () => {},
  });

  view.setLoading("正在处理中");
  const entryEl = view.bodyInnerEl.children[0];
  const actionsEl = getEntryActions(entryEl);

  assert.equal(actionsEl.children[0].attributes["aria-label"], "在独立窗口中打开");
  assert.equal(actionsEl.children[1].attributes["aria-label"], "折叠消息");
});
