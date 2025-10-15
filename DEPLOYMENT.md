# 部署指南

## 项目概述
这是一个基于Next.js的客服聊天系统，包含管理员仪表板和客户聊天小部件。

## 部署前准备

### 1. 环境变量配置
在部署之前，需要正确配置以下环境变量：

```env
NEXT_PUBLIC_APP_URL=你的应用URL (例如: https://your-app.com)
GEMINI_API_KEY=你的Google AI API密钥 (可选，用于AI功能)
POSTGRES_URL=你的PostgreSQL数据库连接URL
```

### 2. 数据库设置
确保你的PostgreSQL数据库已经创建了必要的表结构。项目包含数据库迁移脚本。

## 部署到不同平台

### Vercel部署
1. 将代码推送到GitHub仓库
2. 在Vercel上导入项目
3. 配置环境变量
4. 部署

### 手动部署
1. 确保服务器已安装Node.js (版本18或更高)
2. 克隆代码到服务器
3. 运行以下命令：
   ```bash
   npm install
   npm run build
   npm start
   ```

## 构建和运行命令
- 开发模式: `npm run dev`
- 构建项目: `npm run build`
- 生产模式: `npm start`

## 环境要求
- Node.js 18或更高版本
- PostgreSQL数据库
- 至少1GB内存

## 注意事项
1. 确保环境变量配置正确
2. 数据库连接URL需要有正确的读写权限
3. 如果不使用AI功能，可以不配置GEMINI_API_KEY