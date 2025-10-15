#!/bin/bash

# 部署脚本
echo "开始准备部署包..."

# 创建部署目录
mkdir -p deployment
mkdir -p deployment/src

# 复制必要文件
cp -r src deployment/
cp package.json deployment/
cp next.config.ts deployment/
cp tsconfig.json deployment/
cp tailwind.config.ts deployment/
cp postcss.config.mjs deployment/
cp components.json deployment/
cp .env.production deployment/.env
cp -r public deployment/

# 创建部署说明
cat > deployment/README.md << EOF
# 部署说明

## 安装依赖
npm install

## 构建应用
npm run build

## 启动应用
npm start

## 环境变量
请确保配置了正确的环境变量：
- NEXT_PUBLIC_APP_URL
- POSTGRES_URL
- GEMINI_API_KEY (可选)
EOF

# 创建package.json用于部署
cat > deployment/package.json << EOF
{
  "name": "chat-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@genkit-ai/google-genai": "^1.20.0",
    "@genkit-ai/next": "^1.20.0",
    "@hookform/resolvers": "^4.1.3",
    "@neondatabase/serverless": "^0.9.4",
    "@next/font": "^14.2.5",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "genkit": "^1.20.0",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "next-themes": "^0.3.0",
    "postgres": "^3.4.4",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "react-resizable-panels": "^2.0.20",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  }
}
EOF

echo "部署包已准备完成，位于 deployment 目录中"
echo "请根据你的部署平台配置环境变量并运行应用"