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
import { verifyJWT, isPlaylistOwner } from '../middleware/index.js';

playlistRouter.route('/user/:userId').get(getPlaylists);
playlistRouter.route('/titles/:userId').get(getPlaylistsTitles);
playlistRouter.route('/').post(verifyJWT, createPlaylist);
playlistRouter
    .route('/:playlistId')
    .get(getPlaylist)
    .patch(verifyJWT, isPlaylistOwner, updatePlaylist)
    .delete(verifyJWT, isPlaylistOwner, deletePlaylist);
playlistRouter
    .route('/add/:playlistId/:videoId')
    .patch(verifyJWT, isPlaylistOwner, addVideoToPlaylist);
playlistRouter
    .route('/remove/:playlistId/:videoId')
    .patch(verifyJWT, isPlaylistOwner, removeVideoFromPlaylist);
