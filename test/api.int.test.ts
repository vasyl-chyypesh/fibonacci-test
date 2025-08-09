import { describe, test } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3000';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('App Service Tests', () => {
  describe('GET /health', () => {
    test('should return 200 status with OK message', async () => {
      const response = await request(API_URL).get('/health');

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.message, 'OK');
      assert.ok(response.body.time, 'Response should include timestamp');

      // Verify the timestamp is in ISO format
      const timestamp = new Date(response.body.time);
      assert.ok(!isNaN(timestamp.getTime()), 'Time should be a valid date');
    });
  });

  describe('POST /input', () => {
    test('should return 200 status with ticket number', async () => {
      const response = await request(API_URL).post('/input').send({
        number: 5,
      });

      assert.strictEqual(response.status, 200);
      assert.ok(response.body.ticket);
    });
  });

  describe('GET /output', () => {
    test('should return 404 status with no result for ticket', async () => {
      const notUsedTicket = 12345;

      const response = await request(API_URL).get(`/output/${notUsedTicket}`);

      assert.strictEqual(response.status, 404);
      assert.strictEqual(response.body.message, `Not found data for ticket: ${notUsedTicket}`);
    });

    test('should return 200 status with result for ticket', async () => {
      const inputNumber = 1;
      const expectedResult = '1'; // string format for bigint

      const responseTicket = await request(API_URL).post('/input').send({
        number: inputNumber,
      });

      assert.strictEqual(responseTicket.status, 200);
      assert.ok(responseTicket.body.ticket);

      const ticket = responseTicket.body.ticket;

      await delay(1000); // wait for 1 second

      const response = await request(API_URL).get(`/output/${ticket}`);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.ticket, ticket);
      assert.strictEqual(response.body.inputNumber, inputNumber);
      assert.strictEqual(response.body.fibonacci, expectedResult);
    });
  });
});
