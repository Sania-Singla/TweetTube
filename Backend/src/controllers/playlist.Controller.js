import mongoose, { isValidObjectId } from 'mongoose';
import { Playlist } from '../models/index.js';
import {
    SERVER_ERROR,
    OK,
    BAD_REQUEST,
    CREATED,
} from '../constants/errorCodes.js';

const createPlaylist = async (req, res) => {
    // get name and descr from req.body
    // will have access to req.user (creater)
    // create a playlist doc with empty videos array or jsut dont mention it in the create method.
    try {
        const { name, description = '' } = req.body;

        // can have multiple playlists with same name
        // const existingPlaylist = await Playlist.findOne({ name });
        // if (existingPlaylist) return res.status(OK).json(existingPlaylist);

        const playlist = await Playlist.create({
            name,
            description,
            createdBy: req.user._id,
        });
        if (!playlist)
            return res
                .status(SERVER_ERROR)
                .json({ message: 'PLAYLIST_CREATION_DB_ISSUE' });
        return res.status(CREATED).json(playlist);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while creating the playlist',
            err: err.message,
        });
    }
};

const getPlaylists = async (req, res) => {
    // get userId from req.params
    // will have access to req.user
    // find the playlist docs with this userId as the createdBy
    //populate the videos field and then subfield owner

    try {
        const { userId } = req.params;
        if (!isValidObjectId(userId))
            return res.status(BAD_REQUEST).json({ message: 'INVALID_USERID' });

        const { page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const startIndex = (pageNumber - 1) * limit;
        const endIndex = pageNumber * limit;

        const playlists = await Playlist.aggregate([
            // can also use .find({})
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'videos',
                    foreignField: '_id',
                    as: 'videos',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'owner',
                                foreignField: '_id',
                                as: 'owner',
                                pipeline: [
                                    {
                                        $project: {
                                            username: 1,
                                            fullname: 1,
                                            avatar: 1,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $addFields: {
                                owner: {
                                    $first: '$owner',
                                },
                                views: {
                                    $size: '$views',
                                },
                            },
                        },
                        {
                            $project: {
                                thumbnail: 1,
                                owner: 1,
                                views: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    totalVideos: {
                        $size: '$videos',
                    },
                },
            },
            {
                $sort: {
                    updatedAt: -1, // Sort before skip and limit
                },
            },
            {
                $skip: startIndex,
            },
            {
                $limit: limitNumber,
            },
        ]);

        const totalPlaylists = await Playlist.countDocuments({
            createdBy: new mongoose.Types.ObjectId(userId),
        });
        const totalPages = Math.ceil(totalPlaylists / limitNumber); // will round off to nearest integer
        const hasNextPage = pageNumber < totalPages;
        const hasPreviousPage = pageNumber > 1;

        //if(playlists.length === 0) return res.status(OK).json({ message:"NO playlists created yet." })   //handled on frontend

        const result = {
            info: {
                totalPlaylists,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            },
            playlists,
        };

        return res.status(OK).json(result);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while fetching the playlist',
            err: err.message,
        });
    }
};

const getPlaylistsTitles = async (req, res) => {
    // get userId from req.params
    // will have access to req.user
    // find the playlist docs with this userId as the createdBy
    try {
        const { userId } = req.params;
        if (!isValidObjectId(userId))
            return res.status(BAD_REQUEST).json({ message: 'INVALID_USERID' });

        const playlists = await Playlist.aggregate([
            // can also use .find({})
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $addFields: {
                    totalVideos: { $size: '$videos' },
                },
            },
            {
                $sort: {
                    createdAt: -1, // Sort before skip and limit
                },
            },
            {
                $project: {
                    totalVideos: 1,
                    _id: 1,
                    name: 1,
                    videos: 1,
                },
            },
            { $limit: 5 },
        ]);
        return res.status(OK).json(playlists);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while fetching the playlist titles',
            err: err.message,
        });
    }
};

const getPlaylist = async (req, res) => {
    // get playlistId from req.params
    // will have access to req.user
    // find the playlist doc
    // populate the videos field and then subfield owner
    try {
        const { playlistId } = req.params;
        if (!isValidObjectId(playlistId))
            return res
                .status(BAD_REQUEST)
                .json({ message: 'INVALID_PLAYLISTID' });
        const playlist = await Playlist.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(playlistId),
                },
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'videos',
                    foreignField: '_id',
                    as: 'videos',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'owner',
                                foreignField: '_id',
                                as: 'owner',
                                pipeline: [
                                    {
                                        $project: {
                                            username: 1,
                                            fullname: 1,
                                            avatar: 1,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $addFields: {
                                owner: {
                                    $first: '$owner',
                                },
                                views: { $size: '$views' },
                            },
                        },
                        {
                            $sort: {
                                updatedAt: -1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy',
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullname: 1,
                                avatar: 1,
                                _id: 1,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    totalVideos: { $size: '$videos' },
                    createdBy: { $first: '$createdBy' },
                },
            },
        ]);
        if (!playlist)
            return res
                .status(BAD_REQUEST)
                .json({ message: 'PLAYLIST_NOT_FOUND' });
        return res.status(CREATED).json(playlist[0]);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while fetching the playlist by id',
            err: err.message,
        });
    }
};

const addVideoToPlaylist = async (req, res) => {
    //get playlistId to which we want to add the video and the videoId from req.params
    //have access to req.user
    //find the playlist doc with this playlistId
    //just push the videoId into the video field of the doc
    //in case of user create a new playlist using the input field instead of choosing an already made playlist then first request for createplaylist then call this method (for frontend)
    try {
        const { playlistId, videoId } = req.params;
        if (!isValidObjectId(videoId))
            return res.status(BAD_REQUEST).json({ message: 'INVALID_VIDEOID' });
        if (!isValidObjectId(playlistId))
            return res
                .status(BAD_REQUEST)
                .json({ message: 'INVALID_PLAYLISTID' });
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $push: {
                    videos: new mongoose.Types.ObjectId(videoId),
                },
            },
            { new: true }
        );
        if (!playlist)
            return res
                .status(BAD_REQUEST)
                .json({ message: 'PLAYLIST_NOT_FOUND' });
        return res.status(OK).json({ message: 'VIDEO_ADDED_TO_PLAYLIST' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message:
                'something went wrong while adding the video to the playlist',
            err: err.message,
        });
    }
};

const removeVideoFromPlaylist = async (req, res) => {
    //get playlistId from which we want to remove the video and the videoId from req.params
    //have access to req.user
    //find the playlist doc with this playlistId
    //just remove the videoId from the video field of the doc
    try {
        const { playlistId, videoId } = req.params;
        if (!isValidObjectId(videoId))
            return res.status(BAD_REQUEST).json({ message: 'INVALID_VIDEOID' });
        if (!isValidObjectId(playlistId))
            return res
                .status(BAD_REQUEST)
                .json({ message: 'INVALID_PLAYLISTID' });
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $pull: {
                    videos: new mongoose.Types.ObjectId(videoId),
                },
            },
            { new: true }
        );
        if (!playlist)
            return res
                .status(BAD_REQUEST)
                .json({ message: 'PLAYLIST_NOT_FOUND' });
        return res
            .status(OK)
            .json({ message: 'VIDEO_REMOVED_FROM_PLAYLIST_SUCCESSFULLY' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message:
                'something went wrong while removing the video from the playlist',
            err: err.message,
        });
    }
};

const updatePlaylist = async (req, res) => {
    // get playlistId from req.params
    // get name and descr from req.body to update
    // find the playlist doc with this playlistId and update
    try {
        const { playlistId } = req.params;
        if (!isValidObjectId(playlistId))
            return res
                .status(BAD_REQUEST)
                .json({ message: 'INVALID_PLAYLISTID' });
        const { name, description = '' } = req.body;
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set: {
                    name,
                    description,
                },
            },
            { new: true }
        );
        if (!playlist)
            return res
                .status(BAD_REQUEST)
                .json({ message: 'PLAYLIST_NOT_FOUND' });
        return res
            .status(OK)
            .json({ message: 'PLAYLIST_UPDATED_SUCCESSFULLY' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while updating the playlist',
            err: err.message,
        });
    }
};

const deletePlaylist = async (req, res) => {
    //get playlistId from req.params
    //find the playlist doc with this playlistId and delete
    try {
        const { playlistId } = req.params;
        if (!isValidObjectId(playlistId))
            return res
                .status(BAD_REQUEST)
                .json({ message: 'INVALID_PLAYLISTID' });
        const playlist = await Playlist.findByIdAndDelete(playlistId);
        if (!playlist)
            return res
                .status(BAD_REQUEST)
                .json({ message: 'PLAYLIST_NOT_FOUND' });
        return res
            .status(OK)
            .json({ message: 'PLAYLIST_DELETED_SUCCESSFULLY' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while deleting the playlist',
            err: err.message,
        });
    }
};

export {
    createPlaylist,
    getPlaylist,
    getPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    getPlaylistsTitles,
};
