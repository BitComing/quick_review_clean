const DEFAULT_REVIEW_AGENTS = [
  {
    id: "fact-check",
    label: "事实",
    title: "事实",
    tools: ["current-date"],
    systemRole:
      "你是一名严谨的事实核验编辑，擅长检查事实错误、时间线矛盾、概念混淆、数据不一致与推理失真。",
    focus:
      "优先指出事实错误、概念误用、前后矛盾与需要核实但证据不足的表述。",
  },
  {
    id: "writing",
    label: "表述",
    title: "表述",
    tools: [],
    systemRole:
      "你是一名资深中文写作编辑，擅长提升表达清晰度、逻辑衔接、信息密度与可读性。",
    focus:
      "优先指出句子晦涩、逻辑断层、表述模糊、结构拖沓和信息组织不顺的问题。",
  },
  {
    id: "expand",
    label: "衍生",
    title: "衍生",
    tools: [],
    systemRole:
      "你是一名内容策划编辑，擅长发现文本可扩展的方向、遗漏的相关议题与可补充的背景知识。",
    focus:
      "优先指出可补充的关键背景、遗漏的延伸议题、读者可能继续追问的问题和可拓展的案例。",
  },
  {
    id: "theory",
    label: "关联",
    title: "关联",
    tools: [],
    systemRole:
      "你是一名理论研究助理，擅长把文本内容与主流理论、权威观点、经典框架和学习路径关联起来。",
    focus:
      "优先指出适合补入的理论框架、权威视角、经典概念、参考路径和可能存在的理论表述不严谨之处。",
  },
  {
    id: "refactor",
    label: "重构",
    title: "重构",
    tools: [],
    systemRole:
      "你是一名擅长内容重构的中文编辑，能够提炼所选文本的核心信息，重新组织结构，并在不偏离原意的前提下更清楚地表达作者真正想说的内容。",
    focus:
      "优先提炼核心观点、合并重复信息、重排表达顺序、修复结构松散与主次不清的问题，让内容更凝练、更有条理且更贴近原意。",
  },
];

const POLISH_AGENT = {
  id: "polish",
  label: "润色",
  title: "润色",
  tools: [],
  systemRole:
    "你是一名克制且高水平的中文润色编辑，在不改变原意的前提下提升表达清晰度、自然度、节奏与专业感。",
};

const ALL_REVIEW_ACTION = {
  id: "all-review",
  label: "综合",
  title: "综合",
};

function getActionTitle(actionId, reviewAgents = DEFAULT_REVIEW_AGENTS) {
  if (actionId === ALL_REVIEW_ACTION.id) {
    return ALL_REVIEW_ACTION.title;
  }

  if (actionId === POLISH_AGENT.id) {
    return POLISH_AGENT.title;
  }

  return reviewAgents.find((agent) => agent.id === actionId)?.title || "审阅";
}

function isAllReviewAction(actionId) {
  return actionId === ALL_REVIEW_ACTION.id;
}

function isPolishAction(actionId) {
  return actionId === POLISH_AGENT.id;
}

module.exports = {
  ALL_REVIEW_ACTION,
  DEFAULT_REVIEW_AGENTS,
  POLISH_AGENT,
  getActionTitle,
  isAllReviewAction,
  isPolishAction,
};
