import { Message } from 'redis-smq';
import { Fibonacci } from '../service/fibonacci';
import { RequestStorage } from '../service/requestStorage';
import redisClient from '../storage/redisService';
import {TicketData} from '../types/TicketData';

const fibonacci = new Fibonacci();
const requestStorage = new RequestStorage(redisClient);

const jobHandler = async (msg: Message, cb: any) => {
  const { ticketId, inputNumber } = msg.getBody() as TicketData;
  const result = fibonacci.getValueFor(inputNumber);
  await requestStorage.updateRequestWithField(ticketId, 'result', result);
  cb(); //kind of acknowledge
}

export default jobHandler;
