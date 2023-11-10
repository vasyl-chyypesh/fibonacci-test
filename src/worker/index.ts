import { QueueHandler } from '../app/queue/queueHandler';
import { getRedisClient } from '../app/storage/redisClient';
import { QueueEnum } from '../app/types/QueueEnum';
import { Logger } from '../app/utils/logger';
import jobHandler from './jobHandler';

const startConsume = async () => {
  await getRedisClient();
  const queueHandler = new QueueHandler(process.env.RABBIT_URL as string);
  queueHandler.attachJobHandlerToQueue(QueueEnum.Fibonacci, jobHandler);
};

startConsume()
  .then(() => {
    Logger.log('Started consuming: ', QueueEnum.Fibonacci);
  })
  .catch((err) => {
    Logger.log('Error on starting consuming');
    Logger.error(err);
  });
