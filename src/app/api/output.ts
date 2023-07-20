import { NextFunction, Request, Response } from 'express';
import { RequestStorage } from '../service/requestStorage';
import redisClient from '../storage/redisService';
import { TicketData } from '../types/TicketData';

const requestStorage = new RequestStorage(redisClient);

const output = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (!Number.isInteger(ticketId) || ticketId < 1) {
      return res.status(400).send(`Not valid ticketId: ${ticketId}`);
    }

    const reqData = await requestStorage.getRequest(ticketId);
    if (!reqData) {
      return res.status(404).send(`Not found data for ticket: ${ticketId}`);
    }

    const { result } = JSON.parse(reqData) as TicketData;
    if (!result) {
      return res.status(404).send(`Not found result for ticket: ${ticketId}`);
    }

    res.send({ Fibonacci: result });
  } catch (err) {
    next(err);
  }
};

export default output;
