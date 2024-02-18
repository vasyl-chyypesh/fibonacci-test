import { QueueHandler } from '../app/queue/queueHandler.js';
import { QueueEnum } from '../app/types/QueueEnum.js';
import { Logger } from '../app/utils/logger.js';
import jobHandler from './jobHandler.js';

const startConsume = async () => {
  const queueHandler = new QueueHandler(process.env.RABBIT_URL as string);
  await queueHandler.attachJobHandlerToQueue(QueueEnum.Fibonacci, jobHandler);
};

startConsume()
  .then(() => {
    Logger.log('Started consuming:', QueueEnum.Fibonacci);
  })
  .catch((err) => {
    Logger.log('Error on starting consuming');
    Logger.error(err);
  });
