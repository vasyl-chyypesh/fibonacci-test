import express from 'express';
import helmet from 'helmet';
import router from './api/index.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ strict: true, limit: '1mb' }));
app.use(router);

export default app;
