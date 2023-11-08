import { ConsumeMessage } from 'amqplib';
import { Fibonacci } from '../service/fibonacci';
import { TicketData } from '../types/TicketData';
import getRequestStorageInstance from '../service/getRequestStorageInstance';

const fibonacci = new Fibonacci();

const jobHandler = async (msg: ConsumeMessage | null) => {
  if (!msg) {
    // eslint-disable-next-line no-console
    console.log('jobHandler retrieved empty message!');
    return;
  }
  // eslint-disable-next-line no-console
  console.log('jobHandler retrieved: ', msg.content.toString());

  const { ticketId, inputNumber } = JSON.parse(msg.content.toString()) as TicketData;
  // eslint-disable-next-line no-console
  console.log('jobHandler retrieved ticketId: ', ticketId);

  const result = fibonacci.getValueFor(inputNumber);
  const requestStorage = await getRequestStorageInstance();
  await requestStorage.updateRequestWithField(ticketId, 'result', result.toString());
};

export default jobHandler;
