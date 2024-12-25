import {
    createPlaylist,
    getPlaylists,
    getPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist,
    getPlaylistsTitles,
} from '../controllers/playlist.Controller.js';

import express from 'express';
export const playlistRouter = express.Router();
import { verifyJWT } from '../middleware/index.js';

playlistRouter.route('/user/:userId').get(getPlaylists);
playlistRouter.route('/titles/:userId').get(getPlaylistsTitles);
playlistRouter.route('/').post(verifyJWT, createPlaylist);
playlistRouter
    .route('/:playlistId')
    .get(getPlaylist)
    .patch(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist);
playlistRouter
    .route('/add/:playlistId/:videoId')
    .get(verifyJWT, addVideoToPlaylist);
playlistRouter
    .route('/remove/:playlistId/:videoId')
    .get(verifyJWT, removeVideoFromPlaylist);
