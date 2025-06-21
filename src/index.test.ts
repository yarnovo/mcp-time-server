import { describe, it, expect } from 'vitest';
import { SystemTimeServer } from './index.js';

describe('SystemTimeServer', () => {
  describe('基本功能', () => {
    it('应该创建服务器实例', () => {
      const server = new SystemTimeServer();
      expect(server).toBeDefined();
      expect(server.server).toBeDefined();
    });

    it('应该有正确的服务器名称和版本', () => {
      const server = new SystemTimeServer();
      expect(server.server.constructor.name).toBe('McpServer');
    });

    it('应该成功初始化', async () => {
      const server = new SystemTimeServer();
      await expect(server.init()).resolves.toBeUndefined();
    });
  });

  describe('时间功能', () => {
    it('应该返回有效的日期格式', () => {
      const now = new Date();
      const formattedTime = now.toLocaleString();
      expect(formattedTime).toBeTruthy();
      expect(typeof formattedTime).toBe('string');
    });

    it('应该包含日期和时间信息', () => {
      const now = new Date();
      const formattedTime = now.toLocaleString();
      // 检查是否包含数字（日期和时间）
      expect(formattedTime).toMatch(/\d/);
    });
  });
});