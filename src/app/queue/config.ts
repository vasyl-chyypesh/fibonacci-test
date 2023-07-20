const config = {
  redis: {
    client: 'redis',
    options: {
      host: process.env.REDIS_URL,
      port: process.env.REDIS_PORT,
    },
  },
};

export default config;
