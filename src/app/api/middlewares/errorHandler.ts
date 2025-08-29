import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../utils/errors/httpError.js';
import { CODES } from '../../utils/errors/codes.js';
import { MESSAGES } from '../../utils/errors/messages.js';
import { Logger } from '../../utils/logger.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  Logger.error(error);

  if (error instanceof HttpError) {
    return response.status(error.httpStatus).json({
      code: error.code,
      message: error.message,
    });
  }

  return response.status(500).json({
    code: CODES.INTERNAL_ERROR,
    message: MESSAGES.INTERNAL_SERVER_ERROR,
  });
}
