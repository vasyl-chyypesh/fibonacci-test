import { Request, Response } from 'express';
import { MESSAGES } from '../../utils/errors/messages.js';

export function notFoundHandler(request: Request, response: Response) {
  response.status(404).json({ message: MESSAGES.PAGE_NOT_FOUND });
  return;
}
