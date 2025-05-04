import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// 执行上下文接口
interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
}

// 环境变量接口
interface Env {
  [key: string]: any;
}

// 定义我们的MCP时间服务器
export class McpTimeServer {
  server = new McpServer({
    name: "MCP Time Server",
    version: "1.0.0",
  });

  async init() {
    // 获取当前时间工具
    this.server.tool(
      'get_current_time',
      '获取指定时区的当前时间',
      { 
        timezone: z.string().optional()
      },
      async ({ timezone }) => {
        try {
          // 如果没有提供时区，使用UTC
          const tz = timezone || "UTC";
          
          // 日期格式选项
          const options: Intl.DateTimeFormatOptions = {
            timeZone: tz,
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false, // 24小时制
          };
          
          // 获取当前日期并根据时区格式化
          const currentDate = new Date();
          const formatter = new Intl.DateTimeFormat('en-US', options);
          const formattedDate = formatter.format(currentDate);
          
          // 获取时区偏移
          const tzOffset = formatter.resolvedOptions().timeZone;
          
          return {
            content: [{ 
              type: "text", 
              text: `${formattedDate} (${tzOffset})`
            }],
          };
        } catch (error) {
          return {
            content: [{ 
              type: "text", 
              text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }],
          };
        }
      }
    );

    // 在不同时区之间转换时间
    this.server.tool(
      'convert_time',
      '在不同时区之间转换时间',
      {
        source_timezone: z.string(),
        time: z.string(), // 格式: HH:MM
        target_timezone: z.string()
      },
      async ({ source_timezone, time, target_timezone }) => {
        try {
          // 解析时间字符串 (HH:MM)
          const [hours, minutes] = time.split(':').map(Number);
          if (isNaN(hours) || isNaN(minutes)) {
            throw new Error("无效的时间格式。请使用HH:MM格式。");
          }
          
          // 第1步：为当前日期创建一个日期对象
          const today = new Date();
          const year = today.getFullYear();
          const month = today.getMonth();
          const day = today.getDate();
          
          // 第2步：创建ISO格式的日期字符串，指定时间
          // 这会在本地时区创建指定时间的日期
          const localDate = new Date(year, month, day, hours, minutes, 0, 0);
          
          // 第3步：获取表示此本地时间的UTC时间
          const utcYear = localDate.getUTCFullYear();
          const utcMonth = localDate.getUTCMonth();
          const utcDay = localDate.getUTCDate();
          const utcHours = localDate.getUTCHours();
          const utcMinutes = localDate.getUTCMinutes();
          
          // 第4步：使用UTC时间创建新的Date
          const utcDate = new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHours, utcMinutes, 0, 0));
          
          // 第5步：直接在源时区和目标时区格式化这些时间
          // 格式化源时区以验证
          const sourceFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: source_timezone,
            hour: "numeric",
            minute: "numeric",
            hour12: false
          });
          
          // 格式化目标时区
          const targetFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: target_timezone,
            hour: "numeric",
            minute: "numeric",
            hour12: false
          });
          
          // 第6步：获取格式化的时间
          const sourceTime = sourceFormatter.format(utcDate);
          const [sourceHours, sourceMinutes] = sourceTime.split(':').map(Number);
          
          // 第7步：如果请求的时间和格式化的源时间之间存在差异，
          // 我们需要调整我们的UTC日期
          const hoursDiff = hours - sourceHours;
          const minutesDiff = minutes - sourceMinutes;
          
          // 创建调整后的UTC日期
          const adjustedUtcDate = new Date(utcDate);
          adjustedUtcDate.setUTCHours(
            adjustedUtcDate.getUTCHours() + hoursDiff,
            adjustedUtcDate.getUTCMinutes() + minutesDiff
          );
          
          // 第8步：现在使用调整后的UTC日期获取目标时间
          const targetTime = targetFormatter.format(adjustedUtcDate);
          
          // 第9步：返回结果
          return {
            content: [{ 
              type: "text", 
              text: `${time} 在 ${source_timezone} 相当于 ${targetTime} 在 ${target_timezone}`
            }],
          };
        } catch (error) {
          return {
            content: [{ 
              type: "text", 
              text: `错误: ${error instanceof Error ? error.message : String(error)}`
            }],
          };
        }
      }
    );
  }
}

// 添加命令行入口点
export function cli() {
  async function main() {
    const server = new McpTimeServer();
    await server.init();
    
    const transport = new StdioServerTransport();
    await server.server.connect(transport);
    console.log('MCP时间服务器正在通过stdio运行');
  }
  
  main().catch((error) => {
    console.error('主函数出现致命错误:', error);
    process.exit(1);
  });
}

// 对于Cloudflare Workers环境的处理函数
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    
    if (url.pathname === "/mcp") {
      // 在这里处理MCP请求
      return new Response("MCP服务器", { status: 200 });
    }
    
    return new Response("未找到", { status: 404 });
  },
};
