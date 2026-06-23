const { DEFAULT_REVIEW_AGENTS } = require("../core/reviewAgents");
const {
  DEFAULT_TAVILY_API_URL,
  DEFAULT_TAVILY_MAX_RESULTS,
} = require("../llm/tools/webSearchTool");

const DEFAULT_SETTINGS = {
  providerType: "openai",
  apiUrl: "",
  apiKey: "",
  model: "",
  temperature: 0.3,
  maxTokens: 1800,
  customHeaders: "{}",
  responseLanguage: "简体中文",
  searchApiKey: "",
  searchApiBaseUrl: DEFAULT_TAVILY_API_URL,
  searchMaxResults: DEFAULT_TAVILY_MAX_RESULTS,
  searchDeepMode: false,
  hiddenToolbarButtons: [],
  toolbarActionOrder: [],
  reviewAgents: cloneDefaultAgents(),
};

function cloneAgent(agent) {
  return {
    ...agent,
    tools: Array.isArray(agent?.tools) ? [...agent.tools] : [],
  };
}

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function createEmptyAgent() {
  return {
    id: `agent-${Date.now()}`,
    label: "新 Agent",
    title: "新 Agent",
    tools: [],
    systemRole: "",
    focus: "",
  };
}

function cloneDefaultAgents() {
  return DEFAULT_REVIEW_AGENTS.map(cloneAgent);
}

function normalizeToolbarActionOrder(order, actions) {
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

function normalizeSettings(data, { getSelectionActions } = {}) {
  const source = data && typeof data === "object" ? data : {};
  const normalized = {
    ...DEFAULT_SETTINGS,
    ...source,
  };

  normalized.hiddenToolbarButtons = Array.isArray(source.hiddenToolbarButtons)
    ? [...source.hiddenToolbarButtons]
    : [];
  normalized.searchDeepMode = Boolean(source.searchDeepMode);
  normalized.reviewAgents =
    Array.isArray(source.reviewAgents) && source.reviewAgents.length > 0
      ? source.reviewAgents.map(cloneAgent)
      : cloneDefaultAgents();

  const selectionActions =
    typeof getSelectionActions === "function" ? getSelectionActions(normalized.reviewAgents) : [];
  normalized.toolbarActionOrder = normalizeToolbarActionOrder(
    source.toolbarActionOrder,
    selectionActions,
  );

  return normalized;
}

function renameAgentReferences(settings, previousId, nextId) {
  if (!settings || !previousId || previousId === nextId) {
    return settings;
  }

  settings.hiddenToolbarButtons = (settings.hiddenToolbarButtons || []).map((id) =>
    id === previousId ? nextId : id,
  );
  settings.toolbarActionOrder = (settings.toolbarActionOrder || []).map((id) =>
    id === previousId ? nextId : id,
  );

  return settings;
}

function removeAgentReferences(settings, agentId) {
  if (!settings || !agentId) {
    return settings;
  }

  settings.hiddenToolbarButtons = (settings.hiddenToolbarButtons || []).filter(
    (id) => id !== agentId,
  );
  settings.toolbarActionOrder = (settings.toolbarActionOrder || []).filter((id) => id !== agentId);

  return settings;
}

module.exports = {
  DEFAULT_SETTINGS,
  cloneDefaultAgents,
  createEmptyAgent,
  normalizeSettings,
  normalizeToolbarActionOrder,
  parseNumber,
  removeAgentReferences,
  renameAgentReferences,
};
