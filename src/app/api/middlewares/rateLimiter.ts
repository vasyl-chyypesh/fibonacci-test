import { rateLimit } from 'express-rate-limit';

const RATE_LIMIT_WINDOW = 1 * 60 * 1000; // 1 minute
const RATE_LIMIT = 10; // limit each IP to 10 requests per `window`

export const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  limit: RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests, please try again later.',
  },
});
