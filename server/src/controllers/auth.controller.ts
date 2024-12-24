import { Request, Response } from 'express';
import axios from 'axios';


export const authController = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).send('Controller response successful!');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};
