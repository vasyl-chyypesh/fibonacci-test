import { createClient, RedisClientType } from 'redis';
import { Logger } from '../utils/logger';

let redisClient: RedisClient | undefined;

export async function getRedisClient(): Promise<RedisClient> {
  if (!redisClient) {
    redisClient = createClient({ url: `redis://${process.env.REDIS_URL}` });
    redisClient.on('error', (err: unknown) => Logger.error('Redis client error', err));
    await redisClient.connect();
  }

  return redisClient;
}

export async function disconnectClient(): Promise<void> {
  if (!redisClient) {
    return;
  }

  await redisClient.disconnect();
  redisClient = undefined;
}

export type RedisClient = RedisClientType;
