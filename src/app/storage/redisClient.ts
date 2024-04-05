import { createClient, RedisClientType } from 'redis';
import { Logger } from '../utils/logger.js';

let redisClient: RedisClient | undefined;

const REDIS_URL = process.env.REDIS_URL || 'localhost:6379';

export async function getRedisClient(): Promise<RedisClient> {
  if (!redisClient) {
    redisClient = createClient({ url: `redis://${REDIS_URL}` });
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
