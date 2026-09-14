import request from 'supertest';
import { createApp } from '../src/app';

describe('App smoke test', () => {
  const app = createApp();

  it('GET /api/health retorna status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('GET /rota-inexistente retorna 404 padronizado', async () => {
    const res = await request(app).get('/rota-inexistente');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('NOT_FOUND_ERROR');
  });
});
