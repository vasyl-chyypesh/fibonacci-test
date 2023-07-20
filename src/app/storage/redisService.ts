import { createClient } from 'redis';

const redisClient = createClient({ url: `redis://${process.env.REDIS_URL}:6379` });

// eslint-disable-next-line no-console
redisClient.on('error', (err) => console.error('Redis client error', err));

export default redisClient;
