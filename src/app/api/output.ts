import { NextFunction, Request, Response } from 'express';
import { TicketData } from '../types/TicketData';
import getRequestStorageInstance from '../service/getRequestStorageInstance';

const output = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    if (!Number.isInteger(ticketId) || ticketId < 1) {
      return res.status(400).json({ message: `Not valid ticketId: ${ticketId}` });
    }

    const requestStorage = await getRequestStorageInstance();
    const reqData = await requestStorage.getRequest(ticketId);
    if (!reqData) {
      return res.status(404).json({ message: `Not found data for ticket: ${ticketId}` });
    }

    const { result } = JSON.parse(reqData) as TicketData;
    if (!result) {
      return res.status(404).json({ message: `Not found result for ticket: ${ticketId}` });
    }

    res.status(200).json({ fibonacci: result });
  } catch (err) {
    next(err);
  }
};

export default output;
