import express from 'express';
import {
  getLogin,
  postLogin,
  getJoin,
  postJoin,
} from '../controllers/userControllers';
import { home, search } from '../controllers/videoControllers';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.route('/join').get(getJoin).post(postJoin);
rootRouter.route('/login').get(getLogin).post(postLogin);
rootRouter.get('/search', search);

export default rootRouter;
