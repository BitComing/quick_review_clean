const { Setting } = require("obsidian");
const { getAvailableAgentTools } = require("./agentConfigUtils");

function renderAgentToolMultiSelect(containerEl, agent, plugin, options = {}) {
  const { onChange, onReady } = options;
  const toolOptions = getAvailableAgentTools();
  const toolsSetting = new Setting(containerEl).setName("工具").setDesc(
    toolOptions.length ? "点击选择框展开工具列表，支持多选。" : "当前没有可配置的工具。",
  );

  if (!toolOptions.length) {
    return;
  }

  const getSelectedTools = () => (Array.isArray(agent.tools) ? agent.tools : []);
  const getSummaryText = () => {
    const selectedIds = getSelectedTools();
    const selectedNames = toolOptions
      .filter((tool) => selectedIds.includes(tool.id))
      .map((tool) => tool.name);

    return selectedNames.length ? selectedNames.join("、") : "请选择工具";
  };

  const wrapperEl = toolsSetting.controlEl.createDiv({
    cls: "qreview-agent-tools-select",
  });
  wrapperEl.style.position = "relative";

  const triggerEl = wrapperEl.createEl("button", {
    cls: "qreview-agent-tools-select__trigger",
    attr: { type: "button" },
  });
  triggerEl.style.display = "flex";
  triggerEl.style.alignItems = "center";
  triggerEl.style.justifyContent = "space-between";
  triggerEl.style.gap = "12px";
  triggerEl.style.border = "1px solid var(--background-modifier-border)";
  triggerEl.style.borderRadius = "6px";
  triggerEl.style.background = "var(--background-primary)";
  triggerEl.style.cursor = "pointer";

  const summaryEl = triggerEl.createEl("span", {
    text: getSummaryText(),
    cls: "qreview-agent-tools-select__summary",
  });

  const caretEl = triggerEl.createEl("span", {
    text: "▼",
    cls: "qreview-agent-tools-select__caret",
  });

  const menuEl = wrapperEl.createDiv({
    cls: "qreview-agent-tools-select__menu",
  });
  menuEl.style.display = "none";
  menuEl.style.position = "absolute";
  menuEl.style.top = "calc(100% + 6px)";
  menuEl.style.left = "0";
  menuEl.style.right = "0";
  menuEl.style.zIndex = "10";
  menuEl.style.padding = "8px";
  menuEl.style.border = "1px solid var(--background-modifier-border)";
  menuEl.style.borderRadius = "8px";
  menuEl.style.background = "var(--background-primary)";
  menuEl.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
  menuEl.style.flexDirection = "column";
  menuEl.style.gap = "8px";

  let isOpen = false;
  let detachOutsideClick = null;

  const closeMenu = () => {
    if (!isOpen) {
      return;
    }
    isOpen = false;
    menuEl.style.display = "none";
    caretEl.textContent = "▼";
    if (detachOutsideClick) {
      detachOutsideClick();
      detachOutsideClick = null;
    }
  };

  const openMenu = () => {
    if (isOpen) {
      return;
    }
    isOpen = true;
    menuEl.style.display = "flex";
    caretEl.textContent = "▲";

    const handleOutsideClick = (event) => {
      if (!wrapperEl.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    detachOutsideClick = () => document.removeEventListener("click", handleOutsideClick);
  };

  triggerEl.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  toolOptions.forEach((tool) => {
    const optionLabelEl = menuEl.createEl("label");
    optionLabelEl.style.display = "flex";
    optionLabelEl.style.alignItems = "flex-start";
    optionLabelEl.style.gap = "8px";
    optionLabelEl.style.padding = "6px 4px";
    optionLabelEl.style.cursor = "pointer";

    const checkboxEl = optionLabelEl.createEl("input", { type: "checkbox" });
    checkboxEl.checked = getSelectedTools().includes(tool.id);
    checkboxEl.style.marginTop = "2px";

    const textWrapEl = optionLabelEl.createDiv({
      cls: "qreview-agent-tools-select__option-text",
    });

    textWrapEl.createEl("span", {
      text: tool.name,
      cls: "qreview-agent-tools-select__option-name",
    });

    textWrapEl.createEl("small", {
      text: tool.description,
      cls: "setting-item-description",
    });

    checkboxEl.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    checkboxEl.addEventListener("change", async () => {
      const nextTools = new Set(getSelectedTools());
      if (checkboxEl.checked) {
        nextTools.add(tool.id);
      } else {
        nextTools.delete(tool.id);
      }
      agent.tools = [...nextTools];
      summaryEl.textContent = getSummaryText();
      if (typeof onChange === "function") {
        await onChange(agent.tools);
        return;
      }
      await plugin.saveSettings();
    });
  });

  if (typeof onReady === "function") {
    onReady(() => {
      summaryEl.textContent = getSummaryText();
      menuEl.querySelectorAll('input[type="checkbox"]').forEach((checkboxEl, index) => {
        checkboxEl.checked = getSelectedTools().includes(toolOptions[index]?.id);
      });
    });
  }
}

module.exports = {
  renderAgentToolMultiSelect,
};
