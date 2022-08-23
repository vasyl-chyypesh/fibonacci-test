import { Request, Response, NextFunction } from 'express';
import addJobToQueue from '../queue/addJobToQueue';
import {Ticket} from '../service/ticket';
import redisClient from '../storage/redisService';
import {RequestStorage} from '../service/requestStorage';
import {QueueEnum} from '../types/QueueEnum';

const ticket = new Ticket(redisClient);
const requestStorage = new RequestStorage(redisClient);

const input = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inputNumber: number = req.body.number;
    if (!Number.isInteger(inputNumber)) {
      return res.status(400).send(`Not valid input data: ${inputNumber}`);
    }

    if (inputNumber < 1 || inputNumber > 1000000) {
      return res.status(400).send(`Not valid input data: ${inputNumber} (should be in range 1..1000000)`);
    }

    const ticketId = await ticket.getTicket();
    await requestStorage.addRequest(ticketId, inputNumber);
    await addJobToQueue(QueueEnum.Fibonacci, { ticketId, inputNumber });
    res.send({ ticket: ticketId });
  } catch (err) {
    next(err);
  }
}

export default input;
