import { Games, Utils } from '../models/';
import { type Request, type Response } from 'express';

async function addGame(req: Request, res: Response) {
  if (typeof req.query.name !== 'string' || req.query.name === '') {
    res.status(400);
    return;
  }
  const name = req.query.name;
  const id = await Utils.getUUID();

  const newGame = await Games.addGame(id.gen_random_uuid, name);
  res.status(200).json({
    ...newGame
  });
}

async function getGame(req: Request, res: Response) {
  if (typeof req.query.id !== 'string') return;
  const id = req.query.id;
  const game = await Games.getGame(id);
  res.status(200).json({
    game: game === undefined ? 'game not found' : game
  });
}

async function getAllGames(req: Request, res: Response) {
  const games = await Games.getAllGames();
  res.status(200).json({
    game: games === undefined ? 'games not found' : games
  });
}

async function deleteGameById(req: Request, res: Response) {
  if (typeof req.query.id !== 'string') return;
  const id = req.query.id;
  const deleteGame = await Games.deleteGameById(id);
  res.json({
    200: deleteGame
  });
}

export default {
  getAllGames,
  addGame,
  getGame,
  deleteGameById
};
