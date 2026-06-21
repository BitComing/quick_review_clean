var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/core/reviewAgents.js
var require_reviewAgents = __commonJS({
  "src/core/reviewAgents.js"(exports2, module2) {
    var DEFAULT_REVIEW_AGENTS = [
      {
        id: "fact-check",
        label: "\u4E8B\u5B9E",
        title: "\u4E8B\u5B9E",
        tools: ["current-date"],
        systemRole: "\u4F60\u662F\u4E00\u540D\u4E25\u8C28\u7684\u4E8B\u5B9E\u6838\u9A8C\u7F16\u8F91\uFF0C\u64C5\u957F\u68C0\u67E5\u4E8B\u5B9E\u9519\u8BEF\u3001\u65F6\u95F4\u7EBF\u77DB\u76FE\u3001\u6982\u5FF5\u6DF7\u6DC6\u3001\u6570\u636E\u4E0D\u4E00\u81F4\u4E0E\u63A8\u7406\u5931\u771F\u3002",
        focus: "\u4F18\u5148\u6307\u51FA\u4E8B\u5B9E\u9519\u8BEF\u3001\u6982\u5FF5\u8BEF\u7528\u3001\u524D\u540E\u77DB\u76FE\u4E0E\u9700\u8981\u6838\u5B9E\u4F46\u8BC1\u636E\u4E0D\u8DB3\u7684\u8868\u8FF0\u3002"
      },
      {
        id: "writing",
        label: "\u8868\u8FF0",
        title: "\u8868\u8FF0",
        tools: [],
        systemRole: "\u4F60\u662F\u4E00\u540D\u8D44\u6DF1\u4E2D\u6587\u5199\u4F5C\u7F16\u8F91\uFF0C\u64C5\u957F\u63D0\u5347\u8868\u8FBE\u6E05\u6670\u5EA6\u3001\u903B\u8F91\u8854\u63A5\u3001\u4FE1\u606F\u5BC6\u5EA6\u4E0E\u53EF\u8BFB\u6027\u3002",
        focus: "\u4F18\u5148\u6307\u51FA\u53E5\u5B50\u6666\u6DA9\u3001\u903B\u8F91\u65AD\u5C42\u3001\u8868\u8FF0\u6A21\u7CCA\u3001\u7ED3\u6784\u62D6\u6C93\u548C\u4FE1\u606F\u7EC4\u7EC7\u4E0D\u987A\u7684\u95EE\u9898\u3002"
      },
      {
        id: "expand",
        label: "\u884D\u751F",
        title: "\u884D\u751F",
        tools: [],
        systemRole: "\u4F60\u662F\u4E00\u540D\u5185\u5BB9\u7B56\u5212\u7F16\u8F91\uFF0C\u64C5\u957F\u53D1\u73B0\u6587\u672C\u53EF\u6269\u5C55\u7684\u65B9\u5411\u3001\u9057\u6F0F\u7684\u76F8\u5173\u8BAE\u9898\u4E0E\u53EF\u8865\u5145\u7684\u80CC\u666F\u77E5\u8BC6\u3002",
        focus: "\u4F18\u5148\u6307\u51FA\u53EF\u8865\u5145\u7684\u5173\u952E\u80CC\u666F\u3001\u9057\u6F0F\u7684\u5EF6\u4F38\u8BAE\u9898\u3001\u8BFB\u8005\u53EF\u80FD\u7EE7\u7EED\u8FFD\u95EE\u7684\u95EE\u9898\u548C\u53EF\u62D3\u5C55\u7684\u6848\u4F8B\u3002"
      },
      {
        id: "theory",
        label: "\u5173\u8054",
        title: "\u5173\u8054",
        tools: [],
        systemRole: "\u4F60\u662F\u4E00\u540D\u7406\u8BBA\u7814\u7A76\u52A9\u7406\uFF0C\u64C5\u957F\u628A\u6587\u672C\u5185\u5BB9\u4E0E\u4E3B\u6D41\u7406\u8BBA\u3001\u6743\u5A01\u89C2\u70B9\u3001\u7ECF\u5178\u6846\u67B6\u548C\u5B66\u4E60\u8DEF\u5F84\u5173\u8054\u8D77\u6765\u3002",
        focus: "\u4F18\u5148\u6307\u51FA\u9002\u5408\u8865\u5165\u7684\u7406\u8BBA\u6846\u67B6\u3001\u6743\u5A01\u89C6\u89D2\u3001\u7ECF\u5178\u6982\u5FF5\u3001\u53C2\u8003\u8DEF\u5F84\u548C\u53EF\u80FD\u5B58\u5728\u7684\u7406\u8BBA\u8868\u8FF0\u4E0D\u4E25\u8C28\u4E4B\u5904\u3002"
      },
      {
        id: "refactor",
        label: "\u91CD\u6784",
        title: "\u91CD\u6784",
        tools: [],
        systemRole: "\u4F60\u662F\u4E00\u540D\u64C5\u957F\u5185\u5BB9\u91CD\u6784\u7684\u4E2D\u6587\u7F16\u8F91\uFF0C\u80FD\u591F\u63D0\u70BC\u6240\u9009\u6587\u672C\u7684\u6838\u5FC3\u4FE1\u606F\uFF0C\u91CD\u65B0\u7EC4\u7EC7\u7ED3\u6784\uFF0C\u5E76\u5728\u4E0D\u504F\u79BB\u539F\u610F\u7684\u524D\u63D0\u4E0B\u66F4\u6E05\u695A\u5730\u8868\u8FBE\u4F5C\u8005\u771F\u6B63\u60F3\u8BF4\u7684\u5185\u5BB9\u3002",
        focus: "\u4F18\u5148\u63D0\u70BC\u6838\u5FC3\u89C2\u70B9\u3001\u5408\u5E76\u91CD\u590D\u4FE1\u606F\u3001\u91CD\u6392\u8868\u8FBE\u987A\u5E8F\u3001\u4FEE\u590D\u7ED3\u6784\u677E\u6563\u4E0E\u4E3B\u6B21\u4E0D\u6E05\u7684\u95EE\u9898\uFF0C\u8BA9\u5185\u5BB9\u66F4\u51DD\u7EC3\u3001\u66F4\u6709\u6761\u7406\u4E14\u66F4\u8D34\u8FD1\u539F\u610F\u3002"
      }
    ];
    var POLISH_AGENT = {
      id: "polish",
      label: "\u6DA6\u8272",
      title: "\u6DA6\u8272",
      tools: [],
      systemRole: "\u4F60\u662F\u4E00\u540D\u514B\u5236\u4E14\u9AD8\u6C34\u5E73\u7684\u4E2D\u6587\u6DA6\u8272\u7F16\u8F91\uFF0C\u5728\u4E0D\u6539\u53D8\u539F\u610F\u7684\u524D\u63D0\u4E0B\u63D0\u5347\u8868\u8FBE\u6E05\u6670\u5EA6\u3001\u81EA\u7136\u5EA6\u3001\u8282\u594F\u4E0E\u4E13\u4E1A\u611F\u3002"
    };
    var ALL_REVIEW_ACTION = {
      id: "all-review",
      label: "\u7EFC\u5408",
      title: "\u7EFC\u5408"
    };
    function getActionTitle(actionId, reviewAgents = DEFAULT_REVIEW_AGENTS) {
      if (actionId === ALL_REVIEW_ACTION.id) {
        return ALL_REVIEW_ACTION.title;
      }
      if (actionId === POLISH_AGENT.id) {
        return POLISH_AGENT.title;
      }
      return reviewAgents.find((agent) => agent.id === actionId)?.title || "\u5BA1\u9605";
    }
    function isAllReviewAction(actionId) {
      return actionId === ALL_REVIEW_ACTION.id;
    }
    function isPolishAction(actionId) {
      return actionId === POLISH_AGENT.id;
    }
    module2.exports = {
      ALL_REVIEW_ACTION,
      DEFAULT_REVIEW_AGENTS,
      POLISH_AGENT,
      getActionTitle,
      isAllReviewAction,
      isPolishAction
    };
  }
});

// src/core/reviewScopes.js
var require_reviewScopes = __commonJS({
  "src/core/reviewScopes.js"(exports2, module2) {
    var REVIEW_SCOPES2 = {
      SELECTION: "selection",
      DOCUMENT: "document"
    };
    module2.exports = {
      REVIEW_SCOPES: REVIEW_SCOPES2
    };
  }
});

// src/core/actionDefinitions.js
var require_actionDefinitions = __commonJS({
  "src/core/actionDefinitions.js"(exports2, module2) {
    var {
      ALL_REVIEW_ACTION,
      DEFAULT_REVIEW_AGENTS,
      POLISH_AGENT
    } = require_reviewAgents();
    var { REVIEW_SCOPES: REVIEW_SCOPES2 } = require_reviewScopes();
    function getSelectionActions2(reviewAgents = DEFAULT_REVIEW_AGENTS) {
      return [ALL_REVIEW_ACTION, ...reviewAgents, POLISH_AGENT];
    }
    function getDocumentActions2(reviewAgents = DEFAULT_REVIEW_AGENTS) {
      return [ALL_REVIEW_ACTION, ...reviewAgents];
    }
    function buildCommandDefinitions2(reviewAgents = DEFAULT_REVIEW_AGENTS) {
      const commands = [];
      for (const agent of reviewAgents) {
        commands.push(
          {
            id: `${agent.id}-${REVIEW_SCOPES2.SELECTION}`,
            name: `${agent.label}\uFF1A\u5BA1\u9605\u9009\u4E2D\u6587\u672C`,
            actionId: agent.id,
            scope: REVIEW_SCOPES2.SELECTION
          },
          {
            id: `${agent.id}-${REVIEW_SCOPES2.DOCUMENT}`,
            name: `${agent.label}\uFF1A\u5BA1\u9605\u6574\u7BC7\u7B14\u8BB0`,
            actionId: agent.id,
            scope: REVIEW_SCOPES2.DOCUMENT
          }
        );
      }
      commands.push(
        {
          id: `${ALL_REVIEW_ACTION.id}-${REVIEW_SCOPES2.SELECTION}`,
          name: "\u7EFC\u5408\u5BA1\u9605\uFF1A\u5BA1\u9605\u9009\u4E2D\u6587\u672C",
          actionId: ALL_REVIEW_ACTION.id,
          scope: REVIEW_SCOPES2.SELECTION
        },
        {
          id: `${ALL_REVIEW_ACTION.id}-${REVIEW_SCOPES2.DOCUMENT}`,
          name: "\u7EFC\u5408\u5BA1\u9605\uFF1A\u5BA1\u9605\u6574\u7BC7\u7B14\u8BB0",
          actionId: ALL_REVIEW_ACTION.id,
          scope: REVIEW_SCOPES2.DOCUMENT
        },
        {
          id: `${POLISH_AGENT.id}-${REVIEW_SCOPES2.SELECTION}`,
          name: "\u4E00\u952E\u6DA6\u8272\uFF1A\u6DA6\u8272\u9009\u4E2D\u6587\u672C",
          actionId: POLISH_AGENT.id,
          scope: REVIEW_SCOPES2.SELECTION
        }
      );
      return commands;
    }
    module2.exports = {
      buildCommandDefinitions: buildCommandDefinitions2,
      getDocumentActions: getDocumentActions2,
      getSelectionActions: getSelectionActions2
    };
  }
});

// src/core/actionOrchestrator.js
var require_actionOrchestrator = __commonJS({
  "src/core/actionOrchestrator.js"(exports2, module2) {
    var { REVIEW_SCOPES: REVIEW_SCOPES2 } = require_reviewScopes();
    var { getActionTitle, isAllReviewAction, isPolishAction } = require_reviewAgents();
    function formatToolStatusLabel(toolName) {
      if (typeof toolName !== "string" || !toolName.trim()) {
        return "unknown";
      }
      return toolName.replace(/^get_/, "").replace(/_/g, "-");
    }
    var ActionOrchestrator2 = class {
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
            onFollowUp: null
          });
          const fallbackRequestId = resultView.activeRequestId ?? resultView.setLoading("\u5904\u7406\u5931\u8D25");
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
          onLocate: scope === REVIEW_SCOPES2.SELECTION ? ({ context: locateContext } = {}) => this.plugin.locateSelectionInEditor(locateContext || context) : null,
          onPopout: ({ requestId: requestId2, title, sourceFileName }) => this.plugin.openResultMarkdownPopout({
            requestId: requestId2,
            title,
            sourceFileName,
            resultView
          }),
          onFollowUp: ({ requestId: requestId2, title, question }) => this.plugin.openFollowUpChat({
            requestId: requestId2,
            title,
            question,
            context,
            resultView
          }),
          locateContext: scope === REVIEW_SCOPES2.SELECTION ? context : null
        });
        const requestId = resultView.setLoading(`\u6B63\u5728\u5904\u7406${this.plugin.getScopeLabel(scope)}...`);
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
            resultView.updateLoadingText(requestId, `\u6B63\u5728\u8C03\u7528 ${formatToolStatusLabel(toolName)} \u5DE5\u5177`);
          }
        };
      }
      async executeAllReviewAction(context, resultView, requestId) {
        const markdown = await this.plugin.reviewService.runAllReviews(
          context,
          this.buildStreamingOptions(resultView, requestId)
        );
        resultView.options.onContinue = (streamOptions = {}) => this.plugin.reviewService.runAllReviewContinuation(context, markdown, {
          onChunk: streamOptions.onChunk,
          onToolCall: streamOptions.onToolCall
        });
        await resultView.setMarkdown(requestId, markdown);
      }
      async executePolishAction(context, scope, resultView, requestId) {
        const markdown = await this.plugin.reviewService.runPolish(
          context,
          this.buildStreamingOptions(resultView, requestId)
        );
        resultView.options.onApply = scope === REVIEW_SCOPES2.SELECTION ? (rawMarkdown = resultView.rawMarkdown) => this.plugin.applyPolishedText(context, rawMarkdown) : null;
        await resultView.setMarkdown(requestId, markdown);
      }
      async executeSingleAgentAction(actionId, context, resultView, requestId) {
        const agent = this.plugin.getReviewAgent(actionId);
        if (!agent) {
          throw new Error("\u672A\u627E\u5230\u5BF9\u5E94\u7684\u5BA1\u9605 Agent\u3002");
        }
        const markdown = await this.plugin.reviewService.runSingleReview(
          agent,
          context,
          this.buildStreamingOptions(resultView, requestId)
        );
        resultView.options.onContinue = (streamOptions = {}) => this.plugin.reviewService.runReviewContinuation(agent, context, markdown, {
          onChunk: streamOptions.onChunk,
          onToolCall: streamOptions.onToolCall
        });
        await resultView.setMarkdown(requestId, markdown);
      }
    };
    module2.exports = { ActionOrchestrator: ActionOrchestrator2, formatToolStatusLabel };
  }
});

// src/services/editorContextService.js
var require_editorContextService = __commonJS({
  "src/services/editorContextService.js"(exports2, module2) {
    var { MarkdownView: MarkdownView2 } = require("obsidian");
    var { REVIEW_SCOPES: REVIEW_SCOPES2 } = require_reviewScopes();
    function extractPolishedText(markdown) {
      const match = markdown.match(
        /<!--POLISHED_TEXT_START-->\s*([\s\S]*?)\s*<!--POLISHED_TEXT_END-->/
      );
      return match ? match[1].trim() : "";
    }
    var EditorContextService2 = class {
      constructor(plugin) {
        this.plugin = plugin;
      }
      getActionContext(scope) {
        const view = this.plugin.getActiveMarkdownView();
        const editor = view && view.editor;
        if (!view || !editor) {
          throw this.plugin.createContextError("\u8BF7\u5148\u6253\u5F00\u4E00\u7BC7\u53EF\u7F16\u8F91\u7684 Markdown \u7B14\u8BB0\u3002");
        }
        const text = scope === REVIEW_SCOPES2.SELECTION ? editor.getSelection() : editor.getValue();
        if (!text || !text.trim()) {
          throw this.plugin.createContextError(
            scope === REVIEW_SCOPES2.SELECTION ? "\u8BF7\u5148\u9009\u4E2D\u9700\u8981\u5904\u7406\u7684\u6587\u672C\u3002" : "\u5F53\u524D\u7B14\u8BB0\u6CA1\u6709\u53EF\u5904\u7406\u7684\u5185\u5BB9\u3002"
          );
        }
        return {
          view,
          editor,
          file: view.file,
          title: view.file ? view.file.basename : "\u672A\u547D\u540D\u7B14\u8BB0",
          scope,
          text: text.trim(),
          selectionRange: scope === REVIEW_SCOPES2.SELECTION ? {
            from: editor.getCursor("from"),
            to: editor.getCursor("to")
          } : null
        };
      }
      getPreferredEditorLeaf(context) {
        const preferredLeaf = context?.view?.leaf;
        if (preferredLeaf?.view instanceof MarkdownView2) {
          return preferredLeaf;
        }
        const leaves = this.plugin.app.workspace.getLeavesOfType("markdown");
        if (context?.file?.path) {
          const matchedLeaf = leaves.find((leaf) => leaf?.view?.file?.path === context.file.path);
          if (matchedLeaf) {
            return matchedLeaf;
          }
        }
        return leaves[0] || null;
      }
      async restoreContextEditor(context) {
        if (!context?.file || !context?.selectionRange) {
          throw new Error("\u5F53\u524D\u7ED3\u679C\u65E0\u6CD5\u5B9A\u4F4D\u5230\u539F\u6587\u3002");
        }
        const leaf = this.getPreferredEditorLeaf(context);
        if (!leaf || typeof leaf.openFile !== "function") {
          throw new Error("\u672A\u627E\u5230\u53EF\u7528\u4E8E\u6253\u5F00\u539F\u6587\u7684\u7F16\u8F91\u89C6\u56FE\u3002");
        }
        await leaf.openFile(context.file);
        const view = leaf.view;
        const editor = view?.editor;
        if (!(view instanceof MarkdownView2) || !editor) {
          throw new Error("\u539F\u6587\u6240\u5728\u7F16\u8F91\u89C6\u56FE\u4E0D\u53EF\u7528\u3002");
        }
        this.plugin.app.workspace.setActiveLeaf(leaf, { focus: true });
        return { leaf, view, editor };
      }
      async applyPolishedText(context, rawMarkdown) {
        const polishedText = extractPolishedText(rawMarkdown);
        if (!polishedText) {
          this.plugin.showNotice("\u672A\u627E\u5230\u53EF\u5E94\u7528\u7684\u6DA6\u8272\u7ED3\u679C\u3002");
          return;
        }
        if (!context.selectionRange) {
          this.plugin.showNotice("\u5F53\u524D\u7ED3\u679C\u53EA\u80FD\u5E94\u7528\u5230\u9009\u4E2D\u6587\u672C\u3002");
          return;
        }
        try {
          const { editor, view } = await this.restoreContextEditor(context);
          editor.setSelection(context.selectionRange.from, context.selectionRange.to);
          editor.replaceSelection(polishedText);
          this.plugin.restoreEditorFocus(view);
          this.plugin.showNotice("\u5DF2\u5C06\u6DA6\u8272\u7ED3\u679C\u5E94\u7528\u5230\u539F\u6587\u3002");
        } catch (error) {
          this.plugin.showNotice(this.plugin.formatError(error));
        }
      }
      async locateSelectionInEditor(context) {
        try {
          const { editor, view } = await this.restoreContextEditor(context);
          editor.setSelection(context.selectionRange.from, context.selectionRange.to);
          this.plugin.restoreEditorFocus(view);
        } catch (error) {
          this.plugin.showNotice(this.plugin.formatError(error));
        }
      }
    };
    module2.exports = { EditorContextService: EditorContextService2, extractPolishedText };
  }
});

// src/llm/tools/dateTool.js
var require_dateTool = __commonJS({
  "src/llm/tools/dateTool.js"(exports2, module2) {
    var GET_CURRENT_DATE_TOOL_NAME2 = "get_current_date";
    function pad(value) {
      return String(value).padStart(2, "0");
    }
    function toDateParts(date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        weekday: date.toLocaleDateString("zh-CN", { weekday: "long" })
      };
    }
    function formatOffset(date) {
      const minutes = -date.getTimezoneOffset();
      const sign = minutes >= 0 ? "+" : "-";
      const absoluteMinutes = Math.abs(minutes);
      const hours = Math.floor(absoluteMinutes / 60);
      const remainder = absoluteMinutes % 60;
      return `${sign}${pad(hours)}:${pad(remainder)}`;
    }
    function buildDateResult(now = /* @__PURE__ */ new Date()) {
      const parts = toDateParts(now);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
      return {
        isoDate: `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`,
        year: parts.year,
        month: parts.month,
        day: parts.day,
        weekday: parts.weekday,
        timezone,
        utcOffset: formatOffset(now),
        localeDate: `${parts.year}\u5E74${parts.month}\u6708${parts.day}\u65E5`
      };
    }
    function buildGetCurrentDateTool(providerType = "openai") {
      if (providerType === "anthropic") {
        return {
          name: GET_CURRENT_DATE_TOOL_NAME2,
          description: "\u83B7\u53D6\u5F53\u524D\u672C\u5730\u65E5\u671F\u3001\u661F\u671F\u3001\u65F6\u533A\u4E0E UTC \u504F\u79FB\u3002\u9002\u5408\u6838\u5BF9\u201C\u4ECA\u5929/\u6628\u5929/\u660E\u5929/\u672C\u5468\u201D\u7B49\u76F8\u5BF9\u65E5\u671F\u8868\u8FF0\u3002",
          input_schema: {
            type: "object",
            properties: {},
            additionalProperties: false
          }
        };
      }
      return {
        type: "function",
        function: {
          name: GET_CURRENT_DATE_TOOL_NAME2,
          description: "\u83B7\u53D6\u5F53\u524D\u672C\u5730\u65E5\u671F\u3001\u661F\u671F\u3001\u65F6\u533A\u4E0E UTC \u504F\u79FB\u3002\u9002\u5408\u6838\u5BF9\u201C\u4ECA\u5929/\u6628\u5929/\u660E\u5929/\u672C\u5468\u201D\u7B49\u76F8\u5BF9\u65E5\u671F\u8868\u8FF0\u3002",
          parameters: {
            type: "object",
            properties: {},
            additionalProperties: false
          }
        }
      };
    }
    async function handleGetCurrentDate2() {
      return buildDateResult();
    }
    module2.exports = {
      GET_CURRENT_DATE_TOOL_NAME: GET_CURRENT_DATE_TOOL_NAME2,
      buildDateResult,
      buildGetCurrentDateTool,
      handleGetCurrentDate: handleGetCurrentDate2
    };
  }
});

// src/llm/tools/webSearchTool.js
var require_webSearchTool = __commonJS({
  "src/llm/tools/webSearchTool.js"(exports2, module2) {
    var WEB_SEARCH_TOOL_NAME2 = "web_search";
    var DEFAULT_TAVILY_API_URL = "https://api.tavily.com/search";
    var DEFAULT_TAVILY_MAX_RESULTS = 5;
    function getRequestUrl() {
      const { requestUrl } = require("obsidian");
      return requestUrl;
    }
    function resolveRequestUrl(context) {
      if (typeof context?.requestUrl === "function") {
        return context.requestUrl;
      }
      return getRequestUrl();
    }
    function buildWebSearchParameters() {
      return {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "\u8981\u641C\u7D22\u7684\u95EE\u9898\u6216\u5173\u952E\u8BCD\u3002"
          }
        },
        required: ["query"],
        additionalProperties: false
      };
    }
    function buildWebSearchTool(providerType = "openai") {
      const description = "\u8054\u7F51\u641C\u7D22\u6700\u65B0\u516C\u5F00\u4FE1\u606F\uFF0C\u5E76\u8FD4\u56DE\u7B80\u660E\u6458\u8981\u4E0E\u6765\u6E90\u5217\u8868\u3002\u9002\u5408\u9700\u8981\u6838\u5B9E\u6700\u65B0\u4E8B\u4EF6\u3001\u6570\u636E\u3001\u89C4\u5219\u548C\u65F6\u95F4\u654F\u611F\u4FE1\u606F\u7684\u573A\u666F\u3002";
      if (providerType === "anthropic") {
        return {
          name: WEB_SEARCH_TOOL_NAME2,
          description,
          input_schema: buildWebSearchParameters()
        };
      }
      return {
        type: "function",
        function: {
          name: WEB_SEARCH_TOOL_NAME2,
          description,
          parameters: buildWebSearchParameters()
        }
      };
    }
    async function handleWebSearch2({ query } = {}) {
      const normalizedQuery = typeof query === "string" ? query.trim() : "";
      if (!normalizedQuery) {
        throw new Error("web_search \u5DE5\u5177\u9700\u8981\u63D0\u4F9B query \u53C2\u6570\u3002");
      }
      const settings = this?.settings || {};
      const apiUrl = (settings.searchApiBaseUrl || DEFAULT_TAVILY_API_URL).trim();
      const apiKey = (settings.searchApiKey || "").trim();
      const maxResults = Number.isFinite(Number(settings.searchMaxResults)) ? Math.max(1, Math.min(10, Number(settings.searchMaxResults))) : DEFAULT_TAVILY_MAX_RESULTS;
      const headers = {
        "Content-Type": "application/json"
      };
      if (apiKey) {
        headers.Authorization = `Bearer ${apiKey}`;
      } else {
        headers["X-Tavily-Access-Mode"] = "keyless";
      }
      const response = await resolveRequestUrl(this)({
        url: apiUrl,
        method: "POST",
        headers,
        body: JSON.stringify({
          query: normalizedQuery,
          topic: "general",
          search_depth: "basic",
          include_answer: true,
          include_raw_content: false,
          max_results: maxResults
        })
      });
      const payload = response?.json || {};
      const results = Array.isArray(payload.results) ? payload.results.map((item) => ({
        title: typeof item?.title === "string" ? item.title : "",
        url: typeof item?.url === "string" ? item.url : "",
        snippet: typeof item?.content === "string" ? item.content : "",
        score: typeof item?.score === "number" ? item.score : null
      })) : [];
      return {
        query: normalizedQuery,
        summary: typeof payload.answer === "string" && payload.answer.trim() || (results.length ? `\u5DF2\u68C0\u7D22\u5230 ${results.length} \u6761\u76F8\u5173\u7ED3\u679C\uFF0C\u8BF7\u7ED3\u5408\u6765\u6E90\u7EE7\u7EED\u6838\u5B9E\u3002` : "\u672A\u68C0\u7D22\u5230\u660E\u786E\u7ED3\u679C\u3002"),
        results
      };
    }
    module2.exports = {
      DEFAULT_TAVILY_API_URL,
      DEFAULT_TAVILY_MAX_RESULTS,
      WEB_SEARCH_TOOL_NAME: WEB_SEARCH_TOOL_NAME2,
      buildWebSearchTool,
      handleWebSearch: handleWebSearch2
    };
  }
});

// src/core/agentTools.js
var require_agentTools = __commonJS({
  "src/core/agentTools.js"(exports2, module2) {
    var { buildGetCurrentDateTool } = require_dateTool();
    var { buildWebSearchTool } = require_webSearchTool();
    function resolveAgentTools(agent, providerType = "openai") {
      if (!agent || !Array.isArray(agent.tools)) {
        return [];
      }
      return agent.tools.map((tool) => {
        if (tool && typeof tool === "object") {
          return tool;
        }
        if (typeof tool !== "string") {
          return null;
        }
        if (tool === "current-date") {
          return buildGetCurrentDateTool(providerType);
        }
        if (tool === "web-search") {
          return buildWebSearchTool(providerType);
        }
        return null;
      }).filter(Boolean);
    }
    module2.exports = {
      resolveAgentTools
    };
  }
});

// src/llm/modelProviders/anthropicProvider.js
var require_anthropicProvider = __commonJS({
  "src/llm/modelProviders/anthropicProvider.js"(exports2, module2) {
    function buildAnthropicMessages(userPrompt, messages) {
      if (Array.isArray(messages) && messages.length > 0) {
        return messages;
      }
      return [{ role: "user", content: userPrompt }];
    }
    function buildAnthropicRequest(settings, systemPrompt, messages, tools) {
      const body = {
        model: settings.model,
        system: systemPrompt,
        messages,
        max_tokens: settings.maxTokens,
        temperature: settings.temperature
      };
      if (Array.isArray(tools) && tools.length > 0) {
        body.tools = tools;
      }
      return body;
    }
    function extractAnthropicToolUses(json) {
      return Array.isArray(json.content) ? json.content.filter((part) => part && part.type === "tool_use") : [];
    }
    function extractAnthropicAssistantMessage(json) {
      if (!Array.isArray(json.content) || json.content.length === 0) {
        return null;
      }
      return {
        role: "assistant",
        content: json.content
      };
    }
    function extractAnthropicText(json) {
      return Array.isArray(json.content) ? json.content.map((part) => part && typeof part.text === "string" ? part.text : "").filter(Boolean).join("\n") : "";
    }
    function extractAnthropicStreamDelta(payload) {
      if (payload?.type === "content_block_delta") {
        return payload.delta?.text || "";
      }
      return "";
    }
    module2.exports = {
      buildAnthropicMessages,
      buildAnthropicRequest,
      extractAnthropicAssistantMessage,
      extractAnthropicStreamDelta,
      extractAnthropicText,
      extractAnthropicToolUses
    };
  }
});

// src/llm/modelProviders/openaiProvider.js
var require_openaiProvider = __commonJS({
  "src/llm/modelProviders/openaiProvider.js"(exports2, module2) {
    function coerceMessageContent(content) {
      if (typeof content === "string") {
        return content;
      }
      if (Array.isArray(content)) {
        return content.map((item) => {
          if (typeof item === "string") {
            return item;
          }
          if (item && typeof item.text === "string") {
            return item.text;
          }
          if (item && typeof item.content === "string") {
            return item.content;
          }
          return "";
        }).filter(Boolean).join("\n");
      }
      return "";
    }
    function buildOpenAIRequest(settings, messages, tools) {
      const body = {
        model: settings.model,
        messages,
        max_tokens: settings.maxTokens,
        temperature: settings.temperature
      };
      if (Array.isArray(tools) && tools.length > 0) {
        body.tools = tools;
      }
      return body;
    }
    function extractOpenAIToolCalls(json) {
      const choice = Array.isArray(json.choices) ? json.choices[0] : null;
      return Array.isArray(choice?.message?.tool_calls) ? choice.message.tool_calls : [];
    }
    function extractOpenAIAssistantMessage(json) {
      const choice = Array.isArray(json.choices) ? json.choices[0] : null;
      return choice?.message || null;
    }
    function extractOpenAIText(json) {
      const choice = Array.isArray(json.choices) ? json.choices[0] : null;
      return coerceMessageContent(choice?.message?.content || choice?.text || "");
    }
    function extractOpenAIStreamDelta(payload) {
      const choice = Array.isArray(payload?.choices) ? payload.choices[0] : null;
      return coerceMessageContent(choice?.delta?.content || choice?.text || "");
    }
    module2.exports = {
      buildOpenAIRequest,
      coerceMessageContent,
      extractOpenAIAssistantMessage,
      extractOpenAIStreamDelta,
      extractOpenAIText,
      extractOpenAIToolCalls
    };
  }
});

// src/llm/requestBuilder.js
var require_requestBuilder = __commonJS({
  "src/llm/requestBuilder.js"(exports2, module2) {
    var {
      buildAnthropicMessages,
      buildAnthropicRequest
    } = require_anthropicProvider();
    var { buildOpenAIRequest } = require_openaiProvider();
    function parseCustomHeaders(settings) {
      const value = (settings.customHeaders || "{}").trim();
      if (!value) {
        return {};
      }
      try {
        const parsed = JSON.parse(value);
        if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
          throw new Error();
        }
        return parsed;
      } catch (_error) {
        throw new Error("\u81EA\u5B9A\u4E49 Headers \u4E0D\u662F\u5408\u6CD5\u7684 JSON \u5BF9\u8C61\u3002");
      }
    }
    function validateSettings(settings) {
      if (!settings.apiUrl) {
        throw new Error("\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u586B\u5199 API URL\u3002");
      }
      if (!settings.model) {
        throw new Error("\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u586B\u5199\u6A21\u578B\u540D\u79F0\u3002");
      }
      if (!settings.apiKey) {
        throw new Error("\u8BF7\u5148\u5728\u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u586B\u5199 API Key\u3002");
      }
    }
    function normalizeTools(tools) {
      if (!Array.isArray(tools)) {
        return [];
      }
      return tools.filter((tool) => {
        if (!tool) {
          return false;
        }
        if (typeof tool === "string") {
          return tool.trim().length > 0;
        }
        return typeof tool === "object";
      });
    }
    function buildMessages(settings, { systemPrompt, userPrompt, messages }) {
      if (Array.isArray(messages) && messages.length > 0) {
        return messages;
      }
      if (settings.providerType === "anthropic") {
        return buildAnthropicMessages(userPrompt, messages);
      }
      return [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ];
    }
    function buildRequest(settings, { systemPrompt, userPrompt, tools, messages }, useStreaming) {
      const customHeaders = parseCustomHeaders(settings);
      const headers = {
        "Content-Type": "application/json",
        ...customHeaders
      };
      const normalizedTools = normalizeTools(tools);
      const normalizedMessages = buildMessages(settings, { systemPrompt, userPrompt, messages });
      let body;
      if (settings.providerType === "anthropic") {
        headers["x-api-key"] = settings.apiKey;
        headers["anthropic-version"] = headers["anthropic-version"] || "2023-06-01";
        body = buildAnthropicRequest(settings, systemPrompt, normalizedMessages, normalizedTools);
      } else {
        headers.Authorization = headers.Authorization || `Bearer ${settings.apiKey}`;
        body = buildOpenAIRequest(settings, normalizedMessages, normalizedTools);
      }
      if (useStreaming) {
        body.stream = true;
      }
      return {
        headers,
        body
      };
    }
    function createCallContext(settings, { systemPrompt, userPrompt, tools, toolHandlers, onChunk, onToolCall } = {}) {
      validateSettings(settings);
      const normalizedTools = normalizeTools(tools);
      const toolHandlerMap = toolHandlers && typeof toolHandlers === "object" ? toolHandlers : {};
      const shouldUseTools = normalizedTools.length > 0;
      return {
        systemPrompt,
        userPrompt,
        tools: normalizedTools,
        toolHandlerMap,
        onChunk,
        onToolCall,
        canStream: typeof onChunk === "function" && !shouldUseTools,
        messages: buildMessages(settings, { systemPrompt, userPrompt })
      };
    }
    module2.exports = {
      buildMessages,
      buildRequest,
      createCallContext,
      normalizeTools,
      parseCustomHeaders,
      validateSettings
    };
  }
});

// src/llm/tools/toolCalling.js
var require_toolCalling = __commonJS({
  "src/llm/tools/toolCalling.js"(exports2, module2) {
    function parseJsonArguments(value, toolName) {
      if (value == null || value === "") {
        return {};
      }
      if (typeof value === "object") {
        return value;
      }
      if (typeof value !== "string") {
        throw new Error(`\u5DE5\u5177 ${toolName} \u7684\u53C2\u6570\u683C\u5F0F\u65E0\u6548\u3002`);
      }
      try {
        return JSON.parse(value);
      } catch (_error) {
        throw new Error(`\u5DE5\u5177 ${toolName} \u7684\u53C2\u6570\u4E0D\u662F\u5408\u6CD5 JSON\u3002`);
      }
    }
    function serializeToolResult(result) {
      if (typeof result === "string") {
        return result;
      }
      if (result == null) {
        return "";
      }
      return JSON.stringify(result);
    }
    async function executeOpenAIToolCalls(toolCalls, toolHandlers, onToolCall) {
      const results = [];
      for (const toolCall of toolCalls) {
        const toolName = toolCall?.function?.name;
        const handler = toolHandlers?.[toolName];
        if (typeof handler !== "function") {
          throw new Error(`\u6A21\u578B\u8BF7\u6C42\u8C03\u7528\u672A\u6CE8\u518C\u7684\u5DE5\u5177\uFF1A${toolName || "unknown"}`);
        }
        const args = parseJsonArguments(toolCall.function?.arguments, toolName);
        onToolCall?.(toolName, args);
        const output = await handler(args);
        results.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: serializeToolResult(output)
        });
      }
      return results;
    }
    async function executeAnthropicToolUses(toolUses, toolHandlers, onToolCall) {
      const results = [];
      for (const toolUse of toolUses) {
        const toolName = toolUse?.name;
        const handler = toolHandlers?.[toolName];
        if (typeof handler !== "function") {
          throw new Error(`\u6A21\u578B\u8BF7\u6C42\u8C03\u7528\u672A\u6CE8\u518C\u7684\u5DE5\u5177\uFF1A${toolName || "unknown"}`);
        }
        const args = parseJsonArguments(toolUse.input, toolName);
        onToolCall?.(toolName, args);
        const output = await handler(args);
        results.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: serializeToolResult(output)
            }
          ]
        });
      }
      return results;
    }
    module2.exports = {
      executeAnthropicToolUses,
      executeOpenAIToolCalls,
      parseJsonArguments,
      serializeToolResult
    };
  }
});

// src/llm/responseHandler.js
var require_responseHandler = __commonJS({
  "src/llm/responseHandler.js"(exports2, module2) {
    var {
      extractAnthropicAssistantMessage: extractAnthropicAssistantMessageFromProvider,
      extractAnthropicStreamDelta,
      extractAnthropicText: extractAnthropicTextFromProvider,
      extractAnthropicToolUses: extractAnthropicToolUsesFromProvider
    } = require_anthropicProvider();
    var {
      extractOpenAIAssistantMessage,
      extractOpenAIStreamDelta,
      extractOpenAIText: extractOpenAITextFromProvider,
      extractOpenAIToolCalls: extractOpenAIToolCallsFromProvider
    } = require_openaiProvider();
    var {
      executeAnthropicToolUses,
      executeOpenAIToolCalls
    } = require_toolCalling();
    function extractStreamDelta(providerType, payload) {
      if (!payload || typeof payload !== "object") {
        return "";
      }
      if (providerType === "anthropic") {
        return extractAnthropicStreamDelta(payload);
      }
      return extractOpenAIStreamDelta(payload);
    }
    async function handleAnthropicResponse(json, messages, toolHandlerMap, onToolCall) {
      const toolUses = extractAnthropicToolUsesFromProvider(json);
      if (toolUses.length > 0) {
        messages.push(
          extractAnthropicAssistantMessageFromProvider(json),
          ...await executeAnthropicToolUses(toolUses, toolHandlerMap, onToolCall)
        );
        return null;
      }
      const finalText = extractAnthropicTextFromProvider(json);
      if (!finalText) {
        throw new Error(json.error?.message || "Anthropic \u63A5\u53E3\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u6587\u672C\u3002");
      }
      return finalText.trim();
    }
    async function handleOpenAIResponse(json, messages, toolHandlerMap, onToolCall) {
      const toolCalls = extractOpenAIToolCallsFromProvider(json);
      if (toolCalls.length > 0) {
        messages.push(
          extractOpenAIAssistantMessage(json),
          ...await executeOpenAIToolCalls(toolCalls, toolHandlerMap, onToolCall)
        );
        return null;
      }
      const finalText = extractOpenAITextFromProvider(json);
      if (!finalText) {
        throw new Error(json.error?.message || "\u6A21\u578B\u63A5\u53E3\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u6587\u672C\u3002");
      }
      return finalText.trim();
    }
    async function handleModelResponse(settings, json, context) {
      if (settings.providerType === "anthropic") {
        return await handleAnthropicResponse(
          json,
          context.messages,
          context.toolHandlerMap,
          context.onToolCall
        );
      }
      return await handleOpenAIResponse(
        json,
        context.messages,
        context.toolHandlerMap,
        context.onToolCall
      );
    }
    module2.exports = {
      extractStreamDelta,
      handleAnthropicResponse,
      handleModelResponse,
      handleOpenAIResponse
    };
  }
});

// src/llm/streaming/sse.js
var require_sse = __commonJS({
  "src/llm/streaming/sse.js"(exports2, module2) {
    function parseSseMessages(buffer) {
      const normalized = buffer.replace(/\r\n/g, "\n");
      const chunks = normalized.split("\n\n");
      const complete = chunks.slice(0, -1);
      const remainder = chunks[chunks.length - 1] || "";
      const messages = complete.map(
        (chunk) => chunk.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n")
      ).filter(Boolean);
      return { messages, remainder };
    }
    async function readStreamResponse(response, providerType, onChunk, extractStreamDelta) {
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `\u6A21\u578B\u63A5\u53E3\u8BF7\u6C42\u5931\u8D25\uFF08${response.status}\uFF09\u3002`);
      }
      if (!response.body) {
        throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u8BFB\u53D6\u6D41\u5F0F\u54CD\u5E94\u3002");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const { messages, remainder } = parseSseMessages(buffer);
        buffer = remainder;
        for (const message of messages) {
          if (message === "[DONE]") {
            continue;
          }
          let payload;
          try {
            payload = JSON.parse(message);
          } catch (_error) {
            continue;
          }
          const errorMessage = payload.error?.message || payload.error?.error?.message;
          if (errorMessage) {
            throw new Error(errorMessage);
          }
          const delta = extractStreamDelta(providerType, payload);
          if (delta) {
            fullText += delta;
            onChunk?.(fullText, delta);
          }
        }
        if (done) {
          break;
        }
      }
      if (!fullText.trim()) {
        throw new Error(
          providerType === "anthropic" ? "Anthropic \u63A5\u53E3\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u6587\u672C\u3002" : "\u6A21\u578B\u63A5\u53E3\u6CA1\u6709\u8FD4\u56DE\u53EF\u7528\u6587\u672C\u3002"
        );
      }
      return fullText.trim();
    }
    module2.exports = {
      parseSseMessages,
      readStreamResponse
    };
  }
});

// src/llm/toolLoopCoordinator.js
var require_toolLoopCoordinator = __commonJS({
  "src/llm/toolLoopCoordinator.js"(exports2, module2) {
    var { buildRequest } = require_requestBuilder();
    var { extractStreamDelta, handleModelResponse } = require_responseHandler();
    var { readStreamResponse } = require_sse();
    async function requestModelOnce(settings, payload, useStreaming, requestUrlImpl) {
      const { headers, body } = buildRequest(settings, payload, useStreaming);
      if (useStreaming && typeof fetch === "function") {
        const response2 = await fetch(settings.apiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(body)
        });
        const text = await readStreamResponse(
          response2,
          settings.providerType,
          payload.onChunk,
          extractStreamDelta
        );
        return { text, json: null };
      }
      const response = await requestUrlImpl({
        url: settings.apiUrl,
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });
      return { text: null, json: response.json };
    }
    async function runToolLoop(settings, context, requestUrlImpl) {
      const maxToolRounds = 8;
      for (let round = 0; round <= maxToolRounds; round += 1) {
        const { text, json } = await requestModelOnce(
          settings,
          {
            systemPrompt: context.systemPrompt,
            userPrompt: context.userPrompt,
            tools: context.tools,
            messages: context.messages,
            onChunk: context.onChunk
          },
          context.canStream,
          requestUrlImpl
        );
        if (text != null) {
          return text.trim();
        }
        const finalText = await handleModelResponse(settings, json, context);
        if (finalText != null) {
          return finalText;
        }
      }
      throw new Error("\u5DE5\u5177\u8C03\u7528\u8F6E\u6B21\u8FC7\u591A\uFF0C\u5DF2\u505C\u6B62\u7EE7\u7EED\u8BF7\u6C42\u6A21\u578B\u3002");
    }
    module2.exports = {
      requestModelOnce,
      runToolLoop
    };
  }
});

// src/llm/modelClient.js
var require_modelClient = __commonJS({
  "src/llm/modelClient.js"(exports2, module2) {
    var { requestUrl } = require("obsidian");
    var {
      buildMessages,
      buildRequest,
      createCallContext,
      normalizeTools,
      parseCustomHeaders,
      validateSettings
    } = require_requestBuilder();
    var {
      extractStreamDelta,
      handleAnthropicResponse,
      handleModelResponse,
      handleOpenAIResponse
    } = require_responseHandler();
    var { requestModelOnce, runToolLoop } = require_toolLoopCoordinator();
    async function callModel(settings, { systemPrompt, userPrompt, tools, toolHandlers, onChunk, onToolCall } = {}) {
      const context = createCallContext(settings, {
        systemPrompt,
        userPrompt,
        tools,
        toolHandlers,
        onChunk,
        onToolCall
      });
      return await runToolLoop(settings, context, requestUrl);
    }
    module2.exports = {
      buildRequest,
      buildMessages,
      callModel,
      extractStreamDelta,
      parseCustomHeaders,
      normalizeTools,
      validateSettings
    };
  }
});

// src/core/prompts.js
var require_prompts = __commonJS({
  "src/core/prompts.js"(exports2, module2) {
    function formatSourceContext(context) {
      return `\u6587\u7A3F\u6807\u9898\uFF1A${context.title}
\u539F\u6587\uFF1A
<<<TEXT
${context.text}
TEXT>>>`;
    }
    function stringifyMessageContent(content) {
      if (typeof content === "string") {
        return content;
      }
      if (Array.isArray(content)) {
        return content.map((item) => {
          if (typeof item === "string") {
            return item;
          }
          if (item && typeof item.text === "string") {
            return item.text;
          }
          if (item && typeof item.content === "string") {
            return item.content;
          }
          return "";
        }).filter(Boolean).join("\n");
      }
      return "";
    }
    function buildReviewPrompt(settings, getScopeLabel, agent, context) {
      return `\u4F60\u6B63\u5728\u5BA1\u9605\u4E00\u6BB5 Obsidian ${getScopeLabel(context.scope)}\u3002
\u4F60\u7684\u89D2\u8272\uFF1A${agent.title}\u3002
\u5BA1\u9605\u91CD\u70B9\uFF1A${agent.focus}
\u8F93\u51FA\u8BED\u8A00\uFF1A${settings.responseLanguage}\u3002
\u8F93\u51FA\u8981\u6C42\uFF1A
1. \u4EC5\u8F93\u51FA 1-3 \u6761\u5177\u5907\u5B9E\u9645\u4EF7\u503C\u7684\u7591\u95EE\u6216\u4F18\u5316\u5EFA\u8BAE\uFF0C\u675C\u7EDD\u65E0\u610F\u4E49\u3001\u51D1\u6570\u7684\u5185\u5BB9\uFF1B
2. \u91C7\u7528\u5206\u884C\u65E0\u5E8F\u5217\u8868\u683C\u5F0F\u8F93\u51FA\uFF0C\u5185\u5BB9\u7B80\u6D01\u7CBE\u70BC\uFF0C\u65E0\u5197\u4F59\u8BDD\u672F\u3001\u65E0\u989D\u5916\u89E3\u91CA\uFF1B
3. \u82E5\u6587\u7A3F\u65E0\u660E\u663E\u95EE\u9898\u3001\u65E0\u4F18\u5316\u7A7A\u95F4\uFF0C\u76F4\u63A5\u8F93\u51FA\u6587\u5B57\uFF1A\u6682\u65F6\u6CA1\u6709\u95EE\u9898
${formatSourceContext(context)}`;
    }
    function buildReviewContinuationPrompt(settings, agent, context, initialReview) {
      return `\u8BF7\u57FA\u4E8E\u4E0B\u9762\u7684\u539F\u6587\u4E0E\u521D\u5BA1\u7ED3\u679C\uFF0C\u7EE7\u7EED\u4EE5 ${agent.title} \u7684\u89C6\u89D2\u7ED9\u51FA\u66F4\u53EF\u6267\u884C\u7684\u4FEE\u6539\u65B9\u6848\u3002
\u8F93\u51FA\u8BED\u8A00\uFF1A${settings.responseLanguage}\u3002
\u8F93\u51FA\u8981\u6C42\uFF1A
1. \u5148\u8F93\u51FA \`## \u4F18\u5148\u4FEE\u6539\u65B9\u6848\`\uFF0C\u6309\u4F18\u5148\u7EA7\u5217\u51FA\u5E94\u8BE5\u5148\u6539\u4EC0\u4E48\u3002
2. \u518D\u8F93\u51FA \`## \u793A\u4F8B\u4FEE\u6539\`\uFF0C\u5BF9\u6700\u5173\u952E\u7684 2-4 \u5904\u63D0\u4F9B\u53EF\u76F4\u63A5\u53C2\u8003\u7684\u6539\u5199\u3001\u8865\u5199\u6216\u66FF\u6362\u65B9\u6848\u3002
3. \u5982\u6709\u5FC5\u8981\uFF0C\u518D\u8F93\u51FA \`## \u8FDB\u4E00\u6B65\u5EFA\u8BAE\`\uFF0C\u8BF4\u660E\u4F5C\u8005\u8FD8\u53EF\u7EE7\u7EED\u8865\u4EC0\u4E48\u3002
4. \u4FDD\u6301\u9488\u5BF9\u6027\uFF0C\u4E0D\u8981\u6CDB\u6CDB\u800C\u8C08\u3002
\u521D\u5BA1\u7ED3\u679C\uFF1A
${initialReview}
${formatSourceContext(context)}`;
    }
    function buildPolishPrompt(settings, getScopeLabel, context) {
      return `\u8BF7\u5BF9\u4E0B\u9762\u7684 ${getScopeLabel(context.scope)} \u8FDB\u884C\u4E2D\u6587\u6DA6\u8272\uFF0C\u5728\u4E0D\u6539\u53D8\u539F\u610F\u7684\u524D\u63D0\u4E0B\u63D0\u5347\u8868\u8FBE\u3002
\u8F93\u51FA\u8BED\u8A00\uFF1A${settings.responseLanguage}\u3002
\u8F93\u51FA\u8981\u6C42\uFF1A
1. \u5148\u8F93\u51FA \`## \u6DA6\u8272\u8BF4\u660E\`\uFF0C\u6982\u62EC 2-4 \u6761\u6539\u8FDB\u91CD\u70B9\u3002
2. \u518D\u8F93\u51FA \`## \u6DA6\u8272\u7ED3\u679C\`\u3002
3. \u5728 \`## \u6DA6\u8272\u7ED3\u679C\` \u4E0B\u65B9\uFF0C\u7528\u4EE5\u4E0B\u6807\u8BB0\u5305\u88F9\u6700\u7EC8\u6DA6\u8272\u540E\u7684\u5B8C\u6574\u6587\u672C\uFF0C\u4E14\u4E0D\u8981\u89E3\u91CA\u8FD9\u4E9B\u6807\u8BB0\uFF1A
<!--POLISHED_TEXT_START-->
\u6DA6\u8272\u540E\u7684\u6587\u672C
<!--POLISHED_TEXT_END-->
4. \u53EA\u8F93\u51FA\u4E00\u6B21\u6700\u7EC8\u6DA6\u8272\u6587\u672C\u3002
${formatSourceContext(context)}`;
    }
    function buildAllReviewContinuationPrompt(settings, context, initialReview) {
      return `\u8BF7\u57FA\u4E8E\u4E0B\u9762\u8FD9\u4EFD\u7EFC\u5408\u5BA1\u9605\u7ED3\u679C\uFF0C\u4E3A\u4F5C\u8005\u8F93\u51FA\u4E00\u4EFD\u53EF\u6267\u884C\u7684\u6574\u4F53\u4FEE\u6539\u65B9\u6848\u3002
\u8F93\u51FA\u8BED\u8A00\uFF1A${settings.responseLanguage}\u3002
\u8F93\u51FA\u8981\u6C42\uFF1A
1. \u5148\u8F93\u51FA \`## \u6700\u9AD8\u4F18\u5148\u7EA7\u95EE\u9898\`\uFF0C\u5217\u51FA\u6700\u503C\u5F97\u5148\u5904\u7406\u7684 3-5 \u9879\u3002
2. \u518D\u8F93\u51FA \`## \u9010\u6B65\u4FEE\u6539\u65B9\u6848\`\uFF0C\u6309\u6267\u884C\u987A\u5E8F\u8BF4\u660E\u600E\u4E48\u6539\u3002
3. \u518D\u8F93\u51FA \`## \u793A\u4F8B\u6539\u5199\u4E0E\u8865\u5145\`\uFF0C\u7ED9\u51FA\u5173\u952E\u7247\u6BB5\u7684\u793A\u4F8B\u4F18\u5316\u3002
4. \u9700\u8981\u65F6\u8F93\u51FA \`## \u7EE7\u7EED\u6DF1\u6316\u65B9\u5411\`\uFF0C\u8BF4\u660E\u540E\u7EED\u53EF\u7EE7\u7EED\u62D3\u5C55\u7684\u7406\u8BBA\u3001\u6848\u4F8B\u6216\u8BC1\u636E\u3002
\u7EFC\u5408\u521D\u5BA1\u7ED3\u679C\uFF1A
${initialReview}
${formatSourceContext(context)}`;
    }
    function buildFollowUpChatPrompt(settings, session, messages) {
      const transcript = messages.map(
        (message) => `${message.role === "assistant" ? "\u52A9\u624B" : "\u7528\u6237"}\uFF1A${stringifyMessageContent(message.content)}`
      ).join("\n\n");
      return `\u4F60\u6B63\u5728\u548C\u4F5C\u8005\u56F4\u7ED5\u4E00\u4EFD\u5BA1\u9605\u7ED3\u679C\u8FDB\u884C\u8FFD\u95EE\u5F0F\u4EA4\u6D41\u3002
\u8F93\u51FA\u8BED\u8A00\uFF1A${settings.responseLanguage}\u3002
\u56DE\u7B54\u8981\u6C42\uFF1A
1. \u76F4\u63A5\u56DE\u5E94\u7528\u6237\u5F53\u524D\u8FFD\u95EE\uFF0C\u4F18\u5148\u7ED9\u51FA\u53EF\u6267\u884C\u5EFA\u8BAE\uFF1B
2. \u7ED3\u5408\u539F\u6587\u4E0E\u65E2\u6709\u5BA1\u9605\u7ED3\u679C\uFF0C\u4E0D\u8981\u8131\u79BB\u4E0A\u4E0B\u6587\u6CDB\u6CDB\u800C\u8C08\uFF1B
3. \u82E5\u7528\u6237\u8981\u6C42\u793A\u4F8B\u3001\u6539\u5199\u3001\u8865\u5145\u6750\u6599\uFF0C\u8BF7\u5C3D\u91CF\u7ED9\u51FA\u5177\u4F53\u6587\u672C\uFF1B
4. \u4FDD\u6301\u81EA\u7136\u5BF9\u8BDD\u8BED\u6C14\uFF0C\u4E0D\u8981\u91CD\u590D\u7CFB\u7EDF\u8BBE\u5B9A\u3002
\u5904\u7406\u8303\u56F4\uFF1A${session.context.scope === "selection" ? "\u9009\u4E2D\u6587\u672C" : "\u6574\u7BC7\u7B14\u8BB0"}
\u5F53\u524D\u5173\u8054\u7684\u5BA1\u9605\u7ED3\u679C\uFF1A
${session.reviewMarkdown}
${formatSourceContext(session.context)}
\u5BF9\u8BDD\u8BB0\u5F55\uFF1A
${transcript}`;
    }
    module2.exports = {
      buildAllReviewContinuationPrompt,
      buildFollowUpChatPrompt,
      buildPolishPrompt,
      buildReviewContinuationPrompt,
      buildReviewPrompt
    };
  }
});

// src/services/reviewService.js
var require_reviewService = __commonJS({
  "src/services/reviewService.js"(exports2, module2) {
    var { resolveAgentTools } = require_agentTools();
    var { POLISH_AGENT } = require_reviewAgents();
    var { callModel } = require_modelClient();
    var {
      buildAllReviewContinuationPrompt,
      buildFollowUpChatPrompt,
      buildPolishPrompt,
      buildReviewContinuationPrompt,
      buildReviewPrompt
    } = require_prompts();
    var ReviewService2 = class {
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
          onToolCall
        });
      }
      async runSingleReview(agent, context, options = {}) {
        return await this.callModel({
          systemPrompt: agent.systemRole,
          userPrompt: this.buildReviewPrompt(agent, context),
          tools: resolveAgentTools(agent, this.plugin.settings.providerType),
          toolHandlers: options.toolHandlers,
          onChunk: options.onChunk,
          onToolCall: options.onToolCall
        });
      }
      async runReviewContinuation(agent, context, initialReview, options = {}) {
        return await this.callModel({
          systemPrompt: agent.systemRole,
          userPrompt: this.buildReviewContinuationPrompt(agent, context, initialReview),
          tools: resolveAgentTools(agent, this.plugin.settings.providerType),
          toolHandlers: options.toolHandlers,
          onChunk: options.onChunk,
          onToolCall: options.onToolCall
        });
      }
      async runPolish(context, options = {}) {
        return await this.callModel({
          systemPrompt: POLISH_AGENT.systemRole,
          userPrompt: this.buildPolishPrompt(context),
          tools: POLISH_AGENT.tools,
          toolHandlers: options.toolHandlers,
          onChunk: options.onChunk,
          onToolCall: options.onToolCall
        });
      }
      async runAllReviews(context, options = {}) {
        const sections = [];
        const renderCombinedMarkdown = (streamingSection = "") => {
          const allSections = streamingSection ? [...sections, streamingSection] : sections;
          if (allSections.length === 0) {
            return;
          }
          options.onChunk?.(`# \u7EFC\u5408\u5BA1\u9605\u7ED3\u679C

${allSections.join("\n\n---\n\n")}`);
        };
        for (const agent of this.getReviewAgents()) {
          const content = await this.runSingleReview(agent, context, {
            ...options,
            onChunk: (fullText) => {
              renderCombinedMarkdown(`## ${agent.label}

${fullText}`);
            }
          });
          sections.push(`## ${agent.label}

${content}`);
          renderCombinedMarkdown();
        }
        return `# \u7EFC\u5408\u5BA1\u9605\u7ED3\u679C

${sections.join("\n\n---\n\n")}`;
      }
      async runAllReviewContinuation(context, initialReview, options = {}) {
        return await this.callModel({
          systemPrompt: "\u4F60\u662F\u4E00\u540D\u603B\u7F16\u8F91\uFF0C\u8D1F\u8D23\u628A\u591A\u7EF4\u5EA6\u5BA1\u9605\u610F\u89C1\u6574\u5408\u4E3A\u4E00\u4EFD\u4F18\u5148\u7EA7\u6E05\u6670\u3001\u53EF\u76F4\u63A5\u6267\u884C\u7684\u4FEE\u6539\u65B9\u6848\u3002",
          userPrompt: this.buildAllReviewContinuationPrompt(context, initialReview),
          toolHandlers: options.toolHandlers,
          onChunk: options.onChunk,
          onToolCall: options.onToolCall
        });
      }
      async runFollowUpChat(session, messages, options = {}) {
        return await this.callModel({
          systemPrompt: "\u4F60\u662F\u4E00\u540D\u4E2D\u6587\u5199\u4F5C\u6559\u7EC3\u517C\u5BA1\u9605\u52A9\u624B\uFF0C\u9700\u8981\u56F4\u7ED5\u65E2\u6709\u5BA1\u9605\u7ED3\u679C\u7EE7\u7EED\u56DE\u7B54\u7528\u6237\u7684\u8FFD\u95EE\uFF0C\u5E76\u63D0\u4F9B\u5177\u4F53\u53EF\u6267\u884C\u7684\u5E2E\u52A9\u3002",
          userPrompt: this.buildFollowUpChatPrompt(session, messages),
          toolHandlers: options.toolHandlers,
          onChunk: options.onChunk,
          onToolCall: options.onToolCall
        });
      }
    };
    module2.exports = { ReviewService: ReviewService2 };
  }
});

// src/views/reviewChatView.js
var require_reviewChatView = __commonJS({
  "src/views/reviewChatView.js"(exports2, module2) {
    var { ItemView, MarkdownRenderer } = require("obsidian");
    var REVIEW_CHAT_VIEW_TYPE2 = "qreview-chat-view";
    var ReviewChatView2 = class extends ItemView {
      constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.session = null;
        this.messages = [];
        this.pendingMessageIndex = null;
        this.isBusy = false;
      }
      getViewType() {
        return REVIEW_CHAT_VIEW_TYPE2;
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
          messages: Array.isArray(session.messages) ? session.messages.map((message) => ({ ...message })) : []
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
          emptyEl.setText("\u6682\u65E0\u8FFD\u95EE\u4F1A\u8BDD\u3002");
          return;
        }
        const summaryEl = this.bodyInnerEl.createDiv({ cls: "qreview-chat__summary" });
        summaryEl.createDiv({ cls: "qreview-chat__summary-title", text: this.session.title || "\u8FFD\u95EE\u4F1A\u8BDD" });
        summaryEl.createDiv({
          cls: "qreview-chat__summary-meta",
          text: this.session.context.scope === "selection" ? "\u9009\u4E2D\u6587\u672C\u6A21\u5F0F" : "\u6574\u7BC7\u7B14\u8BB0\u6A21\u5F0F"
        });
        for (const message of this.messages) {
          const bubbleEl = this.bodyInnerEl.createDiv({
            cls: `qreview-chat__message qreview-chat__message--${message.role}`
          });
          const roleEl = bubbleEl.createDiv({ cls: "qreview-chat__message-role" });
          roleEl.setText(message.role === "assistant" ? "QuickReview" : "\u6211");
          const contentEl = bubbleEl.createDiv({
            cls: "qreview-chat__message-content qreview-view__entry-content qreview-view__entry-content-body markdown-rendered"
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
            placeholder: "\u7EE7\u7EED\u8FFD\u95EE\u5F53\u524D\u5BA1\u9605\u7ED3\u679C...",
            rows: "3"
          }
        });
        const actionEl = this.composerEl.createDiv({ cls: "qreview-chat__composer-actions" });
        const submitButton = actionEl.createEl("button", {
          cls: "mod-cta",
          text: this.isBusy ? "\u53D1\u9001\u4E2D..." : "\u53D1\u9001"
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
        this.messages.push({ role: "assistant", content: "\u601D\u8003\u4E2D..." });
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
              }
            }
          );
          this.messages[this.pendingMessageIndex].content = reply;
          this.session.messages = this.messages.map((message) => ({ ...message }));
        } catch (error) {
          this.messages[this.pendingMessageIndex].content = `\u5904\u7406\u5931\u8D25\uFF1A${error.message || "\u53D1\u751F\u672A\u77E5\u9519\u8BEF\u3002"}`;
        } finally {
          this.pendingMessageIndex = null;
          this.isBusy = false;
          this.renderMessages();
          this.renderComposer();
        }
      }
    };
    module2.exports = { ReviewChatView: ReviewChatView2, REVIEW_CHAT_VIEW_TYPE: REVIEW_CHAT_VIEW_TYPE2 };
  }
});

// src/core/reviewResultController.js
var require_reviewResultController = __commonJS({
  "src/core/reviewResultController.js"(exports2, module2) {
    function resolveRequestValue(requestId, value) {
      return typeof requestId === "number" ? value : requestId;
    }
    var RequestStateManager = class {
      constructor() {
        this.requestStates = /* @__PURE__ */ new Map();
        this.requestSequence = 0;
        this.activeRequestId = null;
      }
      create() {
        const requestId = ++this.requestSequence;
        this.requestStates.set(requestId, {
          rawMarkdown: "",
          streamingRenderTimer: null,
          streamingRenderPromise: Promise.resolve()
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
    };
    var ReviewResultController = class {
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
        state.rawMarkdown = `## \u5904\u7406\u5931\u8D25

${resolvedMessage}`;
        this.requestStateManager.clearStreamingTimer(resolvedRequestId);
        this.view.failRequest(resolvedRequestId, resolvedMessage);
      }
      async handleContinue() {
        if (this.view.isBusy || typeof this.view.options.onContinue !== "function") {
          return;
        }
        this.view.setBusy(true);
        const requestId = this.beginRequest("\u601D\u8003\u4E2D");
        try {
          const nextMarkdown = await this.view.options.onContinue({
            onChunk: (nextPart) => this.updateStreamingMarkdown(requestId, nextPart)
          });
          this.view.options.onContinue = null;
          await this.setMarkdown(requestId, nextMarkdown);
        } catch (error) {
          this.setError(requestId, error.message || "\u7EE7\u7EED\u5904\u7406\u65F6\u53D1\u751F\u672A\u77E5\u9519\u8BEF\u3002");
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
    };
    module2.exports = { ReviewResultController };
  }
});

// src/views/reviewResultView.js
var require_reviewResultView = __commonJS({
  "src/views/reviewResultView.js"(exports2, module2) {
    var { ItemView, MarkdownRenderer } = require("obsidian");
    var { ReviewResultController } = require_reviewResultController();
    var REVIEW_VIEW_TYPE2 = "qreview-result-view";
    var reviewResultViewSequence = 0;
    function stripHiddenMarkers(markdown) {
      return markdown.replace(/<!--POLISHED_TEXT_START-->/g, "").replace(/<!--POLISHED_TEXT_END-->/g, "").trim();
    }
    var ReviewResultRenderer = class {
      constructor(view) {
        this.view = view;
      }
      getScopeDisplayLabel(scope) {
        return scope === "selection" ? "\u9009\u4E2D\u6587\u672C\u6A21\u5F0F" : "\u6574\u7BC7\u7B14\u8BB0\u6A21\u5F0F";
      }
      renderShell() {
        this.view.contentEl.empty();
        this.view.contentEl.addClass("qreview-result-view");
        this.view.viewEl = this.view.contentEl.createDiv({
          cls: "qreview-view qreview-view--result"
        });
        this.view.bodyEl = this.view.viewEl.createDiv({ cls: "qreview-view__body" });
        this.view.bodyInnerEl = this.view.bodyEl.createDiv({
          cls: "qreview-view__body-inner qreview-view__body-inner--result markdown-rendered"
        });
        this.view.footerEl = this.view.viewEl.createDiv({ cls: "qreview-view__footer" });
      }
      renderFooter() {
        this.view.footerEl.empty();
        const footerStartEl = this.view.footerEl.createDiv({ cls: "qreview-view__footer-start" });
        const footerEndEl = this.view.footerEl.createDiv({ cls: "qreview-view__footer-end" });
        const collapseAllButton = footerStartEl.createEl("button", {
          text: "\u5168\u90E8\u6298\u53E0",
          attr: {
            type: "button",
            "aria-label": "\u5168\u90E8\u6298\u53E0"
          }
        });
        collapseAllButton.disabled = !this.view.hasEntries();
        collapseAllButton.addEventListener("click", () => this.view.toggleAllEntriesCollapsed());
        this.view.setCollapseAllButton(collapseAllButton);
        this.view.refreshCollapseAllButton();
        if (typeof this.view.options.onContinue === "function") {
          const continueButton = footerEndEl.createEl("button", {
            cls: "mod-cta",
            text: this.view.isBusy ? "\u751F\u6210\u4E2D..." : "\u7EE7\u7EED"
          });
          continueButton.disabled = this.view.isBusy;
          continueButton.addEventListener("click", () => this.view.handleContinue());
        }
        if (typeof this.view.options.onApply === "function") {
          const applyButton = footerEndEl.createEl("button", {
            text: this.view.isBusy ? "\u5904\u7406\u4E2D..." : "\u5E94\u7528\u5230\u539F\u6587"
          });
          applyButton.disabled = this.view.isBusy;
          applyButton.addEventListener("click", () => this.view.handleApply());
        }
      }
      createEntryLayout(entryOptions) {
        const entryEl = this.view.bodyInnerEl.createDiv({ cls: "qreview-view__entry" });
        const sourceFileEl = entryEl.createDiv({ cls: "qreview-view__entry-source" });
        sourceFileEl.createSpan({
          cls: "qreview-view__entry-source-name",
          text: entryOptions.sourceFileName || "\u672A\u547D\u540D\u7B14\u8BB0",
          attr: {
            title: entryOptions.sourceFileName || "\u672A\u547D\u540D\u7B14\u8BB0"
          }
        });
        const metaEl = entryEl.createDiv({ cls: "qreview-view__entry-meta" });
        const metaInfoEl = metaEl.createDiv({ cls: "qreview-view__entry-info" });
        metaInfoEl.createSpan({ cls: "qreview-view__entry-title", text: entryOptions.title });
        const actionsEl = metaEl.createDiv({ cls: "qreview-view__entry-actions" });
        const contentWrapEl = entryEl.createDiv({ cls: "qreview-view__entry-content" });
        const contentEl = contentWrapEl.createDiv({ cls: "qreview-view__entry-content-body" });
        const followUpElements = this.createFollowUpElements(contentWrapEl);
        return {
          entryEl,
          actionsEl,
          contentEl,
          ...followUpElements
        };
      }
      createFollowUpElements(contentWrapEl) {
        const followUpEl = contentWrapEl.createDiv({ cls: "qreview-view__entry-follow-up" });
        const followUpTriggerEl = followUpEl.createEl("button", {
          cls: "qreview-view__entry-follow-up-trigger",
          attr: {
            type: "button"
          },
          text: "\u8FFD\u95EE"
        });
        followUpEl.addClass("is-hidden");
        const followUpFormEl = followUpEl.createDiv({ cls: "qreview-view__entry-follow-up-form" });
        const followUpInputEl = followUpFormEl.createEl("input", {
          cls: "qreview-view__entry-follow-up-input",
          attr: {
            type: "text",
            placeholder: "\u8F93\u5165\u4F60\u60F3\u7EE7\u7EED\u8FFD\u95EE\u7684\u95EE\u9898..."
          }
        });
        const followUpButton = followUpFormEl.createEl("button", {
          cls: "mod-cta",
          attr: {
            type: "button"
          },
          text: "\u8FFD\u95EE"
        });
        return {
          followUpEl,
          followUpTriggerEl,
          followUpInputEl,
          followUpButton
        };
      }
      bindLocateAction(actionsEl, requestId, entryOptions) {
        if (entryOptions.scope !== "selection" || typeof entryOptions.onLocate !== "function") {
          return;
        }
        const locateButton = actionsEl.createEl("button", {
          cls: "qreview-view__entry-icon-button",
          attr: {
            type: "button",
            "aria-label": "\u5B9A\u4F4D\u5230\u539F\u6587"
          },
          text: "\u2316"
        });
        const suppressMenuEvent = (event) => {
          event?.preventDefault?.();
          event?.stopPropagation?.();
        };
        locateButton.addEventListener("mousedown", suppressMenuEvent);
        locateButton.addEventListener("mouseup", suppressMenuEvent);
        locateButton.addEventListener("click", (event) => {
          suppressMenuEvent(event);
          this.view.plugin?.suppressSelectionToolbar?.();
          entryOptions.onLocate(this.view.buildEntryLocatePayload(requestId, entryOptions));
        });
      }
      bindPopoutAction(actionsEl, requestId, entryOptions) {
        if (typeof entryOptions.onPopout !== "function") {
          return;
        }
        const popoutButton = actionsEl.createEl("button", {
          cls: "qreview-view__entry-icon-button",
          attr: {
            type: "button",
            "aria-label": "\u5728\u72EC\u7ACB\u7A97\u53E3\u4E2D\u6253\u5F00"
          },
          text: "\u25F1"
        });
        popoutButton.addEventListener("click", () => {
          entryOptions.onPopout({
            requestId,
            title: entryOptions.title,
            sourceFileName: entryOptions.sourceFileName
          });
        });
      }
      bindCollapseAction(actionsEl, entryEl) {
        const collapseButton = actionsEl.createEl("button", {
          cls: "qreview-view__entry-icon-button qreview-view__entry-icon-button--collapse",
          attr: {
            type: "button",
            "aria-label": "\u6298\u53E0\u6D88\u606F"
          },
          text: "\u25BE"
        });
        collapseButton.addEventListener("click", () => {
          const isCollapsed = entryEl.hasClass("is-collapsed");
          this.view.setEntryCollapsed(entryEl, collapseButton, !isCollapsed);
          this.view.refreshCollapseAllButton();
        });
        return collapseButton;
      }
      bindDeleteAction(actionsEl, entryEl, contentEl) {
        const deleteButton = actionsEl.createEl("button", {
          cls: "qreview-view__entry-icon-button qreview-view__entry-icon-button--danger",
          attr: {
            type: "button",
            "aria-label": "\u5220\u9664\u6D88\u606F"
          },
          text: "\u2715"
        });
        deleteButton.addEventListener("click", () => {
          this.view.removeRequestEntryByContentEl(contentEl);
          entryEl.remove();
          this.view.refreshCollapseAllButton();
        });
      }
      bindFollowUpActions(requestId, entryOptions, followUpElements) {
        const {
          followUpEl,
          followUpTriggerEl,
          followUpInputEl,
          followUpButton
        } = followUpElements;
        const submitFollowUp = async () => {
          if (this.view.isBusy || typeof entryOptions.onFollowUp !== "function") {
            return;
          }
          const question = followUpInputEl.value.trim();
          if (!question) {
            followUpInputEl.focus();
            return;
          }
          followUpInputEl.disabled = true;
          followUpButton.disabled = true;
          try {
            await entryOptions.onFollowUp({
              requestId,
              title: entryOptions.title,
              scope: entryOptions.scope,
              question
            });
            followUpInputEl.value = "";
          } finally {
            followUpInputEl.disabled = false;
            followUpButton.disabled = false;
          }
        };
        const expandFollowUp = () => {
          followUpEl.addClass("is-expanded");
          window.setTimeout(() => followUpInputEl.focus(), 0);
        };
        const collapseFollowUp = () => {
          if (followUpInputEl.value.trim()) {
            return;
          }
          followUpEl.removeClass("is-expanded");
        };
        followUpTriggerEl.addEventListener("click", () => {
          expandFollowUp();
        });
        followUpButton.addEventListener("click", () => {
          submitFollowUp();
        });
        followUpInputEl.addEventListener("keydown", (event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submitFollowUp();
          }
          if (event.key === "Escape") {
            followUpInputEl.value = "";
            collapseFollowUp();
          }
        });
        followUpInputEl.addEventListener("blur", () => {
          window.setTimeout(() => collapseFollowUp(), 120);
        });
      }
      createEntry(requestId, entryOptions) {
        const entry = this.createEntryLayout(entryOptions);
        this.bindPopoutAction(entry.actionsEl, requestId, entryOptions);
        this.bindLocateAction(entry.actionsEl, requestId, entryOptions);
        const collapseButtonEl = this.bindCollapseAction(entry.actionsEl, entry.entryEl);
        this.bindDeleteAction(entry.actionsEl, entry.entryEl, entry.contentEl);
        this.bindFollowUpActions(requestId, entryOptions, entry);
        return {
          entryEl: entry.entryEl,
          contentEl: entry.contentEl,
          followUpEl: entry.followUpEl,
          collapseButtonEl
        };
      }
      showLoading(entryBodyEl, text) {
        const loadingEl = entryBodyEl.createDiv({ cls: "qreview-loading" });
        loadingEl.createDiv({ cls: "qreview-loading__bar" });
        return loadingEl.createDiv({ cls: "qreview-loading__text", text });
      }
      async renderMarkdown(entryBodyEl, markdown) {
        entryBodyEl.empty();
        await MarkdownRenderer.renderMarkdown(
          stripHiddenMarkers(markdown),
          entryBodyEl,
          "",
          this.view.plugin
        );
      }
      renderError(entryBodyEl, message) {
        entryBodyEl.empty();
        entryBodyEl.createDiv({ cls: "qreview-error", text: message });
      }
    };
    var ReviewResultView2 = class extends ItemView {
      constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.instanceId = `qreview-result-${++reviewResultViewSequence}`;
        this.options = {
          title: "QuickReview",
          scope: "document",
          sourceFileName: "",
          onContinue: null,
          onApply: null,
          onLocate: null,
          onPopout: null,
          onFollowUp: null
        };
        this.isBusy = false;
        this.scopeLabel = "\u6574\u7BC7\u7B14\u8BB0\u6A21\u5F0F";
        this.renderer = new ReviewResultRenderer(this);
        this.controller = new ReviewResultController(this);
        this.requestElements = /* @__PURE__ */ new Map();
        this.collapseAllButtonEl = null;
        this.autoScrollThreshold = 48;
        this.shouldAutoScroll = true;
        this.handleBodyScroll = this.handleBodyScroll.bind(this);
      }
      getViewType() {
        return REVIEW_VIEW_TYPE2;
      }
      getDisplayText() {
        return "QuickReview";
      }
      getIcon() {
        return "pen-tool";
      }
      getInstanceId() {
        return this.instanceId;
      }
      async onOpen() {
        this.render();
      }
      async onClose() {
        if (this.bodyEl) {
          this.bodyEl.removeEventListener("scroll", this.handleBodyScroll);
        }
        this.contentEl.empty();
        this.requestElements.clear();
        this.collapseAllButtonEl = null;
        this.controller.cleanup();
      }
      setOptions(options) {
        this.options = {
          ...this.options,
          ...options
        };
        this.scopeLabel = this.options.scope === "selection" ? "\u9009\u4E2D\u6587\u672C\u6A21\u5F0F" : "\u6574\u7BC7\u7B14\u8BB0\u6A21\u5F0F";
        if (!this.viewEl) {
          this.render();
          return;
        }
        this.renderHeaderActions();
        this.renderFooter();
      }
      render() {
        if (this.bodyEl) {
          this.bodyEl.removeEventListener("scroll", this.handleBodyScroll);
        }
        this.renderer.renderShell();
        this.bodyEl.addEventListener("scroll", this.handleBodyScroll);
        this.shouldAutoScroll = true;
        this.renderHeaderActions();
        this.renderer.renderFooter();
      }
      renderHeaderActions() {
      }
      renderFooter() {
        this.renderer.renderFooter();
      }
      buildEntryLocatePayload(requestId, entryOptions) {
        return {
          requestId,
          context: entryOptions.locateContext || null
        };
      }
      setCollapseAllButton(buttonEl) {
        this.collapseAllButtonEl = buttonEl;
      }
      hasEntries() {
        return this.requestElements.size > 0;
      }
      getEntryElements() {
        return Array.from(this.requestElements.values());
      }
      setEntryCollapsed(entryEl, collapseButtonEl, collapsed) {
        if (!entryEl || !collapseButtonEl) {
          return;
        }
        entryEl.toggleClass("is-collapsed", collapsed);
        collapseButtonEl.setText(collapsed ? "\u25B8" : "\u25BE");
        collapseButtonEl.setAttribute("aria-label", collapsed ? "\u5C55\u5F00\u6D88\u606F" : "\u6298\u53E0\u6D88\u606F");
      }
      areAllEntriesCollapsed() {
        const entries = this.getEntryElements();
        return entries.length > 0 && entries.every((entry) => entry.entryEl?.hasClass("is-collapsed"));
      }
      refreshCollapseAllButton() {
        if (!this.collapseAllButtonEl) {
          return;
        }
        const hasEntries = this.hasEntries();
        const shouldExpandAll = this.areAllEntriesCollapsed();
        this.collapseAllButtonEl.disabled = !hasEntries;
        this.collapseAllButtonEl.setText(shouldExpandAll ? "\u5168\u90E8\u5C55\u5F00" : "\u5168\u90E8\u6298\u53E0");
        this.collapseAllButtonEl.setAttribute("aria-label", shouldExpandAll ? "\u5168\u90E8\u5C55\u5F00" : "\u5168\u90E8\u6298\u53E0");
      }
      toggleAllEntriesCollapsed() {
        const entries = this.getEntryElements();
        if (entries.length === 0) {
          return;
        }
        const shouldCollapse = !this.areAllEntriesCollapsed();
        for (const entry of entries) {
          this.setEntryCollapsed(entry.entryEl, entry.collapseButtonEl, shouldCollapse);
        }
        this.refreshCollapseAllButton();
      }
      bindRequestEntry(requestId, entry) {
        this.requestElements.set(requestId, {
          entryEl: entry.entryEl,
          contentEl: entry.contentEl,
          followUpEl: entry.followUpEl,
          collapseButtonEl: entry.collapseButtonEl,
          loadingTextEl: null
        });
      }
      getRequestElements(requestId) {
        return this.requestElements.get(requestId) || null;
      }
      getRequestEntryBodyEl(requestId) {
        return this.getRequestElements(requestId)?.contentEl || null;
      }
      getRequestLoadingTextEl(requestId) {
        return this.getRequestElements(requestId)?.loadingTextEl || null;
      }
      setRequestLoadingTextEl(requestId, loadingTextEl) {
        const entry = this.getRequestElements(requestId);
        if (!entry) {
          return;
        }
        entry.loadingTextEl = loadingTextEl;
      }
      showFollowUp(requestId) {
        this.getRequestElements(requestId)?.followUpEl?.removeClass("is-hidden");
      }
      hideFollowUp(requestId) {
        this.getRequestElements(requestId)?.followUpEl?.addClass("is-hidden");
      }
      removeRequestEntry(requestId) {
        this.requestElements.delete(requestId);
        this.controller.removeRequestEntry(requestId);
        this.refreshCollapseAllButton();
      }
      removeRequestEntryByContentEl(contentEl) {
        for (const [requestId, entry] of this.requestElements.entries()) {
          if (entry.contentEl === contentEl) {
            this.removeRequestEntry(requestId);
            return requestId;
          }
        }
        return null;
      }
      buildRequestEntryOptions() {
        return {
          title: this.options.title,
          scope: this.options.scope,
          sourceFileName: this.options.sourceFileName,
          locateContext: this.options.locateContext,
          onLocate: this.options.onLocate,
          onPopout: this.options.onPopout,
          onFollowUp: this.options.onFollowUp
        };
      }
      createEntry(requestId, entryOptions = this.options) {
        return this.renderer.createEntry(requestId, entryOptions);
      }
      createRequestEntry(requestId, loadingText) {
        const entry = this.createEntry(requestId, this.buildRequestEntryOptions());
        this.bindRequestEntry(requestId, entry);
        this.showLoading(requestId, loadingText);
        this.scrollToBottom();
        this.renderHeaderActions();
        this.renderFooter();
      }
      handleBodyScroll() {
        if (!this.bodyEl) {
          return;
        }
        this.shouldAutoScroll = this.isNearBottom();
      }
      isNearBottom() {
        if (!this.bodyEl) {
          return true;
        }
        const remaining = this.bodyEl.scrollHeight - this.bodyEl.scrollTop - this.bodyEl.clientHeight;
        return remaining <= this.autoScrollThreshold;
      }
      scrollToBottom(force = false) {
        if (!this.bodyEl) {
          return;
        }
        if (!force && !this.shouldAutoScroll) {
          return;
        }
        this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
        this.shouldAutoScroll = true;
      }
      setLoading(text) {
        return this.controller.setLoading(text);
      }
      updateLoadingText(requestId, text) {
        return this.controller.updateLoadingText(requestId, text);
      }
      updateRequestLoadingText(requestId, text) {
        const loadingTextEl = this.getRequestLoadingTextEl(requestId);
        if (!loadingTextEl) {
          return;
        }
        loadingTextEl.setText(text);
        this.scrollToBottom();
      }
      getRequestMarkdown(requestId) {
        return this.controller.getRequestMarkdown(requestId);
      }
      get activeRequestId() {
        return this.controller.getActiveRequestId();
      }
      get rawMarkdown() {
        return this.controller.getRawMarkdown();
      }
      set rawMarkdown(markdown) {
        this.controller.setRawMarkdown(markdown);
      }
      showLoading(requestId, text) {
        const entryBodyEl = this.getRequestEntryBodyEl(requestId);
        if (!entryBodyEl) {
          return null;
        }
        const loadingTextEl = this.renderer.showLoading(entryBodyEl, text);
        this.setRequestLoadingTextEl(requestId, loadingTextEl);
        return loadingTextEl;
      }
      async renderRequestMarkdown(requestId, markdown) {
        const entryBodyEl = this.getRequestEntryBodyEl(requestId);
        if (!entryBodyEl) {
          return;
        }
        await this.renderer.renderMarkdown(entryBodyEl, markdown);
        this.scrollToBottom();
      }
      async completeRequest(requestId, markdown) {
        await this.renderRequestMarkdown(requestId, markdown);
        this.showFollowUp(requestId);
        this.scrollToBottom();
        this.renderHeaderActions();
        this.renderFooter();
      }
      failRequest(requestId, message) {
        this.hideFollowUp(requestId);
        const entryBodyEl = this.getRequestEntryBodyEl(requestId);
        if (!entryBodyEl) {
          return;
        }
        this.renderer.renderError(entryBodyEl, message);
        this.scrollToBottom();
        this.renderHeaderActions();
        this.renderFooter();
      }
      updateStreamingMarkdown(requestId, markdown) {
        return this.controller.updateStreamingMarkdown(requestId, markdown);
      }
      async setMarkdown(requestId, markdown) {
        return this.controller.setMarkdown(requestId, markdown);
      }
      setError(requestId, message) {
        return this.controller.setError(requestId, message);
      }
      async handleContinue() {
        return this.controller.handleContinue();
      }
      handleApply() {
        return this.controller.handleApply();
      }
      setBusy(isBusy) {
        this.isBusy = isBusy;
        this.renderFooter();
      }
    };
    module2.exports = { ReviewResultView: ReviewResultView2 };
  }
});

// src/views/temporaryMarkdownView.js
var require_temporaryMarkdownView = __commonJS({
  "src/views/temporaryMarkdownView.js"(exports2, module2) {
    var { ItemView, MarkdownRenderer, Notice: Notice2, setIcon } = require("obsidian");
    var TEMPORARY_MARKDOWN_VIEW_TYPE2 = "qreview-temporary-markdown-view";
    var TemporaryMarkdownView2 = class extends ItemView {
      constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.pinButtonEl = null;
        this.isAlwaysOnTop = false;
        this.state = {
          title: "\u4E34\u65F6 Markdown",
          markdown: ""
        };
      }
      getViewType() {
        return TEMPORARY_MARKDOWN_VIEW_TYPE2;
      }
      getDisplayText() {
        return this.state.title || "\u4E34\u65F6 Markdown";
      }
      getIcon() {
        return "file-text";
      }
      async onOpen() {
        await this.render();
        this.syncAlwaysOnTopState();
      }
      async onClose() {
        this.contentEl.empty();
      }
      async setContent(state = {}) {
        this.state = {
          ...this.state,
          ...state
        };
        await this.render();
        this.syncAlwaysOnTopState();
      }
      getHostWindow() {
        return this.contentEl?.ownerDocument?.defaultView || null;
      }
      getCurrentBrowserWindow() {
        const hostWindow = this.getHostWindow();
        const electronRequire = typeof hostWindow?.require === "function" && hostWindow.require.bind(hostWindow) || typeof window.require === "function" && window.require.bind(window);
        if (!electronRequire) {
          return null;
        }
        try {
          const electron = electronRequire("electron");
          return electron?.remote?.getCurrentWindow?.() || null;
        } catch (error) {
          console.debug("QuickReview: failed to access current BrowserWindow", error);
          return null;
        }
      }
      syncAlwaysOnTopState() {
        const browserWindow = this.getCurrentBrowserWindow();
        this.isAlwaysOnTop = Boolean(browserWindow?.isAlwaysOnTop?.());
        this.updatePinButtonState();
      }
      updatePinButtonState() {
        if (!this.pinButtonEl) {
          return;
        }
        this.pinButtonEl.toggleClass("is-active", this.isAlwaysOnTop);
        this.pinButtonEl.setAttribute("aria-label", this.isAlwaysOnTop ? "\u53D6\u6D88\u7F6E\u9876\u7A97\u53E3" : "\u7F6E\u9876\u7A97\u53E3");
        this.pinButtonEl.setAttribute("title", this.isAlwaysOnTop ? "\u53D6\u6D88\u7F6E\u9876\u7A97\u53E3" : "\u7F6E\u9876\u7A97\u53E3");
        setIcon(this.pinButtonEl, "pin");
      }
      toggleAlwaysOnTop() {
        const browserWindow = this.getCurrentBrowserWindow();
        if (!browserWindow?.setAlwaysOnTop || !browserWindow?.isAlwaysOnTop) {
          new Notice2("\u5F53\u524D\u73AF\u5883\u6682\u4E0D\u652F\u6301\u7A97\u53E3\u7F6E\u9876\u3002");
          return;
        }
        const nextState = !browserWindow.isAlwaysOnTop();
        try {
          browserWindow.setAlwaysOnTop(nextState);
          this.isAlwaysOnTop = nextState;
          this.updatePinButtonState();
          new Notice2(nextState ? "\u5DF2\u7F6E\u9876\u5F53\u524D\u5F39\u7A97\u3002" : "\u5DF2\u53D6\u6D88\u7F6E\u9876\u5F53\u524D\u5F39\u7A97\u3002");
        } catch (error) {
          console.debug("QuickReview: failed to toggle always-on-top", error);
          new Notice2("\u5207\u6362\u7A97\u53E3\u7F6E\u9876\u5931\u8D25\u3002");
        }
      }
      async render() {
        this.contentEl.empty();
        this.contentEl.addClass("qreview-result-view", "qreview-temporary-markdown-view");
        const viewEl = this.contentEl.createDiv({
          cls: "qreview-view qreview-view--temporary-markdown"
        });
        const bodyEl = viewEl.createDiv({ cls: "qreview-view__body" });
        const bodyInnerEl = bodyEl.createDiv({
          cls: "qreview-view__body-inner qreview-view__body-inner--result"
        });
        const entryEl = bodyInnerEl.createDiv({
          cls: "qreview-view__entry qreview-temporary-markdown-view__entry"
        });
        const metaEl = entryEl.createDiv({ cls: "qreview-view__entry-meta" });
        const metaInfoEl = metaEl.createDiv({ cls: "qreview-view__entry-info" });
        const actionsEl = metaEl.createDiv({ cls: "qreview-view__entry-actions" });
        metaInfoEl.createSpan({
          cls: "qreview-view__entry-title qreview-temporary-markdown-view__title",
          text: this.state.title || "\u4E34\u65F6 Markdown"
        });
        this.pinButtonEl = actionsEl.createEl("button", {
          cls: "qreview-view__entry-icon-button qreview-temporary-markdown-view__pin-button",
          attr: {
            type: "button"
          }
        });
        this.pinButtonEl.addEventListener("click", () => this.toggleAlwaysOnTop());
        this.updatePinButtonState();
        const contentWrapEl = entryEl.createDiv({ cls: "qreview-view__entry-content" });
        const contentEl = contentWrapEl.createDiv({
          cls: "qreview-view__entry-content-body markdown-rendered"
        });
        await MarkdownRenderer.renderMarkdown(
          this.state.markdown || "*\u6682\u65E0\u5185\u5BB9*",
          contentEl,
          "",
          this.plugin
        );
      }
    };
    module2.exports = {
      TemporaryMarkdownView: TemporaryMarkdownView2,
      TEMPORARY_MARKDOWN_VIEW_TYPE: TEMPORARY_MARKDOWN_VIEW_TYPE2
    };
  }
});

// src/settings/settingsStore.js
var require_settingsStore = __commonJS({
  "src/settings/settingsStore.js"(exports2, module2) {
    var { DEFAULT_REVIEW_AGENTS } = require_reviewAgents();
    var {
      DEFAULT_TAVILY_API_URL,
      DEFAULT_TAVILY_MAX_RESULTS
    } = require_webSearchTool();
    var DEFAULT_SETTINGS2 = {
      providerType: "openai",
      apiUrl: "",
      apiKey: "",
      model: "",
      temperature: 0.3,
      maxTokens: 1800,
      customHeaders: "{}",
      responseLanguage: "\u7B80\u4F53\u4E2D\u6587",
      searchApiKey: "",
      searchApiBaseUrl: DEFAULT_TAVILY_API_URL,
      searchMaxResults: DEFAULT_TAVILY_MAX_RESULTS,
      hiddenToolbarButtons: [],
      toolbarActionOrder: [],
      reviewAgents: cloneDefaultAgents()
    };
    function cloneAgent(agent) {
      return {
        ...agent,
        tools: Array.isArray(agent?.tools) ? [...agent.tools] : []
      };
    }
    function parseNumber(value, fallback) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }
    function createEmptyAgent() {
      return {
        id: `agent-${Date.now()}`,
        label: "\u65B0 Agent",
        title: "\u65B0 Agent",
        tools: [],
        systemRole: "",
        focus: ""
      };
    }
    function cloneDefaultAgents() {
      return DEFAULT_REVIEW_AGENTS.map(cloneAgent);
    }
    function normalizeToolbarActionOrder2(order, actions) {
      const actionIds = Array.isArray(actions) ? actions.map((action) => action.id) : [];
      const knownIds = new Set(actionIds);
      const normalized = Array.isArray(order) ? order.filter((id) => knownIds.has(id)) : [];
      for (const id of actionIds) {
        if (!normalized.includes(id)) {
          normalized.push(id);
        }
      }
      return normalized;
    }
    function normalizeSettings2(data, { getSelectionActions: getSelectionActions2 } = {}) {
      const source = data && typeof data === "object" ? data : {};
      const normalized = {
        ...DEFAULT_SETTINGS2,
        ...source
      };
      normalized.hiddenToolbarButtons = Array.isArray(source.hiddenToolbarButtons) ? [...source.hiddenToolbarButtons] : [];
      normalized.reviewAgents = Array.isArray(source.reviewAgents) && source.reviewAgents.length > 0 ? source.reviewAgents.map(cloneAgent) : cloneDefaultAgents();
      const selectionActions = typeof getSelectionActions2 === "function" ? getSelectionActions2(normalized.reviewAgents) : [];
      normalized.toolbarActionOrder = normalizeToolbarActionOrder2(
        source.toolbarActionOrder,
        selectionActions
      );
      return normalized;
    }
    function renameAgentReferences(settings, previousId, nextId) {
      if (!settings || !previousId || previousId === nextId) {
        return settings;
      }
      settings.hiddenToolbarButtons = (settings.hiddenToolbarButtons || []).map(
        (id) => id === previousId ? nextId : id
      );
      settings.toolbarActionOrder = (settings.toolbarActionOrder || []).map(
        (id) => id === previousId ? nextId : id
      );
      return settings;
    }
    function removeAgentReferences(settings, agentId) {
      if (!settings || !agentId) {
        return settings;
      }
      settings.hiddenToolbarButtons = (settings.hiddenToolbarButtons || []).filter(
        (id) => id !== agentId
      );
      settings.toolbarActionOrder = (settings.toolbarActionOrder || []).filter((id) => id !== agentId);
      return settings;
    }
    module2.exports = {
      DEFAULT_SETTINGS: DEFAULT_SETTINGS2,
      cloneDefaultAgents,
      createEmptyAgent,
      normalizeSettings: normalizeSettings2,
      normalizeToolbarActionOrder: normalizeToolbarActionOrder2,
      parseNumber,
      removeAgentReferences,
      renameAgentReferences
    };
  }
});

// src/settings/defaultSection.js
var require_defaultSection = __commonJS({
  "src/settings/defaultSection.js"(exports2, module2) {
    var { Setting } = require("obsidian");
    var { parseNumber } = require_settingsStore();
    var COMMON_RESPONSE_LANGUAGES = [
      "\u7B80\u4F53\u4E2D\u6587",
      "\u7E41\u9AD4\u4E2D\u6587",
      "English",
      "\u65E5\u672C\u8A9E",
      "\uD55C\uAD6D\uC5B4",
      "Fran\xE7ais",
      "Deutsch",
      "Espa\xF1ol",
      "Portugu\xEAs",
      "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
      "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
      "\u0939\u093F\u0928\u094D\u0926\u0940",
      "Italiano",
      "Nederlands",
      "T\xFCrk\xE7e",
      "Ti\u1EBFng Vi\u1EC7t",
      "\u0E44\u0E17\u0E22",
      "Bahasa Indonesia"
    ];
    function createSettingsCard(containerEl, title, description) {
      const cardEl = containerEl.createDiv({ cls: "qreview-settings-card" });
      const headerEl = cardEl.createDiv({ cls: "qreview-settings-card__header" });
      headerEl.createEl("h3", {
        cls: "qreview-settings-card__title",
        text: title
      });
      headerEl.createDiv({
        cls: "qreview-settings-card__description",
        text: description
      });
      return cardEl.createDiv({ cls: "qreview-settings-card__content" });
    }
    function renderResponseLanguageSelect(containerEl, plugin, defaultSettings) {
      const languageSetting = new Setting(containerEl).setName("\u8F93\u51FA\u8BED\u8A00").setDesc("\u70B9\u51FB\u9009\u62E9\u6846\u5C55\u5F00\u5E38\u89C1\u8BED\u8A00\u5217\u8868\uFF0C\u5355\u9009\u540E\u7ACB\u5373\u4FDD\u5B58\u3002");
      const getLanguageValue = () => plugin.settings.responseLanguage?.trim() || defaultSettings.responseLanguage;
      const getLanguageOptions = () => {
        const currentValue = getLanguageValue();
        const hasCurrentValue = COMMON_RESPONSE_LANGUAGES.includes(currentValue);
        if (hasCurrentValue) {
          return COMMON_RESPONSE_LANGUAGES;
        }
        return [currentValue, ...COMMON_RESPONSE_LANGUAGES];
      };
      const wrapperEl = languageSetting.controlEl.createDiv({
        cls: "qreview-single-select"
      });
      wrapperEl.style.position = "relative";
      const triggerEl = wrapperEl.createEl("button", {
        cls: "qreview-single-select__trigger",
        attr: { type: "button" }
      });
      const summaryEl = triggerEl.createEl("span", {
        cls: "qreview-single-select__summary",
        text: getLanguageValue()
      });
      const caretEl = triggerEl.createEl("span", {
        cls: "qreview-single-select__caret",
        text: "\u25BC"
      });
      const menuEl = wrapperEl.createDiv({
        cls: "qreview-single-select__menu"
      });
      let isOpen = false;
      let detachOutsideClick = null;
      const closeMenu = () => {
        if (!isOpen) {
          return;
        }
        isOpen = false;
        menuEl.style.display = "none";
        caretEl.textContent = "\u25BC";
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
        caretEl.textContent = "\u25B2";
        const handleOutsideClick = (event) => {
          if (!wrapperEl.contains(event.target)) {
            closeMenu();
          }
        };
        document.addEventListener("click", handleOutsideClick);
        detachOutsideClick = () => document.removeEventListener("click", handleOutsideClick);
      };
      const renderOptions = () => {
        const currentValue = getLanguageValue();
        menuEl.empty();
        getLanguageOptions().forEach((language) => {
          const optionLabelEl = menuEl.createEl("label", {
            cls: "qreview-single-select__option"
          });
          const radioEl = optionLabelEl.createEl("input", {
            type: "radio",
            attr: { name: "qreview-response-language" }
          });
          radioEl.checked = language === currentValue;
          optionLabelEl.createEl("span", {
            cls: "qreview-single-select__option-name",
            text: language
          });
          radioEl.addEventListener("click", (event) => {
            event.stopPropagation();
          });
          radioEl.addEventListener("change", async () => {
            if (!radioEl.checked) {
              return;
            }
            plugin.settings.responseLanguage = language;
            summaryEl.textContent = language;
            await plugin.saveSettings();
            renderOptions();
            closeMenu();
          });
        });
      };
      triggerEl.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isOpen) {
          closeMenu();
          return;
        }
        renderOptions();
        openMenu();
      });
      renderOptions();
    }
    function renderDefaultSection(containerEl, context) {
      const { plugin, defaultSettings } = context;
      const llmCardEl = createSettingsCard(
        containerEl,
        "LLM API \u914D\u7F6E",
        "\u7BA1\u7406\u6A21\u578B\u670D\u52A1\u7684\u8FDE\u63A5\u4FE1\u606F\u3001\u6A21\u578B\u53C2\u6570\u4E0E\u8F93\u51FA\u884C\u4E3A\u3002"
      );
      const tavilyCardEl = createSettingsCard(
        containerEl,
        "Tavily API \u914D\u7F6E",
        "\u7BA1\u7406\u8054\u7F51\u641C\u7D22\u6240\u9700\u7684 Tavily \u63A5\u53E3\u53C2\u6570\u3002"
      );
      new Setting(llmCardEl).setName("API \u7C7B\u578B").setDesc("\u9009\u62E9\u5F53\u524D\u63A5\u5165\u7684\u6A21\u578B API \u534F\u8BAE\u3002").addDropdown(
        (dropdown) => dropdown.addOption("openai", "OpenAI \u517C\u5BB9").addOption("anthropic", "Anthropic Messages").setValue(plugin.settings.providerType).onChange(async (value) => {
          plugin.settings.providerType = value;
          await plugin.saveSettings();
        })
      );
      new Setting(llmCardEl).setName("API URL").setDesc("\u586B\u5199\u5B8C\u6574\u63A5\u53E3\u5730\u5740\u3002\u914D\u7F6E\u4F1A\u4FDD\u5B58\u5728\u63D2\u4EF6 data.json \u4E2D\u3002").addText(
        (text) => text.setPlaceholder("https://your-api-endpoint").setValue(plugin.settings.apiUrl).onChange(async (value) => {
          plugin.settings.apiUrl = value.trim();
          await plugin.saveSettings();
        })
      );
      new Setting(llmCardEl).setName("API Key").setDesc("\u7528\u4E8E\u8C03\u7528\u6A21\u578B\u63A5\u53E3\u3002").addText(
        (text) => text.setPlaceholder("sk-...").setValue(plugin.settings.apiKey).onChange(async (value) => {
          plugin.settings.apiKey = value.trim();
          await plugin.saveSettings();
        })
      );
      new Setting(llmCardEl).setName("\u6A21\u578B\u540D\u79F0").setDesc("\u4F8B\u5982 deepseek-v4-flash \u6216\u5176\u4ED6\u4F60\u63A5\u5165\u7684\u6A21\u578B\u540D\u3002").addText(
        (text) => text.setPlaceholder("deepseek-v4-flash").setValue(plugin.settings.model).onChange(async (value) => {
          plugin.settings.model = value.trim();
          await plugin.saveSettings();
        })
      );
      new Setting(llmCardEl).setName("Temperature").setDesc("\u5EFA\u8BAE 0.1 - 0.5\uFF0C\u7528\u4E8E\u63A7\u5236\u8F93\u51FA\u53D1\u6563\u7A0B\u5EA6\u3002").addText(
        (text) => text.setPlaceholder("0.3").setValue(String(plugin.settings.temperature)).onChange(async (value) => {
          plugin.settings.temperature = parseNumber(value, defaultSettings.temperature);
          await plugin.saveSettings();
        })
      );
      new Setting(llmCardEl).setName("\u6700\u5927\u8F93\u51FA Tokens").setDesc("\u9650\u5236\u6BCF\u6B21\u7ED3\u679C\u957F\u5EA6\u3002").addText(
        (text) => text.setPlaceholder("1800").setValue(String(plugin.settings.maxTokens)).onChange(async (value) => {
          plugin.settings.maxTokens = parseNumber(value, defaultSettings.maxTokens);
          await plugin.saveSettings();
        })
      );
      new Setting(llmCardEl).setName("\u81EA\u5B9A\u4E49 Headers").setDesc("\u989D\u5916\u8BF7\u6C42\u5934\uFF0C\u4F7F\u7528 JSON \u683C\u5F0F\u3002").addTextArea((text) => {
        text.inputEl.rows = 6;
        text.setPlaceholder('{"x-api-version":"2024-01-01"}').setValue(plugin.settings.customHeaders).onChange(async (value) => {
          plugin.settings.customHeaders = value.trim() || "{}";
          await plugin.saveSettings();
        });
      });
      renderResponseLanguageSelect(llmCardEl, plugin, defaultSettings);
      new Setting(tavilyCardEl).setName("Tavily API Key").setDesc("\u7528\u4E8E\u8054\u7F51\u641C\u7D22\u3002\u7559\u7A7A\u65F6\u5C06\u5C1D\u8BD5\u4F7F\u7528 Tavily keyless \u6A21\u5F0F\u3002").addText(
        (text) => text.setPlaceholder("tvly-...").setValue(plugin.settings.searchApiKey || "").onChange(async (value) => {
          plugin.settings.searchApiKey = value.trim();
          await plugin.saveSettings();
        })
      );
      new Setting(tavilyCardEl).setName("Tavily API URL").setDesc("\u9ED8\u8BA4\u4F7F\u7528 Tavily \u5B98\u65B9 search \u63A5\u53E3\u3002").addText(
        (text) => text.setPlaceholder("https://api.tavily.com/search").setValue(plugin.settings.searchApiBaseUrl || "").onChange(async (value) => {
          plugin.settings.searchApiBaseUrl = value.trim();
          await plugin.saveSettings();
        })
      );
      new Setting(tavilyCardEl).setName("\u8054\u7F51\u641C\u7D22\u7ED3\u679C\u6570").setDesc("\u5EFA\u8BAE 3 - 5 \u6761\uFF0C\u8FC7\u591A\u4F1A\u589E\u52A0 token \u6D88\u8017\u3002").addText(
        (text) => text.setPlaceholder("5").setValue(String(plugin.settings.searchMaxResults ?? 5)).onChange(async (value) => {
          plugin.settings.searchMaxResults = parseNumber(value, 5);
          await plugin.saveSettings();
        })
      );
    }
    module2.exports = {
      renderDefaultSection
    };
  }
});

// src/settings/agentConfigUtils.js
var require_agentConfigUtils = __commonJS({
  "src/settings/agentConfigUtils.js"(exports2, module2) {
    function getAvailableAgentTools() {
      return [
        {
          id: "current-date",
          name: "\u5F53\u524D\u65E5\u671F",
          description: "\u5141\u8BB8 Agent \u83B7\u53D6\u5F53\u524D\u672C\u5730\u65E5\u671F\u3001\u661F\u671F\u3001\u65F6\u533A\u4E0E UTC \u504F\u79FB\u3002"
        },
        {
          id: "web-search",
          name: "\u8054\u7F51\u641C\u7D22",
          description: "\u5141\u8BB8 Agent \u8054\u7F51\u68C0\u7D22\u6700\u65B0\u516C\u5F00\u4FE1\u606F\u3002\u5F53\u524D\u4E3A\u53EF\u63A5\u5165\u9AA8\u67B6\uFF0C\u9700\u5728\u4EE3\u7801\u4E2D\u914D\u7F6E\u771F\u5B9E\u641C\u7D22\u5B9E\u73B0\u3002"
        }
      ];
    }
    function extractJsonObject(text) {
      if (typeof text !== "string") {
        throw new Error("AI \u6CA1\u6709\u8FD4\u56DE\u53EF\u89E3\u6790\u7684\u6587\u672C\u3002");
      }
      const trimmed = text.trim();
      const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      const candidate = fencedMatch ? fencedMatch[1].trim() : trimmed;
      try {
        return JSON.parse(candidate);
      } catch (_error) {
        const start = candidate.indexOf("{");
        const end = candidate.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          return JSON.parse(candidate.slice(start, end + 1));
        }
        throw new Error("AI \u8FD4\u56DE\u5185\u5BB9\u4E0D\u662F\u5408\u6CD5 JSON\u3002");
      }
    }
    function sanitizeAgentId(value) {
      return String(value || "").trim().toLowerCase().replace(/[^a-z0-9-_\s]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
    }
    function normalizeGeneratedAgent(data) {
      const toolOptions = new Set(getAvailableAgentTools().map((tool) => tool.id));
      const normalizedTools = Array.isArray(data?.tools) ? data.tools.filter((toolId) => typeof toolId === "string" && toolOptions.has(toolId)) : [];
      const id = sanitizeAgentId(data?.id);
      return {
        id,
        label: String(data?.label || "").trim(),
        title: String(data?.title || "").trim(),
        tools: normalizedTools,
        systemRole: String(data?.systemRole || "").trim(),
        focus: String(data?.focus || "").trim()
      };
    }
    function finalizeGeneratedAgent(generatedAgent, existingAgents = []) {
      if (!generatedAgent?.id) {
        throw new Error("AI \u751F\u6210\u7ED3\u679C\u7F3A\u5C11\u5408\u6CD5\u7684 id\u3002");
      }
      const idExists = existingAgents.some((agent) => agent.id === generatedAgent.id);
      if (idExists) {
        throw new Error(`AI \u751F\u6210\u7684 id "${generatedAgent.id}" \u5DF2\u5B58\u5728\uFF0C\u8BF7\u91CD\u8BD5\u3002`);
      }
      return {
        ...generatedAgent,
        label: generatedAgent.label || generatedAgent.id,
        title: generatedAgent.title || generatedAgent.label || generatedAgent.id,
        tools: Array.isArray(generatedAgent.tools) ? [...generatedAgent.tools] : []
      };
    }
    module2.exports = {
      extractJsonObject,
      finalizeGeneratedAgent,
      getAvailableAgentTools,
      normalizeGeneratedAgent,
      sanitizeAgentId
    };
  }
});

// src/settings/agentAIGeneratorModal.js
var require_agentAIGeneratorModal = __commonJS({
  "src/settings/agentAIGeneratorModal.js"(exports2, module2) {
    var { Modal, Notice: Notice2, Setting } = require("obsidian");
    var AgentAIGeneratorModal = class extends Modal {
      constructor(app, options = {}) {
        super(app);
        this.onSubmit = options.onSubmit;
        this.prompt = "";
        this.isGenerating = false;
      }
      onOpen() {
        const { contentEl, titleEl } = this;
        titleEl.setText("AI \u751F\u6210 Agent");
        contentEl.empty();
        new Setting(contentEl).setName("\u9700\u6C42\u63CF\u8FF0").setDesc("\u7B80\u5355\u8BF4\u660E\u4F60\u60F3\u8981\u54EA\u79CD\u7C7B\u578B\u7684 Agent\uFF0C\u4F8B\u5982\u7528\u9014\u3001\u98CE\u683C\u3001\u662F\u5426\u9700\u8981\u8054\u7F51\u3002").addTextArea((text) => {
          text.inputEl.rows = 6;
          text.setPlaceholder("\u4F8B\u5982\uFF1A\u6211\u60F3\u8981\u4E00\u4E2A\u66F4\u4E25\u683C\u7684\u8BBA\u6587\u5BA1\u7A3F Agent\uFF0C\u91CD\u70B9\u68C0\u67E5\u903B\u8F91\u6F0F\u6D1E\u3001\u672F\u8BED\u8BEF\u7528\uFF0C\u5E76\u5C3D\u91CF\u7ED9\u51FA\u53EF\u64CD\u4F5C\u4FEE\u6539\u5EFA\u8BAE\u3002").setValue(this.prompt).onChange((value) => {
            this.prompt = value.trim();
          });
          text.inputEl.focus();
        });
        const footerEl = contentEl.createDiv({ cls: "modal-button-container" });
        const cancelButton = footerEl.createEl("button", { text: "\u53D6\u6D88", attr: { type: "button" } });
        const submitButton = footerEl.createEl("button", {
          text: "\u751F\u6210",
          cls: "mod-cta",
          attr: { type: "button" }
        });
        const setGenerating = (isGenerating) => {
          this.isGenerating = isGenerating;
          cancelButton.disabled = isGenerating;
          submitButton.disabled = isGenerating;
          submitButton.setText(isGenerating ? "\u751F\u6210\u4E2D..." : "\u751F\u6210");
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
            new Notice2("\u8BF7\u5148\u63CF\u8FF0\u60F3\u8981\u7684 Agent \u7C7B\u578B\u3002");
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
    };
    module2.exports = {
      AgentAIGeneratorModal
    };
  }
});

// src/settings/agentToolMultiSelect.js
var require_agentToolMultiSelect = __commonJS({
  "src/settings/agentToolMultiSelect.js"(exports2, module2) {
    var { Setting } = require("obsidian");
    var { getAvailableAgentTools } = require_agentConfigUtils();
    function renderAgentToolMultiSelect(containerEl, agent, plugin, options = {}) {
      const { onChange, onReady } = options;
      const toolOptions = getAvailableAgentTools();
      const toolsSetting = new Setting(containerEl).setName("\u5DE5\u5177").setDesc(
        toolOptions.length ? "\u70B9\u51FB\u9009\u62E9\u6846\u5C55\u5F00\u5DE5\u5177\u5217\u8868\uFF0C\u652F\u6301\u591A\u9009\u3002" : "\u5F53\u524D\u6CA1\u6709\u53EF\u914D\u7F6E\u7684\u5DE5\u5177\u3002"
      );
      if (!toolOptions.length) {
        return;
      }
      const getSelectedTools = () => Array.isArray(agent.tools) ? agent.tools : [];
      const getSummaryText = () => {
        const selectedIds = getSelectedTools();
        const selectedNames = toolOptions.filter((tool) => selectedIds.includes(tool.id)).map((tool) => tool.name);
        return selectedNames.length ? selectedNames.join("\u3001") : "\u8BF7\u9009\u62E9\u5DE5\u5177";
      };
      const wrapperEl = toolsSetting.controlEl.createDiv({
        cls: "qreview-agent-tools-select"
      });
      wrapperEl.style.position = "relative";
      const triggerEl = wrapperEl.createEl("button", {
        cls: "qreview-agent-tools-select__trigger",
        attr: { type: "button" }
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
        cls: "qreview-agent-tools-select__summary"
      });
      const caretEl = triggerEl.createEl("span", {
        text: "\u25BC",
        cls: "qreview-agent-tools-select__caret"
      });
      const menuEl = wrapperEl.createDiv({
        cls: "qreview-agent-tools-select__menu"
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
        caretEl.textContent = "\u25BC";
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
        caretEl.textContent = "\u25B2";
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
          cls: "qreview-agent-tools-select__option-text"
        });
        textWrapEl.createEl("span", {
          text: tool.name,
          cls: "qreview-agent-tools-select__option-name"
        });
        textWrapEl.createEl("small", {
          text: tool.description,
          cls: "setting-item-description"
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
    module2.exports = {
      renderAgentToolMultiSelect
    };
  }
});

// src/settings/addAgentModal.js
var require_addAgentModal = __commonJS({
  "src/settings/addAgentModal.js"(exports2, module2) {
    var { Modal, Notice: Notice2, Setting } = require("obsidian");
    var {
      extractJsonObject,
      finalizeGeneratedAgent,
      getAvailableAgentTools,
      normalizeGeneratedAgent
    } = require_agentConfigUtils();
    var { AgentAIGeneratorModal } = require_agentAIGeneratorModal();
    var { renderAgentToolMultiSelect } = require_agentToolMultiSelect();
    var { createEmptyAgent } = require_settingsStore();
    var AddAgentModal = class extends Modal {
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
        const toolDescriptions = getAvailableAgentTools().map((tool) => `- ${tool.id}: ${tool.name}\u3002${tool.description}`).join("\n");
        const existingIds = (this.plugin.settings.reviewAgents || []).map((agent) => agent.id).filter(Boolean).join(", ");
        const userPrompt = [
          "\u8BF7\u6839\u636E\u4E0B\u9762\u7684\u9700\u6C42\uFF0C\u751F\u6210\u4E00\u4E2A\u7528\u4E8E\u4E2D\u6587\u5199\u4F5C\u5BA1\u9605\u63D2\u4EF6\u7684 Agent \u914D\u7F6E\u3002",
          "\u9700\u6C42\uFF1A",
          userDescription,
          "",
          "\u53EF\u9009 tools\uFF1A",
          toolDescriptions || "- \u65E0",
          "",
          `\u73B0\u6709 Agent id\uFF1A${existingIds || "\u65E0"}`,
          "",
          "\u8BF7\u53EA\u8FD4\u56DE\u4E00\u4E2A JSON \u5BF9\u8C61\uFF0C\u4E0D\u8981\u8F93\u51FA\u89E3\u91CA\uFF0C\u4E0D\u8981\u4F7F\u7528 Markdown \u4EE3\u7801\u5757\u3002\u5B57\u6BB5\u8981\u6C42\uFF1A",
          "- id: \u82F1\u6587\u3001\u5C0F\u5199\u3001\u77ED\u6A2A\u7EBF\u98CE\u683C\uFF0C\u4E14\u4E0D\u8981\u4E0E\u73B0\u6709 id \u91CD\u590D",
          "- label: 2 \u5230 6 \u4E2A\u5B57\u7684\u4E2D\u6587\u77ED\u6807\u7B7E",
          "- title: \u6E05\u6670\u7684\u4E2D\u6587\u89D2\u8272\u540D",
          "- systemRole: \u8BE6\u7EC6\u89D2\u8272\u8BBE\u5B9A\uFF0C\u9002\u5408\u76F4\u63A5\u4F5C\u4E3A\u7CFB\u7EDF\u63D0\u793A\u8BCD",
          "- focus: \u8BE6\u7EC6\u5BA1\u9605\u91CD\u70B9\uFF0C\u9002\u5408\u76F4\u63A5\u4F5C\u4E3A\u7528\u6237\u63D0\u793A\u8BCD\u7684\u4E00\u90E8\u5206",
          '- tools: \u6570\u7EC4\uFF0C\u53EA\u80FD\u4ECE\u53EF\u9009 tools \u7684 id \u4E2D\u9009\u62E9\uFF0C\u4F8B\u5982 ["web-search"]'
        ].join("\n");
        const result = await this.plugin.reviewService.callModel({
          systemPrompt: "\u4F60\u662F\u4E00\u540D Agent \u8BBE\u8BA1\u52A9\u624B\uFF0C\u64C5\u957F\u6839\u636E\u9700\u6C42\u751F\u6210\u7ED3\u6784\u5316\u7684\u4E2D\u6587\u5BA1\u9605 Agent \u914D\u7F6E\u3002\u8F93\u51FA\u5FC5\u987B\u662F\u5408\u6CD5 JSON \u5BF9\u8C61\u3002",
          userPrompt
        });
        const generatedAgent = finalizeGeneratedAgent(
          normalizeGeneratedAgent(extractJsonObject(result)),
          this.plugin.settings.reviewAgents || []
        );
        this.agent = {
          ...this.agent,
          ...generatedAgent,
          tools: [...generatedAgent.tools]
        };
        this.updateFormValues();
      }
      onOpen() {
        const { contentEl, titleEl } = this;
        titleEl.setText("\u65B0\u589E Agent");
        contentEl.empty();
        new Setting(contentEl).setName("id").setDesc("\u547D\u4EE4\u548C\u52A8\u4F5C\u7684\u552F\u4E00\u6807\u8BC6\uFF0C\u5EFA\u8BAE\u4F7F\u7528\u82F1\u6587\u77ED\u6A2A\u7EBF\u3002").addText((text) => {
          this.formControls.id = text;
          text.setPlaceholder("fact-check").setValue(this.agent.id).onChange((value) => {
            this.agent.id = value.trim();
          });
        });
        new Setting(contentEl).setName("label").setDesc("\u663E\u793A\u5728\u6309\u94AE\u548C\u547D\u4EE4\u540D\u79F0\u4E2D\u7684\u77ED\u6807\u7B7E\u3002").addText((text) => {
          this.formControls.label = text;
          text.setPlaceholder("\u4E8B\u5B9E").setValue(this.agent.label).onChange((value) => {
            this.agent.label = value.trim();
          });
        });
        new Setting(contentEl).setName("title").setDesc("\u7ED3\u679C\u9875\u6807\u9898\u548C\u63D0\u793A\u8BCD\u4E2D\u7684\u89D2\u8272\u540D\u3002").addText((text) => {
          this.formControls.title = text;
          text.setPlaceholder("\u4E8B\u5B9E\u6838\u9A8C").setValue(this.agent.title).onChange((value) => {
            this.agent.title = value.trim();
          });
        });
        renderAgentToolMultiSelect(contentEl, this.agent, this.plugin, {
          onChange: (tools) => {
            this.agent.tools = Array.isArray(tools) ? [...tools] : [];
          },
          onReady: (updateSummary) => {
            this.toolSummaryUpdater = updateSummary;
          }
        });
        new Setting(contentEl).setName("systemRole").setDesc("\u4F5C\u4E3A\u7CFB\u7EDF\u63D0\u793A\u8BCD\u4F20\u7ED9\u6A21\u578B\u7684\u89D2\u8272\u8BBE\u5B9A\u3002").addTextArea((text) => {
          this.formControls.systemRole = text;
          text.inputEl.rows = 4;
          text.setPlaceholder("\u4F60\u662F\u4E00\u540D\u4E25\u8C28\u7684\u4E8B\u5B9E\u6838\u9A8C\u7F16\u8F91...").setValue(this.agent.systemRole).onChange((value) => {
            this.agent.systemRole = value.trim();
          });
        });
        new Setting(contentEl).setName("focus").setDesc("\u7528\u4E8E\u6784\u9020\u7528\u6237\u63D0\u793A\u8BCD\u7684\u5BA1\u9605\u91CD\u70B9\u3002").addTextArea((text) => {
          this.formControls.focus = text;
          text.inputEl.rows = 4;
          text.setPlaceholder("\u4F18\u5148\u6307\u51FA\u4E8B\u5B9E\u9519\u8BEF\u3001\u6982\u5FF5\u8BEF\u7528...").setValue(this.agent.focus).onChange((value) => {
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
          text: "AI\u751F\u6210",
          attr: { type: "button" }
        });
        const cancelButton = footerEl.createEl("button", { text: "\u53D6\u6D88", attr: { type: "button" } });
        rightActionsEl.appendChild(cancelButton);
        const submitButton = rightActionsEl.createEl("button", {
          text: "\u4FDD\u5B58",
          cls: "mod-cta",
          attr: { type: "button" }
        });
        const setGenerating = (isGenerating) => {
          this.isGenerating = isGenerating;
          generateButton.disabled = isGenerating;
          cancelButton.disabled = isGenerating;
          submitButton.disabled = isGenerating;
          generateButton.setText(isGenerating ? "AI\u751F\u6210\u4E2D..." : "AI\u751F\u6210");
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
                new Notice2("\u5DF2\u6839\u636E\u63CF\u8FF0\u586B\u5145 Agent \u5B57\u6BB5\u3002");
              } catch (error) {
                new Notice2(error.message || "AI \u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6A21\u578B\u914D\u7F6E\u540E\u91CD\u8BD5\u3002");
                throw error;
              } finally {
                setGenerating(false);
              }
            }
          }).open();
        });
        cancelButton.addEventListener("click", () => this.close());
        submitButton.addEventListener("click", async () => {
          if (this.isGenerating) {
            return;
          }
          const nextId = (this.agent.id || "").trim();
          if (!nextId) {
            new Notice2("\u8BF7\u586B\u5199 Agent id\u3002");
            return;
          }
          const idExists = (this.plugin.settings.reviewAgents || []).some((agent) => agent.id === nextId);
          if (idExists) {
            new Notice2(`Agent id "${nextId}" \u5DF2\u5B58\u5728\uFF0C\u8BF7\u66F4\u6362\u3002`);
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
              tools: Array.isArray(this.agent.tools) ? [...this.agent.tools] : []
            });
          }
          this.close();
        });
      }
      onClose() {
        this.contentEl.empty();
      }
    };
    module2.exports = {
      AddAgentModal
    };
  }
});

// src/settings/agentSection.js
var require_agentSection = __commonJS({
  "src/settings/agentSection.js"(exports2, module2) {
    var { Setting, setIcon } = require("obsidian");
    var {
      extractJsonObject,
      finalizeGeneratedAgent,
      normalizeGeneratedAgent,
      sanitizeAgentId
    } = require_agentConfigUtils();
    var { AddAgentModal } = require_addAgentModal();
    var { renderAgentToolMultiSelect } = require_agentToolMultiSelect();
    var {
      cloneDefaultAgents,
      removeAgentReferences,
      renameAgentReferences
    } = require_settingsStore();
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
          "aria-label": "\u56DE\u5230\u9875\u9762\u9876\u90E8"
        }
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
            "data-agent-anchor": anchorId
          }
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
          "aria-label": "\u65B0\u589E Agent"
        }
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
        syncToolbarActionOrder
      } = context;
      syncToolbarActionOrder();
      const agents = plugin.settings.reviewAgents || [];
      const openAddAgentModal = () => {
        new AddAgentModal(app, plugin, {
          onSubmit: async (agent) => {
            plugin.settings.reviewAgents = [...plugin.settings.reviewAgents || [], agent];
            await saveAndRefresh();
          }
        }).open();
      };
      const actionRowEl = containerEl.createDiv();
      actionRowEl.style.display = "flex";
      actionRowEl.style.flexWrap = "wrap";
      actionRowEl.style.gap = "8px";
      actionRowEl.style.marginBottom = "16px";
      const resetButton = actionRowEl.createEl("button", {
        text: "\u6062\u590D\u9ED8\u8BA4"
      });
      resetButton.addEventListener("click", async () => {
        plugin.settings.reviewAgents = cloneDefaultAgents();
        plugin.settings.hiddenToolbarButtons = (plugin.settings.hiddenToolbarButtons || []).filter(
          (id) => id === "all-review" || id === "polish"
        );
        plugin.settings.toolbarActionOrder = plugin.normalizeToolbarActionOrder(
          [],
          plugin.getSelectionActions()
        );
        await saveAndRefresh();
      });
      const allCollapsed = agents.length > 0 && agents.every((agent, index) => collapsedAgentIds.has(getAgentCollapseKey(agent, index)));
      const collapseAllButton = actionRowEl.createEl("button", {
        text: allCollapsed ? "\u5168\u90E8\u5C55\u5F00" : "\u4E00\u952E\u6298\u53E0"
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
          attr: { id: anchorId }
        });
        cardEl.style.scrollMarginTop = "108px";
        cardEntries.push({ agent, index, cardEl, anchorId });
        const headerEl = cardEl.createDiv({ cls: "qreview-agent-card__header" });
        const titleWrapEl = headerEl.createDiv({ cls: "qreview-agent-card__title-wrap" });
        const titleRowEl = titleWrapEl.createDiv({ cls: "qreview-agent-card__title-row" });
        const collapseKey = getAgentCollapseKey(agent, index);
        titleRowEl.createEl("h4", {
          text: agent.label || agent.title || `Agent ${index + 1}`,
          cls: "qreview-agent-card__title"
        });
        titleRowEl.createEl("div", {
          text: agent.id || "\u672A\u8BBE\u7F6E id",
          cls: "qreview-agent-card__subtitle"
        });
        const actionsEl = headerEl.createDiv({ cls: "qreview-agent-card__actions" });
        const contentEl = cardEl.createDiv({ cls: "qreview-agent-card__content" });
        const isCollapsed = collapsedAgentIds.has(collapseKey);
        const collapseButton = actionsEl.createEl("button", {
          cls: "qreview-agent-card__action-button qreview-agent-card__action-button--icon",
          attr: {
            type: "button",
            "aria-label": isCollapsed ? "\u5C55\u5F00 Agent" : "\u6298\u53E0 Agent"
          }
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
            "aria-label": "\u5220\u9664 Agent"
          }
        });
        setIcon(deleteButton, "trash-2");
        deleteButton.addEventListener("click", async () => {
          collapsedAgentIds.delete(collapseKey);
          plugin.settings.reviewAgents = (plugin.settings.reviewAgents || []).filter(
            (_, currentIndex) => currentIndex !== index
          );
          removeAgentReferences(plugin.settings, agent.id);
          await saveAndRefresh();
        });
        if (isCollapsed) {
          cardEl.addClass("is-collapsed");
        }
        new Setting(contentEl).setName("id").setDesc("\u547D\u4EE4\u548C\u52A8\u4F5C\u7684\u552F\u4E00\u6807\u8BC6\uFF0C\u5EFA\u8BAE\u4F7F\u7528\u82F1\u6587\u77ED\u6A2A\u7EBF\u3002").addText(
          (text) => text.setPlaceholder("fact-check").setValue(agent.id || "").onChange(async (value) => {
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
          })
        );
        new Setting(contentEl).setName("label").setDesc("\u663E\u793A\u5728\u6309\u94AE\u548C\u547D\u4EE4\u540D\u79F0\u4E2D\u7684\u77ED\u6807\u7B7E\u3002").addText(
          (text) => text.setPlaceholder("\u4E8B\u5B9E").setValue(agent.label || "").onChange(async (value) => {
            agent.label = value.trim();
            await plugin.saveSettings();
            refreshToolbarButtons();
          })
        );
        new Setting(contentEl).setName("title").setDesc("\u7ED3\u679C\u9875\u6807\u9898\u548C\u63D0\u793A\u8BCD\u4E2D\u7684\u89D2\u8272\u540D\u3002").addText(
          (text) => text.setPlaceholder("\u4E8B\u5B9E\u6838\u9A8C").setValue(agent.title || "").onChange(async (value) => {
            agent.title = value.trim();
            await plugin.saveSettings();
            refreshToolbarButtons();
          })
        );
        renderAgentToolMultiSelect(contentEl, agent, plugin);
        new Setting(contentEl).setName("systemRole").setDesc("\u4F5C\u4E3A\u7CFB\u7EDF\u63D0\u793A\u8BCD\u4F20\u7ED9\u6A21\u578B\u7684\u89D2\u8272\u8BBE\u5B9A\u3002").addTextArea((text) => {
          text.inputEl.rows = 4;
          text.setPlaceholder("\u4F60\u662F\u4E00\u540D\u4E25\u8C28\u7684\u4E8B\u5B9E\u6838\u9A8C\u7F16\u8F91...").setValue(agent.systemRole || "").onChange(async (value) => {
            agent.systemRole = value.trim();
            await plugin.saveSettings();
          });
        });
        new Setting(contentEl).setName("focus").setDesc("\u7528\u4E8E\u6784\u9020\u7528\u6237\u63D0\u793A\u8BCD\u7684\u5BA1\u9605\u91CD\u70B9\u3002").addTextArea((text) => {
          text.inputEl.rows = 4;
          text.setPlaceholder("\u4F18\u5148\u6307\u51FA\u4E8B\u5B9E\u9519\u8BEF\u3001\u6982\u5FF5\u8BEF\u7528...").setValue(agent.focus || "").onChange(async (value) => {
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
    module2.exports = {
      extractJsonObject,
      finalizeGeneratedAgent,
      normalizeGeneratedAgent,
      renderAgentSection,
      sanitizeAgentId
    };
  }
});

// src/settings/toolbarSection.js
var require_toolbarSection = __commonJS({
  "src/settings/toolbarSection.js"(exports2, module2) {
    var { Setting } = require("obsidian");
    function renderToolbarSection(containerEl, context) {
      const { plugin, saveAndRefresh, syncToolbarActionOrder } = context;
      containerEl.createEl("p", {
        text: "\u63A7\u5236\u5728\u9009\u4E2D\u6587\u672C\u65F6\u5F39\u51FA\u7684\u4E0A\u4E0B\u6587\u83DC\u5355\u4E2D\u663E\u793A\u54EA\u4E9B\u6309\u94AE\u3002",
        cls: "setting-item-description"
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
        const setting = new Setting(containerEl).setName(action.label).setDesc(action.id).addToggle((toggle) => {
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
          button.setTooltip("\u62D6\u52A8\u6392\u5E8F");
          button.extraSettingsEl.addClass("qreview-sort-handle");
        });
      }
    }
    module2.exports = {
      renderToolbarSection
    };
  }
});

// src/settings/settingTab.js
var require_settingTab = __commonJS({
  "src/settings/settingTab.js"(exports2, module2) {
    var { renderDefaultSection } = require_defaultSection();
    var { renderAgentSection } = require_agentSection();
    var { renderToolbarSection } = require_toolbarSection();
    var { PluginSettingTab } = require("obsidian");
    var QuickReviewSettingTab2 = class extends PluginSettingTab {
      constructor(app, plugin, helpers) {
        super(app, plugin);
        this.plugin = plugin;
        this.DEFAULT_SETTINGS = helpers.DEFAULT_SETTINGS;
        this.getSelectionActions = helpers.getSelectionActions;
        this.activeTab = "default";
        this.collapsedAgentIds = /* @__PURE__ */ new Set();
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
          this.plugin.getSelectionActions()
        );
      }
      setActiveTab(tab) {
        this.activeTab = tab;
        this.display();
      }
      createTabButton(containerEl, id, label) {
        const button = containerEl.createEl("button", {
          text: label,
          cls: `qreview-settings-tab${this.activeTab === id ? " is-active" : ""}`
        });
        button.setAttribute("aria-selected", this.activeTab === id ? "true" : "false");
        button.addEventListener("click", () => this.setActiveTab(id));
      }
      renderDefaultSettings(containerEl) {
        return renderDefaultSection(containerEl, {
          plugin: this.plugin,
          defaultSettings: this.DEFAULT_SETTINGS
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
          syncToolbarActionOrder: this.syncToolbarActionOrder.bind(this)
        });
      }
      renderContextMenuSettings(containerEl) {
        return renderToolbarSection(containerEl, {
          plugin: this.plugin,
          saveAndRefresh: this.saveAndRefresh.bind(this),
          syncToolbarActionOrder: this.syncToolbarActionOrder.bind(this)
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
        containerEl.createEl("h2", { text: "QuickReview \u8BBE\u7F6E" });
        const tabBarEl = containerEl.createDiv({ cls: "qreview-settings-tabs" });
        this.createTabButton(tabBarEl, "default", "\u9ED8\u8BA4\u8BBE\u7F6E");
        this.createTabButton(tabBarEl, "agents", "Agent\u914D\u7F6E");
        this.createTabButton(tabBarEl, "toolbar", "\u4E0A\u4E0B\u6587\u83DC\u5355");
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
    };
    module2.exports = { QuickReviewSettingTab: QuickReviewSettingTab2 };
  }
});

// src/views/toolbarManager.js
var require_toolbarManager = __commonJS({
  "src/views/toolbarManager.js"(exports2, module2) {
    var { setIcon } = require("obsidian");
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
    var ToolbarManager2 = class {
      constructor(plugin) {
        this.plugin = plugin;
        this.selectionToolbarEl = null;
        this.globalToolbarEl = null;
        this.selectionRefreshTimer = null;
        this.selectionToolbarState = null;
      }
      initialize() {
        this.selectionToolbarEl = document.createElement("div");
        this.selectionToolbarEl.className = "qreview-selection-toolbar is-hidden";
        document.body.appendChild(this.selectionToolbarEl);
        this.renderToolbarButtons(this.selectionToolbarEl, "selection");
        this.globalToolbarEl = document.createElement("div");
        this.globalToolbarEl.className = "qreview-global-toolbar is-hidden";
        document.body.appendChild(this.globalToolbarEl);
        this.renderToolbarButtons(this.globalToolbarEl, "document");
      }
      destroy() {
        window.clearTimeout(this.selectionRefreshTimer);
        this.selectionToolbarState = null;
        if (this.selectionToolbarEl) {
          this.selectionToolbarEl.remove();
          this.selectionToolbarEl = null;
        }
        if (this.globalToolbarEl) {
          this.globalToolbarEl.remove();
          this.globalToolbarEl = null;
        }
      }
      renderToolbarButtons(container, scope) {
        container.innerHTML = "";
        const hidden = new Set(this.plugin.settings.hiddenToolbarButtons || []);
        const buttons = this.plugin.getOrderedActions(scope).filter((action) => !hidden.has(action.id));
        for (const action of buttons) {
          const button = document.createElement("button");
          button.className = "qreview-toolbar__button";
          button.textContent = action.label;
          button.title = action.title || action.label;
          button.addEventListener("mousedown", (event) => event.preventDefault());
          button.addEventListener("click", () => this.plugin.runAction(action.id, scope));
          container.appendChild(button);
        }
        const settingsButton = document.createElement("button");
        settingsButton.className = "qreview-toolbar__button qreview-toolbar__button--icon";
        settingsButton.title = "\u6253\u5F00 QuickReview \u8BBE\u7F6E";
        settingsButton.setAttribute("aria-label", "\u6253\u5F00 QuickReview \u8BBE\u7F6E");
        setIcon(settingsButton, "settings");
        settingsButton.addEventListener("mousedown", (event) => event.preventDefault());
        settingsButton.addEventListener("click", () => this.plugin.openSettings());
        container.appendChild(settingsButton);
      }
      queueRefresh() {
        window.clearTimeout(this.selectionRefreshTimer);
        this.selectionRefreshTimer = window.setTimeout(() => this.refresh(), 80);
      }
      isToolbarEventTarget(target) {
        if (!(target instanceof Node)) {
          return false;
        }
        return Boolean(
          this.selectionToolbarEl?.contains(target) || this.globalToolbarEl?.contains(target)
        );
      }
      refresh() {
        this.refreshSelectionToolbar();
        this.refreshGlobalToolbar();
      }
      refreshGlobalToolbar() {
        if (!this.globalToolbarEl) {
          return;
        }
        const view = this.plugin.getActiveMarkdownView();
        const hasEditor = Boolean(view && view.editor);
        this.globalToolbarEl.classList.toggle("is-hidden", !hasEditor);
      }
      refreshSelectionToolbar() {
        if (!this.selectionToolbarEl) {
          return;
        }
        if ((this.plugin.selectionToolbarSuppressedUntil || 0) > Date.now()) {
          this.selectionToolbarState = null;
          this.selectionToolbarEl.classList.add("is-hidden");
          return;
        }
        if (this.plugin.isMouseSelectionInProgress) {
          this.selectionToolbarState = null;
          this.selectionToolbarEl.classList.add("is-hidden");
          return;
        }
        const view = this.plugin.getActiveMarkdownView();
        const editor = view && view.editor;
        if (!view || !editor) {
          this.selectionToolbarState = null;
          this.selectionToolbarEl.classList.add("is-hidden");
          return;
        }
        const selectedText = editor.getSelection();
        const selection = window.getSelection();
        if (!selectedText || !selectedText.trim() || !selection || !selection.rangeCount) {
          this.selectionToolbarState = null;
          this.selectionToolbarEl.classList.add("is-hidden");
          return;
        }
        const anchorNode = selection.anchorNode;
        if (!anchorNode || !view.containerEl.contains(anchorNode)) {
          this.selectionToolbarState = null;
          this.selectionToolbarEl.classList.add("is-hidden");
          return;
        }
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!rect || !rect.width && !rect.height) {
          this.selectionToolbarState = null;
          this.selectionToolbarEl.classList.add("is-hidden");
          return;
        }
        const selectionKey = [
          selectedText,
          range.startOffset,
          range.endOffset,
          Math.round(rect.left),
          Math.round(rect.top),
          Math.round(rect.width),
          Math.round(rect.height)
        ].join(":");
        const hasVisibleToolbar = !this.selectionToolbarEl.classList.contains("is-hidden");
        const shouldReusePosition = hasVisibleToolbar && this.selectionToolbarState && this.selectionToolbarState.selectionKey === selectionKey;
        let left;
        let top;
        if (shouldReusePosition) {
          ({ left, top } = this.selectionToolbarState);
        } else {
          const mousePosition = this.plugin.lastSelectionMousePosition;
          const preferredLeft = mousePosition?.clientX ?? rect.left + rect.width / 2;
          const preferredTop = mousePosition?.clientY != null ? mousePosition.clientY + 12 : rect.bottom + 10;
          left = clamp(preferredLeft, 120, window.innerWidth - 120);
          top = clamp(preferredTop, 12, window.innerHeight - 72);
          this.selectionToolbarState = { selectionKey, left, top };
        }
        this.selectionToolbarEl.style.left = `${left}px`;
        this.selectionToolbarEl.style.top = `${top}px`;
        this.selectionToolbarEl.classList.remove("is-hidden");
      }
    };
    module2.exports = { ToolbarManager: ToolbarManager2 };
  }
});

// src/services/workspaceViewService.js
var require_workspaceViewService = __commonJS({
  "src/services/workspaceViewService.js"(exports2, module2) {
    var WorkspaceViewService2 = class {
      constructor(plugin, options = {}) {
        this.plugin = plugin;
        this.reviewViewType = options.reviewViewType || "qreview-result-view";
        this.reviewChatViewType = options.reviewChatViewType || "qreview-chat-view";
        this.temporaryMarkdownViewType = options.temporaryMarkdownViewType || "qreview-temporary-markdown-view";
        this.temporaryMarkdownPopouts = /* @__PURE__ */ new Map();
        this.defaultPopoutSize = {
          width: 450,
          height: 600
        };
      }
      getExistingResultLeaf() {
        const leaves = this.plugin.app.workspace.getLeavesOfType(this.reviewViewType);
        return leaves.length ? leaves[0] : null;
      }
      getExistingChatLeaf() {
        const leaves = this.plugin.app.workspace.getLeavesOfType(this.reviewChatViewType);
        return leaves.length ? leaves[0] : null;
      }
      getExistingTemporaryMarkdownLeaf() {
        const leaves = this.plugin.app.workspace.getLeavesOfType(this.temporaryMarkdownViewType);
        return leaves.length ? leaves[0] : null;
      }
      restoreEditorFocus(view) {
        if (!view?.editor?.focus) {
          return;
        }
        window.setTimeout(() => {
          try {
            view.editor.focus();
          } catch (error) {
            console.debug("QuickReview: failed to restore editor focus", error);
          }
        }, 0);
      }
      restoreActiveEditorLeaf(view) {
        const leaf = view?.leaf;
        if (!leaf) {
          return;
        }
        window.setTimeout(() => {
          try {
            this.plugin.app.workspace.setActiveLeaf(leaf, { focus: false });
          } catch (error) {
            console.debug("QuickReview: failed to restore active leaf", error);
          }
          this.restoreEditorFocus(view);
        }, 0);
      }
      async openResultView(options) {
        const activeView = this.plugin.getActiveMarkdownView();
        const leaf = this.getExistingResultLeaf() || this.plugin.app.workspace.getRightLeaf(false);
        await leaf.setViewState({
          type: this.reviewViewType,
          active: true
        });
        this.restoreActiveEditorLeaf(activeView);
        const view = leaf.view;
        view.setOptions(options);
        return view;
      }
      async openChatView(session) {
        const activeView = this.plugin.getActiveMarkdownView();
        const leaf = this.getExistingChatLeaf() || this.plugin.app.workspace.getRightLeaf(false);
        await leaf.setViewState({
          type: this.reviewChatViewType,
          active: true
        });
        this.restoreActiveEditorLeaf(activeView);
        const view = leaf.view;
        view.setSession(session);
        return view;
      }
      pruneTemporaryMarkdownPopouts() {
        for (const [key, leaf] of this.temporaryMarkdownPopouts.entries()) {
          if (!this.isLeafReusable(leaf)) {
            this.temporaryMarkdownPopouts.delete(key);
          }
        }
      }
      getLeafHostWindow(leaf) {
        return leaf?.view?.containerEl?.ownerDocument?.defaultView || null;
      }
      setPopoutWindowVisible(leaf, isVisible) {
        const popoutWindow = this.getLeafHostWindow(leaf);
        const rootEl = popoutWindow?.document?.documentElement;
        if (!rootEl?.style) {
          return;
        }
        if (isVisible) {
          rootEl.style.opacity = "";
          rootEl.style.visibility = "";
          rootEl.style.pointerEvents = "";
          return;
        }
        rootEl.style.opacity = "0";
        rootEl.style.visibility = "hidden";
        rootEl.style.pointerEvents = "none";
      }
      isLeafReusable(leaf) {
        if (!leaf || leaf.isDetached) {
          return false;
        }
        const containerEl = leaf.view?.containerEl;
        if (!containerEl || containerEl.isConnected === false) {
          return false;
        }
        const popoutWindow = this.getLeafHostWindow(leaf);
        if (!popoutWindow || popoutWindow.closed) {
          return false;
        }
        return true;
      }
      async focusLeaf(leaf) {
        if (!leaf) {
          return;
        }
        try {
          this.plugin.app.workspace.setActiveLeaf(leaf, { focus: true });
        } catch (error) {
          console.debug("QuickReview: failed to focus leaf", error);
        }
      }
      focusPopoutWindow(leaf) {
        const popoutWindow = this.getLeafHostWindow(leaf);
        if (typeof popoutWindow?.focus !== "function") {
          return;
        }
        try {
          popoutWindow.focus();
        } catch (error) {
          console.debug("QuickReview: failed to focus popout window", error);
        }
      }
      applyDefaultPopoutWindowSize(leaf) {
        const popoutWindow = this.getLeafHostWindow(leaf);
        if (!popoutWindow?.resizeTo) {
          return;
        }
        const targetWidth = this.defaultPopoutSize.width;
        const targetHeight = this.defaultPopoutSize.height;
        const screenWidth = Number(popoutWindow.screen?.availWidth) || targetWidth;
        const screenHeight = Number(popoutWindow.screen?.availHeight) || targetHeight;
        const left = Math.max(0, Math.round((screenWidth - targetWidth) / 2));
        const top = Math.max(0, Math.round((screenHeight - targetHeight) / 2));
        try {
          if (typeof popoutWindow.moveTo === "function") {
            popoutWindow.moveTo(left, top);
          }
          popoutWindow.resizeTo(targetWidth, targetHeight);
        } catch (error) {
          console.debug("QuickReview: failed to resize popout window", error);
        }
      }
      async openTemporaryMarkdownView(state, options = {}) {
        const popoutKey = options.key || null;
        this.pruneTemporaryMarkdownPopouts();
        let popoutLeaf = popoutKey ? this.temporaryMarkdownPopouts.get(popoutKey) || null : null;
        if (!this.isLeafReusable(popoutLeaf)) {
          if (popoutKey) {
            this.temporaryMarkdownPopouts.delete(popoutKey);
          }
          popoutLeaf = null;
        }
        let isNewPopout = false;
        if (!popoutLeaf) {
          popoutLeaf = await this.plugin.app.workspace.openPopoutLeaf();
          isNewPopout = true;
          this.setPopoutWindowVisible(popoutLeaf, false);
          if (popoutKey) {
            this.temporaryMarkdownPopouts.set(popoutKey, popoutLeaf);
          }
        }
        try {
          await popoutLeaf.setViewState({
            type: this.temporaryMarkdownViewType,
            active: false
          });
          if (isNewPopout) {
            this.applyDefaultPopoutWindowSize(popoutLeaf);
          }
          const view = popoutLeaf.view;
          await view.setContent(state);
          const popoutWindow = this.getLeafHostWindow(popoutLeaf);
          if (popoutKey && popoutWindow && typeof popoutWindow.addEventListener === "function" && !popoutWindow.__qreviewTemporaryMarkdownCleanupBound) {
            popoutWindow.addEventListener("beforeunload", () => {
              const currentLeaf = this.temporaryMarkdownPopouts.get(popoutKey);
              if (currentLeaf === popoutLeaf) {
                this.temporaryMarkdownPopouts.delete(popoutKey);
              }
            });
            popoutWindow.__qreviewTemporaryMarkdownCleanupBound = true;
          }
          this.setPopoutWindowVisible(popoutLeaf, true);
          this.focusPopoutWindow(popoutLeaf);
          return view;
        } catch (error) {
          this.setPopoutWindowVisible(popoutLeaf, true);
          throw error;
        }
      }
    };
    module2.exports = { WorkspaceViewService: WorkspaceViewService2 };
  }
});

// src/main.js
var { MarkdownView, Notice, Plugin } = require("obsidian");
var {
  buildCommandDefinitions,
  getDocumentActions,
  getSelectionActions
} = require_actionDefinitions();
var { REVIEW_SCOPES } = require_reviewScopes();
var { ActionOrchestrator } = require_actionOrchestrator();
var { EditorContextService } = require_editorContextService();
var { ReviewService } = require_reviewService();
var { ReviewChatView, REVIEW_CHAT_VIEW_TYPE } = require_reviewChatView();
var { ReviewResultView } = require_reviewResultView();
var {
  TemporaryMarkdownView,
  TEMPORARY_MARKDOWN_VIEW_TYPE
} = require_temporaryMarkdownView();
var { QuickReviewSettingTab } = require_settingTab();
var { ToolbarManager } = require_toolbarManager();
var { WorkspaceViewService } = require_workspaceViewService();
var {
  GET_CURRENT_DATE_TOOL_NAME,
  handleGetCurrentDate
} = require_dateTool();
var {
  DEFAULT_SETTINGS,
  normalizeSettings,
  normalizeToolbarActionOrder
} = require_settingsStore();
var {
  WEB_SEARCH_TOOL_NAME,
  handleWebSearch
} = require_webSearchTool();
var REVIEW_VIEW_TYPE = "qreview-result-view";
module.exports = class QuickReviewPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.isMouseSelectionInProgress = false;
    this.lastSelectionMousePosition = null;
    this.selectionToolbarSuppressedUntil = 0;
    this.registerView(REVIEW_VIEW_TYPE, (leaf) => new ReviewResultView(leaf, this));
    this.registerView(REVIEW_CHAT_VIEW_TYPE, (leaf) => new ReviewChatView(leaf, this));
    this.registerView(
      TEMPORARY_MARKDOWN_VIEW_TYPE,
      (leaf) => new TemporaryMarkdownView(leaf, this)
    );
    this.initializeServices();
    this.initializeUI();
    this.registerReviewCommands();
    this.registerUtilityCommands();
    this.addSettingTab(
      new QuickReviewSettingTab(this.app, this, {
        DEFAULT_SETTINGS,
        getSelectionActions
      })
    );
    this.registerToolbarEvents();
    this.refreshToolbarState();
  }
  onunload() {
    this.app.workspace.detachLeavesOfType(REVIEW_VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(REVIEW_CHAT_VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(TEMPORARY_MARKDOWN_VIEW_TYPE);
    this.cleanupUI();
  }
  async loadSettings() {
    this.settings = normalizeSettings(await this.loadData(), { getSelectionActions });
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  initializeServices() {
    this.toolHandlers = {
      [GET_CURRENT_DATE_TOOL_NAME]: handleGetCurrentDate,
      [WEB_SEARCH_TOOL_NAME]: handleWebSearch.bind(this)
    };
    this.reviewService = new ReviewService(this);
    this.actionOrchestrator = new ActionOrchestrator(this);
    this.editorContextService = new EditorContextService(this);
    this.workspaceViewService = new WorkspaceViewService(this, {
      reviewViewType: REVIEW_VIEW_TYPE,
      reviewChatViewType: REVIEW_CHAT_VIEW_TYPE,
      temporaryMarkdownViewType: TEMPORARY_MARKDOWN_VIEW_TYPE
    });
  }
  initializeUI() {
    this.toolbarManager = new ToolbarManager(this);
    this.toolbarManager.initialize();
  }
  cleanupUI() {
    if (this.toolbarManager) {
      this.toolbarManager.destroy();
      this.toolbarManager = null;
    }
    this.reviewService = null;
    this.actionOrchestrator = null;
    this.editorContextService = null;
    this.workspaceViewService = null;
    this.toolHandlers = null;
  }
  registerToolbarEvents() {
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.refreshToolbarState()));
    this.registerEvent(this.app.workspace.on("editor-change", () => this.queueSelectionToolbarRefresh()));
    this.registerEvent(this.app.workspace.on("file-open", () => this.refreshToolbarState()));
    this.registerDomEvent(document, "mousedown", (event) => {
      if (this.toolbarManager?.isToolbarEventTarget(event.target)) {
        return;
      }
      this.isMouseSelectionInProgress = true;
      this.lastSelectionMousePosition = null;
      this.queueSelectionToolbarRefresh();
    });
    this.registerDomEvent(document, "selectionchange", () => this.queueSelectionToolbarRefresh());
    this.registerDomEvent(document, "mouseup", (event) => {
      if (this.toolbarManager?.isToolbarEventTarget(event.target)) {
        return;
      }
      this.isMouseSelectionInProgress = false;
      this.lastSelectionMousePosition = {
        clientX: event.clientX,
        clientY: event.clientY
      };
      this.queueSelectionToolbarRefresh();
    });
    this.registerDomEvent(document, "keyup", () => this.queueSelectionToolbarRefresh());
    this.registerDomEvent(window, "resize", () => this.refreshToolbarState());
    this.registerDomEvent(document, "scroll", () => this.refreshToolbarState(), true);
  }
  registerReviewCommands() {
    for (const command of buildCommandDefinitions(this.getReviewAgents())) {
      this.addCommand({
        id: command.id,
        name: command.name,
        editorCallback: () => this.runAction(command.actionId, command.scope)
      });
    }
  }
  registerUtilityCommands() {
    this.addCommand({
      id: "open-temporary-markdown-popout",
      name: "Open temporary Markdown pop-out",
      callback: async () => {
        await this.openTemporaryMarkdownPopout({
          title: "\u4E34\u65F6 Markdown",
          markdown: [
            "# \u4E34\u65F6 Markdown",
            "",
            "\u8FD9\u662F\u4E00\u4E2A\u4E0D\u843D\u5730\u5230 `.md` \u6587\u4EF6\u7684\u72EC\u7ACB\u7A97\u53E3\u3002",
            "",
            "- \u5185\u5BB9\u5F53\u524D\u4FDD\u5B58\u5728\u5185\u5B58\u91CC",
            "- \u5173\u95ED\u7A97\u53E3\u540E\u5C31\u6D88\u5931",
            "- \u540E\u7EED\u53EF\u4EE5\u63A5\u526A\u8D34\u677F\u3001\u8F93\u5165\u6846\u6216 API"
          ].join("\n")
        });
      }
    });
  }
  showNotice(message) {
    return new Notice(message);
  }
  queueSelectionToolbarRefresh() {
    this.toolbarManager?.queueRefresh();
  }
  refreshToolbarState() {
    this.toolbarManager?.refresh();
  }
  suppressSelectionToolbar(durationMs = 300) {
    this.selectionToolbarSuppressedUntil = Date.now() + durationMs;
    if (this.toolbarManager?.selectionToolbarEl) {
      this.toolbarManager.selectionToolbarEl.classList.add("is-hidden");
    }
  }
  openSettings() {
    this.app.setting.open();
    this.app.setting.openTabById(this.manifest.id);
  }
  getActiveMarkdownView() {
    return this.app.workspace.getActiveViewOfType(MarkdownView) || null;
  }
  getReviewAgent(id) {
    return this.getReviewAgents().find((agent) => agent.id === id) || null;
  }
  getReviewAgents() {
    return Array.isArray(this.settings.reviewAgents) ? this.settings.reviewAgents : [];
  }
  getSelectionActions() {
    return getSelectionActions(this.getReviewAgents());
  }
  getDocumentActions() {
    return getDocumentActions(this.getReviewAgents());
  }
  normalizeToolbarActionOrder(order, actions) {
    return normalizeToolbarActionOrder(order, actions);
  }
  getOrderedActions(scope) {
    const actions = scope === "selection" ? this.getSelectionActions() : this.getDocumentActions();
    const order = this.normalizeToolbarActionOrder(this.settings.toolbarActionOrder, actions);
    const orderIndex = new Map(order.map((id, index) => [id, index]));
    return [...actions].sort((left, right) => {
      const leftIndex = orderIndex.get(left.id);
      const rightIndex = orderIndex.get(right.id);
      return (leftIndex ?? Number.MAX_SAFE_INTEGER) - (rightIndex ?? Number.MAX_SAFE_INTEGER);
    });
  }
  getScopeLabel(scope) {
    return scope === REVIEW_SCOPES.SELECTION ? "\u9009\u4E2D\u6587\u672C" : "\u6574\u7BC7\u7B14\u8BB0";
  }
  getExistingResultLeaf() {
    return this.workspaceViewService.getExistingResultLeaf();
  }
  getExistingChatLeaf() {
    return this.workspaceViewService.getExistingChatLeaf();
  }
  restoreEditorFocus(view) {
    return this.workspaceViewService.restoreEditorFocus(view);
  }
  restoreActiveEditorLeaf(view) {
    return this.workspaceViewService.restoreActiveEditorLeaf(view);
  }
  getActionContext(scope) {
    return this.editorContextService.getActionContext(scope);
  }
  async openResultView(options) {
    return this.workspaceViewService.openResultView(options);
  }
  async openChatView(session) {
    return this.workspaceViewService.openChatView(session);
  }
  async openTemporaryMarkdownPopout(state, options) {
    return this.workspaceViewService.openTemporaryMarkdownView(state, options);
  }
  async openResultMarkdownPopout({ requestId, title, sourceFileName, resultView }) {
    const markdown = resultView?.getRequestMarkdown?.(requestId);
    const resultViewId = resultView?.getInstanceId?.() || "result-view";
    return this.openTemporaryMarkdownPopout({
      title: sourceFileName ? `${sourceFileName} \xB7 ${title}` : title || "\u4E34\u65F6 Markdown",
      markdown: markdown || "*\u5F53\u524D\u6D88\u606F\u6682\u65E0\u5185\u5BB9*"
    }, {
      key: `${resultViewId}:request:${requestId}`
    });
  }
  async runAction(actionId, scope) {
    return this.actionOrchestrator.runAction(actionId, scope);
  }
  async openFollowUpChat({ requestId, title, question, context, resultView }) {
    const reviewMarkdown = resultView.getRequestMarkdown(requestId);
    const chatView = await this.openChatView({
      title: `${title} \xB7 \u8FFD\u95EE`,
      reviewMarkdown,
      context: {
        title: context.title,
        scope: context.scope,
        text: context.text
      },
      messages: [
        {
          role: "assistant",
          content: reviewMarkdown || "\u5F53\u524D\u5BA1\u9605\u7ED3\u679C\u4E3A\u7A7A\u3002"
        }
      ]
    });
    await chatView.startConversation(question);
  }
  getPreferredEditorLeaf(context) {
    return this.editorContextService.getPreferredEditorLeaf(context);
  }
  async restoreContextEditor(context) {
    return this.editorContextService.restoreContextEditor(context);
  }
  async applyPolishedText(context, rawMarkdown) {
    return this.editorContextService.applyPolishedText(context, rawMarkdown);
  }
  async locateSelectionInEditor(context) {
    return this.editorContextService.locateSelectionInEditor(context);
  }
  createContextError(message) {
    const error = new Error(message);
    error.isContextError = true;
    return error;
  }
  formatError(error) {
    if (!error) {
      return "\u53D1\u751F\u672A\u77E5\u9519\u8BEF\u3002";
    }
    if (typeof error === "string") {
      return error;
    }
    return error.message || "\u53D1\u751F\u672A\u77E5\u9519\u8BEF\u3002";
  }
};
