const { Setting, setIcon } = require("obsidian");
const {
  extractJsonObject,
  finalizeGeneratedAgent,
  normalizeGeneratedAgent,
  sanitizeAgentId,
} = require("./agentConfigUtils");
const { AddAgentModal } = require("./addAgentModal");
const { renderAgentToolMultiSelect } = require("./agentToolMultiSelect");
const {
  cloneDefaultAgents,
  removeAgentReferences,
  renameAgentReferences,
} = require("./settingsStore");

function getAgentCollapseKey(agent, index) {
  return agent.id || `index-${index}`;
}

function getAgentNavKey(agent, index) {
  return sanitizeAgentId(agent.id || agent.title || agent.label || `agent-${index + 1}`) || `agent-${index + 1}`;
}

function createAgentNav(containerEl, context, agents, cardEntries) {
  if (!agents.length) {
    return null;
  }

  const navEl = containerEl.createDiv({ cls: "qreview-agent-nav" });
  const scrollContainer = containerEl.closest(".vertical-tab-content") || containerEl;
  const headerEl = navEl.createDiv({ cls: "qreview-agent-nav__header" });
  const topButton = headerEl.createEl("button", {
    cls: "qreview-agent-nav__icon-button",
    attr: {
      type: "button",
      "aria-label": "回到页面顶部",
    },
  });
  setIcon(topButton, "arrow-up");
  topButton.addEventListener("click", () => {
    scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
  });

  const listEl = navEl.createDiv({ cls: "qreview-agent-nav__list" });

  const navButtons = cardEntries.map(({ agent, index, cardEl, anchorId }) => {
    const buttonEl = listEl.createEl("button", {
      text: agent.title || agent.label || `Agent ${index + 1}`,
      cls: "qreview-agent-nav__item",
      attr: {
        type: "button",
        "data-agent-anchor": anchorId,
      },
    });
    buttonEl.addEventListener("click", () => {
      cardEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return buttonEl;
  });

  const addButton = listEl.createEl("button", {
    cls: "qreview-agent-nav__item qreview-agent-nav__item--add mod-cta",
    attr: {
      type: "button",
      "aria-label": "新增 Agent",
    },
  });
  setIcon(addButton, "plus");
  addButton.addEventListener("click", () => {
    context.openAddAgentModal();
  });

  const setActiveNavItem = (anchorId) => {
    navButtons.forEach((buttonEl) => {
      buttonEl.toggleClass("is-active", buttonEl.getAttribute("data-agent-anchor") === anchorId);
    });
  };

  const updateActiveNavItem = () => {
    let activeAnchorId = cardEntries[0]?.anchorId || "";
    let closestDistance = Number.POSITIVE_INFINITY;

    cardEntries.forEach(({ cardEl, anchorId }) => {
      const rect = cardEl.getBoundingClientRect();
      const distance = Math.abs(rect.top - 120);
      if (rect.bottom > 120 && distance < closestDistance) {
        closestDistance = distance;
        activeAnchorId = anchorId;
      }
    });

    setActiveNavItem(activeAnchorId);
  };

  updateActiveNavItem();

  if (typeof context.detachAgentNavListeners === "function") {
    context.detachAgentNavListeners();
  }

  scrollContainer.addEventListener("scroll", updateActiveNavItem);
  window.addEventListener("resize", updateActiveNavItem);
  context.detachAgentNavListeners = () => {
    scrollContainer.removeEventListener("scroll", updateActiveNavItem);
    window.removeEventListener("resize", updateActiveNavItem);
  };
  containerEl.detachAgentNavListeners = context.detachAgentNavListeners;

  return navEl;
}

function renderAgentSection(containerEl, context) {
  const {
    app,
    plugin,
    collapsedAgentIds,
    detachAgentNavListeners,
    display,
    saveAndRefresh,
    refreshToolbarButtons,
    syncToolbarActionOrder,
  } = context;

  syncToolbarActionOrder();
  const agents = plugin.settings.reviewAgents || [];
  const openAddAgentModal = () => {
    new AddAgentModal(app, plugin, {
      onSubmit: async (agent) => {
        plugin.settings.reviewAgents = [...(plugin.settings.reviewAgents || []), agent];
        await saveAndRefresh();
      },
    }).open();
  };

  const actionRowEl = containerEl.createDiv();
  actionRowEl.style.display = "flex";
  actionRowEl.style.flexWrap = "wrap";
  actionRowEl.style.gap = "8px";
  actionRowEl.style.marginBottom = "16px";

  const resetButton = actionRowEl.createEl("button", {
    text: "恢复默认",
  });
  resetButton.addEventListener("click", async () => {
    plugin.settings.reviewAgents = cloneDefaultAgents();
    plugin.settings.hiddenToolbarButtons = (plugin.settings.hiddenToolbarButtons || []).filter(
      (id) => id === "all-review" || id === "polish",
    );
    plugin.settings.toolbarActionOrder = plugin.normalizeToolbarActionOrder(
      [],
      plugin.getSelectionActions(),
    );
    await saveAndRefresh();
  });

  const allCollapsed =
    agents.length > 0 &&
    agents.every((agent, index) => collapsedAgentIds.has(getAgentCollapseKey(agent, index)));
  const collapseAllButton = actionRowEl.createEl("button", {
    text: allCollapsed ? "全部展开" : "一键折叠",
  });
  collapseAllButton.addEventListener("click", () => {
    if (allCollapsed) {
      collapsedAgentIds.clear();
    } else {
      agents.forEach((agent, index) => {
        collapsedAgentIds.add(getAgentCollapseKey(agent, index));
      });
    }
    display();
  });

  const cardsWrapEl = containerEl.createDiv({ cls: "qreview-agent-cards" });
  const cardEntries = [];

  agents.forEach((agent, index) => {
    const anchorId = `qreview-agent-${getAgentNavKey(agent, index)}`;
    const cardEl = cardsWrapEl.createDiv({
      cls: "qreview-agent-card",
      attr: { id: anchorId },
    });
    cardEl.style.scrollMarginTop = "108px";
    cardEntries.push({ agent, index, cardEl, anchorId });

    const headerEl = cardEl.createDiv({ cls: "qreview-agent-card__header" });
    const titleWrapEl = headerEl.createDiv({ cls: "qreview-agent-card__title-wrap" });
    const titleRowEl = titleWrapEl.createDiv({ cls: "qreview-agent-card__title-row" });
    const collapseKey = getAgentCollapseKey(agent, index);
    titleRowEl.createEl("h4", {
      text: agent.label || agent.title || `Agent ${index + 1}`,
      cls: "qreview-agent-card__title",
    });
    titleRowEl.createEl("div", {
      text: agent.id || "未设置 id",
      cls: "qreview-agent-card__subtitle",
    });

    const actionsEl = headerEl.createDiv({ cls: "qreview-agent-card__actions" });
    const contentEl = cardEl.createDiv({ cls: "qreview-agent-card__content" });
    const isCollapsed = collapsedAgentIds.has(collapseKey);

    const collapseButton = actionsEl.createEl("button", {
      cls: "qreview-agent-card__action-button qreview-agent-card__action-button--icon",
      attr: {
        type: "button",
        "aria-label": isCollapsed ? "展开 Agent" : "折叠 Agent",
      },
    });
    setIcon(collapseButton, isCollapsed ? "chevron-right" : "chevron-down");
    collapseButton.addEventListener("click", () => {
      if (collapsedAgentIds.has(collapseKey)) {
        collapsedAgentIds.delete(collapseKey);
      } else {
        collapsedAgentIds.add(collapseKey);
      }
      display();
    });

    const deleteButton = actionsEl.createEl("button", {
      cls: "qreview-agent-card__action-button qreview-agent-card__action-button--icon qreview-agent-card__action-button--danger",
      attr: {
        type: "button",
        "aria-label": "删除 Agent",
      },
    });
    setIcon(deleteButton, "trash-2");
    deleteButton.addEventListener("click", async () => {
      collapsedAgentIds.delete(collapseKey);
      plugin.settings.reviewAgents = (plugin.settings.reviewAgents || []).filter(
        (_, currentIndex) => currentIndex !== index,
      );
      removeAgentReferences(plugin.settings, agent.id);
      await saveAndRefresh();
    });

    if (isCollapsed) {
      cardEl.addClass("is-collapsed");
    }

    new Setting(contentEl)
      .setName("id")
      .setDesc("命令和动作的唯一标识，建议使用英文短横线。")
      .addText((text) =>
        text.setPlaceholder("fact-check").setValue(agent.id || "").onChange(async (value) => {
          const previousId = agent.id;
          const nextId = value.trim();
          const previousCollapseKey = getAgentCollapseKey(agent, index);
          const nextCollapseKey = nextId || `index-${index}`;
          if (collapsedAgentIds.has(previousCollapseKey)) {
            collapsedAgentIds.delete(previousCollapseKey);
            collapsedAgentIds.add(nextCollapseKey);
          }
          agent.id = nextId;
          renameAgentReferences(plugin.settings, previousId, agent.id);
          await plugin.saveSettings();
        }),
      );

    new Setting(contentEl)
      .setName("label")
      .setDesc("显示在按钮和命令名称中的短标签。")
      .addText((text) =>
        text.setPlaceholder("事实").setValue(agent.label || "").onChange(async (value) => {
          agent.label = value.trim();
          await plugin.saveSettings();
          refreshToolbarButtons();
        }),
      );

    new Setting(contentEl)
      .setName("title")
      .setDesc("结果页标题和提示词中的角色名。")
      .addText((text) =>
        text.setPlaceholder("事实核验").setValue(agent.title || "").onChange(async (value) => {
          agent.title = value.trim();
          await plugin.saveSettings();
          refreshToolbarButtons();
        }),
      );

    renderAgentToolMultiSelect(contentEl, agent, plugin);

    new Setting(contentEl)
      .setName("systemRole")
      .setDesc("作为系统提示词传给模型的角色设定。")
      .addTextArea((text) => {
        text.inputEl.rows = 4;
        text
          .setPlaceholder("你是一名严谨的事实核验编辑...")
          .setValue(agent.systemRole || "")
          .onChange(async (value) => {
            agent.systemRole = value.trim();
            await plugin.saveSettings();
          });
      });

    new Setting(contentEl)
      .setName("focus")
      .setDesc("用于构造用户提示词的审阅重点。")
      .addTextArea((text) => {
        text.inputEl.rows = 4;
        text
          .setPlaceholder("优先指出事实错误、概念误用...")
          .setValue(agent.focus || "")
          .onChange(async (value) => {
            agent.focus = value.trim();
            await plugin.saveSettings();
          });
      });
  });

  context.detachAgentNavListeners = detachAgentNavListeners;
  context.openAddAgentModal = openAddAgentModal;
  createAgentNav(containerEl, context, agents, cardEntries);
  cardsWrapEl.remove();
  containerEl.appendChild(cardsWrapEl);
}

module.exports = {
  extractJsonObject,
  finalizeGeneratedAgent,
  normalizeGeneratedAgent,
  renderAgentSection,
  sanitizeAgentId,
};
