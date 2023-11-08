import amqplib, { Channel, ConsumeMessage } from 'amqplib';
import { TicketData } from '../types/TicketData';

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

  async attachJobHandlerToQueue(queue: string, jobHandler: (msg: ConsumeMessage | null) => Promise<void>) {
    const channel = await this.getChannel(queue);
    await channel.consume(queue, jobHandler, { noAck: false });
  }
}
