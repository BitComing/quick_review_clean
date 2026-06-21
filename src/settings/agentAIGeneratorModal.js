const { Modal, Notice, Setting } = require("obsidian");

class AgentAIGeneratorModal extends Modal {
  constructor(app, options = {}) {
    super(app);
    this.onSubmit = options.onSubmit;
    this.prompt = "";
    this.isGenerating = false;
  }

  onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.setText("AI 生成 Agent");
    contentEl.empty();

    new Setting(contentEl)
      .setName("需求描述")
      .setDesc("简单说明你想要哪种类型的 Agent，例如用途、风格、是否需要联网。")
      .addTextArea((text) => {
        text.inputEl.rows = 6;
        text
          .setPlaceholder("例如：我想要一个更严格的论文审稿 Agent，重点检查逻辑漏洞、术语误用，并尽量给出可操作修改建议。")
          .setValue(this.prompt)
          .onChange((value) => {
            this.prompt = value.trim();
          });
        text.inputEl.focus();
      });

    const footerEl = contentEl.createDiv({ cls: "modal-button-container" });
    const cancelButton = footerEl.createEl("button", { text: "取消", attr: { type: "button" } });
    const submitButton = footerEl.createEl("button", {
      text: "生成",
      cls: "mod-cta",
      attr: { type: "button" },
    });

    const setGenerating = (isGenerating) => {
      this.isGenerating = isGenerating;
      cancelButton.disabled = isGenerating;
      submitButton.disabled = isGenerating;
      submitButton.setText(isGenerating ? "生成中..." : "生成");
    };

    cancelButton.addEventListener("click", () => {
      if (!this.isGenerating) {
        this.close();
      }
    });

    submitButton.addEventListener("click", async () => {
      if (this.isGenerating) {
        return;
      }

      if (!this.prompt) {
        new Notice("请先描述想要的 Agent 类型。");
        return;
      }

      setGenerating(true);
      try {
        await this.onSubmit?.(this.prompt);
        this.close();
      } finally {
        setGenerating(false);
      }
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

module.exports = {
  AgentAIGeneratorModal,
};
