function resolveRequestValue(requestId, value) {
  return typeof requestId === "number" ? value : requestId;
}

class RequestStateManager {
  constructor() {
    this.requestStates = new Map();
    this.requestSequence = 0;
    this.activeRequestId = null;
  }

  create() {
    const requestId = ++this.requestSequence;
    this.requestStates.set(requestId, {
      rawMarkdown: "",
      streamingRenderTimer: null,
      streamingRenderPromise: Promise.resolve(),
    });
    this.activeRequestId = requestId;
    return requestId;
  }

  get(requestId) {
    return this.requestStates.get(requestId) || null;
  }

  isActive(requestId) {
    return this.activeRequestId === requestId;
  }

  resolve(requestId) {
    if (typeof requestId === "number") {
      return requestId;
    }

    return this.activeRequestId;
  }

  clearStreamingTimer(requestId) {
    const state = this.get(requestId);
    if (!state?.streamingRenderTimer) {
      return;
    }

    window.clearTimeout(state.streamingRenderTimer);
    state.streamingRenderTimer = null;
  }

  delete(requestId) {
    const state = this.get(requestId);
    if (!state) {
      return false;
    }

    this.clearStreamingTimer(requestId);
    this.requestStates.delete(requestId);
    if (this.activeRequestId === requestId) {
      this.activeRequestId = null;
    }
    return true;
  }

  clearAll() {
    for (const requestId of this.requestStates.keys()) {
      this.clearStreamingTimer(requestId);
    }
    this.requestStates.clear();
    this.activeRequestId = null;
  }
}

class ReviewResultController {
  constructor(view) {
    this.view = view;
    this.requestStateManager = new RequestStateManager();
  }

  cleanup() {
    this.requestStateManager.clearAll();
  }

  removeRequestEntry(requestId) {
    this.requestStateManager.delete(requestId);
  }

  beginRequest(text) {
    const requestId = this.requestStateManager.create();
    this.view.createRequestEntry(requestId, text);
    return requestId;
  }

  setLoading(text) {
    return this.beginRequest(text);
  }

  updateLoadingText(requestId, text) {
    const resolvedRequestId = this.resolveRequest(requestId);
    const resolvedText = typeof requestId === "number" ? text : requestId;
    this.view.updateRequestLoadingText(resolvedRequestId, resolvedText);
  }

  isActiveRequest(requestId) {
    return this.requestStateManager.isActive(requestId);
  }

  getRequestState(requestId) {
    return this.requestStateManager.get(requestId);
  }

  getRequestMarkdown(requestId) {
    return this.getRequestState(requestId)?.rawMarkdown || "";
  }

  resolveRequest(requestId) {
    return this.requestStateManager.resolve(requestId);
  }

  getActiveRequestId() {
    return this.requestStateManager.activeRequestId;
  }

  getRawMarkdown() {
    const activeState = this.getRequestState(this.getActiveRequestId());
    return activeState?.rawMarkdown || "";
  }

  setRawMarkdown(markdown) {
    const activeState = this.getRequestState(this.getActiveRequestId());
    if (!activeState) {
      return;
    }

    activeState.rawMarkdown = markdown;
  }

  scheduleStreamingRender(requestId) {
    const state = this.getRequestState(requestId);
    if (!state || state.streamingRenderTimer) {
      return;
    }

    state.streamingRenderTimer = window.setTimeout(() => {
      const latestState = this.getRequestState(requestId);
      if (!latestState) {
        return;
      }

      latestState.streamingRenderTimer = null;
      const latestMarkdown = latestState.rawMarkdown;
      latestState.streamingRenderPromise = this.view.renderRequestMarkdown(requestId, latestMarkdown);
    }, 120);
  }

  updateStreamingMarkdown(requestId, markdown) {
    const resolvedRequestId = this.resolveRequest(requestId);
    const resolvedMarkdown = resolveRequestValue(requestId, markdown);
    const state = this.getRequestState(resolvedRequestId);
    if (!state) {
      return;
    }

    state.rawMarkdown = resolvedMarkdown;
    this.scheduleStreamingRender(resolvedRequestId);
  }

  async setMarkdown(requestId, markdown) {
    const resolvedRequestId = this.resolveRequest(requestId);
    const resolvedMarkdown = resolveRequestValue(requestId, markdown);
    const state = this.getRequestState(resolvedRequestId);
    if (!state) {
      return;
    }

    state.rawMarkdown = resolvedMarkdown;
    this.requestStateManager.clearStreamingTimer(resolvedRequestId);
    await state.streamingRenderPromise;
    await this.view.completeRequest(resolvedRequestId, resolvedMarkdown);
  }

  setError(requestId, message) {
    const resolvedRequestId = this.resolveRequest(requestId);
    const resolvedMessage = resolveRequestValue(requestId, message);
    const state = this.getRequestState(resolvedRequestId);
    if (!state) {
      return;
    }

    state.rawMarkdown = `## 处理失败\n\n${resolvedMessage}`;
    this.requestStateManager.clearStreamingTimer(resolvedRequestId);
    this.view.failRequest(resolvedRequestId, resolvedMessage);
  }

  async handleContinue() {
    if (this.view.isBusy || typeof this.view.options.onContinue !== "function") {
      return;
    }

    this.view.setBusy(true);
    const requestId = this.beginRequest("思考中");

    try {
      const nextMarkdown = await this.view.options.onContinue({
        onChunk: (nextPart) => this.updateStreamingMarkdown(requestId, nextPart),
      });
      this.view.options.onContinue = null;
      await this.setMarkdown(requestId, nextMarkdown);
    } catch (error) {
      this.setError(requestId, error.message || "继续处理时发生未知错误。");
    } finally {
      this.view.setBusy(false);
    }
  }

  handleApply() {
    if (this.view.isBusy || typeof this.view.options.onApply !== "function") {
      return;
    }

    this.view.options.onApply(this.getRawMarkdown());
  }
}

module.exports = { ReviewResultController };
