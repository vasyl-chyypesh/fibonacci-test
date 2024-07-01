import { slowDown } from 'express-slow-down';
import { RATE_LIMIT_WINDOW } from './rateLimiter.js';

const DELAY_AFTER = 5; // allow 5 requests per window without delay, it should be less then RATE_LIMIT
const MAX_DELAY = 2000; // max delay in ms

export const slowDownLimiter = slowDown({
  windowMs: RATE_LIMIT_WINDOW,
  delayAfter: DELAY_AFTER,
  delayMs: (hits) => hits * 100, // add 100 ms of delay to every request
  maxDelayMs: MAX_DELAY,

  /**
   * - requests 1-5 are not delayed.
   * - request 6 is delayed by 600ms
   * - request 7 is delayed by 700ms
   * - request 8 is delayed by 800ms
   *
   * and so on. After RATE_LIMIT_WINDOW duration, the delay is reset to 0.
   */
});
