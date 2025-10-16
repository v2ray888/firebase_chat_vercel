import { sql } from '../src/lib/db.js';

async function getWebsites() {
  try {
    // 获取所有网站
    const websites = await sql`SELECT * FROM websites`;
    
    console.log('现有网站:');
    websites.forEach(website => {
      console.log(`ID: ${website.id}`);
      console.log(`名称: ${website.name}`);
      console.log(`URL: ${website.url}`);
      console.log(`用户ID: ${website.userId}`);
      console.log('---');
    });
    
    // 如果没有网站，创建一个测试网站
    if (websites.length === 0) {
      console.log('没有找到网站，创建一个测试网站...');
      const newWebsite = await sql`
        INSERT INTO websites (name, url, user_id)
        VALUES ('测试网站', 'http://localhost:3000', '00000000-0000-0000-0000-000000000000')
        RETURNING *
      `;
      console.log('创建的测试网站:', newWebsite[0]);
    }
  } catch (error) {
    console.error('获取网站信息时出错:', error);
  } finally {
    process.exit(0);
  }
}

getWebsites();