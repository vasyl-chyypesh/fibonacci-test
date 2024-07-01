import { rateLimit } from 'express-rate-limit';
import { CODES } from '../../utils/errors/codes.js';
import { MESSAGES } from '../../utils/errors/messages.js';

export const RATE_LIMIT_WINDOW = 1 * 60 * 1000; // 1 minute
const RATE_LIMIT = 10; // limit each IP to 10 requests per `window`

export const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  limit: RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: CODES.RATE_LIMIT,
    message: MESSAGES.TOO_MANY_REQUESTS,
  },
});
