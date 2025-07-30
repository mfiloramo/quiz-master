import express, { Express } from 'express';
import cors, { CorsOptions } from 'cors';
import * as http from 'node:http';
import { Server } from 'socket.io';
import { sequelize } from './config/sequelize';
import * as dotenv from 'dotenv';

// LOAD ENVIRONMENT VARIABLES
dotenv.config()

// ROUTE IMPORTS
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";
import { quizRouter } from "./routers/quiz.router";
import { questionRouter } from "./routers/question.router";
import { webSocketRouter } from "./routers/websocket.router";
import { redisClient, connectRedis } from './config/redis';


// GLOBAL VARIABLES
const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3030;
const server: any = http.createServer(app);

// INITIALIZE SERVER
const io = new Server(server, {
  cors: {
    origin: [ 'http://localhost:3000', 'https://quiz-master-client.vercel.app' ],
    methods: [ 'GET', 'POST' ],
  },
});

// CORS MIDDLEWARE
const corsOptions: CorsOptions = {
  origin: [ 'http://localhost:3000', 'https://quiz-master-client.vercel.app' ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

// EXPRESS MIDDLEWARE
app.use(express.json());
app.use(cors(corsOptions));

// HANDLE PREFLIGHT REQUESTS
app.options('*', cors(corsOptions));

// SERVER ROUTES
app
  .use('/api/auth', authRouter)
  .use('/api/users', userRouter)
  .use('/api/quizzes', quizRouter)
  .use('/api/questions', questionRouter)

// ATTACH WEBSOCKET ROUTES
webSocketRouter(io);

// WILDCARD ENDPOINT
app.use('*', (req, res): void => {
  res.status(404).send('Resource not found');
});


// DATABASE CONNECTION AND SERVER STARTUP
const startServer = async (): Promise<void> => {
  try {
    // CONNECT TO SQL DATABASE
    await sequelize.authenticate();
    console.log('Database connected...');

    // CONNECT TO REDIS
    await connectRedis();

    // RUN SERVER
    server.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}...`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// START SERVER
startServer().then((response: any) => response);
