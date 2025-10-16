import { sql } from './src/lib/db';

async function getWidgetId() {
  try {
    const websites = await sql`SELECT id, name, url FROM websites`;
    
    console.log('Available websites:');
    websites.forEach((website, index) => {
      console.log(`${index + 1}. ID: ${website.id}`);
      console.log(`   Name: ${website.name}`);
      console.log(`   URL: ${website.url}`);
      console.log('-------------------');
    });
    
    if (websites.length > 0) {
      console.log('\nUse the following ID in your widget script:');
      console.log(`data-widget-id="${websites[0].id}"`);
    } else {
      console.log('No websites found in the database.');
    }
  } catch (error) {
    console.error('Error fetching websites:', error);
  } finally {
    await sql.end();
  }
}

getWidgetId();