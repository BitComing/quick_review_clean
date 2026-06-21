class FakeMarkdownView {
  constructor(file, editor) {
    this.file = file;
    this.editor = editor;
    this.leaf = null;
  }
}

function createEditorContextFixture(overrides = {}) {
  const notices = [];
  const selectionCalls = [];
  const replaceCalls = [];
  const originalFile = overrides.originalFile || { path: "notes/original.md", basename: "original" };
  const otherFile = overrides.otherFile || { path: "notes/other.md", basename: "other" };
  const editor = {
    focusCalls: 0,
    selectionText: "选中文本",
    documentText: "整篇内容",
    setSelection(from, to) {
      selectionCalls.push({ from, to });
    },
    replaceSelection(text) {
      replaceCalls.push(text);
    },
    getSelection() {
      return this.selectionText;
    },
    getValue() {
      return this.documentText;
    },
    getCursor(which) {
      return which === "from" ? { line: 1, ch: 2 } : { line: 3, ch: 4 };
    },
    focus() {
      this.focusCalls += 1;
    },
    ...overrides.editor,
  };
  const view = new FakeMarkdownView(otherFile, editor);
  const openFileCalls = [];
  const activeLeafCalls = [];
  const leaf = {
    view,
    async openFile(file) {
      openFileCalls.push(file);
      this.view.file = file;
    },
    ...overrides.leaf,
  };
  view.leaf = leaf;

  const workspace = {
    getLeavesOfType(type) {
      return type === "markdown" ? [leaf] : [];
    },
    setActiveLeaf(targetLeaf, options) {
      activeLeafCalls.push({ targetLeaf, options });
    },
    ...overrides.workspace,
  };

  const plugin = {
    app: { workspace },
    getActiveMarkdownView() {
      return view;
    },
    createContextError(message) {
      const error = new Error(message);
      error.isContextError = true;
      return error;
    },
    restoreEditorFocus(targetView) {
      targetView.editor.focus();
    },
    showNotice(message) {
      notices.push(message);
    },
    formatError(error) {
      return error.message || String(error);
    },
    ...overrides.plugin,
  };

  return {
    plugin,
    editor,
    view,
    leaf,
    originalFile,
    otherFile,
    notices,
    openFileCalls,
    activeLeafCalls,
    selectionCalls,
    replaceCalls,
  };
}

module.exports = {
  FakeMarkdownView,
  createEditorContextFixture,
};
