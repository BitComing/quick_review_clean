function formatSourceContext(context) {
  return `文稿标题：${context.title}
原文：
<<<TEXT
${context.text}
TEXT>>>`;
}

function stringifyMessageContent(content) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
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
      })
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function buildReviewPrompt(settings, getScopeLabel, agent, context) {
  return `你正在审阅一段 Obsidian ${getScopeLabel(context.scope)}。
你的角色：${agent.title}。
审阅重点：${agent.focus}
输出语言：${settings.responseLanguage}。
输出要求：
1. 仅输出 1-3 条具备实际价值的疑问或优化建议，杜绝无意义、凑数的内容；
2. 采用分行无序列表格式输出，内容简洁精炼，无冗余话术、无额外解释；
3. 若文稿无明显问题、无优化空间，直接输出文字：暂时没有问题
${formatSourceContext(context)}`;
}

function buildReviewContinuationPrompt(settings, agent, context, initialReview) {
  return `请基于下面的原文与初审结果，继续以 ${agent.title} 的视角给出更可执行的修改方案。
输出语言：${settings.responseLanguage}。
输出要求：
1. 先输出 \`## 优先修改方案\`，按优先级列出应该先改什么。
2. 再输出 \`## 示例修改\`，对最关键的 2-4 处提供可直接参考的改写、补写或替换方案。
3. 如有必要，再输出 \`## 进一步建议\`，说明作者还可继续补什么。
4. 保持针对性，不要泛泛而谈。
初审结果：
${initialReview}
${formatSourceContext(context)}`;
}

function buildPolishPrompt(settings, getScopeLabel, context) {
  return `请对下面的 ${getScopeLabel(context.scope)} 进行中文润色，在不改变原意的前提下提升表达。
输出语言：${settings.responseLanguage}。
输出要求：
1. 先输出 \`## 润色说明\`，概括 2-4 条改进重点。
2. 再输出 \`## 润色结果\`。
3. 在 \`## 润色结果\` 下方，用以下标记包裹最终润色后的完整文本，且不要解释这些标记：
<!--POLISHED_TEXT_START-->
润色后的文本
<!--POLISHED_TEXT_END-->
4. 只输出一次最终润色文本。
${formatSourceContext(context)}`;
}

function buildAllReviewContinuationPrompt(settings, context, initialReview) {
  return `请基于下面这份综合审阅结果，为作者输出一份可执行的整体修改方案。
输出语言：${settings.responseLanguage}。
输出要求：
1. 先输出 \`## 最高优先级问题\`，列出最值得先处理的 3-5 项。
2. 再输出 \`## 逐步修改方案\`，按执行顺序说明怎么改。
3. 再输出 \`## 示例改写与补充\`，给出关键片段的示例优化。
4. 需要时输出 \`## 继续深挖方向\`，说明后续可继续拓展的理论、案例或证据。
综合初审结果：
${initialReview}
${formatSourceContext(context)}`;
}

function buildFollowUpChatPrompt(settings, session, messages) {
  const transcript = messages
    .map(
      (message) =>
        `${message.role === "assistant" ? "助手" : "用户"}：${stringifyMessageContent(message.content)}`,
    )
    .join("\n\n");

  return `你正在和作者围绕一份审阅结果进行追问式交流。
输出语言：${settings.responseLanguage}。
回答要求：
1. 直接回应用户当前追问，优先给出可执行建议；
2. 结合原文与既有审阅结果，不要脱离上下文泛泛而谈；
3. 若用户要求示例、改写、补充材料，请尽量给出具体文本；
4. 保持自然对话语气，不要重复系统设定。
处理范围：${session.context.scope === "selection" ? "选中文本" : "整篇笔记"}
当前关联的审阅结果：
${session.reviewMarkdown}
${formatSourceContext(session.context)}
对话记录：
${transcript}`;
}

module.exports = {
  buildAllReviewContinuationPrompt,
  buildFollowUpChatPrompt,
  buildPolishPrompt,
  buildReviewContinuationPrompt,
  buildReviewPrompt,
};
