import { describe, test, mock, Mock, afterEach } from 'node:test';
import assert from 'node:assert';
import { IStorage } from '../../types/IStorage.js';
import { IdempotencyService } from '../idempotencyService.js';

describe('IdempotencyService', () => {
  const mockStorageService: IStorage = {
    set: mock.fn(),
    get: mock.fn(),
    increment: mock.fn(),
  };

  const idempotencyKey = 'test-idempotency-key';
  const data = { responseStatus: 200, responseBody: { ticket: 123 } };

  afterEach(() => {
    (mockStorageService.set as Mock<(k: string, v: string) => Promise<string>>).mock.resetCalls();
    (mockStorageService.get as Mock<(k: string) => Promise<string | null>>).mock.resetCalls();
  });

  describe('getIdempotency', () => {
    test('should return null if no data is found', async () => {
      const idempotencyService = new IdempotencyService(mockStorageService);
      const result = await idempotencyService.getIdempotency<typeof data>(idempotencyKey);
      assert.strictEqual(result, null);
    });

    test('should return data if it is found', async () => {
      const mockGet = mockStorageService.get as Mock<(k: string) => Promise<string | null>>;
      mockGet.mock.mockImplementation(() => Promise.resolve(JSON.stringify(data)));
      const expectedIdempotencyKey = `idempotency_${idempotencyKey}`;

      const idempotencyService = new IdempotencyService(mockStorageService);
      const result = await idempotencyService.getIdempotency<typeof data>(idempotencyKey);

      assert.strictEqual(mockGet.mock.callCount(), 1);
      const [actualIdempotencyKey] = mockGet.mock.calls[0].arguments;
      assert.strictEqual(actualIdempotencyKey, expectedIdempotencyKey);
      assert.deepStrictEqual(result, data);
    });
  });

  describe('setIdempotency', () => {
    test('should set data for idempotency key', async () => {
      const mockSet = mockStorageService.set as Mock<(k: string, v: string) => Promise<string>>;
      mockSet.mock.mockImplementation(() => Promise.resolve(''));
      const expectedIdempotencyKey = `idempotency_${idempotencyKey}`;

      const idempotencyService = new IdempotencyService(mockStorageService);
      await idempotencyService.setIdempotency(idempotencyKey, data);

      assert.strictEqual(mockSet.mock.callCount(), 1);
      const [actualIdempotencyKey, actualData] = mockSet.mock.calls[0].arguments;
      assert.strictEqual(actualIdempotencyKey, expectedIdempotencyKey);
      assert.strictEqual(actualData, JSON.stringify(data));
    });
  });
});
