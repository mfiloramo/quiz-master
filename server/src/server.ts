// MODULE IMPORTS
import express, { Express } from 'express';
import cors, { CorsOptions } from 'cors';
import * as http from "node:http";

// ROUTE IMPORTS
// ...

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
// ...

// HANDLE PREFLIGHT REQUESTS
app.options('*', cors(corsOptions));

// TODO: BUILD WILDCARD VIEW
// WILDCARD ENDPOINT
app.use('*', (req: any, res: any): void => {
  res.status(404).send('Resource not found');
});

// RUN SERVER FOR API AND WEBSOCKETS
server.listen(PORT, (): void => {
  console.log(`Server listening on port: ${ PORT }...`);
});
