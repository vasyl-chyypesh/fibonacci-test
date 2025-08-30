import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert';
import { RedisStorage } from '../redisStorage.js';
import { RedisClient } from '../redisClient.js';

describe('RedisStorage', () => {
  let mockRedisClient: {
    set: (key: string, value: string) => Promise<string | null>;
    get: (key: string) => Promise<string | null>;
    incr: (key: string) => Promise<number>;
  };
  let redisStorage: RedisStorage;

  beforeEach(() => {
    // Create a mock Redis client
    mockRedisClient = {
      set: () => Promise.resolve('OK'),
      get: () => Promise.resolve(null),
      incr: () => Promise.resolve(1),
    };

    redisStorage = new RedisStorage(mockRedisClient as RedisClient);
  });

  describe('set', () => {
    test('should successfully set a key-value pair', async () => {
      const key = 'test-key';
      const value = 'test-value';
      const expectedResult = 'OK';

      mockRedisClient.set = async () => expectedResult;

      const result = await redisStorage.set(key, value);

      assert.strictEqual(result, expectedResult);
    });

    test('should throw error when set operation fails', async () => {
      const key = 'test-key';
      const value = 'test-value';

      mockRedisClient.set = async () => null;

      await assert.rejects(
        async () => {
          await redisStorage.set(key, value);
        },
        {
          name: 'Error',
          message: `RedisStorage has not set value: ${value} for key: ${key}`,
        }
      );
    });

    test('should throw error when set operation returns undefined', async () => {
      const key = 'test-key';
      const value = 'test-value';

      mockRedisClient.set = async () => undefined as any;

      await assert.rejects(
        async () => {
          await redisStorage.set(key, value);
        },
        {
          name: 'Error',
          message: `RedisStorage has not set value: ${value} for key: ${key}`,
        }
      );
    });

    test('should throw error when set operation throws', async () => {
      const key = 'test-key';
      const value = 'test-value';
      const errorMessage = 'Redis connection failed';

      mockRedisClient.set = async () => {
        throw new Error(errorMessage);
      };

      await assert.rejects(
        async () => {
          await redisStorage.set(key, value);
        },
        {
          name: 'Error',
          message: errorMessage,
        }
      );
    });
  });

  describe('get', () => {
    test('should successfully get a value for existing key', async () => {
      const key = 'test-key';
      const expectedValue = 'test-value';

      mockRedisClient.get = async () => expectedValue;

      const result = await redisStorage.get(key);

      assert.strictEqual(result, expectedValue);
    });

    test('should return null for non-existing key', async () => {
      const key = 'non-existing-key';

      mockRedisClient.get = async () => null;

      const result = await redisStorage.get(key);

      assert.strictEqual(result, null);
    });

    test('should propagate error when get operation throws', async () => {
      const key = 'test-key';
      const errorMessage = 'Redis connection failed';

      mockRedisClient.get = async () => {
        throw new Error(errorMessage);
      };

      await assert.rejects(
        async () => {
          await redisStorage.get(key);
        },
        {
          name: 'Error',
          message: errorMessage,
        }
      );
    });
  });

  describe('increment', () => {
    test('should successfully increment a key', async () => {
      const key = 'counter-key';
      const expectedValue = 42;

      mockRedisClient.incr = async () => expectedValue;

      const result = await redisStorage.increment(key);

      assert.strictEqual(result, expectedValue);
    });

    test('should increment from 0 to 1 for new key', async () => {
      const key = 'new-counter-key';
      const expectedValue = 1;

      mockRedisClient.incr = async () => expectedValue;

      const result = await redisStorage.increment(key);

      assert.strictEqual(result, expectedValue);
    });

    test('should propagate error when increment operation throws', async () => {
      const key = 'test-key';
      const errorMessage = 'Redis connection failed';

      mockRedisClient.incr = async () => {
        throw new Error(errorMessage);
      };

      await assert.rejects(
        async () => {
          await redisStorage.increment(key);
        },
        {
          name: 'Error',
          message: errorMessage,
        }
      );
    });
  });
});
