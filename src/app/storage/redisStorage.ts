import { IStorage } from '../types/IStorage.js';
import { RedisClient } from './redisClient.js';

export class RedisStorage implements IStorage {
  private readonly redisClient: RedisClient;

  constructor(redisClient: RedisClient) {
    this.redisClient = redisClient;
  }

  async set(key: string, value: string): Promise<string> {
    const setResult = await this.redisClient.set(key, value);
    if (!setResult) {
      throw new Error(`RedisStorage has not set value: ${value} for key: ${key}`);
    }
    return setResult;
  }

  get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  increment(key: string): Promise<number> {
    return this.redisClient.incr(key);
  }
}
