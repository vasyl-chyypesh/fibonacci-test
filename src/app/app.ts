import express from 'express';
import router from './api';

const app = express();

app.use(express.json({ strict: false, limit: '1mb' }));
app.use(router);

export default app;
