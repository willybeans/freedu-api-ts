import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const port: number = parseInt(<string>process.env.POSTGRES_PORT, 10) || 5432;

export const pool = new Pool(
  process?.env?.ISPROD === 'true'
    ? { connectionString: process.env.POSTGRES_URL }
    : {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_NAME,
        password: process.env.POSTGRES_CLIENT_PASSWORD,
        port
      }
);

pool.on('error', (err) => {
  console.error('error connecting to db', err);
});

export const query = async (text: string, values: Array<string | number>) => {
  const start = Date.now();
  const res = await pool.query(text, values);
  const duration = Date.now() - start;
  // log here for dev
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

// clients are used for running multiple queries at once
// export const getClient = async () => {
//   const client = await pool.connect()
//   const query = client.query
//   const release = client.release
//   // set a timeout of 5 seconds, after which we will log this client's last query
//   const timeout = setTimeout(() => {
//     console.error('A client has been checked out for more than 5 seconds!')
//     console.error(`The last executed query on this client was: ${client.lastQuery}`)
//   }, 5000)
//   // monkey patch the query method to keep track of the last query executed
//   client.query = (...args) => {
//     client.lastQuery = args
//     return query.apply(client, args)
//   }
//   client.release = () => {
//     // clear our timeout
//     clearTimeout(timeout)
//     // set the methods back to their old un-monkey-patched version
//     client.query = query
//     client.release = release
//     return release.apply(client)
//   }
//   return client
// }

export default query;
