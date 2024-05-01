import { Router } from 'express';
import { requestValidator, RequestSource } from '../middlewares/requestValidator.js';
import { TicketNumber, ticketNumberSchema } from './output.schema.js';
import output from './output.js';

const router = Router();

router.get(
  '/:ticket',
  requestValidator<TicketNumber>(ticketNumberSchema, RequestSource.params, { coerceTypes: true }),
  output,
);

export default router;
