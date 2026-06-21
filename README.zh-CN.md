[English](README.md) | [简体中文](README.zh-CN.md)

# QuickReview

QuickReview 是一个面向笔记的多 Agent 审阅与润色插件。它可以帮助你检查事实、优化措辞、扩展思路，并在需要时把润色后的版本直接写回编辑器。

![screenshot](images\image.png)

它适合这些场景：

- 检查新写笔记中的事实、逻辑或措辞问题
- 只审阅当前选中的文字，而不处理整篇笔记
- 从多个不同关注点的 Agent 获得反馈
- 润色当前选区，并直接替换原文
- 基于审阅结果继续追问和展开讨论

## 功能特性

- 多 Agent 审阅
  - 内置事实审阅、措辞优化、内容扩展、知识连接、结构重组和润色等 Agent
  - 可单独运行某个 Agent，也可执行综合审阅
- 选区与全文模式
  - 只审阅当前选中文本
  - 审阅当前活动笔记全文
- 一键润色
  - 在尽量保持原意的前提下改写选中文本
  - 可将润色结果直接写回编辑器
- 追问聊天
  - 审阅结果会在专用视图中打开
  - 可继续围绕结果发起追问
- 可配置 Agent
  - 自定义每个 Agent 的 `id`、`label`、`title`、`systemRole` 和 `focus`
  - 可新增、删除或恢复内置 Agent
- 可配置工具
  - `current-date`：返回当前本地日期、星期、时区和 UTC 偏移
  - `web-search`：在网络上搜索近期公开信息
- 可配置上下文菜单
  - 控制显示或隐藏哪些操作按钮
  - 通过拖拽调整按钮顺序
- 支持多种 API 风格
  - `OpenAI-compatible`
  - `Anthropic Messages`

## 默认 Agent

插件默认包含以下角色：

- `Facts`：检查事实错误、概念混淆、时间线问题和证据薄弱点
- `Wording`：检查清晰度、结构、可读性和逻辑流畅度
- `Expansion`：建议值得补充的话题、上下文和示例
- `Connection`：补充框架、经典概念、学习路径和权威观点
- `Restructure`：提炼核心观点、重组结构并压缩冗余
- `Polish`：在不改变原意的前提下优化语言表达

## 安装

当前插件主要面向手动安装。

1. 打开你的 vault 文件夹。
2. 进入 `.obsidian/plugins/`。
3. 创建或打开名为 `quick_review` 的文件夹。
4. 将以下文件复制到该文件夹中：
   - `manifest.json`
   - `main.js`
   - `styles.css`
5. 在社区插件设置中启用 `QuickReview`。

## 配置

启用插件后，打开 `Settings -> QuickReview`。

### 1. LLM API 设置

必填项：

- `API type`
  - `OpenAI-compatible`
  - `Anthropic Messages`
- `API URL`
- `API Key`
- `Model name`

可选项：

- `Temperature`
- `Max output tokens`
- `Custom headers`
- `Output language`

说明：

- 配置会保存在插件的 `data.json` 中
- `API URL` 需要填写完整的接口地址
- `Custom headers` 必须是合法 JSON

### 2. Tavily API 设置

如果希望某些 Agent 能搜索近期信息，请配置：

- `Tavily API Key`
- `Tavily API URL`
- `Search result count`

说明：

- 如果未提供 `Tavily API Key`，插件会尝试使用 Tavily 的无密钥模式
- 网页搜索特别适合事实校验、近期事件、变动中的规则以及日期敏感内容

### 3. Agent 设置

在 `Agent settings` 标签页中，你可以：

- 添加 Agent
- 删除 Agent
- 恢复内置 Agent
- 修改显示名称和角色说明
- 为 Agent 绑定工具

每个 Agent 支持以下字段：

- `id`：唯一标识，建议使用 kebab-case 英文命名
- `label`：按钮和命令中使用的短标签
- `title`：结果视图中显示的标题
- `tools`：启用的工具列表
- `systemRole`：系统角色提示词
- `focus`：审阅关注点

### 4. 上下文菜单

在 `Context menu` 标签页中，你可以：

- 控制哪些按钮会出现在选区工具栏中
- 通过拖拽调整按钮顺序

## 使用方法

### 审阅选中文本

1. 在编辑器中选中一段文字。
2. 点击 QuickReview 操作按钮。
3. 选择某个 Agent、`Combined review` 或 `Polish`。
4. 在审阅面板中查看结果。

### 从命令面板运行

插件会为各个 Agent 注册命令，包括：

- `Review selection`
- `Review full note`
- `Combined review: selection`
- `Combined review: full note`
- `Polish selection`

### 继续追问

在结果视图中，你可以：

- 点击 `Follow up`
- 输入新的问题
- 在专用聊天视图中继续对话

### 应用润色文本

执行 `Polish` 后，点击 `Apply to original`，即可用生成结果替换当前选区。

## 结果视图

QuickReview 会在专用面板中展示结果，并支持：

- 连续显示多次审阅结果
- 折叠或展开单条结果
- 全部折叠或全部展开
- 删除某条结果
- 跳回原始选区

## 工具

### `current-date`

返回本地日期信息，包括：

- ISO 日期
- 年、月、日
- 星期
- 时区
- UTC 偏移

适用场景：

- 解释 today、yesterday、tomorrow、this week 等相对日期
- 检查日志、日记、报告和复盘内容

### `web-search`

使用 Tavily 搜索近期公开信息，并返回：

- 摘要
- 来源链接
- 结果片段

适用场景：

- 检查近期信息是否准确
- 交叉核验事实、规则、日期、新闻和公开资料

## 使用建议

为了获得更稳定的结果：

- 将 `Facts` 与 `current-date` 或 `web-search` 搭配使用
- 对中长笔记优先使用 `Wording` 或 `Restructure`
- 用 `Expansion` 或 `Connection` 扩展学习型或研究型笔记
- 将 `Polish` 作为最终语言润色步骤，而不是事实校验工具

## 开发

### 安装依赖

```bash
npm install
```

### 构建

```bash
npm run build
```

### 测试

```bash
npm test
```

### 验证

```bash
npm run verify
```

## 项目结构

```text
src/
  core/        核心操作、提示词与 Agent 定义
  llm/         模型请求、流式响应与工具调用
  services/    审阅流程、编辑器上下文与视图协调
  settings/    设置页与 Agent 配置界面
  views/       结果视图与追问聊天视图
test/          单元测试
```

## 已知限制

- 当前为桌面端插件，`manifest.json` 中设置了 `isDesktopOnly: true`
- 网页搜索依赖 Tavily 服务可用性
- 审阅质量高度依赖你配置的模型与提示词
- 审阅较长的全文内容会增加 token 消耗和响应时间

## License

This repository includes an MIT license in [LICENSE](LICENSE).
