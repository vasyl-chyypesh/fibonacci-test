import { Router, Request, Response, NextFunction } from 'express';
import input from './input';
import output from './output';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] request: ${req.method} ${req.originalUrl}`);
  next();
});

router.post('/input', input);

router.get('/output/:id', output);

router.use((req, res) => {
  res.status(404).json({ message: 'PAGE NOT FOUND' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);

  res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
});

export default router;
