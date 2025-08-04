import { Request, Response } from 'express';
import { sequelize } from "../config/sequelize";
import { redis } from '../config/redis';


export class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    // SELECT ALL USERS
    try {
      // CREATE CACHE KEY FOR ALL USERS
      const cacheKey: string = 'users:all';

      const cached = await redis.get(cacheKey);

      if (cached) {
        // CACHE HIT: SEND CACHED USER DATA TO CLIENT
        console.log('Cache hit: All users...');
        const users = JSON.parse(cached);
        res.send(users);
      } else {
        // CACHE MISS: QUERY DATABASE FOR ALL USERS
        console.log('Cache miss: All users...');

        // EXECUTE STORED PROCEDURE TO QUERY DATABASE FOR ALL USERS
        const selectAll = await sequelize.query('EXECUTE GetAllUsers')

        // SEND ALL USERS TO CLIENT
        res.send(selectAll[0]);
      }
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }
  
  static async getUserById(req: Request, res: Response): Promise<void> {
    // SELECT USER BY ID
    try {
      // DESTRUCTURE USER ID FROM REQUEST PARAMS
      const { userId } = req.params;

      // CREATE CACHE KEY FOR USER TO BE SELECTED
      const cacheKey: string = `user${userId}`;

      const cached = await redis.get(cacheKey);

      if (cached) {
        // CACHE HIT: RETRIEVE USER FROM CACHE
        console.log('Cache hit: Select user data...');
        const user = JSON.parse(cached);
        res.send(user);
      } else {
        // CACHE MISS: EXECUTE STORED PROCEDURE TO GET USER BY ID
        console.log('Cache miss: Select user data...')
        const user: any = await sequelize.query('EXECUTE GetUserById :userId', {
          replacements: { userId }
        })
        res.send(user[0][0]);
      }
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    // UPDATE EXISTING USER
    try {
      // DESTRUCTURE USER DATA FROM REQUEST BODY
      const { userId, username, email }  = req.body;

      // CREATE CACHE KEY FOR USER TO BE UPDATED
      const cacheKey: string = `user:${userId}`;

      const cached = await redis.get(cacheKey);

      // EXECUTE STORED PROCEDURE TO UPDATE USER IN DATABASE
      await sequelize.query('EXECUTE UpdateUser :userId :username :email',
        {
          replacements: { userId, username, email }
        });

      // SET/UPDATE USER IN REDIS CACHE
      await redis.set(cacheKey, JSON.stringify(cached));

      // SEND CONFIRMATION MESSAGE TO CLIENT
      res.json(`User ${ username } updated successfully`);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      // DESTRUCTURE USER ID FROM REQUEST BODY
      const { userId } = req.body;

      // CREATE CACHE KEY FOR USER TO BE DELETED
      const cacheKey: string = `user:${userId}`

      // EXECUTE STORED PROCEDURE TO DELETE USER FROM DATABASE[
      await sequelize.query('EXECUTE DeleteUser :userId',
        {
          replacements: { userId }
        })

      // REMOVE KEY FROM CACHE
      await redis.del(cacheKey)
        .then((): void => console.log('User cacheKey deleted...'))
        .catch((error: any): void => console.log(`Error deleting user from Redis cache: ${error}`));

      // SEND CONFIRMATION RESPONSE TO USER
      res.json(`User with ID ${ userId } deleted successfully`);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }
}


