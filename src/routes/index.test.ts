import request from 'supertest';
import { app } from '../app';
import { pool, query } from '../config/db';

require('dotenv').config();

describe('testing postgres', () => {
  let pgPool;

  beforeAll(() => {
    // pgPool = pool;
    pool.connect();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should test', async () => {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query('SELECT 1 AS "result"');
      expect(rows[0]['result']).toBe(1);

      await client.query('ROLLBACK');
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  });
});

describe('Example Test', () => {
  it('should return "healthcheck"', async () => {
    const response = await request(app).get('/healthcheck');
    expect(response.status).toBe(200);
    expect(response.text).toBe('healthcheck');
  });
});
