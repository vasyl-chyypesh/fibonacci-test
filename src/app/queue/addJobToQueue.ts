import { Message, Producer } from 'redis-smq';
import getQueue from './getQueue';
import config from './config';

let _producer: Producer;

const getProducer = async (queueName: string): Promise<Producer> => {
  await getQueue(queueName);

  return new Promise((resolve, reject) => {
    if (_producer) {
      return resolve(_producer);
    }

    const producer = new Producer(config as any);
    producer.run((err) => {
      if (err) {
        return reject(err);
      }

      _producer = producer;
      return resolve(producer);
    });
  });
};

const addJobToQueue = async (queueName: string, data: any) => {
  const producer = await getProducer(queueName);

  return new Promise((resolve, reject) => {
    const message = new Message();
    message.setBody(data).setQueue(queueName);

    producer.produce(message, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(message.getId());
    });
  });
};

export default addJobToQueue;
