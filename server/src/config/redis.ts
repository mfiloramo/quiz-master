import { createClient } from 'redis';

// INSTANTIATE REDIS CLIENT
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// ERROR HANDLER
redisClient.on('error', (error: any): void => console.error('Redis error:', error));

// CONNECT TO REDIS
const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log('Redis client connected...');
  } catch (error: any) {
    console.error('Failed to connect to Redis:', error);
  }
};

export { redisClient, connectRedis };
