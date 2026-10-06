import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger.js';
import { QueueEnum } from '../../types/QueueEnum.js';
import { QueueHandler } from '../../queue/queueHandler.js';
import {
  ServiceFactory,
  ClassName,
  TicketService,
  RequestService,
  IdempotencyService,
} from '../../service/serviceFactory.js';
import { InputNumber } from './input.schema.js';

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://localhost:5672';

const queueHandler = new QueueHandler(RABBIT_URL);

type TicketResponse = {
  ticket: number;
};

const input = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { number: inputNumber } = req.body as InputNumber;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const idempotencyKey = `${ipAddress}-${userAgent}-${inputNumber}`;
    const idempotencyService = await ServiceFactory.getInstanceOfClass<IdempotencyService>(
      ClassName.IdempotencyService,
    );
    const cachedResponse = await idempotencyService.getIdempotency<{
      responseStatus: number;
      responseBody: TicketResponse;
    }>(idempotencyKey);

    if (cachedResponse) {
      Logger.log(`Returning cached response for idempotency key: ${idempotencyKey}`);
      res.status(cachedResponse.responseStatus).json(cachedResponse.responseBody);
      return;
    }

    const ticketService = await ServiceFactory.getInstanceOfClass<TicketService>(ClassName.TicketService);
    const ticket = await ticketService.getTicket();

    const requestService = await ServiceFactory.getInstanceOfClass<RequestService>(ClassName.RequestService);
    await requestService.addRequest(ticket, inputNumber);

    await queueHandler.addJobToQueue(QueueEnum.Fibonacci, { ticket, inputNumber });

    await idempotencyService.setIdempotency(idempotencyKey, { responseStatus: 200, responseBody: { ticket } });

    res.status(200).json({ ticket });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default input;
