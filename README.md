# 系统时间 MCP

[![npm版本](https://img.shields.io/npm/v/system-time-mcp.svg)](https://www.npmjs.com/package/system-time-mcp)
[![许可证](https://img.shields.io/npm/l/system-time-mcp.svg)](https://github.com/SzeMeng76/system-time-mcp/blob/main/LICENSE)

一个简单的 MCP (模型上下文协议) 服务器，用于获取当前系统时间。

## 安装

```bash
npm install -g system-time-mcp
```

或者直接通过 npx 使用：

```bash
npx -y system-time-mcp
```

## 功能

该 MCP 服务器提供一个工具：

### 获取当前时间 (get_current_time)

获取当前系统时间，使用系统默认的区域设置格式化。

参数：无

返回：当前系统时间的格式化字符串

## 使用方法

### 在 MCP 环境中使用

```json
{ "type": "stdio", "command": "npx", "args": ["-y", "system-time-mcp"] }
```

### 作为命令行工具

```bash
npx system-time-mcp
```

### 作为库使用

```javascript
import { SystemTimeServer } from 'system-time-mcp';

async function example() {
  const server = new SystemTimeServer();
  await server.init();
  
  // 使用 server.server 对象进行进一步操作
  // ...
}
```

## 示例

### 获取当前时间

请求：
```json
{
  "name": "get_current_time",
  "params": {}
}
```

响应：
```json
{
  "content": [
    {
      "type": "text",
      "text": "2025/1/21 22:30:45"
    }
  ]
}
```

## 测试

项目使用 Vitest 进行测试：

```bash
# 运行测试
npm test

# 运行测试并显示 UI
npm run test:ui

# 运行测试并生成覆盖率报告
npm run test:coverage
```

## 许可证

MIT

## 贡献

欢迎提交问题和拉取请求！