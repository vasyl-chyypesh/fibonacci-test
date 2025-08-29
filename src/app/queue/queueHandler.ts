import amqplib, { ChannelModel, Channel, ConsumeMessage } from 'amqplib';
import { Logger } from '../utils/logger.js';
import { IJobHandler } from '../types/IJobHandler.js';

export class QueueHandler {
  private readonly rmqUrl: string;
  private connection: ChannelModel | undefined;
  private channel: Channel | undefined;

  constructor(rmqUrl: string) {
    this.rmqUrl = rmqUrl;
  }

  private async getChannel(queue: string) {
    if (!this.connection) {
      Logger.log('Create RabbitMq connection ...');
      this.connection = await amqplib.connect(this.rmqUrl);
      this.connection.on('error', (err) => {
        Logger.error(err);
      });
      Logger.log('RabbitMq connection created');
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
      this.channel.assertQueue(queue, { durable: true });
    }

    return this.channel;
  }

  async addJobToQueue<T>(queue: string, data: T): Promise<boolean> {
    const channel = await this.getChannel(queue);
    Logger.log(`Sending message to rabbitMQ queue: ${queue}`);
    const ok = channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
    Logger.log(`Sent message to rabbitMQ queue: ${queue}, ok: ${ok}`);
    return ok;
  }

  async attachJobHandlerToQueue(queue: string, jobHandler: IJobHandler) {
    const channel = await this.getChannel(queue);
    await channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (!msg) {
        Logger.error('jobHandler retrieved empty message!');
        return;
      }
      Logger.log(`New message from rabbitMQ queue: ${queue}`);
      channel.ack(msg); // default acknowledgement timeout is 30 minutes
      await jobHandler.handleMessage(msg);
      Logger.log(`Handled message from rabbitMQ queue: ${queue}`);
    });
  }
}
