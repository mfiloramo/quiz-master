import { Request, Response } from 'express';
import { sequelize } from "../config/sequelize";


export class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    // SELECT ALL USERS
    try {
      const selectAll = await sequelize.query('EXECUTE GetAllUsers')
      res.send(selectAll[0]);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }
  
  static async getUserById(req: Request, res: Response): Promise<void> {
    // SELECT USER BY ID
    try {
      const user: any = await sequelize.query('EXECUTE GetUserById :userId', {
        replacements: {
          userId: req.params.userId
        }
      })
      res.send(user[0][0]);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    // UPDATE EXISTING USER
    try {
      const { userId, username, email }  = req.body;
      await sequelize.query('EXECUTE UpdateUser :userId :username :email',
        {
          replacements: { userId, username, email }
        });
      res.json(`User ${ username } updated successfully`);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      await sequelize.query('EXECUTE DeleteUser :userId',
        {
          replacements: { userId }
        })
      res.json(`User with ID ${ userId } deleted successfully`);
    } catch (error: any) {
      console.error('Error executing Stored Procedure:', error.message);
      res.status(500).send('Internal server error');
    }
  }
}


