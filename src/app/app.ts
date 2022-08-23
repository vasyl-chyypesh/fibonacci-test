import express from 'express';
import bodyParser from 'body-parser';
import router from './api';

const app = express();

app.use(bodyParser.json({ strict: false, limit: '10mb' }));
app.use(router);

export default app;
