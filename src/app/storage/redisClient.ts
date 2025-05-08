import { createClient } from 'redis';
import { Logger } from '../utils/logger.js';

export type RedisClient = ReturnType<typeof createClient>;

export class RedisClientInstance {
  private static redisClient: RedisClient | undefined;

  public static async getRedisClient(redisUrl = process.env.REDIS_URL || 'localhost:6379'): Promise<RedisClient> {
    if (!RedisClientInstance.redisClient) {
      RedisClientInstance.redisClient = createClient({ url: `redis://${redisUrl}` });
      RedisClientInstance.redisClient.on('error', (err: unknown) => Logger.error('Redis client error', err));
      await RedisClientInstance.redisClient.connect();
    }

    return RedisClientInstance.redisClient;
  }

  public static async disconnectClient(): Promise<void> {
    if (!RedisClientInstance.redisClient) {
      return;
    }

    await RedisClientInstance.redisClient.disconnect();
    RedisClientInstance.redisClient = undefined;
  }
}
