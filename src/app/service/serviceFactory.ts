import { RedisClientInstance } from '../storage/redisClient.js';
import { RedisStorage } from '../storage/redisStorage.js';
import { RequestService } from './requestService.js';
import { TicketService } from './ticketService.js';

export class ServiceFactory {
  public static async getInstanceOfClass<T extends TicketService | RequestService | RedisStorage>(
    className: ClassName,
  ): Promise<T> {
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
      default:
        throw new Error('Unknown class name');
    }
  }
}

export enum ClassName {
  TicketService = 'TicketService',
  RequestService = 'RequestService',
  RedisStorage = 'RedisStorage',
}

export { RedisStorage, RequestService, TicketService };
