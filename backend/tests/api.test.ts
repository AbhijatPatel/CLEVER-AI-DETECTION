import request from 'supertest';
import app from '../src/app';

describe('Clever AI Backend API — Health & Security Tests', () => {
  it('GET /api/v1/health → returns 200 with healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/v1/ready → returns 200 with ready flag', async () => {
    const res = await request(app).get('/api/v1/ready');
    expect(res.status).toBe(200);
    expect(res.body.ready).toBe(true);
    expect(res.body.service).toBe('clever-ai-api-gateway');
  });

  it('GET /api/v1/auth/me (unauthenticated) → returns 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/analysis/text (unauthenticated) → returns 401', async () => {
    const res = await request(app).post('/api/v1/analysis/text').send({
      text: 'Some text content here'
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/auth/register with invalid email → returns 400', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'not-a-valid-email',
      password: 'Sh0rt!',
      name: 'Test'
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/v1/auth/login with missing credentials → returns 400', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'missing@test.com'
      // password intentionally omitted
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/v1/analysis with fake Bearer token → returns 401', async () => {
    const res = await request(app)
      .get('/api/v1/analysis')
      .set('Authorization', 'Bearer fake.jwt.token.here');
    expect(res.status).toBe(401);
  });
});
