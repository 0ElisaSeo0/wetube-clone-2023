import express from 'express';
import {
  see,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from '../controllers/videoControllers';
import { protectedMiddleware } from '../middlewares';

const videoRouter = express.Router();

videoRouter
  .route('/upload')
  .all(protectedMiddleware)
  .get(getUpload)
  .post(postUpload);
videoRouter.get('/:id([0-9a-f]{24})', see);
videoRouter
  .route('/:id([0-9a-f]{24})/edit')
  .all(protectedMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route('/:id([0-9a-f]{24})/delete')
  .all(protectedMiddleware)
  .get(deleteVideo);
// videoRouter.get('/:id(\\d+)/edit', getEdit);
// videoRouter.post('/:id(\\d+)/edit', postEdit);

export default videoRouter;
