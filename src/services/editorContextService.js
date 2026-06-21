const { MarkdownView } = require("obsidian");

const { REVIEW_SCOPES } = require("../core/reviewScopes");

function extractPolishedText(markdown) {
  const match = markdown.match(
    /<!--POLISHED_TEXT_START-->\s*([\s\S]*?)\s*<!--POLISHED_TEXT_END-->/,
  );
  return match ? match[1].trim() : "";
}

class EditorContextService {
  constructor(plugin) {
    this.plugin = plugin;
  }

  getActionContext(scope) {
    const view = this.plugin.getActiveMarkdownView();
    const editor = view && view.editor;
    if (!view || !editor) {
      throw this.plugin.createContextError("请先打开一篇可编辑的 Markdown 笔记。");
    }

    const text = scope === REVIEW_SCOPES.SELECTION ? editor.getSelection() : editor.getValue();
    if (!text || !text.trim()) {
      throw this.plugin.createContextError(
        scope === REVIEW_SCOPES.SELECTION
          ? "请先选中需要处理的文本。"
          : "当前笔记没有可处理的内容。",
      );
    }

    return {
      view,
      editor,
      file: view.file,
      title: view.file ? view.file.basename : "未命名笔记",
      scope,
      text: text.trim(),
      selectionRange:
        scope === REVIEW_SCOPES.SELECTION
          ? {
              from: editor.getCursor("from"),
              to: editor.getCursor("to"),
            }
          : null,
    };
  }

  getPreferredEditorLeaf(context) {
    const preferredLeaf = context?.view?.leaf;
    if (preferredLeaf?.view instanceof MarkdownView) {
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
      throw new Error("当前结果无法定位到原文。");
    }

    const leaf = this.getPreferredEditorLeaf(context);
    if (!leaf || typeof leaf.openFile !== "function") {
      throw new Error("未找到可用于打开原文的编辑视图。");
    }

    await leaf.openFile(context.file);
    const view = leaf.view;
    const editor = view?.editor;
    if (!(view instanceof MarkdownView) || !editor) {
      throw new Error("原文所在编辑视图不可用。");
    }

    this.plugin.app.workspace.setActiveLeaf(leaf, { focus: true });
    return { leaf, view, editor };
  }

  async applyPolishedText(context, rawMarkdown) {
    const polishedText = extractPolishedText(rawMarkdown);
    if (!polishedText) {
      this.plugin.showNotice("未找到可应用的润色结果。");
      return;
    }

    if (!context.selectionRange) {
      this.plugin.showNotice("当前结果只能应用到选中文本。");
      return;
    }

    try {
      const { editor, view } = await this.restoreContextEditor(context);
      editor.setSelection(context.selectionRange.from, context.selectionRange.to);
      editor.replaceSelection(polishedText);
      this.plugin.restoreEditorFocus(view);
      this.plugin.showNotice("已将润色结果应用到原文。");
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
}

module.exports = { EditorContextService, extractPolishedText };
