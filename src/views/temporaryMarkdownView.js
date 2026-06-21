const { ItemView, MarkdownRenderer, Notice, setIcon } = require("obsidian");

const TEMPORARY_MARKDOWN_VIEW_TYPE = "qreview-temporary-markdown-view";

class TemporaryMarkdownView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.pinButtonEl = null;
    this.isAlwaysOnTop = false;
    this.state = {
      title: "临时 Markdown",
      markdown: "",
    };
  }

  getViewType() {
    return TEMPORARY_MARKDOWN_VIEW_TYPE;
  }

  getDisplayText() {
    return this.state.title || "临时 Markdown";
  }

  getIcon() {
    return "file-text";
  }

  async onOpen() {
    await this.render();
    this.syncAlwaysOnTopState();
  }

  async onClose() {
    this.contentEl.empty();
  }

  async setContent(state = {}) {
    this.state = {
      ...this.state,
      ...state,
    };
    await this.render();
    this.syncAlwaysOnTopState();
  }

  getHostWindow() {
    return this.contentEl?.ownerDocument?.defaultView || null;
  }

  getCurrentBrowserWindow() {
    const hostWindow = this.getHostWindow();
    const electronRequire =
      (typeof hostWindow?.require === "function" && hostWindow.require.bind(hostWindow)) ||
      (typeof window.require === "function" && window.require.bind(window));

    if (!electronRequire) {
      return null;
    }

    try {
      const electron = electronRequire("electron");
      return electron?.remote?.getCurrentWindow?.() || null;
    } catch (error) {
      console.debug("QuickReview: failed to access current BrowserWindow", error);
      return null;
    }
  }

  syncAlwaysOnTopState() {
    const browserWindow = this.getCurrentBrowserWindow();
    this.isAlwaysOnTop = Boolean(browserWindow?.isAlwaysOnTop?.());
    this.updatePinButtonState();
  }

  updatePinButtonState() {
    if (!this.pinButtonEl) {
      return;
    }

    this.pinButtonEl.toggleClass("is-active", this.isAlwaysOnTop);
    this.pinButtonEl.setAttribute("aria-label", this.isAlwaysOnTop ? "取消置顶窗口" : "置顶窗口");
    this.pinButtonEl.setAttribute("title", this.isAlwaysOnTop ? "取消置顶窗口" : "置顶窗口");
    setIcon(this.pinButtonEl, "pin");
  }

  toggleAlwaysOnTop() {
    const browserWindow = this.getCurrentBrowserWindow();
    if (!browserWindow?.setAlwaysOnTop || !browserWindow?.isAlwaysOnTop) {
      new Notice("当前环境暂不支持窗口置顶。");
      return;
    }

    const nextState = !browserWindow.isAlwaysOnTop();

    try {
      browserWindow.setAlwaysOnTop(nextState);
      this.isAlwaysOnTop = nextState;
      this.updatePinButtonState();
      new Notice(nextState ? "已置顶当前弹窗。" : "已取消置顶当前弹窗。");
    } catch (error) {
      console.debug("QuickReview: failed to toggle always-on-top", error);
      new Notice("切换窗口置顶失败。");
    }
  }

  async render() {
    this.contentEl.empty();
    this.contentEl.addClass("qreview-result-view", "qreview-temporary-markdown-view");

    const viewEl = this.contentEl.createDiv({
      cls: "qreview-view qreview-view--temporary-markdown",
    });
    const bodyEl = viewEl.createDiv({ cls: "qreview-view__body" });
    const bodyInnerEl = bodyEl.createDiv({
      cls: "qreview-view__body-inner qreview-view__body-inner--result",
    });
    const entryEl = bodyInnerEl.createDiv({
      cls: "qreview-view__entry qreview-temporary-markdown-view__entry",
    });
    const metaEl = entryEl.createDiv({ cls: "qreview-view__entry-meta" });
    const metaInfoEl = metaEl.createDiv({ cls: "qreview-view__entry-info" });
    const actionsEl = metaEl.createDiv({ cls: "qreview-view__entry-actions" });
    metaInfoEl.createSpan({
      cls: "qreview-view__entry-title qreview-temporary-markdown-view__title",
      text: this.state.title || "临时 Markdown",
    });
    this.pinButtonEl = actionsEl.createEl("button", {
      cls: "qreview-view__entry-icon-button qreview-temporary-markdown-view__pin-button",
      attr: {
        type: "button",
      },
    });
    this.pinButtonEl.addEventListener("click", () => this.toggleAlwaysOnTop());
    this.updatePinButtonState();
    const contentWrapEl = entryEl.createDiv({ cls: "qreview-view__entry-content" });
    const contentEl = contentWrapEl.createDiv({
      cls: "qreview-view__entry-content-body markdown-rendered",
    });

    await MarkdownRenderer.renderMarkdown(
      this.state.markdown || "*暂无内容*",
      contentEl,
      "",
      this.plugin,
    );
  }
}

module.exports = {
  TemporaryMarkdownView,
  TEMPORARY_MARKDOWN_VIEW_TYPE,
};
