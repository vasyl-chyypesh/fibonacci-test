import { describe, test, mock, afterEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js';
import { ServiceFactory, ClassName } from '../service/serviceFactory.js';

describe('API Output Tests', () => {
  // Mock ServiceFactory
  const mockGetRequest = mock.fn<(ticket: number) => Promise<string | null>>();

  mock.method(ServiceFactory, 'getInstanceOfClass', async (className: ClassName) => {
    if (className === ClassName.RequestService) {
      return {
        getRequest: mockGetRequest
      };
    }
    throw new Error('Unknown class');
  });

  afterEach(() => {
    // Reset mock calls
    (ServiceFactory.getInstanceOfClass as any).mock.resetCalls();
    mockGetRequest.mock.resetCalls();
  });

  describe('GET /output/:ticket', () => {
    test('should return fibonacci result when valid ticket is provided', async () => {
      const ticket = 12345;
      const inputNumber = 10;
      const result = '55'; // Fibonacci of 10

      // Mock the request service to return data for this ticket
      mockGetRequest.mock.mockImplementation(() =>
        Promise.resolve(JSON.stringify({ inputNumber, result }))
      );

      const response = await request(app)
        .get(`/output/${ticket}`)
        .set('Accept', 'application/json');

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body, {
        ticket,
        inputNumber,
        fibonacci: result
      });

      // Verify ServiceFactory was called correctly
      assert.strictEqual((ServiceFactory.getInstanceOfClass as any).mock.calls.length, 1);
      assert.strictEqual(
        (ServiceFactory.getInstanceOfClass as any).mock.calls[0].arguments[0],
        ClassName.RequestService
      );

      // Verify getRequest was called with the correct ticket
      assert.strictEqual(mockGetRequest.mock.calls.length, 1);
      const [actualTicket] = mockGetRequest.mock.calls[0].arguments;
      assert.strictEqual(actualTicket, ticket);
    });

    test('should return 404 when ticket does not exist', async () => {
      const ticket = 99999;

      // Mock the request service to return null (ticket not found)
      mockGetRequest.mock.mockImplementation(() => Promise.resolve(null));

      const response = await request(app)
        .get(`/output/${ticket}`)
        .set('Accept', 'application/json');

      assert.strictEqual(response.status, 404);
      assert.ok(response.body.message.includes('Not found data for ticket'));
    });

    test('should return 404 when result is not available yet', async () => {
      const ticket = 12345;
      const inputNumber = 10;

      // Mock the request service to return data without result
      mockGetRequest.mock.mockImplementation(() =>
        Promise.resolve(JSON.stringify({ inputNumber }))
      );

      const response = await request(app)
        .get(`/output/${ticket}`)
        .set('Accept', 'application/json');

      assert.strictEqual(response.status, 404);
      assert.ok(response.body.message.includes('Not found result for ticket'));
    });

    test('should return 400 when ticket is not a number', async () => {
      const response = await request(app)
        .get('/output/not-a-number')
        .set('Accept', 'application/json');

      assert.strictEqual(response.status, 400);
      assert.ok(response.body.message.includes('ticket must be integer'));
    });

    test('should return 400 when ticket is less than minimum', async () => {
      const response = await request(app)
        .get('/output/0')
        .set('Accept', 'application/json');

      assert.strictEqual(response.status, 400);
      assert.ok(response.body.message.includes('ticket must be >= 1'));
    });
  });
});
