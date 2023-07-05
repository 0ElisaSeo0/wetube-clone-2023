import express from 'express';
import { edit, deleteUser, see, logout } from '../controllers/userControllers';

const userRouter = express.Router();

userRouter.get('/:id', see);
userRouter.get('/edit', edit);
userRouter.get('/logout', logout);
userRouter.get('/delete', deleteUser);

export default userRouter;
