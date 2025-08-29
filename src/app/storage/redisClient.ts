import { createClient } from 'redis';
import { Logger } from '../utils/logger.js';

export type RedisClient = ReturnType<typeof createClient>;

const RECONNECT_MAX_RETRY = 10;
const RECONNECT_DELAY = 100;

export class RedisClientInstance {
  private static redisClient: RedisClient | undefined;

  public static async getRedisClient(redisUrl = process.env.REDIS_URL || 'localhost:6379'): Promise<RedisClient> {
    if (!RedisClientInstance.redisClient) {
      RedisClientInstance.redisClient = createClient({
        url: `redis://${redisUrl}`,
        socket: {
          reconnectStrategy: (retries, cause) => {
            if (retries > RECONNECT_MAX_RETRY) {
              return false;
            }
            Logger.log('Redis client reconnect retries', retries);
            Logger.error('Redis client reconnect cause', cause);
            return RECONNECT_DELAY * retries;
          },
        },
      });

      RedisClientInstance.redisClient.on('error', (err: unknown) => Logger.error('Redis client error', err));
      await RedisClientInstance.redisClient.connect();
    }

    return RedisClientInstance.redisClient;
  }

  public static async disconnectClient(): Promise<void> {
    if (!RedisClientInstance.redisClient) {
      return;
    }

    await RedisClientInstance.redisClient.close();
    RedisClientInstance.redisClient = undefined;
  }
}
