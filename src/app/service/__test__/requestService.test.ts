import { describe, test, mock, Mock, afterEach } from 'node:test';
import assert from 'node:assert';
import { RequestService } from '../requestService.js';
import { IStorage, ISimpleStorage } from '../../types/Storage.js';

describe.only('RequestService', () => {
  const mockStorageService: IStorage = {
    set: mock.fn(),
    get: mock.fn(),
    executeIsolated: mock.fn(),
  };

  const ticket = 123;
  const inputNumber = 5;

  afterEach(() => {
    (mockStorageService.set as Mock<(k: string, v: string) => Promise<string>>).mock.resetCalls();
    (mockStorageService.get as Mock<(k: string) => Promise<string | null>>).mock.resetCalls();
    (
      mockStorageService.executeIsolated as Mock<(func: (client: ISimpleStorage) => Promise<void>) => Promise<void>>
    ).mock.resetCalls();
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

  describe('updateRequestWithField', () => {
    test('should update existing request with new field', async () => {
      const requestService = new RequestService(mockStorageService);
      const field = 'result';
      const value = 8;
      const existingData = JSON.stringify({ inputNumber });
      const expectedUpdatedData = JSON.stringify({ inputNumber, [field]: value });

      const mockIsolatedStorage: ISimpleStorage = {
        get: mock.fn(),
        set: mock.fn(),
      };

      const mockGet = mockIsolatedStorage.get as Mock<(k: string) => Promise<string | null>>;
      const mockSet = mockIsolatedStorage.set as Mock<(k: string, v: string) => Promise<string>>;
      const mockExecute = mockStorageService.executeIsolated as Mock<
        (func: (client: ISimpleStorage) => Promise<void>) => Promise<void>
      >;

      mockGet.mock.mockImplementation(() => Promise.resolve(existingData));
      mockSet.mock.mockImplementation(() => Promise.resolve(''));
      mockExecute.mock.mockImplementation(async (callback) => {
        await callback(mockIsolatedStorage);
      });

      await requestService.updateRequestWithField(ticket, field, value);

      assert.strictEqual(mockExecute.mock.calls.length, 1);
      assert.strictEqual(mockGet.mock.calls.length, 1);
      assert.strictEqual(mockGet.mock.calls.length, 1);

      const [actualStorageId] = mockGet.mock.calls[0].arguments;
      const [actualUpdateStorageId, actualUpdatedData] = mockSet.mock.calls[0].arguments;

      assert.strictEqual(actualStorageId, `fib_request_${ticket}`);
      assert.strictEqual(actualUpdateStorageId, `fib_request_${ticket}`);
      assert.strictEqual(actualUpdatedData, expectedUpdatedData);
    });

    test('should throw error when updating non-existing request', async () => {
      const requestService = new RequestService(mockStorageService);
      const field = 'result';
      const value = 8;

      const mockGet = mockStorageService.get as Mock<(k: string) => Promise<string | null>>;
      const mockSet = mockStorageService.set as Mock<(k: string, v: string) => Promise<string>>;
      const mockExecute = mockStorageService.executeIsolated as Mock<
        (func: (client: ISimpleStorage) => Promise<void>) => Promise<void>
      >;

      mockGet.mock.mockImplementation(() => Promise.resolve(null));
      mockSet.mock.mockImplementation(() => Promise.resolve(''));
      mockExecute.mock.mockImplementation(async (callback) => {
        await callback(mockStorageService);
      });

      await assert.rejects(() => requestService.updateRequestWithField(ticket, field, value), {
        message: `Not found request by ticket: ${ticket}`,
      });

      assert.strictEqual(mockExecute.mock.calls.length, 1);
      assert.strictEqual(mockGet.mock.calls.length, 1);
      assert.strictEqual(mockSet.mock.calls.length, 0);
    });
  });
});
