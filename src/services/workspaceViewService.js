class WorkspaceViewService {
  constructor(plugin, options = {}) {
    this.plugin = plugin;
    this.reviewViewType = options.reviewViewType || "qreview-result-view";
    this.reviewChatViewType = options.reviewChatViewType || "qreview-chat-view";
    this.temporaryMarkdownViewType =
      options.temporaryMarkdownViewType || "qreview-temporary-markdown-view";
    this.temporaryMarkdownPopouts = new Map();
    this.defaultPopoutSize = {
      width: 450,
      height: 600,
    };
  }

  getExistingResultLeaf() {
    const leaves = this.plugin.app.workspace.getLeavesOfType(this.reviewViewType);
    return leaves.length ? leaves[0] : null;
  }

  getExistingChatLeaf() {
    const leaves = this.plugin.app.workspace.getLeavesOfType(this.reviewChatViewType);
    return leaves.length ? leaves[0] : null;
  }

  getExistingTemporaryMarkdownLeaf() {
    const leaves = this.plugin.app.workspace.getLeavesOfType(this.temporaryMarkdownViewType);
    return leaves.length ? leaves[0] : null;
  }

  restoreEditorFocus(view) {
    if (!view?.editor?.focus) {
      return;
    }

    window.setTimeout(() => {
      try {
        view.editor.focus();
      } catch (error) {
        console.debug("QuickReview: failed to restore editor focus", error);
      }
    }, 0);
  }

  restoreActiveEditorLeaf(view) {
    const leaf = view?.leaf;
    if (!leaf) {
      return;
    }

    window.setTimeout(() => {
      try {
        this.plugin.app.workspace.setActiveLeaf(leaf, { focus: false });
      } catch (error) {
        console.debug("QuickReview: failed to restore active leaf", error);
      }
      this.restoreEditorFocus(view);
    }, 0);
  }

  async openResultView(options) {
    const activeView = this.plugin.getActiveMarkdownView();
    const leaf = this.getExistingResultLeaf() || this.plugin.app.workspace.getRightLeaf(false);
    await leaf.setViewState({
      type: this.reviewViewType,
      active: true,
    });
    this.restoreActiveEditorLeaf(activeView);

    const view = leaf.view;
    view.setOptions(options);
    return view;
  }

  async openChatView(session) {
    const activeView = this.plugin.getActiveMarkdownView();
    const leaf = this.getExistingChatLeaf() || this.plugin.app.workspace.getRightLeaf(false);
    await leaf.setViewState({
      type: this.reviewChatViewType,
      active: true,
    });
    this.restoreActiveEditorLeaf(activeView);

    const view = leaf.view;
    view.setSession(session);
    return view;
  }

  pruneTemporaryMarkdownPopouts() {
    for (const [key, leaf] of this.temporaryMarkdownPopouts.entries()) {
      if (!this.isLeafReusable(leaf)) {
        this.temporaryMarkdownPopouts.delete(key);
      }
    }
  }

  getLeafHostWindow(leaf) {
    return leaf?.view?.containerEl?.ownerDocument?.defaultView || null;
  }

  setPopoutWindowVisible(leaf, isVisible) {
    const popoutWindow = this.getLeafHostWindow(leaf);
    const rootEl = popoutWindow?.document?.documentElement;
    if (!rootEl?.style) {
      return;
    }

    if (isVisible) {
      rootEl.style.opacity = "";
      rootEl.style.visibility = "";
      rootEl.style.pointerEvents = "";
      return;
    }

    rootEl.style.opacity = "0";
    rootEl.style.visibility = "hidden";
    rootEl.style.pointerEvents = "none";
  }

  isLeafReusable(leaf) {
    if (!leaf || leaf.isDetached) {
      return false;
    }

    const containerEl = leaf.view?.containerEl;
    if (!containerEl || containerEl.isConnected === false) {
      return false;
    }

    const popoutWindow = this.getLeafHostWindow(leaf);
    if (!popoutWindow || popoutWindow.closed) {
      return false;
    }

    return true;
  }

  async focusLeaf(leaf) {
    if (!leaf) {
      return;
    }

    try {
      this.plugin.app.workspace.setActiveLeaf(leaf, { focus: true });
    } catch (error) {
      console.debug("QuickReview: failed to focus leaf", error);
    }
  }

  focusPopoutWindow(leaf) {
    const popoutWindow = this.getLeafHostWindow(leaf);
    if (typeof popoutWindow?.focus !== "function") {
      return;
    }

    try {
      popoutWindow.focus();
    } catch (error) {
      console.debug("QuickReview: failed to focus popout window", error);
    }
  }

  applyDefaultPopoutWindowSize(leaf) {
    const popoutWindow = this.getLeafHostWindow(leaf);
    if (!popoutWindow?.resizeTo) {
      return;
    }

    const targetWidth = this.defaultPopoutSize.width;
    const targetHeight = this.defaultPopoutSize.height;
    const screenWidth = Number(popoutWindow.screen?.availWidth) || targetWidth;
    const screenHeight = Number(popoutWindow.screen?.availHeight) || targetHeight;
    const left = Math.max(0, Math.round((screenWidth - targetWidth) / 2));
    const top = Math.max(0, Math.round((screenHeight - targetHeight) / 2));

    try {
      if (typeof popoutWindow.moveTo === "function") {
        popoutWindow.moveTo(left, top);
      }
      popoutWindow.resizeTo(targetWidth, targetHeight);
    } catch (error) {
      console.debug("QuickReview: failed to resize popout window", error);
    }
  }

  async openTemporaryMarkdownView(state, options = {}) {
    const popoutKey = options.key || null;
    this.pruneTemporaryMarkdownPopouts();

    let popoutLeaf = popoutKey ? this.temporaryMarkdownPopouts.get(popoutKey) || null : null;
    if (!this.isLeafReusable(popoutLeaf)) {
      if (popoutKey) {
        this.temporaryMarkdownPopouts.delete(popoutKey);
      }
      popoutLeaf = null;
    }
    let isNewPopout = false;
    if (!popoutLeaf) {
      popoutLeaf = await this.plugin.app.workspace.openPopoutLeaf();
      isNewPopout = true;
      this.setPopoutWindowVisible(popoutLeaf, false);
      if (popoutKey) {
        this.temporaryMarkdownPopouts.set(popoutKey, popoutLeaf);
      }
    }

    try {
      await popoutLeaf.setViewState({
        type: this.temporaryMarkdownViewType,
        active: false,
      });
      if (isNewPopout) {
        this.applyDefaultPopoutWindowSize(popoutLeaf);
      }

      const view = popoutLeaf.view;
      await view.setContent(state);

      const popoutWindow = this.getLeafHostWindow(popoutLeaf);
      if (
        popoutKey &&
        popoutWindow &&
        typeof popoutWindow.addEventListener === "function" &&
        !popoutWindow.__qreviewTemporaryMarkdownCleanupBound
      ) {
        popoutWindow.addEventListener("beforeunload", () => {
          const currentLeaf = this.temporaryMarkdownPopouts.get(popoutKey);
          if (currentLeaf === popoutLeaf) {
            this.temporaryMarkdownPopouts.delete(popoutKey);
          }
        });
        popoutWindow.__qreviewTemporaryMarkdownCleanupBound = true;
      }

      this.setPopoutWindowVisible(popoutLeaf, true);
      this.focusPopoutWindow(popoutLeaf);

      return view;
    } catch (error) {
      this.setPopoutWindowVisible(popoutLeaf, true);
      throw error;
    }
  }
}

module.exports = { WorkspaceViewService };
