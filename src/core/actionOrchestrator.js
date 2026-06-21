const { REVIEW_SCOPES } = require("./reviewScopes");
const { getActionTitle, isAllReviewAction, isPolishAction } = require("./reviewAgents");

function formatToolStatusLabel(toolName) {
  if (typeof toolName !== "string" || !toolName.trim()) {
    return "unknown";
  }

  return toolName
    .replace(/^get_/, "")
    .replace(/_/g, "-");
}

class ActionOrchestrator {
  constructor(plugin) {
    this.plugin = plugin;
  }

  async runAction(actionId, scope) {
    try {
      const context = this.plugin.getActionContext(scope);
      const { resultView, requestId } = await this.prepareResultView(actionId, scope, context);
      await this.executeAction(actionId, context, scope, resultView, requestId);
    } catch (error) {
      if (error && error.isContextError) {
        this.plugin.showNotice(this.plugin.formatError(error));
        return;
      }

      const resultView = await this.plugin.openResultView({
        title: getActionTitle(actionId, this.plugin.getReviewAgents()),
        scope,
        sourceFileName: "",
        onContinue: null,
        onApply: null,
        onLocate: null,
        onFollowUp: null,
      });
      const fallbackRequestId = resultView.activeRequestId ?? resultView.setLoading("处理失败");
      resultView.setError(fallbackRequestId, this.plugin.formatError(error));
    }
  }

  async prepareResultView(actionId, scope, context) {
    const resultView = await this.plugin.openResultView({
      title: getActionTitle(actionId, this.plugin.getReviewAgents()),
      scope,
      sourceFileName: context.file?.name || context.title,
      onContinue: null,
      onApply: null,
      onLocate:
        scope === REVIEW_SCOPES.SELECTION
          ? ({ context: locateContext } = {}) =>
              this.plugin.locateSelectionInEditor(locateContext || context)
          : null,
      onPopout: ({ requestId, title, sourceFileName }) =>
        this.plugin.openResultMarkdownPopout({
          requestId,
          title,
          sourceFileName,
          resultView,
        }),
      onFollowUp: ({ requestId, title, question }) =>
        this.plugin.openFollowUpChat({
          requestId,
          title,
          question,
          context,
          resultView,
        }),
      locateContext: scope === REVIEW_SCOPES.SELECTION ? context : null,
    });
    const requestId = resultView.setLoading(`正在处理${this.plugin.getScopeLabel(scope)}...`);
    return { resultView, requestId };
  }

  async executeAction(actionId, context, scope, resultView, requestId) {
    if (isAllReviewAction(actionId)) {
      await this.executeAllReviewAction(context, resultView, requestId);
      return;
    }

    if (isPolishAction(actionId)) {
      await this.executePolishAction(context, scope, resultView, requestId);
      return;
    }

    await this.executeSingleAgentAction(actionId, context, resultView, requestId);
  }

  buildStreamingOptions(resultView, requestId) {
    return {
      onChunk: (nextMarkdown) => resultView.updateStreamingMarkdown(requestId, nextMarkdown),
      onToolCall: (toolName) => {
        resultView.updateLoadingText(requestId, `正在调用 ${formatToolStatusLabel(toolName)} 工具`);
      },
    };
  }

  async executeAllReviewAction(context, resultView, requestId) {
    const markdown = await this.plugin.reviewService.runAllReviews(
      context,
      this.buildStreamingOptions(resultView, requestId),
    );
    resultView.options.onContinue = (streamOptions = {}) =>
      this.plugin.reviewService.runAllReviewContinuation(context, markdown, {
        onChunk: streamOptions.onChunk,
        onToolCall: streamOptions.onToolCall,
      });
    await resultView.setMarkdown(requestId, markdown);
  }

  async executePolishAction(context, scope, resultView, requestId) {
    const markdown = await this.plugin.reviewService.runPolish(
      context,
      this.buildStreamingOptions(resultView, requestId),
    );
    resultView.options.onApply =
      scope === REVIEW_SCOPES.SELECTION
        ? (rawMarkdown = resultView.rawMarkdown) => this.plugin.applyPolishedText(context, rawMarkdown)
        : null;
    await resultView.setMarkdown(requestId, markdown);
  }

  async executeSingleAgentAction(actionId, context, resultView, requestId) {
    const agent = this.plugin.getReviewAgent(actionId);
    if (!agent) {
      throw new Error("未找到对应的审阅 Agent。");
    }

    const markdown = await this.plugin.reviewService.runSingleReview(
      agent,
      context,
      this.buildStreamingOptions(resultView, requestId),
    );
    resultView.options.onContinue = (streamOptions = {}) =>
      this.plugin.reviewService.runReviewContinuation(agent, context, markdown, {
        onChunk: streamOptions.onChunk,
        onToolCall: streamOptions.onToolCall,
      });
    await resultView.setMarkdown(requestId, markdown);
  }
}

module.exports = { ActionOrchestrator, formatToolStatusLabel };
