import express from 'express';
import {
  getEdit,
  postEdit,
  see,
  logout,
  startKakaoLogin,
  finishKakaoLogin,
  getChangePassword,
  postChangePassword,
} from '../controllers/userControllers';
import {
  protectedMiddleware,
  publicOnlyMiddleware,
  uploadFilesMiddleware,
} from '../middlewares';

const userRouter = express.Router();

userRouter.get('/logout', protectedMiddleware, logout);
userRouter
  .route('/edit')
  .all(protectedMiddleware)
  .get(getEdit)
  .post(uploadFilesMiddleware.single('avatar'), postEdit);
userRouter.get('/kakao/start', publicOnlyMiddleware, startKakaoLogin);
userRouter.get('/kakao/finish', publicOnlyMiddleware, finishKakaoLogin);
userRouter
  .route('/change-password')
  .all(protectedMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get('/:id', see);

export default userRouter;
