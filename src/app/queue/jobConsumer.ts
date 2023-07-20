import { Consumer, Message } from 'redis-smq';
import getQueue from './getQueue';
import config from './config';

const consumer = new Consumer(config as any);

const start = async (queueName: string, messageHandler: (msg: Message, cb: any) => void) => {
  if (consumer.isRunning()) {
    return consumer;
  }

  await getQueue(queueName);

  return new Promise((resolve, reject) => {
    consumer.consume(queueName, messageHandler, (err) => {
      if (err) {
        return reject(err);
      }

      consumer.run((err) => {
        if (err) {
          return reject(err);
        }
        return resolve(consumer);
      });
    });
  });
};

const stop = async () => {
  if (!consumer.isRunning()) {
    return consumer;
  }

  return new Promise((resolve, reject) => {
    consumer.shutdown((err) => {
      if (err) {
        return reject(err);
      }
      return resolve(consumer);
    });
  });
};

const jobConsumer = { start, stop };

export default jobConsumer;
