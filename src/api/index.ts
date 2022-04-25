import { Router } from 'express';
import auth from './routes/auth';
import can from './routes/user-can';
import rec from './routes/user-rec';
import agendash from './routes/agendash';
import utils from './routes/utils';
import job from './routes/job';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  can(app);
  rec(app);
  job(app);
  utils(app);
  agendash(app);
  return app;
};
