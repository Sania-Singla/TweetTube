import {
    getTweets,
    createTweet,
    updateTweet,
    deleteTweet,
} from '../controllers/tweet.Controller.js';

import express from 'express';
export const tweetRouter = express.Router();
import { verifyJWT, isTweetOwner } from '../middleware/index.js';

tweetRouter.route('/:userId').get(getTweets);

tweetRouter.use(verifyJWT);

tweetRouter.route('/').post(createTweet);

tweetRouter
    .route('/:tweetId')
    .patch(isTweetOwner, updateTweet)
    .delete(isTweetOwner, deleteTweet);
