import { Messages } from '../models/';
import { type Request, type Response } from 'express';

async function getMessages (req: Request, res: Response) {
  if (typeof req.query.id !== 'string') return;
  const id = req.query.id;
  const currentMessage = await Messages.getMessageById(id);
  res.status(200).json({
    user: currentMessage === undefined ? 'user not found' : currentMessage
  });
}

async function deleteMessageById (req: Request, res: Response) {
  if (typeof req.query.id !== 'string') return;
  const id = req.query.id;
  const deleteMessage = await Messages.deleteMessageById(id);
  res.json({
    200: deleteMessage
  });
}

export default {
  getMessages,
  deleteMessageById
};
