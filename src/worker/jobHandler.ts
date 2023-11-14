import { ConsumeMessage } from 'amqplib';
import { Fibonacci } from './fibonacci';
import { Logger } from '../app/utils/logger';
import { TicketData } from '../app/types/TicketData';
import { ServiceFactory, ClassName, RequestService } from '../app/service/serviceFactory';

const fibonacci = new Fibonacci();

const jobHandler = async (msg: ConsumeMessage) => {
  Logger.log('jobHandler retrieved:', msg.content.toString());
  const { ticket, inputNumber } = JSON.parse(msg.content.toString()) as TicketData;

  Logger.log('jobHandler is starting calculate Fibonacci for:', inputNumber);
  const result = await fibonacci.getValueFor(inputNumber);
  Logger.log('jobHandler finished calculate Fibonacci for:', inputNumber);

  const requestService = await ServiceFactory.getInstanceOfClass<RequestService>(ClassName.RequestService);
  await requestService.updateRequestWithField(ticket, 'result', result.toString());
};

export default jobHandler;
