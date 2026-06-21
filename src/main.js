const { MarkdownView, Notice, Plugin } = require("obsidian");

const {
  buildCommandDefinitions,
  getDocumentActions,
  getSelectionActions,
} = require("./core/actionDefinitions");
const { REVIEW_SCOPES } = require("./core/reviewScopes");
const { ActionOrchestrator } = require("./core/actionOrchestrator");
const { EditorContextService } = require("./services/editorContextService");
const { ReviewService } = require("./services/reviewService");
const { ReviewChatView, REVIEW_CHAT_VIEW_TYPE } = require("./views/reviewChatView");
const { ReviewResultView } = require("./views/reviewResultView");
const {
  TemporaryMarkdownView,
  TEMPORARY_MARKDOWN_VIEW_TYPE,
} = require("./views/temporaryMarkdownView");
const { QuickReviewSettingTab } = require("./settings/settingTab");
const { ToolbarManager } = require("./views/toolbarManager");
const { WorkspaceViewService } = require("./services/workspaceViewService");
const {
  GET_CURRENT_DATE_TOOL_NAME,
  handleGetCurrentDate,
} = require("./llm/tools/dateTool");
const {
  DEFAULT_SETTINGS,
  normalizeSettings,
  normalizeToolbarActionOrder,
} = require("./settings/settingsStore");
const {
  WEB_SEARCH_TOOL_NAME,
  handleWebSearch,
} = require("./llm/tools/webSearchTool");

const REVIEW_VIEW_TYPE = "qreview-result-view";

module.exports = class QuickReviewPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.isMouseSelectionInProgress = false;
    this.lastSelectionMousePosition = null;
    this.selectionToolbarSuppressedUntil = 0;
    this.registerView(REVIEW_VIEW_TYPE, (leaf) => new ReviewResultView(leaf, this));
    this.registerView(REVIEW_CHAT_VIEW_TYPE, (leaf) => new ReviewChatView(leaf, this));
    this.registerView(
      TEMPORARY_MARKDOWN_VIEW_TYPE,
      (leaf) => new TemporaryMarkdownView(leaf, this),
    );
    this.initializeServices();
    this.initializeUI();
    this.registerReviewCommands();
    this.registerUtilityCommands();
    this.addSettingTab(
      new QuickReviewSettingTab(this.app, this, {
        DEFAULT_SETTINGS,
        getSelectionActions,
      }),
    );

    this.registerToolbarEvents();
    this.refreshToolbarState();
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(REVIEW_VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(REVIEW_CHAT_VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(TEMPORARY_MARKDOWN_VIEW_TYPE);
    this.cleanupUI();
  }

  async loadSettings() {
    this.settings = normalizeSettings(await this.loadData(), { getSelectionActions });
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  initializeServices() {
    this.toolHandlers = {
      [GET_CURRENT_DATE_TOOL_NAME]: handleGetCurrentDate,
      [WEB_SEARCH_TOOL_NAME]: handleWebSearch.bind(this),
    };
    this.reviewService = new ReviewService(this);
    this.actionOrchestrator = new ActionOrchestrator(this);
    this.editorContextService = new EditorContextService(this);
    this.workspaceViewService = new WorkspaceViewService(this, {
      reviewViewType: REVIEW_VIEW_TYPE,
      reviewChatViewType: REVIEW_CHAT_VIEW_TYPE,
      temporaryMarkdownViewType: TEMPORARY_MARKDOWN_VIEW_TYPE,
    });
  }

  initializeUI() {
    this.toolbarManager = new ToolbarManager(this);
    this.toolbarManager.initialize();
  }

  cleanupUI() {
    if (this.toolbarManager) {
      this.toolbarManager.destroy();
      this.toolbarManager = null;
    }

    this.reviewService = null;
    this.actionOrchestrator = null;
    this.editorContextService = null;
    this.workspaceViewService = null;
    this.toolHandlers = null;
  }

  registerToolbarEvents() {
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.refreshToolbarState()));
    this.registerEvent(this.app.workspace.on("editor-change", () => this.queueSelectionToolbarRefresh()));
    this.registerEvent(this.app.workspace.on("file-open", () => this.refreshToolbarState()));

    this.registerDomEvent(document, "mousedown", (event) => {
      if (this.toolbarManager?.isToolbarEventTarget(event.target)) {
        return;
      }

      this.isMouseSelectionInProgress = true;
      this.lastSelectionMousePosition = null;
      this.queueSelectionToolbarRefresh();
    });
    this.registerDomEvent(document, "selectionchange", () => this.queueSelectionToolbarRefresh());
    this.registerDomEvent(document, "mouseup", (event) => {
      if (this.toolbarManager?.isToolbarEventTarget(event.target)) {
        return;
      }

      this.isMouseSelectionInProgress = false;
      this.lastSelectionMousePosition = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      this.queueSelectionToolbarRefresh();
    });
    this.registerDomEvent(document, "keyup", () => this.queueSelectionToolbarRefresh());
    this.registerDomEvent(window, "resize", () => this.refreshToolbarState());
    this.registerDomEvent(document, "scroll", () => this.refreshToolbarState(), true);
  }

  registerReviewCommands() {
    for (const command of buildCommandDefinitions(this.getReviewAgents())) {
      this.addCommand({
        id: command.id,
        name: command.name,
        editorCallback: () => this.runAction(command.actionId, command.scope),
      });
    }
  }

  registerUtilityCommands() {
    this.addCommand({
      id: "open-temporary-markdown-popout",
      name: "Open temporary Markdown pop-out",
      callback: async () => {
        await this.openTemporaryMarkdownPopout({
          title: "临时 Markdown",
          markdown: [
            "# 临时 Markdown",
            "",
            "这是一个不落地到 `.md` 文件的独立窗口。",
            "",
            "- 内容当前保存在内存里",
            "- 关闭窗口后就消失",
            "- 后续可以接剪贴板、输入框或 API",
          ].join("\n"),
        });
      },
    });
  }

  showNotice(message) {
    return new Notice(message);
  }

  queueSelectionToolbarRefresh() {
    this.toolbarManager?.queueRefresh();
  }

  refreshToolbarState() {
    this.toolbarManager?.refresh();
  }

  suppressSelectionToolbar(durationMs = 300) {
    this.selectionToolbarSuppressedUntil = Date.now() + durationMs;
    if (this.toolbarManager?.selectionToolbarEl) {
      this.toolbarManager.selectionToolbarEl.classList.add("is-hidden");
    }
  }

  openSettings() {
    this.app.setting.open();
    this.app.setting.openTabById(this.manifest.id);
  }

  getActiveMarkdownView() {
    return this.app.workspace.getActiveViewOfType(MarkdownView) || null;
  }

  getReviewAgent(id) {
    return this.getReviewAgents().find((agent) => agent.id === id) || null;
  }

  getReviewAgents() {
    return Array.isArray(this.settings.reviewAgents) ? this.settings.reviewAgents : [];
  }

  getSelectionActions() {
    return getSelectionActions(this.getReviewAgents());
  }

  getDocumentActions() {
    return getDocumentActions(this.getReviewAgents());
  }

  normalizeToolbarActionOrder(order, actions) {
    return normalizeToolbarActionOrder(order, actions);
  }

  getOrderedActions(scope) {
    const actions = scope === "selection" ? this.getSelectionActions() : this.getDocumentActions();
    const order = this.normalizeToolbarActionOrder(this.settings.toolbarActionOrder, actions);
    const orderIndex = new Map(order.map((id, index) => [id, index]));

    return [...actions].sort((left, right) => {
      const leftIndex = orderIndex.get(left.id);
      const rightIndex = orderIndex.get(right.id);
      return (leftIndex ?? Number.MAX_SAFE_INTEGER) - (rightIndex ?? Number.MAX_SAFE_INTEGER);
    });
  }

  getScopeLabel(scope) {
    return scope === REVIEW_SCOPES.SELECTION ? "选中文本" : "整篇笔记";
  }

  getExistingResultLeaf() {
    return this.workspaceViewService.getExistingResultLeaf();
  }

  getExistingChatLeaf() {
    return this.workspaceViewService.getExistingChatLeaf();
  }

  restoreEditorFocus(view) {
    return this.workspaceViewService.restoreEditorFocus(view);
  }

  restoreActiveEditorLeaf(view) {
    return this.workspaceViewService.restoreActiveEditorLeaf(view);
  }

  getActionContext(scope) {
    return this.editorContextService.getActionContext(scope);
  }

  async openResultView(options) {
    return this.workspaceViewService.openResultView(options);
  }

  async openChatView(session) {
    return this.workspaceViewService.openChatView(session);
  }

  async openTemporaryMarkdownPopout(state, options) {
    return this.workspaceViewService.openTemporaryMarkdownView(state, options);
  }

  async openResultMarkdownPopout({ requestId, title, sourceFileName, resultView }) {
    const markdown = resultView?.getRequestMarkdown?.(requestId);
    const resultViewId = resultView?.getInstanceId?.() || "result-view";
    return this.openTemporaryMarkdownPopout({
      title: sourceFileName ? `${sourceFileName} · ${title}` : title || "临时 Markdown",
      markdown: markdown || "*当前消息暂无内容*",
    }, {
      key: `${resultViewId}:request:${requestId}`,
    });
  }

  async runAction(actionId, scope) {
    return this.actionOrchestrator.runAction(actionId, scope);
  }

  async openFollowUpChat({ requestId, title, question, context, resultView }) {
    const reviewMarkdown = resultView.getRequestMarkdown(requestId);
    const chatView = await this.openChatView({
      title: `${title} · 追问`,
      reviewMarkdown,
      context: {
        title: context.title,
        scope: context.scope,
        text: context.text,
      },
      messages: [
        {
          role: "assistant",
          content: reviewMarkdown || "当前审阅结果为空。",
        },
      ],
    });
    await chatView.startConversation(question);
  }

  getPreferredEditorLeaf(context) {
    return this.editorContextService.getPreferredEditorLeaf(context);
  }

  async restoreContextEditor(context) {
    return this.editorContextService.restoreContextEditor(context);
  }

  async applyPolishedText(context, rawMarkdown) {
    return this.editorContextService.applyPolishedText(context, rawMarkdown);
  }

  async locateSelectionInEditor(context) {
    return this.editorContextService.locateSelectionInEditor(context);
  }

  createContextError(message) {
    const error = new Error(message);
    error.isContextError = true;
    return error;
  }

  formatError(error) {
    if (!error) {
      return "发生未知错误。";
    }

    if (typeof error === "string") {
      return error;
    }

    return error.message || "发生未知错误。";
  }
};
