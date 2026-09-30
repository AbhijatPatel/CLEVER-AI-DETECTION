import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';

describe('Clever AI Backend API Health & Security Tests', () => {
  it('GET /api/v1/health should return healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /api/v1/ready should return ready status', async () => {
    const res = await request(app).get('/api/v1/ready');
    expect(res.status).toBe(200);
    expect(res.body.ready).toBe(true);
  });

  it('Protected route /api/v1/auth/me should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/v1/auth/register should validate invalid email format', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'not-an-email',
      password: 'Short',
      name: 'Tester'
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });
});
