import { describe, test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { ConsumeMessage } from 'amqplib';
import JobHandler from '../jobHandler.js';
import { Fibonacci } from '../fibonacci.js';
import { RequestService } from '../../app/service/requestService.js';

describe('JobHandler', () => {
  let jobHandler: JobHandler;
  let mockFibonacci: Fibonacci;
  let mockRequestService: RequestService;

  const mockGetValueFor = mock.fn<(ticket: number) => Promise<bigint>>();
  const mockUpdateRequestWithData = mock.fn<(ticket: number, data: any) => Promise<void>>();

  beforeEach(() => {
    mockFibonacci = {
      getValueFor: mockGetValueFor,
    } as unknown as Fibonacci;

    mockRequestService = {
      updateRequestWithData: mockUpdateRequestWithData,
    } as unknown as RequestService;

    jobHandler = new JobHandler(mockFibonacci, mockRequestService);
  });

  afterEach(() => {
    mockGetValueFor.mock.resetCalls();
    mockUpdateRequestWithData.mock.resetCalls();
  });

  describe('handleMessage method', () => {
    test('should successfully process a valid message', async () => {
      const ticket = 123;
      const inputNumber = 10;
      const result = 55n;

      const jobMessage = {
        content: Buffer.from(JSON.stringify({ ticket, inputNumber })),
        fields: {},
        properties: {},
      } as ConsumeMessage;

      mockGetValueFor.mock.mockImplementation(() => Promise.resolve(result));
      mockUpdateRequestWithData.mock.mockImplementation(() => Promise.resolve());

      await jobHandler.handleMessage(jobMessage);

      assert.strictEqual(mockGetValueFor.mock.callCount(), 1);
      assert.strictEqual(mockGetValueFor.mock.calls[0].arguments[0], inputNumber);
      assert.strictEqual(mockUpdateRequestWithData.mock.callCount(), 1);
      assert.strictEqual(mockUpdateRequestWithData.mock.calls[0].arguments[0], ticket);
      assert.deepEqual(mockUpdateRequestWithData.mock.calls[0].arguments[1], {
        inputNumber,
        result: result.toString(),
      });
    });

    test('should handle invalid JSON in message content', async () => {
      const jobMessageWithInvalidJson = {
        content: Buffer.from('invalid json'),
        fields: {},
        properties: {},
      } as ConsumeMessage;

      mockGetValueFor.mock.mockImplementation(() => Promise.resolve(55n));
      mockUpdateRequestWithData.mock.mockImplementation(() => Promise.resolve());

      await jobHandler.handleMessage(jobMessageWithInvalidJson);

      assert.strictEqual(mockGetValueFor.mock.callCount(), 0);
      assert.strictEqual(mockUpdateRequestWithData.mock.callCount(), 0);
    });
  });
});
