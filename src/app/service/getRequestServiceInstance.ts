import { RequestService } from './requestService';
import { getRedisClient } from '../storage/redisClient';
import { RedisStorage } from '../storage/redisStorage';

let _requestService: RequestService;

const getRequestServiceInstance = async (): Promise<RequestService> => {
  if (!_requestService) {
    const redisClient = await getRedisClient();
    const redisStorage = new RedisStorage(redisClient);
    _requestService = new RequestService(redisStorage);
  }
  return _requestService;
};

export default getRequestServiceInstance;
