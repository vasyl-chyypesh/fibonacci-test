/* eslint-disable no-console */
import serverWrapper from './server';

const catchErrors = (expressServer: typeof serverWrapper) => {
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection happened, reason: ', reason);

    expressServer.stop();
  });

  process.on('uncaughtException', (ex) => {
    console.error('Unhandled Exception:', ex);

    expressServer.stop();
  });

  process.once('SIGTERM', () => {
    console.info('Received SIGTERM. Graceful shutdown start', new Date().toISOString());

    expressServer.stop();
  });

  process.once('SIGINT', () => {
    console.info('Received SIGINT. Graceful shutdown start', new Date().toISOString());

    expressServer.stop();
  });
};

serverWrapper
  .start()
  .then(catchErrors)
  .catch((err) => {
    console.error('Server start error: ', err);
    process.exit(0);
  });
