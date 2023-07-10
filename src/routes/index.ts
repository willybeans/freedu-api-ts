import { type Request, type Response, Router } from 'express';
import { Games, Users } from '../controllers/index';

const router = Router();
// Define your REST API endpoints here

router.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).send('healthcheck');
});

router.get('/getUser', Users.getUser);

// router.get("/getUser", requireAuth, Users.getUser);

router.get('/addGame', Games.addGame);

export default router;
