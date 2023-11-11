import { TicketService } from './ticketService';
import { getRedisClient } from '../storage/redisClient';
import { RedisStorage } from '../storage/redisStorage';

let _ticketService: TicketService;

const getTicketServiceInstance = async (): Promise<TicketService> => {
  if (!_ticketService) {
    const redisClient = await getRedisClient();
    const redisStorage = new RedisStorage(redisClient);
    _ticketService = new TicketService(redisStorage);
  }
  return _ticketService;
};

export default getTicketServiceInstance;
