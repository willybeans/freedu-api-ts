import request from 'supertest';
import { app } from '../app';
import { pool } from '../config/db';
import { type Pool } from 'pg';

console.log('test:', process.env.POSTGRES_CLIENT_PASSWORD);
console.log('test:', process.env.POSTGRES_NAME);
console.log('test:', process.env.POSTGRES_HOST);
console.log('test:', process.env.POSTGRES_PORT);
console.log('test:', process.env.POSTGRES_USER);

describe('testing endpoints with database', () => {
  let pgPool: Pool;

  beforeAll(() => {
    pgPool = pool;
  });

  afterAll(async () => {
    await pgPool.end();
  });

  it('/getUser?id=2', async () => {
    const client = await pgPool.connect();
    try {
      const res = await request(app).get('/getUser?id=2');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        user: {
          id: 2,
          username: 'testname',
          password: '123456abcdef'
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      client.release();
    }
  });

  it('when user doesnt exist /getUser?id=1', async () => {
    const client = await pgPool.connect();
    try {
      const res = await request(app).get('/getUser?id=1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ user: 'user not found' });
    } catch (err) {
      console.error(err);
    } finally {
      client.release();
    }
  });
});
