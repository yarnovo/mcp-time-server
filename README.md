# MCP 时间服务器

[![npm版本](https://img.shields.io/npm/v/mcp-time-server.svg)](https://www.npmjs.com/package/mcp-time-server)
[![许可证](https://img.shields.io/npm/l/mcp-time-server.svg)](https://github.com/SzeMeng76/mcp-time-server/blob/main/LICENSE)

一个基于模型上下文协议(MCP)的时间服务器，提供时区相关工具。可以获取指定时区的当前时间以及在不同时区之间转换时间。

```markdown
## 安装

您可以通过npm全局安装：

```bash
npm install -g mcp-time-server
```

或者直接通过npx使用：

```bash
npx -y mcp-time-server
```

## 功能

该MCP服务器提供以下工具：

### 1. 获取当前时间 (get_current_time)

获取指定时区的当前时间。如果不指定时区，默认为UTC。

参数：
- `timezone` (可选): 时区名称，例如 "Asia/Tokyo"、"America/New_York" 等

返回：
- 指定时区的当前日期和时间

### 2. 时区转换 (convert_time)

将一个时区的时间转换为另一个时区的时间。

参数：
- `source_timezone`: 源时区名称
- `time`: 要转换的时间，格式为 "HH:MM"
- `target_timezone`: 目标时区名称

返回：
- 目标时区的等效时间

## 使用方法

### 在MCP环境中使用

您可以通过以下方式直接启动MCP服务器：

```json
{ "type": "stdio", "command": "npx", "args": ["-y", "mcp-time-server"] }
```

这将通过stdio启动MCP服务器，您可以使用MCP客户端与之通信。

### 作为命令行工具

```bash
npx mcp-time-server
```

### 作为库使用

```javascript
import { McpTimeServer } from 'mcp-time-server';

async function example() {
  const server = new McpTimeServer();
  await server.init();
  
  // 使用server.server对象进行进一步操作
  // ...
}
```

## 示例

### 获取当前时间

```json
{
  "name": "get_current_time",
  "params": {
    "timezone": "Asia/Shanghai"
  }
}
```

响应:

```json
{
  "content": [
    {
      "type": "text",
      "text": "5/4/2025, 12:30:45 (Asia/Shanghai)"
    }
  ]
}
```

### 时区转换

```json
{
  "name": "convert_time",
  "params": {
    "source_timezone": "Asia/Tokyo",
    "time": "15:30",
    "target_timezone": "America/Los_Angeles"
  }
}
```

响应:

```json
{
  "content": [
    {
      "type": "text",
      "text": "15:30 在 Asia/Tokyo 相当于 23:30 在 America/Los_Angeles"
    }
  ]
}
```

## 许可证

MIT

## 贡献

欢迎提交问题和拉取请求！
