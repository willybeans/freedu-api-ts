import request from 'supertest';
import app from '../src/index';

describe('Example Test', () => {
  it('should return "healthcheck"', async () => {
    const response = await request(app).get('/healthcheck');
    expect(response.status).toBe(200);
    expect(response.text).toBe('healthcheck');
  });
});

