import request from 'supertest';

jest.mock('../../src/infrastructure/persistence/db', () => ({
  __esModule: true,
  default: {
    healthCheck: jest.fn().mockResolvedValue(true),
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
  },
}));

import { createApp } from '../../src/app';

const app = createApp();

describe('API integration', () => {
  describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /ready', () => {
    it('should return 200 and ready when DB is healthy', async () => {
      const res = await request(app).get('/ready');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ready');
      expect(res.body.database).toBe('connected');
    });
  });

  describe('POST /api/contact', () => {
    it('should return 400 for invalid body (missing required fields)', async () => {
      const res = await request(app)
        .post('/api/contact')
        .set('Content-Type', 'application/json')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/contact')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Test',
          email: 'not-an-email',
          message: 'Hello',
        });
      expect(res.status).toBe(400);
    });
  });

  describe('404', () => {
    it('should return 404 for unknown route', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Route not found');
    });
  });
});
