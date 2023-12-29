import http from 'http';
import app from './app';
import { disconnectClient } from './storage/redisClient';
import { Logger } from './utils/logger';

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
    await promisifyListen(server, { port });

    Logger.log(`️Server is running at PORT: ${port}`);

    storeConnections(server);

    return this;
  },

  async stop() {
    releaseConnections();
    await disconnectClient();

    Logger.log('Connections are closed. Process is exiting');

    process.exit();
  },
};

export default serverWrapper;
