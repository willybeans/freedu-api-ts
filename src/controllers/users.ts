import { Users } from '../models/';
import { type Request, type Response } from 'express';

async function addUser(req: Request, res: Response) {
  if (typeof req.query.user_name !== 'string') return;
  const userName = req.query.user_name;
  const currentUser = await Users.addUser(userName);
  res.status(200).json({
    user: currentUser === undefined ? 'user creation failed' : currentUser
  });
}

async function getUser(req: Request, res: Response) {
  if (typeof req.query.id !== 'string') return;
  const id = req.query.id;
  const currentUser = await Users.getUser(id);
  res.status(200).json({
    user: currentUser === undefined ? 'user not found' : currentUser
  });
}

async function deleteUserById(req: Request, res: Response) {
  if (typeof req.query.id !== 'string') return;
  const id = req.query.id;
  const deleteUser = await Users.deleteUserById(id);
  res.json({
    200: deleteUser
  });
}

export default {
  addUser,
  getUser,
  deleteUserById
};
