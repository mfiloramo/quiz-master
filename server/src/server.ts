import express, { Express } from 'express';
import cors, { CorsOptions } from 'cors';
import * as http from "node:http";
import { Server } from "socket.io";

// ROUTE IMPORTS
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";
import { quizRouter } from "./routers/quiz.router";
import { questionRouter } from "./routers/question.router";
import { sessionRouter } from "./routers/session.router";
import { playerRouter } from "./routers/player.router";
import { webSocketRouter } from "./routers/websocket.router";

// GLOBAL VARIABLES
const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3030;
const server: any = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: [ 'GET', 'POST' ],
  },
});

// CORS MIDDLEWARE
const corsOptions: CorsOptions = {
  origin: [ 'http://localhost:3000' ],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],
  allowedHeaders: [ 'Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept' ],
};
app.use(express.json());
app.use(cors(corsOptions));

// SERVER ROUTES
app
  .use('/api/auth', authRouter)
  .use('/api/users', userRouter)
  .use('/api/quizzes', quizRouter)
  .use('/api/questions', questionRouter)
  .use('/api/sessions', sessionRouter)
  .use('/api/players', playerRouter);

// ATTACH WEBSOCKET ROUTES
webSocketRouter(io);

// HANDLE PREFLIGHT REQUESTS
app.options('*', cors(corsOptions));

// WILDCARD ENDPOINT
app.use('*', (req, res): void => {
  res.status(404).send('Resource not found');
});

// RUN SERVER FOR API AND WEBSOCKETS
server.listen(PORT, (): void => {
  console.log(`Server listening on port: ${ PORT }...`);
});
