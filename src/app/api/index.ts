import { Router, Request, Response, NextFunction } from 'express';
import input from './input';
import output from './output';
import { Logger } from '../utils/logger';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  Logger.log(`request: ${req.method} ${req.originalUrl}`);
  next();
});

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'ok' });
});

router.post('/input', input);

router.get('/output/:ticket', output);

router.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'PAGE NOT FOUND' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  Logger.error(err);

  res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
});

export default router;
