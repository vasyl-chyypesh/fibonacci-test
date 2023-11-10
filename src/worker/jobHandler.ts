import { ConsumeMessage } from 'amqplib';
import { Fibonacci } from '../app/service/fibonacci';
import { TicketData } from '../app/types/TicketData';
import getRequestStorageInstance from '../app/storage/getRequestStorageInstance';
import { Logger } from '../app/utils/logger';

const fibonacci = new Fibonacci();

const jobHandler = async (msg: ConsumeMessage) => {
  Logger.log('jobHandler retrieved:', msg.content.toString());
  const { ticketId, inputNumber } = JSON.parse(msg.content.toString()) as TicketData;

  Logger.log('jobHandler is starting calculate Fibonacci for:', inputNumber);
  const result = await fibonacci.getValueFor(inputNumber);
  Logger.log('jobHandler finished calculate Fibonacci for:', inputNumber);

  const requestStorage = await getRequestStorageInstance();
  await requestStorage.updateRequestWithField(ticketId, 'result', result.toString());
};

export default jobHandler;
