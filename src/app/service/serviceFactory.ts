import { RedisClientInstance } from '../storage/redisClient.js';
import { RedisStorage } from '../storage/redisStorage.js';
import { RequestService } from './requestService.js';
import { TicketService } from './ticketService.js';
import { IdempotencyService } from './idempotencyService.js';

type ServiceClass = TicketService | RequestService | RedisStorage | IdempotencyService;

export class ServiceFactory {
  public static async getInstanceOfClass<T extends ServiceClass>(className: ClassName): Promise<T> {
    switch (className) {
      case ClassName.TicketService: {
        const redisStorage = await ServiceFactory.getInstanceOfClass<RedisStorage>(ClassName.RedisStorage);
        return new TicketService(redisStorage) as T;
      }
      case ClassName.RequestService: {
        const redisStorage = await ServiceFactory.getInstanceOfClass<RedisStorage>(ClassName.RedisStorage);
        return new RequestService(redisStorage) as T;
      }
      case ClassName.RedisStorage: {
        const redisClient = await RedisClientInstance.getRedisClient();
        return new RedisStorage(redisClient) as T;
      }
      case ClassName.IdempotencyService: {
        const redisStorage = await ServiceFactory.getInstanceOfClass<RedisStorage>(ClassName.RedisStorage);
        return new IdempotencyService(redisStorage) as T;
      }
      default:
        throw new Error('Unknown class name');
    }
  }
}

export enum ClassName {
  TicketService = 'TicketService',
  RequestService = 'RequestService',
  RedisStorage = 'RedisStorage',
  IdempotencyService = 'IdempotencyService',
}

export { RedisStorage, RequestService, TicketService, IdempotencyService };
