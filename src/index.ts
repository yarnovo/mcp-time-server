import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export class SystemTimeServer {
  server = new McpServer({
    name: "System Time Server",
    version: "1.0.0",
  });

  async init() {
    // 获取当前系统时间工具
    this.server.tool(
      'get_current_time',
      '获取当前系统时间',
      {},
      async () => {
        const now = new Date();
        const formattedTime = now.toLocaleString();
        
        return {
          content: [{ 
            type: "text", 
            text: formattedTime
          }],
        };
      }
    );
  }
}

// 命令行入口点
export function cli() {
  async function main() {
    const server = new SystemTimeServer();
    await server.init();
    
    const transport = new StdioServerTransport();
    await server.server.connect(transport);
    console.log('系统时间服务器正在运行');
  }
  
  main().catch((error) => {
    console.error('服务器启动失败:', error);
    process.exit(1);
  });
}