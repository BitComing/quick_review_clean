const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildDateResult,
  buildGetCurrentDateTool,
  handleGetCurrentDate,
} = require("../src/llm/tools/dateTool");

test("buildDateResult returns structured local date metadata", () => {
  const result = buildDateResult(new Date("2026-06-20T12:34:56+08:00"));

  assert.equal(result.isoDate, "2026-06-20");
  assert.equal(result.year, 2026);
  assert.equal(result.month, 6);
  assert.equal(result.day, 20);
  assert.match(result.weekday, /^星期|^周/);
  assert.equal(result.localeDate, "2026年6月20日");
});

test("buildGetCurrentDateTool returns OpenAI function schema by default", () => {
  const tool = buildGetCurrentDateTool();

  assert.equal(tool.type, "function");
  assert.equal(tool.function.name, "get_current_date");
  assert.equal(tool.function.parameters.type, "object");
});

test("buildGetCurrentDateTool returns Anthropic schema when requested", () => {
  const tool = buildGetCurrentDateTool("anthropic");

  assert.equal(tool.name, "get_current_date");
  assert.equal(tool.input_schema.type, "object");
});

test("handleGetCurrentDate returns the current date payload shape", async () => {
  const result = await handleGetCurrentDate();

  assert.equal(typeof result.isoDate, "string");
  assert.equal(typeof result.timezone, "string");
  assert.equal(typeof result.utcOffset, "string");
});
