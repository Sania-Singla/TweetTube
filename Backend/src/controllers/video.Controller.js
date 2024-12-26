import mongoose, { isValidObjectId } from 'mongoose';
import { User, Like, Comment, Video } from '../models/index.js';
import fs from 'fs';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from '../utils/cloudinary.js';
import {
    SERVER_ERROR,
    OK,
    BAD_REQUEST,
    NOT_FOUND,
    CREATED,
    ABORTED,
} from '../constants/errorCodes.js';

const getRandomVideos = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = pageNumber * limitNumber;

        const videos = await Video.aggregate([
            {
                $match: { isPublished: true },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
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
                    owner: { $first: '$owner' },
                },
            },
            {
                $addFields: {
                    views: { $size: '$views' },
                },
            },
            {
                $sort: { updatedAt: -1 },
            },
            {
                $skip: startIndex,
            },
            {
                $limit: limitNumber,
            },
        ]);

        const totalVideos = await Video.countDocuments({});
        const totalPages = Math.ceil(totalVideos / limitNumber);
        const hasNextPage = pageNumber < totalPages;
        const hasPreviousPage = pageNumber > 1;

        const result = {
            info: {
                totalPages,
                totalVideos,
                hasNextPage,
                hasPreviousPage,
            },
            videos,
        };

        return res.status(OK).json(result);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while fetching random videos.',
            err: err.message,
        });
    }
};

const getVideos = async (req, res) => {
    //get the userid from query and find all the videos with that owner id (there is no need to populate the owner field)
    //we have access to req.user
    //pagination: we need page, limit
    //for additional features like sorting we will need sortBy, sortType

    try {
        const {
            userId,
            query = '',
            sortType = 'desc',
            sortBy = 'updatedAt',
            page = 1,
            limit = 10,
        } = req.query; // query means search term right now we are not implementing that will see in future (easy)
        if (!userId || !isValidObjectId(userId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'MISSING_OR_INVALID_USERID' });
        }

        //all will be strings by default
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = pageNumber * limitNumber;

        //pipeline
        const pipeline = [
            //stage 1
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId),
                    isPublished: true,
                },
            },
            {
                $addFields: {
                    views: { $size: '$views' },
                },
            },
            {
                $sort: {
                    [sortBy]: sortType === 'desc' ? -1 : 1, //(desc => -1 and asc => 1)
                },
            },
            //stage 3
            {
                $skip: startIndex, // will directly go to that index skipping all docs before that
            },
            //stage 4
            {
                $limit: limitNumber, // will give only this number of docs so saves time if user was satisfied with this much andd not willint to go to next page
            },
        ];

        //checking if have sortBy and sortType so will add an additional stage for sorting (stage 4)
        // if(sortBy && sortType)
        // {
        //     const sortStage = {
        //         //stage 5
        //         $sort:{
        //             [sortBy]: sortType === "desc" ? -1 : 1           //(desc => -1 and asc => 1)
        //         }
        //     }
        //     pipeline.push(sortStage);
        // }

        //executing the pipeline
        const videos = await Video.aggregate(pipeline);
        //if(videos.length === 0) return res.status(OK).json({ message: "NO videos found." });   //if we set 204 status, it was causing an issue in frontend regarding the response is not json also we handled it on frontend so no need here

        //calculating has next and prev page or not
        const totalVideos = await Video.countDocuments({
            owner: new mongoose.Types.ObjectId(userId),
        });
        const totalPages = Math.ceil(totalVideos / limitNumber); // will round off to nearest integer
        const hasNextPage = pageNumber < totalPages;
        const hasPreviousPage = pageNumber > 1;
        /* alternative
        const hasNextPage = endIndex < totalVideos;
        const hasPreviousPage = startIndex > 0;
        */

        const result = {
            info: {
                totalVideos,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            },
            videos,
        };
        return res.status(OK).json(result);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while fetching the videos',
            err: err.message,
        });
    }
};

const togglePublish = async (req, res) => {
    try {
        const { videoId, status } = req.params;
        if (!videoId || !isValidObjectId(videoId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'INVALID_OR_MISSING_VIDEOID' });
        }

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(NOT_FOUND).json({ message: 'VIDEO_NOT_FOUND' });
        }

        video.isPublished = status;
        await video.save({ validateBeforeSave: false });
        return res.status(OK).json(video);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while toggling the publish video',
            err: err.message,
        });
    }
};

const publishVideo = async (req, res) => {
    let videoFile, thumbnail;
    try {
        const { title, description } = req.body;
        if (
            !req.files?.videoFile ||
            !req.files?.thumbnail ||
            !title ||
            !description
        ) {
            return res.status(BAD_REQUEST).json({ message: 'MISSING_FIELDS' });
        }

        const videoFileLocalpath = req.files.videoFile[0].path;
        const thumbnailLocalpath = req.files.thumbnail[0].path;

        if (req.connectionClosed) {
            console.log('Connection closed,had nothing to clean yet.');
            return res
                .status(ABORTED)
                .json({ message: 'VIDEO_UPLOAD_REQUEST_CANCELLED' });
        }

        // upload thumbnail
        thumbnail = await uploadOnCloudinary(thumbnailLocalpath);
        if (req.connectionClosed) {
            console.log(
                'uploaded thumbnail but request cancelled so deleting it from cloudinary.'
            );
            // await deleteFromCloudinary(videoFile.url);
            await deleteFromCloudinary(thumbnail.url);
            console.log('deleted the thumbnail from cloudinary');
            fs.unlinkSync(videoFileLocalpath); //we dont need the video anymore
            return res
                .status(ABORTED)
                .json({ message: 'VIDEO_UPLOAD_REQUEST_CANCELLED' });
        }

        // upload video
        videoFile = await uploadOnCloudinary(videoFileLocalpath);
        if (req.connectionClosed) {
            console.log(
                'video & thumbnail uploaded but request cancelled so deleting both from cloudinary.'
            );
            await deleteFromCloudinary(videoFile.url);
            await deleteFromCloudinary(thumbnail.url);
            console.log('deleted both from cloudinary');
            return res
                .status(ABORTED)
                .json({ message: 'VIDEO_UPLOAD_REQUEST_CANCELLED' });
        }

        const video = await Video.create({
            description,
            title,
            duration: videoFile.duration,
            thumbnail: thumbnail.url,
            videoFile: videoFile.url,
            owner: req.user._id,
        });

        if (req.connectionClosed) {
            console.log(
                'uploaded both and created entry in db but request cancelled so deleting both from cloudinary and the video from db'
            );
            await deleteFromCloudinary(videoFile.url);
            await deleteFromCloudinary(thumbnail.url);
            await Video.findByIdAndDelete(video._id);
            console.log('video deleted from db & cloudinary');
            return res
                .status(ABORTED)
                .json({ message: 'VIDEO_UPLOAD_REQUEST_CANCELLED' });
        }

        return res.status(CREATED).json(video);
    } catch (err) {
        if (videoFile) await deleteFromCloudinary(videoFile.url);
        if (thumbnail) await deleteFromCloudinary(thumbnail.url);
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while publishing the video',
            err: err.message,
        });
    }
};

const updateVideo = async (req, res) => {
    let newThumbnail;
    try {
        const { description, title } = req.body;
        // isOwner middleware
        const oldVideo = req.video;

        if (!description || !title || !req.file) {
            return res.status(BAD_REQUEST).json({ message: 'MISSING_FIELDS' });
        }

        newThumbnail = await uploadOnCloudinary(req.file.path);

        // updating
        const video = await Video.findByIdAndUpdate(
            oldVideo._id,
            {
                $set: {
                    thumbnail: newThumbnail.url,
                    description,
                    title,
                },
            },
            { new: true }
        );

        // deleting old thumbnail
        await deleteFromCloudinary(oldVideo.thumbnail);

        return res.status(OK).json(video);
    } catch (err) {
        if (newThumbnail) await deleteFromCloudinary(newThumbnail.url);
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while updating the video',
            err: err.message,
        });
    }
};

const deleteVideo = async (req, res) => {
    try {
        // isOwner middleware
        const video = req.video;

        //deleting the files from cloudinary
        await deleteFromCloudinary(video.thumbnail);
        await deleteFromCloudinary(video.videoFile);

        // delete video, its comments and likes
        await Video.findByIdAndDelete(video._id);
        await Comment.deleteMany({
            video: new mongoose.Types.ObjectId(video._id),
        });
        await Like.deleteMany({
            video: new mongoose.Types.ObjectId(video._id),
        });

        return res.status(OK).json({ message: 'VIDEO_DELETED_SUCCESSFULLY' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while deleting the video',
            err: err.message,
        });
    }
};

const getVideoById = async (req, res) => {
    // will be used while playing the videos on clicking and showing the owner details under the videos
    //get the id from params and find the video
    //have access to req.user
    //increment the views of the video
    //push the video id to the user watch history  //sub-pipeline won't work (can't avoid the extra db call) becuase they cant presist the changes
    //populate the owner before returning the video using aggregation pipelines
    try {
        const { videoId } = req.params;
        if (!videoId || !isValidObjectId(videoId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'MISSING_OR_INVALID_VIDEOID' });
        }

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(NOT_FOUND).json({ message: 'VIDEO_NOT_FOUND' });
        }

        if (req.user) {
            // updating watchHistory
            const user = await User.findById(req.user?._id);
            await user.updateWatchHistory(videoId);

            // updating views
            await video.increment_Views(user._id);
        } else {
            await video.increment_Views(req.ip);
        }

        // aggregation pipeline
        const detailedVideo = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId), // becuase params se hmme string form mein milegi (no autoconversion since mongodb opr not mongoose)
                },
            },
            // owner{}
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner', //overwrite
                    pipeline: [
                        {
                            $lookup: {
                                from: 'subscriptions',
                                localField: '_id',
                                foreignField: 'channel',
                                as: 'subscribers',
                            },
                        },
                        {
                            $addFields: {
                                subscribersCount: { $size: '$subscribers' },
                                isSubscribed: req.user
                                    ? {
                                          $cond: {
                                              if: {
                                                  $in: [
                                                      req.user._id,
                                                      '$subscribers.subscriber',
                                                  ],
                                              },
                                              then: true,
                                              else: false,
                                          },
                                      }
                                    : false,
                            },
                        },
                        {
                            $project: {
                                fullname: 1,
                                username: 1,
                                avatar: 1,
                                isSubscribed: 1,
                                subscribersCount: 1,
                            },
                        },
                    ],
                },
            },
            // likes[]
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'video',
                    as: 'likes',
                    pipeline: [
                        {
                            $match: { liked: 'true' },
                        },
                    ],
                },
            },
            // dislikes[]
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'video',
                    as: 'dislikes',
                    pipeline: [
                        {
                            $match: { liked: 'false' },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    views: { $size: '$views' },
                    owner: { $first: '$owner' },
                    //overwrite
                    likes: { $size: '$likes' },
                    //overwrite
                    dislikes: { $size: '$dislikes' },
                    hasLiked: req.user
                        ? {
                              $cond: {
                                  if: { $in: [req.user._id, '$likes.likedBy'] },
                                  then: true,
                                  else: false,
                              },
                          }
                        : false,
                    hasDisliked: req.user
                        ? {
                              $cond: {
                                  if: {
                                      $in: [req.user._id, '$dislikes.likedBy'],
                                  },
                                  then: true,
                                  else: false,
                              },
                          }
                        : false,
                },
            },
        ]);

        return res.status(OK).json(detailedVideo[0]);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while fetching the video',
            err: err.message,
        });
    }
};

const getSearchData = async (req, res) => {
    // get videos based on matched title or fullname or username
    try {
        const { page = 1, limit = 10, query = '' } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const startIndex = (pageNumber - 1) * limitNumber;

        // pipeline
        const results = await Video.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                fullname: 1,
                                username: 1,
                                avatar: 1,
                            },
                        },
                    ],
                },
            },
            { $unwind: '$owner' },
            {
                $match: query
                    ? {
                          $or: [
                              { title: { $regex: query, $options: 'i' } },
                              {
                                  'owner.fullname': {
                                      $regex: query,
                                      $options: 'i',
                                  },
                              },
                          ],
                          isPublished: true,
                      }
                    : { isPublished: true },
            },
            {
                $addFields: {
                    views: { $size: '$views' },
                },
            },
            {
                $sort: { title: 1 },
            },
            { $skip: startIndex },
            { $limit: limitNumber },
        ]);

        //calculating total no. of results
        const totalResults = await Video.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                },
            },
            { $unwind: '$owner' },
            {
                $match: query
                    ? {
                          $or: [
                              { title: { $regex: query, $options: 'i' } },
                              {
                                  'owner.fullname': {
                                      $regex: query,
                                      $options: 'i',
                                  },
                              },
                          ],
                          isPublished: true,
                      }
                    : { isPublished: true },
            },
            { $count: 'totalResults' },
        ]);

        const totalMatches = totalResults[0]?.totalResults || 0;
        const totalPages = Math.ceil(totalMatches / limitNumber); // will round off to nearest integer
        const hasNextPage = pageNumber < totalPages;
        const hasPreviousPage = pageNumber > 1;

        const result = {
            info: {
                hasNextPage,
                hasPreviousPage,
                totalPages,
                totalMatches,
            },
            results,
        };

        return res.status(OK).json(result);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while fetching the video titles',
            err: err.message,
        });
    }
};

export {
    getRandomVideos,
    getVideos,
    togglePublish,
    publishVideo,
    updateVideo,
    deleteVideo,
    getVideoById,
    getSearchData,
};
