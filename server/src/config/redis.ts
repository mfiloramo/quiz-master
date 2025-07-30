import { createClient } from 'redis';

// INSTANTIATE REDIS CLIENT
const redisClient = createClient({
  username: process.env.REDIS_USERNAME, // default
  password: process.env.REDIS_PASSWORD || 'vuCExJRgx3MJYjx4efHpA2Ke9VbXP5JS',
  socket: {
    host: process.env.REDIS_HOST || 'redis-13553.c245.us-east-1-3.ec2.redns.redis-cloud.com',
    port: Number(process.env.REDIS_PORT) || 13553
  }
});

// ERROR HANDLER
redisClient.on('error', (error: any): void => console.error('Redis error:', error));

// CONNECT TO REDIS
const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log('Caching client connected...');
  } catch (error: any) {
    console.error('Failed to connect to Redis:', error);
  }
};

export { redisClient, connectRedis };
