import { type Request, type Response, Router } from 'express';
import { Games, Users } from '../controllers/index';
import cors from 'cors';

const router = Router();
// Define your REST API endpoints here

router.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).send('healthcheck');
});

router.get('/getUser', cors(), Users.getUser);
router.get('/addUser', cors(), Users.addUser);

// router.get("/getUser", requireAuth, Users.getUser);

router.get('/addGame', Games.addGame);

export default router;
