const { ItemView, MarkdownRenderer } = require("obsidian");

const REVIEW_CHAT_VIEW_TYPE = "qreview-chat-view";

class ReviewChatView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.session = null;
    this.messages = [];
    this.pendingMessageIndex = null;
    this.isBusy = false;
  }

  getViewType() {
    return REVIEW_CHAT_VIEW_TYPE;
  }

  getDisplayText() {
    return "QuickReview Chat";
  }

  getIcon() {
    return "messages-square";
  }

  async onOpen() {
    this.render();
  }

  async onClose() {
    this.contentEl.empty();
  }

  setSession(session) {
    this.session = {
      ...session,
      context: { ...session.context },
      messages: Array.isArray(session.messages)
        ? session.messages.map((message) => ({ ...message }))
        : [],
    };
    this.messages = this.session.messages.map((message) => ({ ...message }));
    this.pendingMessageIndex = null;
    this.isBusy = false;
    this.render();
  }

  async startConversation(question) {
    if (!this.session) {
      return;
    }

    const content = (question || "").trim();
    if (!content) {
      return;
    }

    this.messages.push({ role: "user", content });
    await this.sendPendingConversation();
  }

  render() {
    this.contentEl.empty();
    this.contentEl.addClass("qreview-result-view", "qreview-chat-view");

    this.viewEl = this.contentEl.createDiv({ cls: "qreview-view" });
    this.bodyEl = this.viewEl.createDiv({ cls: "qreview-view__body" });
    this.bodyInnerEl = this.bodyEl.createDiv({ cls: "qreview-view__body-inner qreview-chat__body-inner" });
    this.composerEl = this.viewEl.createDiv({ cls: "qreview-chat__composer" });

    this.renderMessages();
    this.renderComposer();
  }

  renderMessages() {
    if (!this.bodyInnerEl) {
      return;
    }

    this.bodyInnerEl.empty();

    if (!this.session) {
      const emptyEl = this.bodyInnerEl.createDiv({ cls: "qreview-chat__empty" });
      emptyEl.setText("暂无追问会话。");
      return;
    }

    const summaryEl = this.bodyInnerEl.createDiv({ cls: "qreview-chat__summary" });
    summaryEl.createDiv({ cls: "qreview-chat__summary-title", text: this.session.title || "追问会话" });
    summaryEl.createDiv({
      cls: "qreview-chat__summary-meta",
      text: this.session.context.scope === "selection" ? "选中文本模式" : "整篇笔记模式",
    });

    for (const message of this.messages) {
      const bubbleEl = this.bodyInnerEl.createDiv({
        cls: `qreview-chat__message qreview-chat__message--${message.role}`,
      });
      const roleEl = bubbleEl.createDiv({ cls: "qreview-chat__message-role" });
      roleEl.setText(message.role === "assistant" ? "QuickReview" : "我");
      const contentEl = bubbleEl.createDiv({
        cls: "qreview-chat__message-content qreview-view__entry-content qreview-view__entry-content-body markdown-rendered",
      });

      if (message.role === "assistant") {
        MarkdownRenderer.renderMarkdown(message.content || "", contentEl, "", this.plugin);
      } else {
        const paragraph = contentEl.createEl("p");
        paragraph.setText(message.content || "");
      }
    }

    this.scrollToBottom();
  }

  renderComposer() {
    if (!this.composerEl) {
      return;
    }

    this.composerEl.empty();
    const fieldWrapEl = this.composerEl.createDiv({ cls: "qreview-chat__composer-field" });
    this.inputEl = fieldWrapEl.createEl("textarea", {
      cls: "qreview-chat__textarea",
      attr: {
        placeholder: "继续追问当前审阅结果...",
        rows: "3",
      },
    });

    const actionEl = this.composerEl.createDiv({ cls: "qreview-chat__composer-actions" });
    const submitButton = actionEl.createEl("button", {
      cls: "mod-cta",
      text: this.isBusy ? "发送中..." : "发送",
    });
    submitButton.disabled = this.isBusy || !this.session;

    const submit = () => this.handleSubmit();
    submitButton.addEventListener("click", submit);
    this.inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submit();
      }
    });
  }

  scrollToBottom() {
    if (!this.bodyEl) {
      return;
    }

    this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
  }

  async updateAssistantMessage(content) {
    if (this.pendingMessageIndex == null) {
      return;
    }

    this.messages[this.pendingMessageIndex].content = content;
    this.renderMessages();
  }

  async handleSubmit() {
    if (this.isBusy || !this.session || !this.inputEl) {
      return;
    }

    const question = this.inputEl.value.trim();
    if (!question) {
      return;
    }

    this.messages.push({ role: "user", content: question });
    this.inputEl.value = "";
    await this.sendPendingConversation();
  }

  async sendPendingConversation() {
    if (this.isBusy || !this.session) {
      return;
    }

    this.messages.push({ role: "assistant", content: "思考中..." });
    this.pendingMessageIndex = this.messages.length - 1;
    this.isBusy = true;
    this.renderMessages();
    this.renderComposer();

    try {
      const reply = await this.plugin.reviewService.runFollowUpChat(
        this.session,
        this.messages.slice(1),
        {
          onChunk: (fullText) => {
            this.updateAssistantMessage(fullText);
          },
        },
      );
      this.messages[this.pendingMessageIndex].content = reply;
      this.session.messages = this.messages.map((message) => ({ ...message }));
    } catch (error) {
      this.messages[this.pendingMessageIndex].content = `处理失败：${error.message || "发生未知错误。"}`;
    } finally {
      this.pendingMessageIndex = null;
      this.isBusy = false;
      this.renderMessages();
      this.renderComposer();
    }
  }
}

module.exports = { ReviewChatView, REVIEW_CHAT_VIEW_TYPE };
