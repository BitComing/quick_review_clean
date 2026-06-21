const { resolveAgentTools } = require("../core/agentTools");
const { POLISH_AGENT } = require("../core/reviewAgents");
const { callModel } = require("../llm/modelClient");
const {
  buildAllReviewContinuationPrompt,
  buildFollowUpChatPrompt,
  buildPolishPrompt,
  buildReviewContinuationPrompt,
  buildReviewPrompt,
} = require("../core/prompts");

class ReviewService {
  constructor(plugin) {
    this.plugin = plugin;
  }

  getReviewAgents() {
    return this.plugin.getReviewAgents();
  }

  getReviewAgent(actionId) {
    return this.plugin.getReviewAgent(actionId);
  }

  getScopeLabel(scope) {
    return this.plugin.getScopeLabel(scope);
  }

  buildReviewPrompt(agent, context) {
    return buildReviewPrompt(this.plugin.settings, this.getScopeLabel.bind(this), agent, context);
  }

  buildReviewContinuationPrompt(agent, context, initialReview) {
    return buildReviewContinuationPrompt(this.plugin.settings, agent, context, initialReview);
  }

  buildPolishPrompt(context) {
    return buildPolishPrompt(this.plugin.settings, this.getScopeLabel.bind(this), context);
  }

  buildAllReviewContinuationPrompt(context, initialReview) {
    return buildAllReviewContinuationPrompt(this.plugin.settings, context, initialReview);
  }

  buildFollowUpChatPrompt(session, messages) {
    return buildFollowUpChatPrompt(this.plugin.settings, session, messages);
  }

  getToolHandlers() {
    return this.plugin.toolHandlers || {};
  }

  async callModel({ systemPrompt, userPrompt, tools, toolHandlers, onChunk, onToolCall }) {
    return await callModel(this.plugin.settings, {
      systemPrompt,
      userPrompt,
      tools,
      toolHandlers: toolHandlers || this.getToolHandlers(),
      onChunk,
      onToolCall,
    });
  }

  async runSingleReview(agent, context, options = {}) {
    return await this.callModel({
      systemPrompt: agent.systemRole,
      userPrompt: this.buildReviewPrompt(agent, context),
      tools: resolveAgentTools(agent, this.plugin.settings.providerType),
      toolHandlers: options.toolHandlers,
      onChunk: options.onChunk,
      onToolCall: options.onToolCall,
    });
  }

  async runReviewContinuation(agent, context, initialReview, options = {}) {
    return await this.callModel({
      systemPrompt: agent.systemRole,
      userPrompt: this.buildReviewContinuationPrompt(agent, context, initialReview),
      tools: resolveAgentTools(agent, this.plugin.settings.providerType),
      toolHandlers: options.toolHandlers,
      onChunk: options.onChunk,
      onToolCall: options.onToolCall,
    });
  }

  async runPolish(context, options = {}) {
    return await this.callModel({
      systemPrompt: POLISH_AGENT.systemRole,
      userPrompt: this.buildPolishPrompt(context),
      tools: POLISH_AGENT.tools,
      toolHandlers: options.toolHandlers,
      onChunk: options.onChunk,
      onToolCall: options.onToolCall,
    });
  }

  async runAllReviews(context, options = {}) {
    const sections = [];
    const renderCombinedMarkdown = (streamingSection = "") => {
      const allSections = streamingSection ? [...sections, streamingSection] : sections;
      if (allSections.length === 0) {
        return;
      }

      options.onChunk?.(`# 综合审阅结果\n\n${allSections.join("\n\n---\n\n")}`);
    };

    for (const agent of this.getReviewAgents()) {
      const content = await this.runSingleReview(agent, context, {
        ...options,
        onChunk: (fullText) => {
          renderCombinedMarkdown(`## ${agent.label}\n\n${fullText}`);
        },
      });
      sections.push(`## ${agent.label}\n\n${content}`);
      renderCombinedMarkdown();
    }

    return `# 综合审阅结果\n\n${sections.join("\n\n---\n\n")}`;
  }

  async runAllReviewContinuation(context, initialReview, options = {}) {
    return await this.callModel({
      systemPrompt:
        "你是一名总编辑，负责把多维度审阅意见整合为一份优先级清晰、可直接执行的修改方案。",
      userPrompt: this.buildAllReviewContinuationPrompt(context, initialReview),
      toolHandlers: options.toolHandlers,
      onChunk: options.onChunk,
      onToolCall: options.onToolCall,
    });
  }

  async runFollowUpChat(session, messages, options = {}) {
    return await this.callModel({
      systemPrompt:
        "你是一名中文写作教练兼审阅助手，需要围绕既有审阅结果继续回答用户的追问，并提供具体可执行的帮助。",
      userPrompt: this.buildFollowUpChatPrompt(session, messages),
      toolHandlers: options.toolHandlers,
      onChunk: options.onChunk,
      onToolCall: options.onToolCall,
    });
  }
}

module.exports = { ReviewService };
