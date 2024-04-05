import { Request, Response, NextFunction } from 'express';
import { QueueEnum } from '../types/QueueEnum.js';
import { QueueHandler } from '../queue/queueHandler.js';
import { ServiceFactory, ClassName, TicketService, RequestService } from '../service/serviceFactory.js';

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://localhost:5672';

const queueHandler = new QueueHandler(RABBIT_URL);

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

    const ticketService = await ServiceFactory.getInstanceOfClass<TicketService>(ClassName.TicketService);
    const ticket = await ticketService.getTicket();

    const requestService = await ServiceFactory.getInstanceOfClass<RequestService>(ClassName.RequestService);
    await requestService.addRequest(ticket, inputNumber);

    await queueHandler.addJobToQueue(QueueEnum.Fibonacci, { ticket, inputNumber });

    return res.status(200).json({ ticket });
  } catch (err) {
    return next(err);
  }
};

export default input;
