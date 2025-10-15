@echo off
echo 开始准备部署包...

# 创建部署目录
if not exist deployment mkdir deployment
if not exist deployment\src mkdir deployment\src

# 复制必要文件
xcopy src deployment\src /E /I /H
copy package.json deployment\
copy next.config.ts deployment\
copy tsconfig.json deployment\
copy tailwind.config.ts deployment\
copy postcss.config.mjs deployment\
copy components.json deployment\
copy .env.production deployment\.env
xcopy public deployment\public /E /I /H

# 创建部署说明
echo # 部署说明 > deployment\README.md
echo. >> deployment\README.md
echo ## 安装依赖 >> deployment\README.md
echo npm install >> deployment\README.md
echo. >> deployment\README.md
echo ## 构建应用 >> deployment\README.md
echo npm run build >> deployment\README.md
echo. >> deployment\README.md
echo ## 启动应用 >> deployment\README.md
echo npm start >> deployment\README.md
echo. >> deployment\README.md
echo ## 环境变量 >> deployment\README.md
echo 请确保配置了正确的环境变量： >> deployment\README.md
echo - NEXT_PUBLIC_APP_URL >> deployment\README.md
echo - POSTGRES_URL >> deployment\README.md
echo - GEMINI_API_KEY (可选) >> deployment\README.md

echo 部署包已准备完成，位于 deployment 目录中
echo 请根据你的部署平台配置环境变量并运行应用
pause