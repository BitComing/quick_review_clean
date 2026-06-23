const { Setting } = require("obsidian");
const { parseNumber } = require("./settingsStore");

const COMMON_RESPONSE_LANGUAGES = [
  "简体中文",
  "繁體中文",
  "English",
  "日本語",
  "한국어",
  "Français",
  "Deutsch",
  "Español",
  "Português",
  "Русский",
  "العربية",
  "हिन्दी",
  "Italiano",
  "Nederlands",
  "Türkçe",
  "Tiếng Việt",
  "ไทย",
  "Bahasa Indonesia",
];

function createSettingsCard(containerEl, title, description) {
  const cardEl = containerEl.createDiv({ cls: "qreview-settings-card" });
  const headerEl = cardEl.createDiv({ cls: "qreview-settings-card__header" });

  headerEl.createEl("h3", {
    cls: "qreview-settings-card__title",
    text: title,
  });
  headerEl.createDiv({
    cls: "qreview-settings-card__description",
    text: description,
  });

  return cardEl.createDiv({ cls: "qreview-settings-card__content" });
}

function renderResponseLanguageSelect(containerEl, plugin, defaultSettings) {
  const languageSetting = new Setting(containerEl)
    .setName("输出语言")
    .setDesc("点击选择框展开常见语言列表，单选后立即保存。");

  const getLanguageValue = () =>
    plugin.settings.responseLanguage?.trim() || defaultSettings.responseLanguage;
  const getLanguageOptions = () => {
    const currentValue = getLanguageValue();
    const hasCurrentValue = COMMON_RESPONSE_LANGUAGES.includes(currentValue);

    if (hasCurrentValue) {
      return COMMON_RESPONSE_LANGUAGES;
    }

    return [currentValue, ...COMMON_RESPONSE_LANGUAGES];
  };

  const wrapperEl = languageSetting.controlEl.createDiv({
    cls: "qreview-single-select",
  });
  wrapperEl.style.position = "relative";

  const triggerEl = wrapperEl.createEl("button", {
    cls: "qreview-single-select__trigger",
    attr: { type: "button" },
  });

  const summaryEl = triggerEl.createEl("span", {
    cls: "qreview-single-select__summary",
    text: getLanguageValue(),
  });

  const caretEl = triggerEl.createEl("span", {
    cls: "qreview-single-select__caret",
    text: "▼",
  });

  const menuEl = wrapperEl.createDiv({
    cls: "qreview-single-select__menu",
  });

  let isOpen = false;
  let detachOutsideClick = null;

  const closeMenu = () => {
    if (!isOpen) {
      return;
    }
    isOpen = false;
    menuEl.style.display = "none";
    caretEl.textContent = "▼";
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
    caretEl.textContent = "▲";

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
        cls: "qreview-single-select__option",
      });

      const radioEl = optionLabelEl.createEl("input", {
        type: "radio",
        attr: { name: "qreview-response-language" },
      });
      radioEl.checked = language === currentValue;

      optionLabelEl.createEl("span", {
        cls: "qreview-single-select__option-name",
        text: language,
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
    "LLM API 配置",
    "管理模型服务的连接信息、模型参数与输出行为。",
  );
  const tavilyCardEl = createSettingsCard(
    containerEl,
    "Tavily API 配置",
    "管理联网搜索所需的 Tavily 接口参数。",
  );

  new Setting(llmCardEl)
    .setName("API 类型")
    .setDesc("选择当前接入的模型 API 协议。")
    .addDropdown((dropdown) =>
      dropdown
        .addOption("openai", "OpenAI 兼容")
        .addOption("anthropic", "Anthropic Messages")
        .setValue(plugin.settings.providerType)
        .onChange(async (value) => {
          plugin.settings.providerType = value;
          await plugin.saveSettings();
        }),
    );

  new Setting(llmCardEl)
    .setName("API URL")
    .setDesc("填写完整接口地址。配置会保存在插件 data.json 中。")
    .addText((text) =>
      text
        .setPlaceholder("https://your-api-endpoint")
        .setValue(plugin.settings.apiUrl)
        .onChange(async (value) => {
          plugin.settings.apiUrl = value.trim();
          await plugin.saveSettings();
        }),
    );

  new Setting(llmCardEl)
    .setName("API Key")
    .setDesc("用于调用模型接口。")
    .addText((text) =>
      text
        .setPlaceholder("sk-...")
        .setValue(plugin.settings.apiKey)
        .onChange(async (value) => {
          plugin.settings.apiKey = value.trim();
          await plugin.saveSettings();
        }),
    );

  new Setting(llmCardEl)
    .setName("模型名称")
    .setDesc("例如 deepseek-v4-flash 或其他你接入的模型名。")
    .addText((text) =>
      text
        .setPlaceholder("deepseek-v4-flash")
        .setValue(plugin.settings.model)
        .onChange(async (value) => {
          plugin.settings.model = value.trim();
          await plugin.saveSettings();
        }),
    );

  new Setting(llmCardEl)
    .setName("Temperature")
    .setDesc("建议 0.1 - 0.5，用于控制输出发散程度。")
    .addText((text) =>
      text
        .setPlaceholder("0.3")
        .setValue(String(plugin.settings.temperature))
        .onChange(async (value) => {
          plugin.settings.temperature = parseNumber(value, defaultSettings.temperature);
          await plugin.saveSettings();
        }),
    );

  new Setting(llmCardEl)
    .setName("最大输出 Tokens")
    .setDesc("限制每次结果长度。")
    .addText((text) =>
      text
        .setPlaceholder("1800")
        .setValue(String(plugin.settings.maxTokens))
        .onChange(async (value) => {
          plugin.settings.maxTokens = parseNumber(value, defaultSettings.maxTokens);
          await plugin.saveSettings();
        }),
    );

  new Setting(llmCardEl)
    .setName("自定义 Headers")
    .setDesc("额外请求头，使用 JSON 格式。")
    .addTextArea((text) => {
      text.inputEl.rows = 6;
      text
        .setPlaceholder('{"x-api-version":"2024-01-01"}')
        .setValue(plugin.settings.customHeaders)
        .onChange(async (value) => {
          plugin.settings.customHeaders = value.trim() || "{}";
          await plugin.saveSettings();
        });
    });

  renderResponseLanguageSelect(llmCardEl, plugin, defaultSettings);

  new Setting(tavilyCardEl)
    .setName("Tavily API Key")
    .setDesc("用于联网搜索。留空时将尝试使用 Tavily keyless 模式。")
    .addText((text) =>
      text
        .setPlaceholder("tvly-...")
        .setValue(plugin.settings.searchApiKey || "")
        .onChange(async (value) => {
          plugin.settings.searchApiKey = value.trim();
          await plugin.saveSettings();
        }),
    );

  new Setting(tavilyCardEl)
    .setName("Tavily API URL")
    .setDesc("默认使用 Tavily 官方 search 接口。")
    .addText((text) =>
      text
        .setPlaceholder("https://api.tavily.com/search")
        .setValue(plugin.settings.searchApiBaseUrl || "")
        .onChange(async (value) => {
          plugin.settings.searchApiBaseUrl = value.trim();
          await plugin.saveSettings();
        }),
    );

  new Setting(tavilyCardEl)
    .setName("联网搜索结果数")
    .setDesc("建议 3 - 5 条，过多会增加 token 消耗。")
    .addText((text) =>
      text
        .setPlaceholder("5")
        .setValue(String(plugin.settings.searchMaxResults ?? 5))
        .onChange(async (value) => {
          plugin.settings.searchMaxResults = parseNumber(value, 5);
          await plugin.saveSettings();
        }),
    );

  new Setting(tavilyCardEl)
    .setName("深度搜索")
    .setDesc("开启后，联网搜索会使用深度模式，尽量返回更完整的可读内容，帮助 LLM 更准确读取与总结。")
    .addToggle((toggle) =>
      toggle.setValue(Boolean(plugin.settings.searchDeepMode)).onChange(async (value) => {
        plugin.settings.searchDeepMode = value;
        await plugin.saveSettings();
      }),
    );
}

module.exports = {
  renderDefaultSection,
};
