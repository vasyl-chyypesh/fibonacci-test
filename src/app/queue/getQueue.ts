import { QueueManager } from 'redis-smq';
import config from './config';

let _queueManager: QueueManager;

const getQueue = (queueName: string): Promise<QueueManager> => {
  return new Promise((resolve, reject) => {
    if (_queueManager) {
      return resolve(_queueManager);
    }

    QueueManager.createInstance(config as any, (err, queueManager) => {
      if (err) {
        return reject(err);
      }
      if (!queueManager) {
        return reject('No QueueManager');
      }

      queueManager.queue.exists(queueName, (err, isExist) => {
        if (err) {
          return reject(err);
        }

        if (isExist) {
          _queueManager = queueManager;
          return resolve(queueManager);
        }

        queueManager.queue.create(queueName, false, (err) => {
          if (err) {
            return reject(err);
          }

          _queueManager = queueManager;
          return resolve(queueManager);
        });
      });
    });
  });
};

export default getQueue;
