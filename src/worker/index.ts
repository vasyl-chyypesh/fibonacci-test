import { QueueHandler } from '../app/queue/queueHandler.js';
import { ClassName, RequestService, ServiceFactory } from '../app/service/serviceFactory.js';
import { QueueEnum } from '../app/types/QueueEnum.js';
import { Logger } from '../app/utils/logger.js';
import { Fibonacci } from './fibonacci.js';
import JobHandler from './jobHandler.js';

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://localhost:5672';

const startConsume = async () => {
  const queueHandler = new QueueHandler(RABBIT_URL);
  const fibonacci = new Fibonacci();
  const requestService = await ServiceFactory.getInstanceOfClass<RequestService>(ClassName.RequestService);
  const jobHandler = new JobHandler(fibonacci, requestService);
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
