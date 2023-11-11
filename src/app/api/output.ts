import { NextFunction, Request, Response } from 'express';
import { TicketData } from '../types/TicketData';
import getRequestServiceInstance from '../service/getRequestServiceInstance';

const output = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = parseInt(req.params.ticket, 10);
    if (!Number.isInteger(ticket) || ticket < 1) {
      return res.status(400).json({ message: `Not valid ticket: ${ticket}` });
    }

    const requestStorage = await getRequestServiceInstance();
    const reqData = await requestStorage.getRequest(ticket);
    if (!reqData) {
      return res.status(404).json({ message: `Not found data for ticket: ${ticket}` });
    }

    const { result, inputNumber } = JSON.parse(reqData) as TicketData;
    if (!result) {
      return res.status(404).json({ message: `Not found result for ticket: ${ticket}` });
    }

    res.status(200).json({ ticket, inputNumber, fibonacci: result });
  } catch (err) {
    next(err);
  }
};

export default output;
