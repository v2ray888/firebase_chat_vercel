import postgres from 'postgres';
import { neon } from '@neondatabase/serverless';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const pg_url = process.env.POSTGRES_URL;

// Use the neon serverless driver in production
// Use the standard postgres driver in development
// The 'postgres' package is smart enough to handle the connection string format
const sql = process.env.NODE_ENV === 'production' 
  ? postgres(pg_url, { ssl: 'require', transform: postgres.camel, ...neon(pg_url) }) 
  : postgres(pg_url, { transform: postgres.camel });

export { sql };
