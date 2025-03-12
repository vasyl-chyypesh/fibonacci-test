import { describe, test, mock, after, afterEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js';
import { ServiceFactory, ClassName } from '../service/serviceFactory.js';
import { QueueHandler } from '../queue/queueHandler.js';

describe('API Tests', () => {
  // Mock ServiceFactory and QueueHandler
  mock.method(ServiceFactory, 'getInstanceOfClass', async (className: ClassName) => {
    if (className === ClassName.TicketService) {
      return {
        getTicket: async () => 12345,
      };
    } else if (className === ClassName.RequestService) {
      return {
        addRequest: async () => {},
      };
    }
    throw new Error('Unknown class');
  });

  // Mock QueueHandler
  const originalQueueHandler = QueueHandler.prototype.addJobToQueue;
  // Use type assertion to handle the mock function type
  QueueHandler.prototype.addJobToQueue = mock.fn(
    async () => true,
  ) as unknown as typeof QueueHandler.prototype.addJobToQueue;

  // Restore original implementation after tests
  after(() => {
    QueueHandler.prototype.addJobToQueue = originalQueueHandler;
  });

  describe('POST /input', () => {
    afterEach(() => {
      // Reset mock calls
      (ServiceFactory.getInstanceOfClass as any).mock.resetCalls();
      (QueueHandler.prototype.addJobToQueue as any).mock.resetCalls();
    });

    test('should return ticket when valid input is provided', async () => {
      const inputNumber = 10;
      const expectedTicket = 12345;

      const response = await request(app)
        .post('/input')
        .send({ number: inputNumber })
        .set('Content-Type', 'application/json');

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.ticket, expectedTicket);

      // Verify ServiceFactory was called correctly
      assert.strictEqual((ServiceFactory.getInstanceOfClass as any).mock.calls.length, 2);
      assert.strictEqual(
        (ServiceFactory.getInstanceOfClass as any).mock.calls[0].arguments[0],
        ClassName.TicketService,
      );
      assert.strictEqual(
        (ServiceFactory.getInstanceOfClass as any).mock.calls[1].arguments[0],
        ClassName.RequestService,
      );

      // Verify QueueHandler was called correctly
      assert.strictEqual((QueueHandler.prototype.addJobToQueue as any).mock.calls.length, 1);
      const [queueName, jobData] = (QueueHandler.prototype.addJobToQueue as any).mock.calls[0].arguments;
      assert.strictEqual(queueName, 'fibonacci_queue');
      assert.strictEqual(jobData.ticket, expectedTicket);
      assert.strictEqual(jobData.inputNumber, inputNumber);
    });

    test('should return 400 when input is missing', async () => {
      const response = await request(app).post('/input').send({}).set('Content-Type', 'application/json');

      assert.strictEqual(response.status, 400);
      assert.ok(response.body.message.includes('required'));
    });

    test('should return 400 when input number is less than minimum', async () => {
      const response = await request(app).post('/input').send({ number: 0 }).set('Content-Type', 'application/json');

      assert.strictEqual(response.status, 400);
      assert.ok(response.body.message.includes('number must be >= 1'));
    });

    test('should return 400 when input is not a number', async () => {
      const response = await request(app)
        .post('/input')
        .send({ number: 'not-a-number' })
        .set('Content-Type', 'application/json');

      assert.strictEqual(response.status, 400);
      assert.ok(response.body.message.includes('number must be integer'));
    });

    test('should return 400 when additional properties are provided', async () => {
      const response = await request(app)
        .post('/input')
        .send({ number: 10, extraProperty: 'value' })
        .set('Content-Type', 'application/json');

      assert.strictEqual(response.status, 400);
      assert.ok(response.body.message.includes('additional'));
    });
  });
});
