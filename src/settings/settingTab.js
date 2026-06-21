const { renderDefaultSection } = require("./defaultSection");
const { renderAgentSection } = require("./agentSection");
const { renderToolbarSection } = require("./toolbarSection");
const { PluginSettingTab } = require("obsidian");

class QuickReviewSettingTab extends PluginSettingTab {
  constructor(app, plugin, helpers) {
    super(app, plugin);
    this.plugin = plugin;
    this.DEFAULT_SETTINGS = helpers.DEFAULT_SETTINGS;
    this.getSelectionActions = helpers.getSelectionActions;
    this.activeTab = "default";
    this.collapsedAgentIds = new Set();
    this.detachAgentNavListeners = null;
  }

  refreshToolbarButtons() {
    const toolbarManager = this.plugin.toolbarManager;
    if (!toolbarManager) {
      return;
    }

    if (toolbarManager.selectionToolbarEl) {
      toolbarManager.renderToolbarButtons(toolbarManager.selectionToolbarEl, "selection");
    }

    if (toolbarManager.globalToolbarEl) {
      toolbarManager.renderToolbarButtons(toolbarManager.globalToolbarEl, "document");
    }
  }

  async saveAndRefresh() {
    await this.plugin.saveSettings();
    this.refreshToolbarButtons();
    this.plugin.refreshToolbarState();
    this.display();
  }

  syncToolbarActionOrder() {
    this.plugin.settings.toolbarActionOrder = this.plugin.normalizeToolbarActionOrder(
      this.plugin.settings.toolbarActionOrder,
      this.plugin.getSelectionActions(),
    );
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.display();
  }

  createTabButton(containerEl, id, label) {
    const button = containerEl.createEl("button", {
      text: label,
      cls: `qreview-settings-tab${this.activeTab === id ? " is-active" : ""}`,
    });
    button.setAttribute("aria-selected", this.activeTab === id ? "true" : "false");
    button.addEventListener("click", () => this.setActiveTab(id));
  }

  renderDefaultSettings(containerEl) {
    return renderDefaultSection(containerEl, {
      plugin: this.plugin,
      defaultSettings: this.DEFAULT_SETTINGS,
    });
  }

  renderAgentSettings(containerEl) {
    return renderAgentSection(containerEl, {
      app: this.app,
      plugin: this.plugin,
      collapsedAgentIds: this.collapsedAgentIds,
      detachAgentNavListeners: this.detachAgentNavListeners,
      display: this.display.bind(this),
      saveAndRefresh: this.saveAndRefresh.bind(this),
      refreshToolbarButtons: this.refreshToolbarButtons.bind(this),
      syncToolbarActionOrder: this.syncToolbarActionOrder.bind(this),
    });
  }

  renderContextMenuSettings(containerEl) {
    return renderToolbarSection(containerEl, {
      plugin: this.plugin,
      saveAndRefresh: this.saveAndRefresh.bind(this),
      syncToolbarActionOrder: this.syncToolbarActionOrder.bind(this),
    });
  }

  stabilizeContainerScroll(containerEl) {
    containerEl.style.overflowY = "auto";
    containerEl.style.scrollbarGutter = "stable";
  }

  display() {
    const { containerEl } = this;
    if (typeof this.detachAgentNavListeners === "function") {
      this.detachAgentNavListeners();
      this.detachAgentNavListeners = null;
    }
    this.stabilizeContainerScroll(containerEl);
    containerEl.empty();

    containerEl.createEl("h2", { text: "QuickReview 设置" });
    const tabBarEl = containerEl.createDiv({ cls: "qreview-settings-tabs" });

    this.createTabButton(tabBarEl, "default", "默认设置");
    this.createTabButton(tabBarEl, "agents", "Agent配置");
    this.createTabButton(tabBarEl, "toolbar", "上下文菜单");

    const panelEl = containerEl.createDiv({ cls: "qreview-settings-panel" });

    if (this.activeTab === "default") {
      this.renderDefaultSettings(panelEl);
    } else if (this.activeTab === "agents") {
      this.renderAgentSettings(panelEl);
      this.detachAgentNavListeners = panelEl.detachAgentNavListeners || this.detachAgentNavListeners;
    } else if (this.activeTab === "toolbar") {
      this.renderContextMenuSettings(panelEl);
    }
  }
}

module.exports = { QuickReviewSettingTab };
