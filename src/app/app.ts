import express from 'express';
import helmet from 'helmet';
import router from './api/index.js';

const app = express();

app.use(helmet());
app.use(express.json({ strict: false, limit: '1mb' }));
app.use(router);

export default app;
