import request from 'supertest';
import { app } from '../app';
import { pool } from '../config/db';
import { type Pool } from 'pg';

describe('testing endpoints with database', () => {
  let pgPool: Pool;

  beforeAll(() => {
    pgPool = pool;
  });

  afterAll(async () => {
    await pgPool.end();
  });

  it(' when user exists pass /getUser?id=<id>', async () => {
    const client = await pgPool.connect();
    try {
      const res = await request(app).get(
        '/getUser?id=d2792a62-86a4-4c49-a909-b1e762c683a3'
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        user: {
          id: 'd2792a62-86a4-4c49-a909-b1e762c683a3',
          username: 'JohnDoe'
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      client.release();
    }
  });

  it('when user doesnt exist fail /getUser?id=<id>', async () => {
    const client = await pgPool.connect();
    try {
      const res = await request(app).get(
        '/getUser?id=d2792a62-86a4-4c49-a909-b1e762c683f2'
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ user: 'user not found' });
    } catch (err) {
      console.error(err);
    } finally {
      client.release();
    }
  });
});
