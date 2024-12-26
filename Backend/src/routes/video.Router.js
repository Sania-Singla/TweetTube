import {
    getRandomVideos,
    getVideos,
    togglePublish,
    publishVideo,
    updateVideo,
    deleteVideo,
    getVideoById,
    getSearchData,
} from '../controllers/video.Controller.js';

import express from 'express';
export const videoRouter = express.Router();
import {
    upload,
    verifyJWT,
    optionalVerifyJWT,
    checkAborted,
    isVideoOwner,
} from '../middleware/index.js';

videoRouter.route('/random-videos').get(getRandomVideos);
videoRouter.route('/search-data').get(getSearchData);

videoRouter
    .route('/toggle-publish/:videoId/:status')
    .get(verifyJWT, isVideoOwner, togglePublish);

videoRouter
    .route('/:videoId')
    .get(optionalVerifyJWT, getVideoById)
    .delete(verifyJWT, isVideoOwner, deleteVideo)
    .patch(verifyJWT, isVideoOwner, upload.single('thumbnail'), updateVideo);

videoRouter
    .route('/')
    .get(getVideos)
    .post(
        verifyJWT,
        upload.fields([
            {
                name: 'videoFile',
                maxCount: 1,
            },
            {
                name: 'thumbnail',
                maxCount: 1,
            },
        ]),
        checkAborted,
        publishVideo
    );
