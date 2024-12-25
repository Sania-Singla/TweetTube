import {
    register,
    login,
    logout,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateChannelInfo,
    updateCoverImage,
    updateAvatar,
    getChannelProfile,
    getwatchhistory,
    clearWatchHistory,
} from '../controllers/user.Controller.js';

import express from 'express';
export const userRouter = express.Router();
import { upload, verifyJWT, optionalVerifyJWT } from '../middleware/index.js';

userRouter.route('/register').post(
    upload.fields([
        {
            name: 'avatar', // these are field names , should be same in frontend
            maxCount: 1,
        },
        {
            name: 'coverImage',
            maxCount: 1,
        },
    ]),
    register
);

userRouter.route('/login').post(login);
userRouter.route('/logout').post(verifyJWT, logout);
userRouter.route('/refresh-token').post(refreshAccessToken);
userRouter.route('/change-password').patch(verifyJWT, changeCurrentPassword);
userRouter.route('/current-user').get(verifyJWT, getCurrentUser);
userRouter
    .route('/update-account') // can use put/post too since we are not getting into too much of context here
    .patch(verifyJWT, updateAccountDetails);

userRouter.route('/update-channel-info').patch(verifyJWT, updateChannelInfo);
userRouter.route('/cover-image').patch(
    verifyJWT,
    (req, res, next) => {
        try {
            upload.single('coverImage')(req, res, (err) =>
                /*console.log('req.file:', req.file)*/ next()
            );
        } catch (error) {
            return res.status(500).json({
                message: 'Catch block error in multer middleware.',
                error,
            });
        }
    },
    updateCoverImage
);
userRouter.route('/avatar').patch(
    verifyJWT,
    (req, res, next) => {
        try {
            upload.single('avatar')(req, res, (err) =>
                /*console.log('req.file:', req.file)*/ next()
            );
        } catch (error) {
            return res.status(500).json({
                message: 'Catch block error in multer middleware.',
                error,
            });
        }
    },
    updateAvatar
);
userRouter
    .route('/channel/:username') // don't apply colon(:) in the url while testing
    .get(optionalVerifyJWT, getChannelProfile);

userRouter.route('/watch-History').get(verifyJWT, getwatchhistory);
userRouter.route('/clear-History').delete(verifyJWT, clearWatchHistory);
