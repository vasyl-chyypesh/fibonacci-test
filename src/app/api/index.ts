import { Router, Request, Response, NextFunction } from 'express';
import input from './input.js';
import output from './output.js';
import { Logger } from '../utils/logger.js';
import { rateLimiter } from './middlewares/rateLimiter.js';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  Logger.log(`request: ${req.method} ${req.originalUrl}`);
  next();
});

router.use(rateLimiter);

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Ok' });
});

router.post('/input', input);

router.get('/output/:ticket', output);

router.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Page not found' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  Logger.error(err);

  res.status(500).json({ message: 'Internal server error' });
});

export default router;
