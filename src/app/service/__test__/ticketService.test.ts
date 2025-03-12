import { describe, test, mock, Mock, afterEach } from 'node:test';
import assert from 'node:assert';
import { TicketService } from '../ticketService.js';
import { IStorage, ISimpleStorage } from '../../types/IStorage.js';

describe('TicketService', () => {
  const mockStorageService: IStorage = {
    set: mock.fn(),
    get: mock.fn(),
    executeIsolated: mock.fn(),
  };

  afterEach(() => {
    (mockStorageService.set as Mock<(k: string, v: string) => Promise<string>>).mock.resetCalls();
    (mockStorageService.get as Mock<(k: string) => Promise<string | null>>).mock.resetCalls();
    (
      mockStorageService.executeIsolated as Mock<(func: (client: ISimpleStorage) => Promise<void>) => Promise<void>>
    ).mock.resetCalls();
  });

  describe('getTicket', () => {
    test('should return first ticket number when no previous ticket exists', async () => {
      const ticketService = new TicketService(mockStorageService);
      const mockIsolatedStorage: ISimpleStorage = {
        get: mock.fn(),
        set: mock.fn(),
      };

      const mockGet = mockIsolatedStorage.get as Mock<(k: string) => Promise<string | null>>;
      const mockSet = mockIsolatedStorage.set as Mock<(k: string, v: string) => Promise<string>>;
      const mockExecute = mockStorageService.executeIsolated as Mock<
        (func: (client: ISimpleStorage) => Promise<void>) => Promise<void>
      >;

      mockGet.mock.mockImplementation(() => Promise.resolve(null));
      mockSet.mock.mockImplementation(() => Promise.resolve(''));
      mockExecute.mock.mockImplementation(async (callback) => {
        await callback(mockIsolatedStorage);
      });

      const result = await ticketService.getTicket();

      assert.strictEqual(result, 1);
      assert.strictEqual(mockExecute.mock.calls.length, 1);
      assert.strictEqual(mockGet.mock.calls.length, 1);
      assert.strictEqual(mockSet.mock.calls.length, 1);

      const [actualGetKey] = mockGet.mock.calls[0].arguments;
      const [actualSetKey, actualSetValue] = mockSet.mock.calls[0].arguments;

      assert.strictEqual(actualGetKey, 'ticket');
      assert.strictEqual(actualSetKey, 'ticket');
      assert.strictEqual(actualSetValue, '1');
    });

    test('should increment ticket number when previous ticket exists', async () => {
      const ticketService = new TicketService(mockStorageService);
      const previousTicket = '42';
      const expectedNewTicket = '43';

      const mockIsolatedStorage: ISimpleStorage = {
        get: mock.fn(),
        set: mock.fn(),
      };

      const mockGet = mockIsolatedStorage.get as Mock<(k: string) => Promise<string | null>>;
      const mockSet = mockIsolatedStorage.set as Mock<(k: string, v: string) => Promise<string>>;
      const mockExecute = mockStorageService.executeIsolated as Mock<
        (func: (client: ISimpleStorage) => Promise<void>) => Promise<void>
      >;

      mockGet.mock.mockImplementation(() => Promise.resolve(previousTicket));
      mockSet.mock.mockImplementation(() => Promise.resolve(''));
      mockExecute.mock.mockImplementation(async (callback) => {
        await callback(mockIsolatedStorage);
      });

      const result = await ticketService.getTicket();

      assert.strictEqual(result, 43);
      assert.strictEqual(mockExecute.mock.calls.length, 1);
      assert.strictEqual(mockGet.mock.calls.length, 1);
      assert.strictEqual(mockSet.mock.calls.length, 1);

      const [actualGetKey] = mockGet.mock.calls[0].arguments;
      const [actualSetKey, actualSetValue] = mockSet.mock.calls[0].arguments;

      assert.strictEqual(actualGetKey, 'ticket');
      assert.strictEqual(actualSetKey, 'ticket');
      assert.strictEqual(actualSetValue, expectedNewTicket);
    });
  });
});
