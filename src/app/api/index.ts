import { Router, Request, Response, NextFunction } from 'express';
import inputRouter from './input/index.js';
import outputRouter from './output/index.js';
import { Logger } from '../utils/logger.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import { slowDownLimiter } from './middlewares/slowDownLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  Logger.log(`request: ${req.method} ${req.originalUrl}`);
  return next();
});

router.use(slowDownLimiter);
router.use(rateLimiter);

router.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Ok', time: new Date().toISOString() });
});

router.use('/input', inputRouter);

router.use('/output', outputRouter);

router.use(notFoundHandler);

router.use(errorHandler);

export default router;
