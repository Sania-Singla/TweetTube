import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
    removeFromLikedVideos,
    getDislikedVideos,
} from '../controllers/like.Controller.js';

import express from 'express';
export const likeRouter = express.Router();
import { verifyJWT } from '../middleware/index.js';

likeRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

likeRouter.route('/likedvideos').get(getLikedVideos);
likeRouter.route('/dislikedvideos').get(getDislikedVideos);
likeRouter
    .route('/removevideofromLiked/:videoId')
    .delete(removeFromLikedVideos);

likeRouter.route('/togglevideolike/:videoId').get(toggleVideoLike); // no need to write the toggleStatus query parameter, directly write in the request
likeRouter.route('/togglecommentlike/:commentId').get(toggleCommentLike);
likeRouter.route('/toggletweetlike/:tweetId').get(toggleTweetLike);
