import {
    toggleSubscribe,
    getChannelSubscribers,
    getSubscribedChannels,
} from '../controllers/subscription.Controller.js';

import { verifyJWT } from '../middleware/index.js';
import express from 'express';
export const subscriptionRouter = express.Router();

subscriptionRouter.route('/toggle/:channelId').get(verifyJWT, toggleSubscribe);
subscriptionRouter
    .route('/subscribers/:channelId')
    .get(verifyJWT, getChannelSubscribers);

subscriptionRouter.route('/subscribedTo/:userId').get(getSubscribedChannels);
