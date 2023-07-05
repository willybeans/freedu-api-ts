import { type Request, type Response, Router } from 'express';
import { Users } from '../controllers/index';

const router = Router();
// Define your REST API endpoints here

router.get('/healthcheck', (req: Request, res: Response) => {
  res.status(200).send('healthcheck');
});

router.get('/getUser', Users.getUser);

// router.get("/getUser", requireAuth, Users.getUser);

router.get('/users', (req: Request, res: Response) => {
  // Implement the logic to retrieve users from the database
  // Send the response back to the client
});

export default router;
