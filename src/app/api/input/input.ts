import { Request, Response, NextFunction } from 'express';
import { QueueEnum } from '../../types/QueueEnum.js';
import { QueueHandler } from '../../queue/queueHandler.js';
import { ServiceFactory, ClassName, TicketService, RequestService } from '../../service/serviceFactory.js';
import { InputNumber } from './input.schema.js';

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://localhost:5672';

const queueHandler = new QueueHandler(RABBIT_URL);

const input = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { number: inputNumber } = req.body as InputNumber;

    const ticketService = await ServiceFactory.getInstanceOfClass<TicketService>(ClassName.TicketService);
    const ticket = await ticketService.getTicket();

    const requestService = await ServiceFactory.getInstanceOfClass<RequestService>(ClassName.RequestService);
    await requestService.addRequest(ticket, inputNumber);

    await queueHandler.addJobToQueue(QueueEnum.Fibonacci, { ticket, inputNumber });

    res.status(200).json({ ticket });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default input;
