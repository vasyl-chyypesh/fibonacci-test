import { slowDown } from 'express-slow-down';
import { RATE_LIMIT_WINDOW } from './rateLimiter.js';

const DELAY_AFTER = 10; // allow 10 requests per window without delay, it should be less then RATE_LIMIT
const MAX_DELAY = 1500; // max delay in ms

export const slowDownLimiter = slowDown({
  windowMs: RATE_LIMIT_WINDOW,
  delayAfter: DELAY_AFTER,
  delayMs: (hits) => hits * 10 + 500, // add 500 ms + 10 ms of delay to every request
  maxDelayMs: MAX_DELAY,

  /**
   * - requests 1-10 are not delayed.
   * - request 11 is delayed by 610ms
   * - request 12 is delayed by 620ms
   * - request 13 is delayed by 630ms
   * - and so on. After RATE_LIMIT_WINDOW duration, the delay is reset to 0.
   */
});
