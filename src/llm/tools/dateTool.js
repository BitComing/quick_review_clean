const GET_CURRENT_DATE_TOOL_NAME = "get_current_date";

function pad(value) {
  return String(value).padStart(2, "0");
}

function toDateParts(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: date.toLocaleDateString("zh-CN", { weekday: "long" }),
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

function buildDateResult(now = new Date()) {
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
    localeDate: `${parts.year}年${parts.month}月${parts.day}日`,
  };
}

function buildGetCurrentDateTool(providerType = "openai") {
  if (providerType === "anthropic") {
    return {
      name: GET_CURRENT_DATE_TOOL_NAME,
      description:
        "获取当前本地日期、星期、时区与 UTC 偏移。适合核对“今天/昨天/明天/本周”等相对日期表述。",
      input_schema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    };
  }

  return {
    type: "function",
    function: {
      name: GET_CURRENT_DATE_TOOL_NAME,
      description:
        "获取当前本地日期、星期、时区与 UTC 偏移。适合核对“今天/昨天/明天/本周”等相对日期表述。",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  };
}

async function handleGetCurrentDate() {
  return buildDateResult();
}

module.exports = {
  GET_CURRENT_DATE_TOOL_NAME,
  buildDateResult,
  buildGetCurrentDateTool,
  handleGetCurrentDate,
};
