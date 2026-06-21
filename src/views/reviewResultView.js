const { ItemView, MarkdownRenderer } = require("obsidian");
const { ReviewResultController } = require("../core/reviewResultController");

const REVIEW_VIEW_TYPE = "qreview-result-view";
let reviewResultViewSequence = 0;

function stripHiddenMarkers(markdown) {
  return markdown
    .replace(/<!--POLISHED_TEXT_START-->/g, "")
    .replace(/<!--POLISHED_TEXT_END-->/g, "")
    .trim();
}

class ReviewResultRenderer {
  constructor(view) {
    this.view = view;
  }

  getScopeDisplayLabel(scope) {
    return scope === "selection" ? "选中文本模式" : "整篇笔记模式";
  }

  renderShell() {
    this.view.contentEl.empty();
    this.view.contentEl.addClass("qreview-result-view");

    this.view.viewEl = this.view.contentEl.createDiv({
      cls: "qreview-view qreview-view--result",
    });
    this.view.bodyEl = this.view.viewEl.createDiv({ cls: "qreview-view__body" });
    this.view.bodyInnerEl = this.view.bodyEl.createDiv({
      cls: "qreview-view__body-inner qreview-view__body-inner--result markdown-rendered",
    });
    this.view.footerEl = this.view.viewEl.createDiv({ cls: "qreview-view__footer" });
  }

  renderFooter() {
    this.view.footerEl.empty();

    const footerStartEl = this.view.footerEl.createDiv({ cls: "qreview-view__footer-start" });
    const footerEndEl = this.view.footerEl.createDiv({ cls: "qreview-view__footer-end" });

    const collapseAllButton = footerStartEl.createEl("button", {
      text: "全部折叠",
      attr: {
        type: "button",
        "aria-label": "全部折叠",
      },
    });
    collapseAllButton.disabled = !this.view.hasEntries();
    collapseAllButton.addEventListener("click", () => this.view.toggleAllEntriesCollapsed());
    this.view.setCollapseAllButton(collapseAllButton);
    this.view.refreshCollapseAllButton();

    if (typeof this.view.options.onContinue === "function") {
      const continueButton = footerEndEl.createEl("button", {
        cls: "mod-cta",
        text: this.view.isBusy ? "生成中..." : "继续",
      });
      continueButton.disabled = this.view.isBusy;
      continueButton.addEventListener("click", () => this.view.handleContinue());
    }

    if (typeof this.view.options.onApply === "function") {
      const applyButton = footerEndEl.createEl("button", {
        text: this.view.isBusy ? "处理中..." : "应用到原文",
      });
      applyButton.disabled = this.view.isBusy;
      applyButton.addEventListener("click", () => this.view.handleApply());
    }
  }

  createEntryLayout(entryOptions) {
    const entryEl = this.view.bodyInnerEl.createDiv({ cls: "qreview-view__entry" });
    const sourceFileEl = entryEl.createDiv({ cls: "qreview-view__entry-source" });
    sourceFileEl.createSpan({
      cls: "qreview-view__entry-source-name",
      text: entryOptions.sourceFileName || "未命名笔记",
      attr: {
        title: entryOptions.sourceFileName || "未命名笔记",
      },
    });

    const metaEl = entryEl.createDiv({ cls: "qreview-view__entry-meta" });
    const metaInfoEl = metaEl.createDiv({ cls: "qreview-view__entry-info" });
    metaInfoEl.createSpan({ cls: "qreview-view__entry-title", text: entryOptions.title });

    const actionsEl = metaEl.createDiv({ cls: "qreview-view__entry-actions" });
    const contentWrapEl = entryEl.createDiv({ cls: "qreview-view__entry-content" });
    const contentEl = contentWrapEl.createDiv({ cls: "qreview-view__entry-content-body" });
    const followUpElements = this.createFollowUpElements(contentWrapEl);

    return {
      entryEl,
      actionsEl,
      contentEl,
      ...followUpElements,
    };
  }

  createFollowUpElements(contentWrapEl) {
    const followUpEl = contentWrapEl.createDiv({ cls: "qreview-view__entry-follow-up" });
    const followUpTriggerEl = followUpEl.createEl("button", {
      cls: "qreview-view__entry-follow-up-trigger",
      attr: {
        type: "button",
      },
      text: "追问",
    });
    followUpEl.addClass("is-hidden");

    const followUpFormEl = followUpEl.createDiv({ cls: "qreview-view__entry-follow-up-form" });
    const followUpInputEl = followUpFormEl.createEl("input", {
      cls: "qreview-view__entry-follow-up-input",
      attr: {
        type: "text",
        placeholder: "输入你想继续追问的问题...",
      },
    });
    const followUpButton = followUpFormEl.createEl("button", {
      cls: "mod-cta",
      attr: {
        type: "button",
      },
      text: "追问",
    });

    return {
      followUpEl,
      followUpTriggerEl,
      followUpInputEl,
      followUpButton,
    };
  }

  bindLocateAction(actionsEl, requestId, entryOptions) {
    if (entryOptions.scope !== "selection" || typeof entryOptions.onLocate !== "function") {
      return;
    }

    const locateButton = actionsEl.createEl("button", {
      cls: "qreview-view__entry-icon-button",
      attr: {
        type: "button",
        "aria-label": "定位到原文",
      },
      text: "⌖",
    });
    const suppressMenuEvent = (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
    };

    locateButton.addEventListener("mousedown", suppressMenuEvent);
    locateButton.addEventListener("mouseup", suppressMenuEvent);
    locateButton.addEventListener("click", (event) => {
      suppressMenuEvent(event);
      this.view.plugin?.suppressSelectionToolbar?.();
      entryOptions.onLocate(this.view.buildEntryLocatePayload(requestId, entryOptions));
    });
  }

  bindPopoutAction(actionsEl, requestId, entryOptions) {
    if (typeof entryOptions.onPopout !== "function") {
      return;
    }

    const popoutButton = actionsEl.createEl("button", {
      cls: "qreview-view__entry-icon-button",
      attr: {
        type: "button",
        "aria-label": "在独立窗口中打开",
      },
      text: "◱",
    });
    popoutButton.addEventListener("click", () => {
      entryOptions.onPopout({
        requestId,
        title: entryOptions.title,
        sourceFileName: entryOptions.sourceFileName,
      });
    });
  }

  bindCollapseAction(actionsEl, entryEl) {
    const collapseButton = actionsEl.createEl("button", {
      cls: "qreview-view__entry-icon-button qreview-view__entry-icon-button--collapse",
      attr: {
        type: "button",
        "aria-label": "折叠消息",
      },
      text: "▾",
    });
    collapseButton.addEventListener("click", () => {
      const isCollapsed = entryEl.hasClass("is-collapsed");
      this.view.setEntryCollapsed(entryEl, collapseButton, !isCollapsed);
      this.view.refreshCollapseAllButton();
    });

    return collapseButton;
  }

  bindDeleteAction(actionsEl, entryEl, contentEl) {
    const deleteButton = actionsEl.createEl("button", {
      cls: "qreview-view__entry-icon-button qreview-view__entry-icon-button--danger",
      attr: {
        type: "button",
        "aria-label": "删除消息",
      },
      text: "✕",
    });
    deleteButton.addEventListener("click", () => {
      this.view.removeRequestEntryByContentEl(contentEl);
      entryEl.remove();
      this.view.refreshCollapseAllButton();
    });
  }

  bindFollowUpActions(requestId, entryOptions, followUpElements) {
    const {
      followUpEl,
      followUpTriggerEl,
      followUpInputEl,
      followUpButton,
    } = followUpElements;

    const submitFollowUp = async () => {
      if (this.view.isBusy || typeof entryOptions.onFollowUp !== "function") {
        return;
      }

      const question = followUpInputEl.value.trim();
      if (!question) {
        followUpInputEl.focus();
        return;
      }

      followUpInputEl.disabled = true;
      followUpButton.disabled = true;

      try {
        await entryOptions.onFollowUp({
          requestId,
          title: entryOptions.title,
          scope: entryOptions.scope,
          question,
        });
        followUpInputEl.value = "";
      } finally {
        followUpInputEl.disabled = false;
        followUpButton.disabled = false;
      }
    };

    const expandFollowUp = () => {
      followUpEl.addClass("is-expanded");
      window.setTimeout(() => followUpInputEl.focus(), 0);
    };

    const collapseFollowUp = () => {
      if (followUpInputEl.value.trim()) {
        return;
      }
      followUpEl.removeClass("is-expanded");
    };

    followUpTriggerEl.addEventListener("click", () => {
      expandFollowUp();
    });
    followUpButton.addEventListener("click", () => {
      submitFollowUp();
    });
    followUpInputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitFollowUp();
      }
      if (event.key === "Escape") {
        followUpInputEl.value = "";
        collapseFollowUp();
      }
    });
    followUpInputEl.addEventListener("blur", () => {
      window.setTimeout(() => collapseFollowUp(), 120);
    });
  }

  createEntry(requestId, entryOptions) {
    const entry = this.createEntryLayout(entryOptions);
    this.bindPopoutAction(entry.actionsEl, requestId, entryOptions);
    this.bindLocateAction(entry.actionsEl, requestId, entryOptions);
    const collapseButtonEl = this.bindCollapseAction(entry.actionsEl, entry.entryEl);
    this.bindDeleteAction(entry.actionsEl, entry.entryEl, entry.contentEl);
    this.bindFollowUpActions(requestId, entryOptions, entry);

    return {
      entryEl: entry.entryEl,
      contentEl: entry.contentEl,
      followUpEl: entry.followUpEl,
      collapseButtonEl,
    };
  }

  showLoading(entryBodyEl, text) {
    const loadingEl = entryBodyEl.createDiv({ cls: "qreview-loading" });
    loadingEl.createDiv({ cls: "qreview-loading__bar" });
    return loadingEl.createDiv({ cls: "qreview-loading__text", text });
  }

  async renderMarkdown(entryBodyEl, markdown) {
    entryBodyEl.empty();
    await MarkdownRenderer.renderMarkdown(
      stripHiddenMarkers(markdown),
      entryBodyEl,
      "",
      this.view.plugin,
    );
  }

  renderError(entryBodyEl, message) {
    entryBodyEl.empty();
    entryBodyEl.createDiv({ cls: "qreview-error", text: message });
  }
}

class ReviewResultView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.instanceId = `qreview-result-${++reviewResultViewSequence}`;
    this.options = {
      title: "QuickReview",
      scope: "document",
      sourceFileName: "",
      onContinue: null,
      onApply: null,
      onLocate: null,
      onPopout: null,
      onFollowUp: null,
    };
    this.isBusy = false;
    this.scopeLabel = "整篇笔记模式";
    this.renderer = new ReviewResultRenderer(this);
    this.controller = new ReviewResultController(this);
    this.requestElements = new Map();
    this.collapseAllButtonEl = null;
    this.autoScrollThreshold = 48;
    this.shouldAutoScroll = true;
    this.handleBodyScroll = this.handleBodyScroll.bind(this);
  }

  getViewType() {
    return REVIEW_VIEW_TYPE;
  }

  getDisplayText() {
    return "QuickReview";
  }

  getIcon() {
    return "pen-tool";
  }

  getInstanceId() {
    return this.instanceId;
  }

  async onOpen() {
    this.render();
  }

  async onClose() {
    if (this.bodyEl) {
      this.bodyEl.removeEventListener("scroll", this.handleBodyScroll);
    }
    this.contentEl.empty();
    this.requestElements.clear();
    this.collapseAllButtonEl = null;
    this.controller.cleanup();
  }

  setOptions(options) {
    this.options = {
      ...this.options,
      ...options,
    };
    this.scopeLabel = this.options.scope === "selection" ? "选中文本模式" : "整篇笔记模式";

    if (!this.viewEl) {
      this.render();
      return;
    }

    this.renderHeaderActions();
    this.renderFooter();
  }

  render() {
    if (this.bodyEl) {
      this.bodyEl.removeEventListener("scroll", this.handleBodyScroll);
    }
    this.renderer.renderShell();
    this.bodyEl.addEventListener("scroll", this.handleBodyScroll);
    this.shouldAutoScroll = true;
    this.renderHeaderActions();
    this.renderer.renderFooter();
  }

  renderHeaderActions() {
    // Header actions removed with the top panel header.
  }

  renderFooter() {
    this.renderer.renderFooter();
  }

  buildEntryLocatePayload(requestId, entryOptions) {
    return {
      requestId,
      context: entryOptions.locateContext || null,
    };
  }

  setCollapseAllButton(buttonEl) {
    this.collapseAllButtonEl = buttonEl;
  }

  hasEntries() {
    return this.requestElements.size > 0;
  }

  getEntryElements() {
    return Array.from(this.requestElements.values());
  }

  setEntryCollapsed(entryEl, collapseButtonEl, collapsed) {
    if (!entryEl || !collapseButtonEl) {
      return;
    }

    entryEl.toggleClass("is-collapsed", collapsed);
    collapseButtonEl.setText(collapsed ? "▸" : "▾");
    collapseButtonEl.setAttribute("aria-label", collapsed ? "展开消息" : "折叠消息");
  }

  areAllEntriesCollapsed() {
    const entries = this.getEntryElements();
    return entries.length > 0 && entries.every((entry) => entry.entryEl?.hasClass("is-collapsed"));
  }

  refreshCollapseAllButton() {
    if (!this.collapseAllButtonEl) {
      return;
    }

    const hasEntries = this.hasEntries();
    const shouldExpandAll = this.areAllEntriesCollapsed();
    this.collapseAllButtonEl.disabled = !hasEntries;
    this.collapseAllButtonEl.setText(shouldExpandAll ? "全部展开" : "全部折叠");
    this.collapseAllButtonEl.setAttribute("aria-label", shouldExpandAll ? "全部展开" : "全部折叠");
  }

  toggleAllEntriesCollapsed() {
    const entries = this.getEntryElements();
    if (entries.length === 0) {
      return;
    }

    const shouldCollapse = !this.areAllEntriesCollapsed();
    for (const entry of entries) {
      this.setEntryCollapsed(entry.entryEl, entry.collapseButtonEl, shouldCollapse);
    }

    this.refreshCollapseAllButton();
  }

  bindRequestEntry(requestId, entry) {
    this.requestElements.set(requestId, {
      entryEl: entry.entryEl,
      contentEl: entry.contentEl,
      followUpEl: entry.followUpEl,
      collapseButtonEl: entry.collapseButtonEl,
      loadingTextEl: null,
    });
  }

  getRequestElements(requestId) {
    return this.requestElements.get(requestId) || null;
  }

  getRequestEntryBodyEl(requestId) {
    return this.getRequestElements(requestId)?.contentEl || null;
  }

  getRequestLoadingTextEl(requestId) {
    return this.getRequestElements(requestId)?.loadingTextEl || null;
  }

  setRequestLoadingTextEl(requestId, loadingTextEl) {
    const entry = this.getRequestElements(requestId);
    if (!entry) {
      return;
    }

    entry.loadingTextEl = loadingTextEl;
  }

  showFollowUp(requestId) {
    this.getRequestElements(requestId)?.followUpEl?.removeClass("is-hidden");
  }

  hideFollowUp(requestId) {
    this.getRequestElements(requestId)?.followUpEl?.addClass("is-hidden");
  }

  removeRequestEntry(requestId) {
    this.requestElements.delete(requestId);
    this.controller.removeRequestEntry(requestId);
    this.refreshCollapseAllButton();
  }

  removeRequestEntryByContentEl(contentEl) {
    for (const [requestId, entry] of this.requestElements.entries()) {
      if (entry.contentEl === contentEl) {
        this.removeRequestEntry(requestId);
        return requestId;
      }
    }

    return null;
  }

  buildRequestEntryOptions() {
    return {
      title: this.options.title,
      scope: this.options.scope,
      sourceFileName: this.options.sourceFileName,
      locateContext: this.options.locateContext,
      onLocate: this.options.onLocate,
      onPopout: this.options.onPopout,
      onFollowUp: this.options.onFollowUp,
    };
  }

  createEntry(requestId, entryOptions = this.options) {
    return this.renderer.createEntry(requestId, entryOptions);
  }

  createRequestEntry(requestId, loadingText) {
    const entry = this.createEntry(requestId, this.buildRequestEntryOptions());
    this.bindRequestEntry(requestId, entry);
    this.showLoading(requestId, loadingText);
    this.scrollToBottom();
    this.renderHeaderActions();
    this.renderFooter();
  }

  handleBodyScroll() {
    if (!this.bodyEl) {
      return;
    }

    this.shouldAutoScroll = this.isNearBottom();
  }

  isNearBottom() {
    if (!this.bodyEl) {
      return true;
    }

    const remaining = this.bodyEl.scrollHeight - this.bodyEl.scrollTop - this.bodyEl.clientHeight;
    return remaining <= this.autoScrollThreshold;
  }

  scrollToBottom(force = false) {
    if (!this.bodyEl) {
      return;
    }

    if (!force && !this.shouldAutoScroll) {
      return;
    }

    this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
    this.shouldAutoScroll = true;
  }

  setLoading(text) {
    return this.controller.setLoading(text);
  }

  updateLoadingText(requestId, text) {
    return this.controller.updateLoadingText(requestId, text);
  }

  updateRequestLoadingText(requestId, text) {
    const loadingTextEl = this.getRequestLoadingTextEl(requestId);
    if (!loadingTextEl) {
      return;
    }

    loadingTextEl.setText(text);
    this.scrollToBottom();
  }

  getRequestMarkdown(requestId) {
    return this.controller.getRequestMarkdown(requestId);
  }

  get activeRequestId() {
    return this.controller.getActiveRequestId();
  }

  get rawMarkdown() {
    return this.controller.getRawMarkdown();
  }

  set rawMarkdown(markdown) {
    this.controller.setRawMarkdown(markdown);
  }

  showLoading(requestId, text) {
    const entryBodyEl = this.getRequestEntryBodyEl(requestId);
    if (!entryBodyEl) {
      return null;
    }

    const loadingTextEl = this.renderer.showLoading(entryBodyEl, text);
    this.setRequestLoadingTextEl(requestId, loadingTextEl);
    return loadingTextEl;
  }

  async renderRequestMarkdown(requestId, markdown) {
    const entryBodyEl = this.getRequestEntryBodyEl(requestId);
    if (!entryBodyEl) {
      return;
    }

    await this.renderer.renderMarkdown(entryBodyEl, markdown);
    this.scrollToBottom();
  }

  async completeRequest(requestId, markdown) {
    await this.renderRequestMarkdown(requestId, markdown);
    this.showFollowUp(requestId);
    this.scrollToBottom();
    this.renderHeaderActions();
    this.renderFooter();
  }

  failRequest(requestId, message) {
    this.hideFollowUp(requestId);
    const entryBodyEl = this.getRequestEntryBodyEl(requestId);
    if (!entryBodyEl) {
      return;
    }

    this.renderer.renderError(entryBodyEl, message);
    this.scrollToBottom();
    this.renderHeaderActions();
    this.renderFooter();
  }

  updateStreamingMarkdown(requestId, markdown) {
    return this.controller.updateStreamingMarkdown(requestId, markdown);
  }

  async setMarkdown(requestId, markdown) {
    return this.controller.setMarkdown(requestId, markdown);
  }

  setError(requestId, message) {
    return this.controller.setError(requestId, message);
  }

  async handleContinue() {
    return this.controller.handleContinue();
  }

  handleApply() {
    return this.controller.handleApply();
  }

  setBusy(isBusy) {
    this.isBusy = isBusy;
    this.renderFooter();
  }
}

module.exports = { ReviewResultView };
