import postgres from 'postgres';

const sql = postgres('postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', {
  transform: postgres.camel
});

async function checkSettings() {
  try {
    const settings = await sql`SELECT * FROM app_settings WHERE id = 1`;
    console.log('Settings in database:');
    console.log(settings[0]);
  } catch (error) {
    console.error('Error fetching settings:', error);
  } finally {
    await sql.end();
  }
}

checkSettings();