# QuickReview

QuickReview is a multi-agent review and polishing plugin for notes. It helps you inspect facts, improve wording, expand ideas, and optionally write a polished version back into the editor.

It is useful when you want to:

- review a newly written note for factual, logical, or wording issues
- inspect only the selected text without touching the whole note
- gather feedback from multiple agent roles with different focuses
- polish the current selection and replace it in place
- continue asking follow-up questions based on the review results

## Features

- Multi-agent review
  - Built-in agents for factual review, wording, expansion, connection, restructuring, and polishing
  - Run a single agent or a combined review
- Selection and full-note modes
  - Review only the selected text
  - Review the entire active note
- One-click polish
  - Rewrite the selected text conservatively
  - Apply the polished result directly back to the editor
- Follow-up chat
  - Review results open in a dedicated view
  - Continue the discussion with follow-up questions
- Configurable agents
  - Customize each agent's `id`, `label`, `title`, `systemRole`, and `focus`
  - Add, remove, or restore built-in agents
- Configurable tools
  - `current-date`: returns the current local date, weekday, timezone, and UTC offset
  - `web-search`: searches for recent public information on the web
- Configurable context menu
  - Show or hide action buttons
  - Reorder them with drag and drop
- Multiple API styles
  - `OpenAI-compatible`
  - `Anthropic Messages`

## Default agents

The plugin includes these roles by default:

- `Facts`: checks factual errors, concept confusion, timeline issues, and weak evidence
- `Wording`: checks clarity, structure, readability, and logical flow
- `Expansion`: suggests topics, context, and examples worth adding
- `Connection`: adds frameworks, classic concepts, study paths, and authoritative viewpoints
- `Restructure`: distills the core point, reorganizes structure, and compresses redundancy
- `Polish`: improves language without changing the original meaning

## Installation

This plugin is currently intended for manual installation.

1. Open your vault folder.
2. Go to `.obsidian/plugins/`.
3. Create or open a folder named `quick_review`.
4. Copy these files into that folder:
   - `manifest.json`
   - `main.js`
   - `styles.css`
5. Enable `QuickReview` from the community plugins settings.

## Configuration

After enabling the plugin, open `Settings -> QuickReview`.

### 1. LLM API settings

Required:

- `API type`
  - `OpenAI-compatible`
  - `Anthropic Messages`
- `API URL`
- `API Key`
- `Model name`

Optional:

- `Temperature`
- `Max output tokens`
- `Custom headers`
- `Output language`

Notes:

- Settings are saved in the plugin's `data.json`
- `API URL` should be the full endpoint URL
- `Custom headers` must be valid JSON

### 2. Tavily API settings

To let some agents search recent information, configure:

- `Tavily API Key`
- `Tavily API URL`
- `Search result count`

Notes:

- If no `Tavily API Key` is provided, the plugin attempts Tavily keyless mode
- Web search is most useful for fact checking, recent events, changing rules, and date-sensitive content

### 3. Agent settings

In the `Agent settings` tab you can:

- add an agent
- delete an agent
- restore built-in agents
- change display names and role instructions
- attach tools to an agent

Each agent supports:

- `id`: unique identifier, preferably kebab-case English
- `label`: short display label for buttons and commands
- `title`: title shown in the result view
- `tools`: enabled tool list
- `systemRole`: system role prompt
- `focus`: review focus

### 4. Context menu

In the `Context menu` tab you can:

- control which buttons appear in the selection toolbar
- drag to reorder buttons

## Usage

### Review selected text

1. Select text in the editor.
2. Click the QuickReview action button.
3. Choose an agent, `Combined review`, or `Polish`.
4. Read the result in the review pane.

### Run from the command palette

The plugin registers commands for each agent, including:

- `Review selection`
- `Review full note`
- `Combined review: selection`
- `Combined review: full note`
- `Polish selection`

### Ask follow-up questions

In the result view you can:

- click `Follow up`
- enter another question
- continue in a dedicated chat view

### Apply polished text

After running `Polish`, click `Apply to original` to replace the current selection with the generated version.

## Result view

QuickReview shows results in a dedicated pane and supports:

- multiple results in sequence
- collapse or expand individual items
- collapse all or expand all
- delete a result
- jump back to the original selection

## Tools

### `current-date`

Returns local date information including:

- ISO date
- year, month, and day
- weekday
- timezone
- UTC offset

Useful for:

- interpreting relative dates such as today, yesterday, tomorrow, or this week
- checking logs, journals, reports, and retrospectives

### `web-search`

Uses Tavily to search recent public information and returns:

- summaries
- source links
- result snippets

Useful for:

- checking whether recent information is accurate
- cross-verifying facts, rules, dates, news, and public references

## Recommendations

For more reliable results:

- use `Facts` with `current-date` or `web-search`
- use `Wording` or `Restructure` for medium or long notes
- use `Expansion` or `Connection` to extend study or research notes
- use `Polish` as a final language pass, not as a fact-checking tool

## Development

### Install dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Verify

```bash
npm run verify
```

## Project structure

```text
src/
  core/        core actions, prompts, and agent definitions
  llm/         model requests, streaming responses, tool calls
  services/    review flow, editor context, view coordination
  settings/    settings tab and agent configuration UI
  views/       result views and follow-up chat views
test/          unit tests
```

## Known limitations

- This is currently a desktop-only plugin and `manifest.json` sets `isDesktopOnly: true`
- Web search depends on Tavily availability
- Review quality depends heavily on your configured model and prompts
- Reviewing long full-note content increases token usage and response time

## 中文说明

QuickReview 是一个多 Agent 审阅与润色插件，用来帮你快速检查笔记内容、优化表达、补充思路，并在需要时继续追问或直接把润色结果写回原文。

- 适合写完笔记后做事实、逻辑和表达检查
- 支持选区审阅、全文审阅、综合审阅和一键润色
- 支持在结果页继续追问，并将润色结果直接应用回原文
- 支持自定义 Agent、工具调用和上下文菜单

## License

This repository includes an MIT license in [LICENSE](LICENSE).
