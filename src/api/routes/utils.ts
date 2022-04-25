import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import skillset from '../../utils/skills';
import cities from '../../utils/cities';
const route = Router();
export default (app: Router) => {
  app.use('/utils', route);

  /*
   * Method to get a list of predefined skills
   */
  route.get('/skills', middlewares.isAuth, (req: Request, res: Response) => {
    return res.json({ skills: skillset }).status(200);
  });

  /*
   * Method to get a list of predefined cities
   */
  route.get('/cities', middlewares.isAuth, (req: Request, res: Response) => {
    return res.json({ cities: cities }).status(200);
  });
};
