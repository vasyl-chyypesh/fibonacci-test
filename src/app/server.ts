import http from 'http';
import app from './app';
import { getRedisClient } from './storage/redisClient';
import { QueueEnum } from './types/QueueEnum';
import jobHandler from './queue/jobHandler';
import { QueueHandler } from './queue/queueHandler';

const port = parseInt(process.env.PORT || '3000', 10);

const connections: { [k: string]: any } = {};

const server = http.createServer(app);

const promisifyListen = (serverInstance: http.Server, options: any) => {
  return new Promise((resolve) => {
    serverInstance.listen(options, () => {
      return resolve(serverInstance);
    });
  });
};

const storeConnections = (server: http.Server) => {
  server.on('connection', (conn) => {
    const key = `${conn.remoteAddress}:${conn.remotePort}`;
    connections[key] = conn;

    conn.on('close', () => {
      delete connections[key];
    });
  });
};

const releaseConnections = () => {
  server.close();

  for (const key in connections) {
    connections[key].destroy();
  }
};

const serverWrapper = {
  async start() {
    await getRedisClient();
    const queueHandler = new QueueHandler(process.env.RABBIT_URL as string);
    queueHandler.attachJobHandlerToQueue(QueueEnum.Fibonacci, jobHandler);

    await promisifyListen(server, { port });

    // eslint-disable-next-line no-console
    console.log(`️[server]: Server is running at http://localhost:${port}`);

    storeConnections(server);

    return this;
  },

  async stop() {
    releaseConnections();
    await (await getRedisClient()).disconnect();

    process.exit();
  },
};

export default serverWrapper;
