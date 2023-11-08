import { IStorageService } from '../service/IStorageService';
import { RedisClient } from './redisClient';

export class RedisService implements IStorageService {
  private readonly redisClient: any;

  constructor(redisClient: RedisClient) {
    this.redisClient = redisClient;
  }

  set(key: string, value: string): Promise<string> {
    return this.redisClient.set(key, value);
  }

  get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  executeIsolated(func: (client: any) => Promise<void>): void {
    return this.redisClient.executeIsolated(func);
  }
}
