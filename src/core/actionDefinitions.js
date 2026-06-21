const {
  ALL_REVIEW_ACTION,
  DEFAULT_REVIEW_AGENTS,
  POLISH_AGENT,
} = require("./reviewAgents");
const { REVIEW_SCOPES } = require("./reviewScopes");

function getSelectionActions(reviewAgents = DEFAULT_REVIEW_AGENTS) {
  return [ALL_REVIEW_ACTION, ...reviewAgents, POLISH_AGENT];
}

function getDocumentActions(reviewAgents = DEFAULT_REVIEW_AGENTS) {
  return [ALL_REVIEW_ACTION, ...reviewAgents];
}

function buildCommandDefinitions(reviewAgents = DEFAULT_REVIEW_AGENTS) {
  const commands = [];

  for (const agent of reviewAgents) {
    commands.push(
      {
        id: `${agent.id}-${REVIEW_SCOPES.SELECTION}`,
        name: `${agent.label}：审阅选中文本`,
        actionId: agent.id,
        scope: REVIEW_SCOPES.SELECTION,
      },
      {
        id: `${agent.id}-${REVIEW_SCOPES.DOCUMENT}`,
        name: `${agent.label}：审阅整篇笔记`,
        actionId: agent.id,
        scope: REVIEW_SCOPES.DOCUMENT,
      },
    );
  }

  commands.push(
    {
      id: `${ALL_REVIEW_ACTION.id}-${REVIEW_SCOPES.SELECTION}`,
      name: "综合审阅：审阅选中文本",
      actionId: ALL_REVIEW_ACTION.id,
      scope: REVIEW_SCOPES.SELECTION,
    },
    {
      id: `${ALL_REVIEW_ACTION.id}-${REVIEW_SCOPES.DOCUMENT}`,
      name: "综合审阅：审阅整篇笔记",
      actionId: ALL_REVIEW_ACTION.id,
      scope: REVIEW_SCOPES.DOCUMENT,
    },
    {
      id: `${POLISH_AGENT.id}-${REVIEW_SCOPES.SELECTION}`,
      name: "一键润色：润色选中文本",
      actionId: POLISH_AGENT.id,
      scope: REVIEW_SCOPES.SELECTION,
    },
  );

  return commands;
}

module.exports = {
  buildCommandDefinitions,
  getDocumentActions,
  getSelectionActions,
};
