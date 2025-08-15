import { describe, test, mock, Mock, afterEach } from 'node:test';
import assert from 'node:assert';
import { TicketService } from '../ticketService.js';
import { IStorage } from '../../types/IStorage.js';

describe('TicketService', () => {
  const mockStorageService: IStorage = {
    set: mock.fn(),
    get: mock.fn(),
    increment: mock.fn(),
  };

  afterEach(() => {
    (mockStorageService.set as Mock<(k: string, v: string) => Promise<string>>).mock.resetCalls();
    (mockStorageService.get as Mock<(k: string) => Promise<string | null>>).mock.resetCalls();
    (mockStorageService.increment as Mock<(k: string) => Promise<number>>).mock.resetCalls();
  });

  describe('getTicket', () => {
    test('should return first ticket number when no previous ticket exists', async () => {
      const ticketService = new TicketService(mockStorageService);

      const mockIncrement = mockStorageService.increment as Mock<(k: string) => Promise<number>>;
      mockIncrement.mock.mockImplementation(() => Promise.resolve(1));

      const result = await ticketService.getTicket();

      assert.strictEqual(result, 1);
      assert.strictEqual(mockIncrement.mock.calls.length, 1);
    });
  });
});
