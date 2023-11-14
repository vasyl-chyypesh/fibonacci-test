import { getRedisClient } from '../storage/redisClient';
import { RedisStorage } from '../storage/redisStorage';
import { RequestService } from './requestService';
import { TicketService } from './ticketService';

export class ServiceFactory {
  public static async getInstanceOfClass<T>(className: ClassName): Promise<T> {
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
        const redisClient = await getRedisClient();
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
