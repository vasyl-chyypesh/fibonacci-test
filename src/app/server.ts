import http from 'http';
import { ListenOptions, Socket } from 'node:net';
import app from './app.js';
import { disconnectClient } from './storage/redisClient.js';
import { Logger } from './utils/logger.js';

const port = parseInt(process.env.PORT || '3000', 10);

const connections = new Map<string, Socket>();

const server = http.createServer(app);

const promisifyListen = (serverInstance: http.Server, options: ListenOptions) => {
  return new Promise((resolve) => {
    serverInstance.listen(options, () => {
      return resolve(serverInstance);
    });
  });
};

const storeConnections = (server: http.Server) => {
  server.on('connection', (conn: Socket) => {
    const key = `${conn.remoteAddress}:${conn.remotePort}`;
    connections.set(key, conn);

    conn.on('close', () => {
      connections.delete(key);
    });
  });
};

const releaseConnections = () => {
  server.close();

  connections.forEach((conn) => {
    conn.destroy();
  });
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
