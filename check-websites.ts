import postgres from 'postgres';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const pg_url = process.env.POSTGRES_URL;

// Use the neon serverless driver in production, postgres driver in development.
// The `postgres` package is smart enough to handle the connection string format.
// `transform: postgres.camel` automatically transforms snake_case columns to camelCase properties.
const sql = process.env.NODE_ENV === 'production' 
  ? postgres(pg_url, { ssl: 'require', transform: postgres.camel, ...neon(pg_url) }) 
  : postgres(pg_url, { transform: postgres.camel });

async function checkWebsites() {
  try {
    console.log('正在检查数据库中的网站信息...');
    
    // 获取所有网站
    const websites = await sql`SELECT * FROM websites`;
    
    if (websites.length === 0) {
      console.log('数据库中没有网站记录');
      console.log('widget页面需要一个有效的网站ID才能正常工作');
      console.log('请确保您已经添加了至少一个网站');
    } else {
      console.log(`找到 ${websites.length} 个网站:`);
      websites.forEach((website: any, index: number) => {
        console.log(`${index + 1}. ID: ${website.id}`);
        console.log(`   名称: ${website.name}`);
        console.log(`   URL: ${website.url}`);
        console.log(`   用户ID: ${website.userId}`);
        console.log('---');
      });
    }
    
    // 检查设置
    const settings = await sql`SELECT * FROM app_settings WHERE id = 1`;
    if (settings.length > 0) {
      console.log('应用设置:');
      console.log(`  主色调: ${settings[0].primaryColor}`);
      console.log(`  欢迎消息: ${settings[0].welcomeMessage}`);
    } else {
      console.log('未找到应用设置');
    }
  } catch (error) {
    console.error('检查数据库时出错:', error);
  } finally {
    process.exit(0);
  }
}

checkWebsites();