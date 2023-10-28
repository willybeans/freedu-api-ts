import request from 'supertest';
import { app } from '../src/app';

// afterAll(done => {
// //    app.close();
//     done();
// });

describe('Example Test', () => {
  it('should return "healthcheck"', async () => {
    const response = await request(app).get('/healthcheck');
    expect(response.status).toBe(200);
    expect(response.text).toBe('HealthCheck');
  });
});
