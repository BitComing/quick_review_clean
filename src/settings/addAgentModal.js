const { Modal, Notice, Setting } = require("obsidian");
const {
  extractJsonObject,
  finalizeGeneratedAgent,
  getAvailableAgentTools,
  normalizeGeneratedAgent,
} = require("./agentConfigUtils");
const { AgentAIGeneratorModal } = require("./agentAIGeneratorModal");
const { renderAgentToolMultiSelect } = require("./agentToolMultiSelect");
const { createEmptyAgent } = require("./settingsStore");

class AddAgentModal extends Modal {
  constructor(app, plugin, options = {}) {
    super(app);
    this.plugin = plugin;
    this.onSubmit = options.onSubmit;
    this.agent = createEmptyAgent();
    this.formControls = {};
    this.toolSummaryUpdater = null;
    this.isGenerating = false;
  }

  updateFormValues() {
    this.formControls.id?.setValue(this.agent.id || "");
    this.formControls.label?.setValue(this.agent.label || "");
    this.formControls.title?.setValue(this.agent.title || "");
    this.formControls.systemRole?.setValue(this.agent.systemRole || "");
    this.formControls.focus?.setValue(this.agent.focus || "");
    this.toolSummaryUpdater?.();
  }

  async generateAgentWithAI(userDescription) {
    const toolDescriptions = getAvailableAgentTools()
      .map((tool) => `- ${tool.id}: ${tool.name}。${tool.description}`)
      .join("\n");
    const existingIds = (this.plugin.settings.reviewAgents || [])
      .map((agent) => agent.id)
      .filter(Boolean)
      .join(", ");
    const userPrompt = [
      "请根据下面的需求，生成一个用于中文写作审阅插件的 Agent 配置。",
      "需求：",
      userDescription,
      "",
      "可选 tools：",
      toolDescriptions || "- 无",
      "",
      `现有 Agent id：${existingIds || "无"}`,
      "",
      "请只返回一个 JSON 对象，不要输出解释，不要使用 Markdown 代码块。字段要求：",
      '- id: 英文、小写、短横线风格，且不要与现有 id 重复',
      "- label: 2 到 6 个字的中文短标签",
      "- title: 清晰的中文角色名",
      "- systemRole: 详细角色设定，适合直接作为系统提示词",
      "- focus: 详细审阅重点，适合直接作为用户提示词的一部分",
      '- tools: 数组，只能从可选 tools 的 id 中选择，例如 ["web-search"]',
    ].join("\n");

    const result = await this.plugin.reviewService.callModel({
      systemPrompt:
        "你是一名 Agent 设计助手，擅长根据需求生成结构化的中文审阅 Agent 配置。输出必须是合法 JSON 对象。",
      userPrompt,
    });
    const generatedAgent = finalizeGeneratedAgent(
      normalizeGeneratedAgent(extractJsonObject(result)),
      this.plugin.settings.reviewAgents || [],
    );

    this.agent = {
      ...this.agent,
      ...generatedAgent,
      tools: [...generatedAgent.tools],
    };
    this.updateFormValues();
  }

  onOpen() {
    const { contentEl, titleEl } = this;
    titleEl.setText("新增 Agent");
    contentEl.empty();

    new Setting(contentEl)
      .setName("id")
      .setDesc("命令和动作的唯一标识，建议使用英文短横线。")
      .addText((text) => {
        this.formControls.id = text;
        text.setPlaceholder("fact-check").setValue(this.agent.id).onChange((value) => {
          this.agent.id = value.trim();
        });
      });

    new Setting(contentEl)
      .setName("label")
      .setDesc("显示在按钮和命令名称中的短标签。")
      .addText((text) => {
        this.formControls.label = text;
        text.setPlaceholder("事实").setValue(this.agent.label).onChange((value) => {
          this.agent.label = value.trim();
        });
      });

    new Setting(contentEl)
      .setName("title")
      .setDesc("结果页标题和提示词中的角色名。")
      .addText((text) => {
        this.formControls.title = text;
        text.setPlaceholder("事实核验").setValue(this.agent.title).onChange((value) => {
          this.agent.title = value.trim();
        });
      });

    renderAgentToolMultiSelect(contentEl, this.agent, this.plugin, {
      onChange: (tools) => {
        this.agent.tools = Array.isArray(tools) ? [...tools] : [];
      },
      onReady: (updateSummary) => {
        this.toolSummaryUpdater = updateSummary;
      },
    });

    new Setting(contentEl)
      .setName("systemRole")
      .setDesc("作为系统提示词传给模型的角色设定。")
      .addTextArea((text) => {
        this.formControls.systemRole = text;
        text.inputEl.rows = 4;
        text
          .setPlaceholder("你是一名严谨的事实核验编辑...")
          .setValue(this.agent.systemRole)
          .onChange((value) => {
            this.agent.systemRole = value.trim();
          });
      });

    new Setting(contentEl)
      .setName("focus")
      .setDesc("用于构造用户提示词的审阅重点。")
      .addTextArea((text) => {
        this.formControls.focus = text;
        text.inputEl.rows = 4;
        text
          .setPlaceholder("优先指出事实错误、概念误用...")
          .setValue(this.agent.focus)
          .onChange((value) => {
            this.agent.focus = value.trim();
          });
      });

    const footerEl = contentEl.createDiv({ cls: "modal-button-container" });
    footerEl.style.display = "flex";
    footerEl.style.justifyContent = "space-between";
    footerEl.style.alignItems = "center";

    const leftActionsEl = footerEl.createDiv();
    leftActionsEl.style.display = "flex";
    leftActionsEl.style.gap = "8px";

    const rightActionsEl = footerEl.createDiv();
    rightActionsEl.style.display = "flex";
    rightActionsEl.style.gap = "8px";

    const generateButton = leftActionsEl.createEl("button", {
      text: "AI生成",
      attr: { type: "button" },
    });
    const cancelButton = footerEl.createEl("button", { text: "取消", attr: { type: "button" } });
    rightActionsEl.appendChild(cancelButton);
    const submitButton = rightActionsEl.createEl("button", {
      text: "保存",
      cls: "mod-cta",
      attr: { type: "button" },
    });

    const setGenerating = (isGenerating) => {
      this.isGenerating = isGenerating;
      generateButton.disabled = isGenerating;
      cancelButton.disabled = isGenerating;
      submitButton.disabled = isGenerating;
      generateButton.setText(isGenerating ? "AI生成中..." : "AI生成");
    };

    generateButton.addEventListener("click", () => {
      if (this.isGenerating) {
        return;
      }

      new AgentAIGeneratorModal(this.app, {
        onSubmit: async (prompt) => {
          setGenerating(true);
          try {
            await this.generateAgentWithAI(prompt);
            new Notice("已根据描述填充 Agent 字段。");
          } catch (error) {
            new Notice(error.message || "AI 生成失败，请检查模型配置后重试。");
            throw error;
          } finally {
            setGenerating(false);
          }
        },
      }).open();
    });

    cancelButton.addEventListener("click", () => this.close());
    submitButton.addEventListener("click", async () => {
      if (this.isGenerating) {
        return;
      }

      const nextId = (this.agent.id || "").trim();
      if (!nextId) {
        new Notice("请填写 Agent id。");
        return;
      }

      const idExists = (this.plugin.settings.reviewAgents || []).some((agent) => agent.id === nextId);
      if (idExists) {
        new Notice(`Agent id "${nextId}" 已存在，请更换。`);
        return;
      }

      if (!this.agent.label) {
        this.agent.label = nextId;
      }
      if (!this.agent.title) {
        this.agent.title = this.agent.label;
      }

      if (typeof this.onSubmit === "function") {
        await this.onSubmit({
          ...this.agent,
          tools: Array.isArray(this.agent.tools) ? [...this.agent.tools] : [],
        });
      }
      this.close();
    });
  }

  onClose() {
    this.contentEl.empty();
  }
}

module.exports = {
  AddAgentModal,
};
