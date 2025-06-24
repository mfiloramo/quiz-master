import { Options, Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

// LOAD ENVIRONMENT VARIABLES
dotenv.config();

// RETRIEVE ENVIRONMENT VARIABLES
const dbHost: string = process.env.DB_HOST!;
const dbName: string = process.env.DB_NAME!;
const dbUser: string = process.env.DB_USER!;
const dbPassword: string = process.env.DB_PASSWORD!;

// ENSURE REQUIRED ENVIRONMENT VARIABLES ARE DEFINED
if (!dbHost || !dbName || !dbUser || !dbPassword) {
  throw new Error('Missing required database environment variables. Check your .env file.');
}

// CONFIGURE SEQUELIZE CONNECTION
const options: Options = {
  host: dbHost,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true, // SET TRUE IF USING AZURE
    },
  },
  logging: console.log,
};

export const sequelize: Sequelize = new Sequelize(dbName, dbUser, dbPassword, options);
