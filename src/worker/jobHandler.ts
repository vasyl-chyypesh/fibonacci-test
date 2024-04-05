import { ConsumeMessage } from 'amqplib';
import { Fibonacci } from './fibonacci.js';
import { Logger } from '../app/utils/logger.js';
import { TicketData } from '../app/types/TicketData.js';
import { ServiceFactory, ClassName, RequestService } from '../app/service/serviceFactory.js';

const fibonacci = new Fibonacci();

const jobHandler = async (msg: ConsumeMessage) => {
  try {
    Logger.log('jobHandler retrieved:', msg.content.toString());
    const { ticket, inputNumber } = JSON.parse(msg.content.toString()) as TicketData;

    Logger.log('jobHandler is starting calculate Fibonacci for:', inputNumber);
    const result = await fibonacci.getValueFor(inputNumber);
    Logger.log('jobHandler finished calculate Fibonacci for:', inputNumber);

    const requestService = await ServiceFactory.getInstanceOfClass<RequestService>(ClassName.RequestService);
    await requestService.updateRequestWithField(ticket, 'result', result.toString());
  } catch (err: unknown) {
    Logger.error(err);
  }
};

export default jobHandler;
