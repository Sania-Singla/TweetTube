import {
    addComment,
    updateComment,
    deleteComment,
    getComments,
} from '../controllers/comment.Controller.js';

import { verifyJWT, optionalVerifyJWT } from '../middleware/index.js';
import express from 'express';
export const commentRouter = express.Router();

commentRouter
    .route('/:videoId')
    .get(optionalVerifyJWT, getComments)
    .post(verifyJWT, addComment);

commentRouter
    .route('/:commentId')
    .patch(verifyJWT, updateComment)
    .delete(verifyJWT, deleteComment);
