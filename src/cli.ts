import { McpTimeServer } from './index';
import http from 'http';

export function cli() {
  const server = new McpTimeServer();
  
  // 初始化MCP服务器
  server.init().then(() => {
    console.log("MCP时间服务器已初始化！");
    
    // 创建HTTP服务器
    const httpServer = http.createServer((req, res) => {
      const url = new URL(req.url || '/', `http://${req.headers.host}`);
      
      if (url.pathname === "/mcp") {
        // 处理MCP请求
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
          status: 'ok',
          message: 'MCP服务器正在运行',
          tools: ['get_current_time', 'convert_time']
        }));
      } else if (url.pathname === "/sse" || url.pathname === "/sse/message") {
        // 处理SSE请求
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        res.write('data: MCP SSE正在运行\n\n');
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('未找到');
      }
    });
    
    // 在端口3000上启动服务器
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`MCP时间服务器正在运行，地址：http://localhost:${PORT}`);
      console.log(`- MCP端点: http://localhost:${PORT}/mcp`);
      console.log(`- SSE端点: http://localhost:${PORT}/sse`);
    });
  }).catch(error => {
    console.error("初始化MCP时间服务器失败:", error);
    process.exit(1);
  });
}
