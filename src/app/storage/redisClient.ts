import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({ url: `redis://${process.env.REDIS_URL}` });
    // eslint-disable-next-line no-console
    redisClient.on('error', (err: unknown) => console.error('Redis client error', err));
    await redisClient.connect();
  }

  return redisClient;
}

export type RedisClient = RedisClientType;
