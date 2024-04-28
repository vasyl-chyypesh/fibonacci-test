import { describe, test, mock } from 'node:test';
import assert from 'node:assert';
import { ServiceFactory, ClassName, TicketService, RequestService, RedisStorage } from '../serviceFactory.js';
import { RedisClientInstance } from '../../storage/redisClient.js';

describe('ServiceFactory', () => {
  describe('getInstanceOfClass', () => {
    test('should return an instance of TicketService', async () => {
      const getRedisClientMock = mock.method(RedisClientInstance, 'getRedisClient', async () => Promise.resolve({}));

      const instance = await ServiceFactory.getInstanceOfClass<TicketService>(ClassName.TicketService);

      assert.ok(instance instanceof TicketService);
      assert.strictEqual(getRedisClientMock.mock.calls.length, 1);
    });

    test('should return an instance of RequestService', async () => {
      const getRedisClientMock = mock.method(RedisClientInstance, 'getRedisClient', async () => Promise.resolve({}));

      const instance = await ServiceFactory.getInstanceOfClass<RequestService>(ClassName.RequestService);

      assert.ok(instance instanceof RequestService);
      assert.strictEqual(getRedisClientMock.mock.calls.length, 1);
    });

    test('should return an instance of RedisStorage', async () => {
      const redisClientInstance = {};
      const getRedisClientMock = mock.method(RedisClientInstance, 'getRedisClient', async () =>
        Promise.resolve(redisClientInstance),
      );

      const instance = await ServiceFactory.getInstanceOfClass<RedisStorage>(ClassName.RedisStorage);

      assert.ok(instance instanceof RedisStorage);
      assert.strictEqual(getRedisClientMock.mock.calls.length, 1);
    });

    test('should throw an error for unknown class name', async () => {
      await assert.rejects(() => ServiceFactory.getInstanceOfClass('UnknownClass' as ClassName), {
        message: 'Unknown class name',
      });
    });
  });
});
