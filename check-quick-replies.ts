import { sql } from './src/lib/db';

async function checkQuickReplies() {
  try {
    const replies = await sql`SELECT * FROM quick_replies`;
    console.log('Quick replies in DB:', replies);
  } catch (error) {
    console.error('Error fetching quick replies:', error);
  } finally {
    await sql.end();
  }
}

checkQuickReplies();