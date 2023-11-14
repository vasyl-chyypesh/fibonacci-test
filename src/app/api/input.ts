import { Request, Response, NextFunction } from 'express';
import { QueueEnum } from '../types/QueueEnum';
import { QueueHandler } from '../queue/queueHandler';
import { ServiceFactory, ClassName, TicketService, RequestService } from '../service/serviceFactory';

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

    const ticketService = await ServiceFactory.getInstanceOfClass<TicketService>(ClassName.TicketService);
    const ticket = await ticketService.getTicket();

    const requestService = await ServiceFactory.getInstanceOfClass<RequestService>(ClassName.RequestService);
    await requestService.addRequest(ticket, inputNumber);

    await queueHandler.addJobToQueue(QueueEnum.Fibonacci, { ticket, inputNumber });

    res.status(200).json({ ticket });
  } catch (err) {
    next(err);
  }
};

export default input;
