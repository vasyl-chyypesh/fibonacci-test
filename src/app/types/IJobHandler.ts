import { ConsumeMessage } from 'amqplib';

export interface IJobHandler {
  handleMessage(message: ConsumeMessage): Promise<void>;
}
