import { RequestStorage } from './requestStorage';
import { getRedisClient } from '../storage/redisClient';
import { RedisService } from '../storage/redisService';

let _requestStorage: RequestStorage;

const getRequestStorageInstance = async (): Promise<RequestStorage> => {
  if (!_requestStorage) {
    const redisClient = await getRedisClient();
    const redisService = new RedisService(redisClient);
    _requestStorage = new RequestStorage(redisService);
  }
  return _requestStorage;
};

export default getRequestStorageInstance;
