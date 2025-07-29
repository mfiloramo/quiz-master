import { createClient } from 'redis';

// CREATE REDIS CLIENT
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// HANDLE ERROR
redisClient.on('error', (error: any): void => console.error(error));

// CONNECT TO REDIS WHEN THE  MODULE IS IMPORTED
redisClient.connect()
  .then(async (): Promise<void> => {
  console.log('Connected to Redis client...');
})
  .catch((error: any): void => {
  console.error('Failed to connect to Redis:', error);
})

export default redisClient;
