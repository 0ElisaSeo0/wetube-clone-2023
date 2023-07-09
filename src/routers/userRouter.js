import express from 'express';
import {
  getEdit,
  postEdit,
  see,
  logout,
  startKakaoLogin,
  finishKakaoLogin,
} from '../controllers/userControllers';
import { protectedMiddleware, publicOnlyMiddleware } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/logout', protectedMiddleware, logout);
userRouter.route('/edit').all(protectedMiddleware).get(getEdit).post(postEdit);
userRouter.get('/kakao/start', publicOnlyMiddleware, startKakaoLogin);
userRouter.get('/kakao/finish', publicOnlyMiddleware, finishKakaoLogin);
userRouter.get('/:id', see);

export default userRouter;
