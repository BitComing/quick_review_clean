const { Setting } = require("obsidian");

function renderToolbarSection(containerEl, context) {
  const { plugin, saveAndRefresh, syncToolbarActionOrder } = context;

  containerEl.createEl("p", {
    text: "控制在选中文本时弹出的上下文菜单中显示哪些按钮。",
    cls: "setting-item-description",
  });

  syncToolbarActionOrder();
  const orderedIds = plugin.settings.toolbarActionOrder || [];
  const actionMap = new Map(plugin.getSelectionActions().map((action) => [action.id, action]));

  let draggedActionId = null;

  const moveAction = async (draggedId, targetId) => {
    if (!draggedId || !targetId || draggedId === targetId) {
      return;
    }

    const nextOrder = [...orderedIds];
    const fromIndex = nextOrder.indexOf(draggedId);
    const toIndex = nextOrder.indexOf(targetId);

    if (fromIndex === -1 || toIndex === -1) {
      return;
    }

    nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, draggedId);
    plugin.settings.toolbarActionOrder = nextOrder;
    await saveAndRefresh();
  };

  for (const actionId of orderedIds) {
    const action = actionMap.get(actionId);
    if (!action) {
      continue;
    }

    const setting = new Setting(containerEl)
      .setName(action.label)
      .setDesc(action.id)
      .addToggle((toggle) => {
        const hidden = plugin.settings.hiddenToolbarButtons || [];
        toggle.setValue(!hidden.includes(action.id));
        toggle.onChange(async (value) => {
          const current = plugin.settings.hiddenToolbarButtons || [];
          if (value) {
            plugin.settings.hiddenToolbarButtons = current.filter((id) => id !== action.id);
          } else {
            plugin.settings.hiddenToolbarButtons = [...current, action.id];
          }
          await saveAndRefresh();
        });
      });

    setting.settingEl.dataset.actionId = action.id;
    setting.settingEl.draggable = true;
    setting.settingEl.addClass("qreview-sortable-setting");

    setting.settingEl.addEventListener("dragstart", (event) => {
      draggedActionId = action.id;
      setting.settingEl.addClass("is-dragging");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", action.id);
      }
    });

    setting.settingEl.addEventListener("dragend", () => {
      draggedActionId = null;
      setting.settingEl.removeClass("is-dragging");
      containerEl.querySelectorAll(".qreview-sortable-setting").forEach((element) => {
        element.removeClass("is-drag-over");
      });
    });

    setting.settingEl.addEventListener("dragover", (event) => {
      event.preventDefault();
      setting.settingEl.addClass("is-drag-over");
    });

    setting.settingEl.addEventListener("dragleave", () => {
      setting.settingEl.removeClass("is-drag-over");
    });

    setting.settingEl.addEventListener("drop", async (event) => {
      event.preventDefault();
      setting.settingEl.removeClass("is-drag-over");
      const droppedActionId = draggedActionId || event.dataTransfer?.getData("text/plain") || null;
      await moveAction(droppedActionId, action.id);
    });

    setting.addExtraButton((button) => {
      button.setIcon("grip-vertical");
      button.setTooltip("拖动排序");
      button.extraSettingsEl.addClass("qreview-sort-handle");
    });
  }
}

module.exports = {
  renderToolbarSection,
};
