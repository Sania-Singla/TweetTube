import mongoose, { isValidObjectId } from 'mongoose';
import { Like } from '../models/index.js';
import {
    SERVER_ERROR,
    OK,
    BAD_REQUEST,
    CREATED,
} from '../constants/errorCodes.js';

const toggleVideoLike = async (req, res) => {
    // from frontend we will send a query parameter as toggleStatus=true/false to specify like/dislike  //
    // find the like doc with req.user._id if exist then check if status matches (delete) , unmatches (update)
    // if not found that means will have to create a doc with provided toggleStatus
    // remember removing the like doesn't mean disliked
    try {
        const { videoId } = req.params;
        const { toggleStatus } = req.query; // string

        if (!videoId || !isValidObjectId(videoId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'MISSING_OR_INVALID_VIDEOID' });
        }

        const existingLikeDoc = await Like.findOne({
            video: new mongoose.Types.ObjectId(videoId),
            likedBy: new mongoose.Types.ObjectId(req.user._id),
        });
        if (!existingLikeDoc) {
            await Like.create({
                video: videoId,
                likedBy: req.user._id,
                liked: toggleStatus,
            });

            if (toggleStatus === 'true') {
                return res.status(CREATED).json({ message: 'VIDEO_LIKED' });
            } else {
                return res.status(CREATED).json({ message: 'VIDEO_DISLIKED' });
            }
        } else {
            if (existingLikeDoc.liked === toggleStatus) {
                await Like.findByIdAndDelete(existingLikeDoc._id);

                if (toggleStatus === 'true') {
                    return res.status(OK).json({ message: 'LIKE_REMOVED' });
                } else {
                    return res.status(OK).json({ message: 'DISLIKE_REMOVED' });
                }
            } else {
                existingLikeDoc.liked = toggleStatus;
                await existingLikeDoc.save();
                if (toggleStatus === 'true') {
                    return res
                        .status(OK)
                        .json({ message: 'LIKE_REMOVED_AND_DISLIKED' });
                } else {
                    return res
                        .status(OK)
                        .json({ message: 'DISLIKE_REMOVED_AND_LIKED' });
                }
            }
        }
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while toggling the video like',
            err: err.message,
        });
    }
};

const toggleCommentLike = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { toggleStatus } = req.query; // string

        if (!commentId || !isValidObjectId(commentId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'MISSING_OR_INVALID_COMMENTID' });
        }

        const existingLikeDoc = await Like.findOne({
            comment: new mongoose.Types.ObjectId(commentId),
            likedBy: new mongoose.Types.ObjectId(req.user._id),
        });

        if (!existingLikeDoc) {
            await Like.create({
                comment: commentId,
                likedBy: req.user._id,
                liked: toggleStatus,
            });

            if (toggleStatus === 'true') {
                return res.status(CREATED).json({ message: 'COMMENT_LIKED' });
            } else {
                return res
                    .status(CREATED)
                    .json({ message: 'COMMENT_DISLIKED' });
            }
        } else {
            if (existingLikeDoc.liked === toggleStatus) {
                await Like.findByIdAndDelete(existingLikeDoc._id);

                if (toggleStatus === 'true') {
                    return res.status(OK).json({ message: 'LIKE_REMOVED' });
                } else {
                    return res.status(OK).json({ message: 'DISLIKE_REMOVED' });
                }
            } else {
                existingLikeDoc.liked = toggleStatus;
                await existingLikeDoc.save();
                if (toggleStatus === 'true') {
                    return res
                        .status(OK)
                        .json({ message: 'LIKE_REMOVED_AND_DISLIKED' });
                } else {
                    return res
                        .status(OK)
                        .json({ message: 'DISLIKE_REMOVED_AND_LIKED' });
                }
            }
        }
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while toggling the comment like',
            err: err.message,
        });
    }
};

const toggleTweetLike = async (req, res) => {
    try {
        const { tweetId } = req.params;
        const { toggleStatus } = req.query; // string

        if (!tweetId || !isValidObjectId(tweetId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'MISSING_OR_INVALID_TWEETID' });
        }

        const existingLikeDoc = await Like.findOne({
            tweet: new mongoose.Types.ObjectId(tweetId),
            likedBy: new mongoose.Types.ObjectId(req.user._id),
        });

        if (!existingLikeDoc) {
            await Like.create({
                tweet: tweetId,
                likedBy: req.user._id,
                liked: toggleStatus,
            });

            if (toggleStatus === 'true') {
                return res.status(CREATED).json({ message: 'TWEET_LIKED' });
            } else {
                return res.status(CREATED).json({ message: 'TWEET_DISLIKED' });
            }
        } else {
            if (existingLikeDoc.liked === toggleStatus) {
                await Like.findByIdAndDelete(existingLikeDoc._id);

                if (toggleStatus === 'true') {
                    return res.status(OK).json({ message: 'LIKE_REMOVED' });
                } else {
                    return res.status(OK).json({ message: 'DISLIKE_REMOVED' });
                }
            } else {
                existingLikeDoc.liked = toggleStatus;
                await existingLikeDoc.save();
                if (toggleStatus === 'true') {
                    return res
                        .status(OK)
                        .json({ message: 'LIKE_REMOVED_AND_DISLIKED' });
                } else {
                    return res
                        .status(OK)
                        .json({ message: 'DISLIKE_REMOVED_AND_LIKED' });
                }
            }
        }
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while toggling the tweet like',
            err,
        });
    }
};

const getLikedVideos = async (req, res) => {
    //just find the like docs with the userId and liked to be true
    const { page = 1, limit = 10, term = '' } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;

    try {
        //step:1 count total liked videos in the db
        const userLikedVideoCount = await Like.countDocuments({
            likedBy: new mongoose.Types.ObjectId(req.user._id),
            liked: 'true',
        });

        // Step:1 Count total videos in the watch history based on search term
        const querySpecificTotalVideosCountPipeline = [
            {
                $match: {
                    likedBy: new mongoose.Types.ObjectId(req.user._id),
                    liked: 'true',
                },
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'video',
                    foreignField: '_id',
                    as: 'video',
                    pipeline: term
                        ? [
                              {
                                  $match: {
                                      $or: [
                                          {
                                              title: {
                                                  $regex: term,
                                                  $options: 'i',
                                              },
                                          },
                                          {
                                              description: {
                                                  $regex: term,
                                                  $options: 'i',
                                              },
                                          },
                                      ],
                                  },
                              },
                          ]
                        : [],
                },
            },
            { $unwind: '$video' },
            { $count: 'totalVideos' },
        ];

        const searchSpecificLikedVideoCount = await Like.aggregate(
            querySpecificTotalVideosCountPipeline
        );

        const totalVideos = searchSpecificLikedVideoCount[0]?.totalVideos || 0;
        const totalPages = Math.ceil(totalVideos / limitNumber); // will round off to nearest integer
        const hasNextPage = pageNumber < totalPages;
        const hasPreviousPage = pageNumber > 1;

        const likedVideos = await Like.aggregate([
            {
                $match: {
                    likedBy: new mongoose.Types.ObjectId(req.user._id),
                    liked: 'true',
                },
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'video',
                    foreignField: '_id',
                    as: 'video',
                    pipeline: [
                        {
                            $match: term
                                ? {
                                      $or: [
                                          {
                                              title: {
                                                  $regex: term,
                                                  $options: 'i',
                                              },
                                          },
                                          {
                                              description: {
                                                  $regex: term,
                                                  $options: 'i',
                                              },
                                          },
                                      ],
                                  }
                                : {},
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
                                            fullname: 1,
                                            username: 1,
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
                    ],
                },
            },
            // { ⭐this is also sending the like docs as empty objects because there video not match query term but we don't want those docs at all so used unwind that will remove the empty objects
            //     $addFields:
            //     {
            //         video: {$first:"$video"}
            //     }
            // },
            { $unwind: '$video' },
            {
                $project: {
                    video: 1,
                },
            },
            {
                $sort: {
                    updatedAt: -1, // Sort before skip and limit
                },
            },
            { $skip: startIndex },
            { $limit: limitNumber },
        ]);

        const result = {
            info: {
                overAllLikedVideosCount: userLikedVideoCount,
                totalVideos,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            },
            likedVideos,
        };

        if (!likedVideos.length)
            return res.status(OK).json({ message: 'NO_LIKED_VIDEOS' });
        return res.status(OK).json(result);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while fetching the liked videos',
            err: err.message,
        });
    }
};

const removeFromLikedVideos = async (req, res) => {
    //toggle the like for this video
    //have access to req.user
    try {
        const { videoId } = req.params;
        await Like.findOneAndDelete({
            video: new mongoose.Types.ObjectId(videoId),
            likedBy: new mongoose.Types.ObjectId(req.user._id),
            liked: 'true',
        });

        return res
            .status(OK)
            .json({ message: 'VIDEO_REMOVED_FROM_LIKED_SUCCESSFULLY' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while fetching the liked videos',
            err: err.message,
        });
    }
};

const getDislikedVideos = async (req, res) => {
    //have access to req.user
    //just find the like docs with the user id and liked to be false
    try {
        const dislikedVideos = await Like.aggregate([
            {
                $match: {
                    likedBy: new mongoose.Types.ObjectId(req.user._id),
                    liked: 'false',
                },
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'video',
                    foreignField: '_id',
                    as: 'video',
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
                                            fullname: 1,
                                            username: 1,
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
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    video: {
                        $first: '$video',
                    },
                },
            },
            {
                $project: {
                    video: 1,
                },
            },
        ]);

        if (!dislikedVideos.length) {
            return res.status(OK).json({ message: 'NO_DISLIKED_VIDEOS' });
        }

        return res.status(OK).json(dislikedVideos);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while fetching the liked videos',
            err,
        });
    }
};

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
    removeFromLikedVideos,
    getDislikedVideos,
};
