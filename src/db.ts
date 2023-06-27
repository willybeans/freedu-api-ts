import { Pool } from 'pg';
const port: number = parseInt(<string>process.env.DB_PORT, 10) || 5432;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port
});

export default pool;
