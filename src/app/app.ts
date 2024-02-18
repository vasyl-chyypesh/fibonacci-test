import express from 'express';
import router from './api/index.js';

const app = express();

app.use(express.json({ strict: false, limit: '1mb' }));
app.use(router);

export default app;
