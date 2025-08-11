import { ConsumeMessage } from 'amqplib';
import { Fibonacci } from './fibonacci.js';
import { Logger } from '../app/utils/logger.js';
import { IJobHandler } from '../app/types/IJobHandler.js';
import { TicketData } from '../app/types/TicketData.js';
import { RequestService } from '../app/service/serviceFactory.js';

export default class JobHandler implements IJobHandler {
  private readonly fibonacci: Fibonacci;
  private readonly requestService: RequestService;

  constructor(fibonacci: Fibonacci, requestService: RequestService) {
    this.fibonacci = fibonacci;
    this.requestService = requestService;
  }

  public async handleMessage(msg: ConsumeMessage) {
    try {
      Logger.log('message retrieved:', msg.content.toString());
      const { ticket, inputNumber } = JSON.parse(msg.content.toString()) as TicketData;

      Logger.log('starting calculate Fibonacci for:', inputNumber);
      const result = await this.fibonacci.getValueFor(inputNumber);
      Logger.log('finished calculate Fibonacci for:', inputNumber);

      await this.requestService.updateRequestWithField(ticket, 'result', result.toString());
      Logger.log('updated result for request ticket:', ticket);
    } catch (err: unknown) {
      Logger.error(err);
    }
  }
}
