import http from 'http';
import app from './app';
import redisClient from './storage/redisService';
import jobConsumer from './queue/jobConsumer';
import {QueueEnum} from './types/QueueEnum';
import jobHandler from './queue/jobHandler';

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
  server.on('connection', conn => {
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
    await redisClient.connect();
    await jobConsumer.start(QueueEnum.Fibonacci, jobHandler);
    await promisifyListen(server, { port });

    console.log(`️[server]: Server is running at http://localhost:${port}`);

    storeConnections(server);

    return this;
  },

  async stop() {
    releaseConnections();

    await jobConsumer.stop();
    await redisClient.disconnect();

    process.exit();
  }
}

export default serverWrapper;
