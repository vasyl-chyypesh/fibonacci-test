import { describe, test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js';
import { MESSAGES } from '../utils/errors/messages.js';

describe('App Service Tests', () => {
  describe('GET /health', () => {
    test('should return 200 status with OK message', async () => {
      const response = await request(app).get('/health');

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.message, 'OK');
      assert.ok(response.body.time, 'Response should include timestamp');

      // Verify the timestamp is in ISO format
      const timestamp = new Date(response.body.time);
      assert.ok(!isNaN(timestamp.getTime()), 'Time should be a valid date');
    });
  });

  describe('GET /notfound', () => {
    test('should return 404 status with not found message', async () => {
      const response = await request(app).get('/notfound');

      assert.strictEqual(response.status, 404);
      assert.strictEqual(response.body.message, MESSAGES.PAGE_NOT_FOUND);
    });
  });
});
