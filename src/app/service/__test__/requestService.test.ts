import { describe, test, mock, Mock, afterEach } from 'node:test';
import assert from 'node:assert';
import { RequestService } from '../requestService.js';
import { IStorage } from '../../types/IStorage.js';

describe.only('RequestService', () => {
  const mockStorageService: IStorage = {
    set: mock.fn(),
    get: mock.fn(),
    increment: mock.fn(),
  };

  const ticket = 123;
  const inputNumber = 5;

  afterEach(() => {
    (mockStorageService.set as Mock<(k: string, v: string) => Promise<string>>).mock.resetCalls();
    (mockStorageService.get as Mock<(k: string) => Promise<string | null>>).mock.resetCalls();
  });

  describe('addRequest', () => {
    test('should store request with input number', async () => {
      const requestService = new RequestService(mockStorageService);
      const expectedStorageId = `fib_request_${ticket}`;
      const expectedData = JSON.stringify({ inputNumber });

      const mockSet = mockStorageService.set as Mock<(k: string, v: string) => Promise<string>>;

      mockSet.mock.mockImplementation(() => Promise.resolve(''));

      await requestService.addRequest(ticket, inputNumber);

      assert.strictEqual(mockSet.mock.calls.length, 1);
      const [actualStorageId, actualData] = mockSet.mock.calls[0].arguments;
      assert.strictEqual(actualStorageId, expectedStorageId);
      assert.strictEqual(actualData, expectedData);
    });
  });

  describe('getRequest', () => {
    test('should retrieve stored request', async () => {
      const requestService = new RequestService(mockStorageService);
      const expectedStorageId = `fib_request_${ticket}`;
      const expectedData = JSON.stringify({ inputNumber });

      const mockGet = mockStorageService.get as Mock<(k: string) => Promise<string | null>>;
      mockGet.mock.mockImplementation(() => Promise.resolve(expectedData));

      const result = await requestService.getRequest(ticket);

      assert.strictEqual(mockGet.mock.calls.length, 1);
      const [actualStorageId] = mockGet.mock.calls[0].arguments;
      assert.strictEqual(actualStorageId, expectedStorageId);
      assert.strictEqual(result, expectedData);
    });
  });

  describe('updateRequestWithData', () => {
    test('should update existing request with new field', async () => {
      const requestService = new RequestService(mockStorageService);
      const field = 'result';
      const value = 8;
      const expectedUpdatedData = JSON.stringify({ inputNumber, [field]: value });

      const mockSet = mockStorageService.set as Mock<(k: string, v: string) => Promise<string>>;
      mockSet.mock.mockImplementation(() => Promise.resolve(''));

      await requestService.updateRequestWithData(ticket, { inputNumber, result: value });

      assert.strictEqual(mockSet.mock.calls.length, 1);

      const [actualUpdateStorageId, actualUpdatedData] = mockSet.mock.calls[0].arguments;

      assert.strictEqual(actualUpdateStorageId, `fib_request_${ticket}`);
      assert.strictEqual(actualUpdatedData, expectedUpdatedData);
    });
  });
});
