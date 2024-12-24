// MODULE IMPORTS
import express, { Express } from 'express';
import cors, { CorsOptions } from 'cors';
import * as http from "node:http";

// ROUTE IMPORTS
import { authRouter } from "./routers/auth.router";
import { usersRouter } from "./routers/users.router";
import { quizzesRouter } from "./routers/quizzes.router";
import { questionsRouter } from "./routers/questions.router";
import { sessionsRouter } from "./routers/sessions.router";
import { playersRouter } from "./routers/players.router";
import { websocketRouter } from "./routers/websocket.router";

// GLOBAL VARIABLES
const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3030;
const server: any = http.createServer(app);

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
  .use('/api/users', usersRouter)
  .use('/api/quizzes', quizzesRouter)
  .use('/api/questions', questionsRouter)
  .use('/api/sessions', sessionsRouter)
  .use('/api/players', playersRouter)
  .use('/ws/sessions/:id', websocketRouter)

// HANDLE PREFLIGHT REQUESTS
app.options('*', cors(corsOptions));

// WILDCARD ENDPOINT
app.use('*', (req: any, res: any): void => {
  res.status(404).send('Resource not found');
});

// RUN SERVER FOR API AND WEBSOCKETS
server.listen(PORT, (): void => { 
  console.log(`Server listening on port: ${ PORT }...`);
});
