import { createClient, RedisClientType } from 'redis';

// DECLARE REDIS CLIENT
let redisClient: RedisClientType;

// SET ENVIRONMENT CONFIGURATION
if (process.env.NODE_ENV === 'production') {
  // PRODUCTION CONFIGURATION
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
  });
} else {
  // DEVELOPMENT CONFIGURATION
  redisClient = createClient({
    url: process.env.REDIS_URL
  });
}

// ERROR HANDLER
redisClient.on('error', (error: any): void => console.error('Redis error:', error));

// CONNECT FUNCTION
const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log('Caching client connected...');
  } catch (error: any) {
    console.error('Failed to connect to Redis:', error);
  }
};

export { redisClient, connectRedis };
