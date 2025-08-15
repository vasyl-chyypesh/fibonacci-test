import { NextFunction, Request, Response } from 'express';
import { TicketData } from '../../types/ITicketData.js';
import { ServiceFactory, ClassName, RequestService } from '../../service/serviceFactory.js';
import { TicketNumber } from './output.schema.js';
import { HttpError } from '../../utils/errors/httpError.js';
import { CODES } from '../../utils/errors/codes.js';

const output = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticket } = (<unknown>req.params) as TicketNumber;

    const requestService = await ServiceFactory.getInstanceOfClass<RequestService>(ClassName.RequestService);
    const reqData = await requestService.getRequest(ticket);
    if (!reqData) {
      next(new HttpError(`Not found data for ticket: ${ticket}`, CODES.NOT_FOUND, 404));
      return;
    }

    const { result, inputNumber } = JSON.parse(reqData) as TicketData;
    if (!result) {
      next(new HttpError(`Not found result for ticket: ${ticket}`, CODES.NOT_FOUND, 404));
      return;
    }

    res.status(200).json({ ticket, inputNumber, fibonacci: result });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default output;
