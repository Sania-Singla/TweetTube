import { healthCheck } from '../controllers/healthcheck.Controller.js';
import { verifyJWT } from '../middleware/index.js';
import express from 'express';
export const healthRouter = express.Router();

healthRouter.use(verifyJWT);

healthRouter.route('/').get(healthCheck);
