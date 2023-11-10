import amqplib, { Channel, ConsumeMessage } from 'amqplib';
import { TicketData } from '../types/TicketData';
import { Logger } from '../utils/logger';

export class QueueHandler {
  private rmqUrl: string;
  private channel: Channel | undefined;

  constructor(rmqUrl: string) {
    this.rmqUrl = rmqUrl;
  }

  private async getChannel(queue: string) {
    if (!this.channel) {
      const conn = await amqplib.connect(this.rmqUrl);
      this.channel = await conn.createChannel();
      this.channel.assertQueue(queue, {
        durable: true,
      });
    }
    return this.channel;
  }

  async addJobToQueue(queue: string, data: TicketData): Promise<boolean> {
    const channel = await this.getChannel(queue);
    return channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
  }

  async attachJobHandlerToQueue(queue: string, jobHandler: (msg: ConsumeMessage) => Promise<void>) {
    const channel = await this.getChannel(queue);
    await channel.consume(
      queue,
      async (msg: ConsumeMessage | null) => {
        if (!msg) {
          Logger.log('jobHandler retrieved empty message!');
          return;
        }
        await jobHandler(msg);
        channel.ack(msg); // default acknowledgement timeout is 30 minutes
      },
      { noAck: false },
    );
  }
}
