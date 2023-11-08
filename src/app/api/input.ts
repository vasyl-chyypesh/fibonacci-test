import { Request, Response, NextFunction } from 'express';
import { Ticket } from '../service/ticket';
import { QueueEnum } from '../types/QueueEnum';
import { RedisService } from '../storage/redisService';
import { getRedisClient } from '../storage/redisClient';
import getRequestStorageInstance from '../service/getRequestStorageInstance';
import { QueueHandler } from '../queue/queueHandler';

let _ticket: Ticket;

const getTicketInstance = async (): Promise<Ticket> => {
  if (!_ticket) {
    const redisClient = await getRedisClient();
    const redisService = new RedisService(redisClient);
    _ticket = new Ticket(redisService);
  }
  return _ticket;
};

const queueHandler = new QueueHandler(process.env.RABBIT_URL as string);

const input = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inputNumber: number = req.body.number;
    if (!Number.isInteger(inputNumber)) {
      return res.status(400).json({ message: `Not valid input data: ${inputNumber}` });
    }

    if (inputNumber < 1 || inputNumber >= Number.MAX_SAFE_INTEGER) {
      return res
        .status(400)
        .json({ message: `Not valid input data: ${inputNumber} (should be in range 1..${Number.MAX_SAFE_INTEGER})` });
    }

    const ticket = await getTicketInstance();
    const ticketId = await ticket.getTicket();
    const requestStorage = await getRequestStorageInstance();
    await requestStorage.addRequest(ticketId, inputNumber);
    await queueHandler.addJobToQueue(QueueEnum.Fibonacci, { ticketId, inputNumber });
    res.status(200).json({ ticket: ticketId });
  } catch (err) {
    next(err);
  }
};

export default input;
