import express from 'express';
import {
  getLogin,
  postLogin,
  getJoin,
  postJoin,
} from '../controllers/userControllers';
import { home, search } from '../controllers/videoControllers';
import { publicOnlyMiddleware } from '../middlewares';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.route('/join').all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route('/login')
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get('/search', search);

export default rootRouter;
