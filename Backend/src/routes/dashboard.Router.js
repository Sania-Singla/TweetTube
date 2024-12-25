import express from 'express';
export const dashboardRouter = express.Router();
import { verifyJWT } from '../middleware/index.js';
import { getStats, getVideos } from '../controllers/dashboard.Controller.js';

dashboardRouter.use(verifyJWT);

dashboardRouter.route('/stats').get(getStats);
dashboardRouter.route('/videos').get(getVideos);
