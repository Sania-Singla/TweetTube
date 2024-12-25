import { getAboutChannel } from '../controllers/about.Controller.js';

import express from 'express';
export const aboutRouter = express.Router();

aboutRouter.route('/:userId').get(getAboutChannel);

//⭐⭐⭐ will add links feature for contact information
