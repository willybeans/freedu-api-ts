import { Users } from '../models/';
import { type Request, type Response } from 'express';

async function getUser (req: Request, res: Response) {
  if (typeof req.query.id !== 'string') return;
  const id = req.query.id;
  const currentUser = await Users.getUser(id);
  res.status(200).json({
    user: currentUser === undefined ? 'user not found' : currentUser
  });
}

async function deleteUserById (req: Request, res: Response) {
  if (typeof req.query.id !== 'string') return;
  const id = req.query.id;
  const deleteUser = await Users.deleteUserById(id);
  res.json({
    200: deleteUser
  });
}

export default {
  getUser,
  deleteUserById
};
