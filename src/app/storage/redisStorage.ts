import { IStorage, IStorageSetOptions } from '../types/IStorage.js';
import { RedisClient, RedisSetOptions } from './redisClient.js';

export class RedisStorage implements IStorage {
  private readonly redisClient: RedisClient;

  constructor(redisClient: RedisClient) {
    this.redisClient = redisClient;
  }

  async set(key: string, value: string, options?: IStorageSetOptions): Promise<string> {
    const setResult = await this.redisClient.set(key, value, this.convertSetOptions(options));
    if (!setResult) {
      throw new Error(`RedisStorage has not set value: ${value} for key: ${key}`);
    }
    return setResult;
  }

  private convertSetOptions(options?: IStorageSetOptions): RedisSetOptions {
    const setOptions: RedisSetOptions = {};
    if (options?.expirationMilliseconds) {
      setOptions.expiration = { type: 'PX', value: options.expirationMilliseconds };
    }
    return setOptions;
  }

  get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  increment(key: string): Promise<number> {
    return this.redisClient.incr(key);
  }
}
