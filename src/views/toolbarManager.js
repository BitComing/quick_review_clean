const { setIcon } = require("obsidian");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

class ToolbarManager {
  constructor(plugin) {
    this.plugin = plugin;
    this.selectionToolbarEl = null;
    this.globalToolbarEl = null;
    this.selectionRefreshTimer = null;
    this.selectionToolbarState = null;
  }

  initialize() {
    this.selectionToolbarEl = document.createElement("div");
    this.selectionToolbarEl.className = "qreview-selection-toolbar is-hidden";
    document.body.appendChild(this.selectionToolbarEl);
    this.renderToolbarButtons(this.selectionToolbarEl, "selection");

    this.globalToolbarEl = document.createElement("div");
    this.globalToolbarEl.className = "qreview-global-toolbar is-hidden";
    document.body.appendChild(this.globalToolbarEl);
    this.renderToolbarButtons(this.globalToolbarEl, "document");
  }

  destroy() {
    window.clearTimeout(this.selectionRefreshTimer);
    this.selectionToolbarState = null;

    if (this.selectionToolbarEl) {
      this.selectionToolbarEl.remove();
      this.selectionToolbarEl = null;
    }

    if (this.globalToolbarEl) {
      this.globalToolbarEl.remove();
      this.globalToolbarEl = null;
    }
  }

  renderToolbarButtons(container, scope) {
    container.innerHTML = "";
    const hidden = new Set(this.plugin.settings.hiddenToolbarButtons || []);
    const buttons = this.plugin
      .getOrderedActions(scope)
      .filter((action) => !hidden.has(action.id));

    for (const action of buttons) {
      const button = document.createElement("button");
      button.className = "qreview-toolbar__button";
      button.textContent = action.label;
      button.title = action.title || action.label;
      button.addEventListener("mousedown", (event) => event.preventDefault());
      button.addEventListener("click", () => this.plugin.runAction(action.id, scope));
      container.appendChild(button);
    }

    const settingsButton = document.createElement("button");
    settingsButton.className = "qreview-toolbar__button qreview-toolbar__button--icon";
    settingsButton.title = "打开 QuickReview 设置";
    settingsButton.setAttribute("aria-label", "打开 QuickReview 设置");
    setIcon(settingsButton, "settings");
    settingsButton.addEventListener("mousedown", (event) => event.preventDefault());
    settingsButton.addEventListener("click", () => this.plugin.openSettings());
    container.appendChild(settingsButton);
  }

  queueRefresh() {
    window.clearTimeout(this.selectionRefreshTimer);
    this.selectionRefreshTimer = window.setTimeout(() => this.refresh(), 80);
  }

  isToolbarEventTarget(target) {
    if (!(target instanceof Node)) {
      return false;
    }

    return Boolean(
      this.selectionToolbarEl?.contains(target) || this.globalToolbarEl?.contains(target),
    );
  }

  refresh() {
    this.refreshSelectionToolbar();
    this.refreshGlobalToolbar();
  }

  refreshGlobalToolbar() {
    if (!this.globalToolbarEl) {
      return;
    }

    const view = this.plugin.getActiveMarkdownView();
    const hasEditor = Boolean(view && view.editor);
    this.globalToolbarEl.classList.toggle("is-hidden", !hasEditor);
  }

  refreshSelectionToolbar() {
    if (!this.selectionToolbarEl) {
      return;
    }

    if ((this.plugin.selectionToolbarSuppressedUntil || 0) > Date.now()) {
      this.selectionToolbarState = null;
      this.selectionToolbarEl.classList.add("is-hidden");
      return;
    }

    if (this.plugin.isMouseSelectionInProgress) {
      this.selectionToolbarState = null;
      this.selectionToolbarEl.classList.add("is-hidden");
      return;
    }

    const view = this.plugin.getActiveMarkdownView();
    const editor = view && view.editor;

    if (!view || !editor) {
      this.selectionToolbarState = null;
      this.selectionToolbarEl.classList.add("is-hidden");
      return;
    }

    const selectedText = editor.getSelection();
    const selection = window.getSelection();

    if (!selectedText || !selectedText.trim() || !selection || !selection.rangeCount) {
      this.selectionToolbarState = null;
      this.selectionToolbarEl.classList.add("is-hidden");
      return;
    }

    const anchorNode = selection.anchorNode;
    if (!anchorNode || !view.containerEl.contains(anchorNode)) {
      this.selectionToolbarState = null;
      this.selectionToolbarEl.classList.add("is-hidden");
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect || (!rect.width && !rect.height)) {
      this.selectionToolbarState = null;
      this.selectionToolbarEl.classList.add("is-hidden");
      return;
    }

    const selectionKey = [
      selectedText,
      range.startOffset,
      range.endOffset,
      Math.round(rect.left),
      Math.round(rect.top),
      Math.round(rect.width),
      Math.round(rect.height),
    ].join(":");
    const hasVisibleToolbar = !this.selectionToolbarEl.classList.contains("is-hidden");
    const shouldReusePosition =
      hasVisibleToolbar &&
      this.selectionToolbarState &&
      this.selectionToolbarState.selectionKey === selectionKey;

    let left;
    let top;
    if (shouldReusePosition) {
      ({ left, top } = this.selectionToolbarState);
    } else {
      const mousePosition = this.plugin.lastSelectionMousePosition;
      const preferredLeft = mousePosition?.clientX ?? rect.left + rect.width / 2;
      const preferredTop = mousePosition?.clientY != null ? mousePosition.clientY + 12 : rect.bottom + 10;
      left = clamp(preferredLeft, 120, window.innerWidth - 120);
      top = clamp(preferredTop, 12, window.innerHeight - 72);
      this.selectionToolbarState = { selectionKey, left, top };
    }

    this.selectionToolbarEl.style.left = `${left}px`;
    this.selectionToolbarEl.style.top = `${top}px`;
    this.selectionToolbarEl.classList.remove("is-hidden");
  }
}

module.exports = { ToolbarManager };
