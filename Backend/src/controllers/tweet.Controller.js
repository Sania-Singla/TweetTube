import { Tweet, Like } from '../models/index.js';
import mongoose from 'mongoose';
import isValidObjectId from 'mongoose';
import {
    SERVER_ERROR,
    OK,
    BAD_REQUEST,
    CREATED,
} from '../constants/errorCodes.js';

const getTweets = async (req, res) => {
    //get userId from params
    //find tweet docs with this userid  // one can do multiple tweets
    //will have to populate the tweetBy field (user)
    //add like & dislike field
    //add pagination
    try {
        const { userId } = req.params;
        if (!userId || !isValidObjectId(userId)) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'INVALID_OR_MISSING_USERID' });
        }

        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const startIndex = (pageNumber - 1) * limitNumber;

        const pipeline = [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId),
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
            {
                //populating the user field
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
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'tweet',
                    as: 'likes',
                    pipeline: [
                        {
                            $match: {
                                liked: 'true',
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'tweet',
                    as: 'dislikes',
                    pipeline: [
                        {
                            $match: {
                                liked: 'false',
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    likes: { $size: '$likes' },
                    dislikes: { $size: '$dislikes' },
                },
            },
        ];
        const tweets = await Tweet.aggregate(pipeline);
        if (!tweets.length) {
            return res.status(OK).json({ message: 'NO_TWEETS_FOUND' });
        }

        const totalTweets = await Tweet.countDocuments({
            owner: new mongoose.Types.ObjectId(userId),
        });
        const totalPages = totalTweets / limitNumber;
        const hasPreviousPage = pageNumber > 1;
        const hasNextPage = pageNumber < totalPages;

        const response = {
            hasNextPage,
            hasPreviousPage,
            totalPages,
            totalTweets,
            tweets,
        };

        return res.status(OK).json(response);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while fetching the tweets',
            err: err.message,
        });
    }
};

const createTweet = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(BAD_REQUEST).json({ message: 'MISSING_FIELDS' });
        }

        const tweet = await Tweet.create({
            content,
            owner: req.user._id,
        });

        return res.status(CREATED).json(tweet);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while creating the tweet.',
            err: err.message,
        });
    }
};

const updateTweet = async (req, res) => {
    try {
        const { content } = req.body;
        // isOwner middleware
        const oldTweet = req.tweet;

        if (!content) {
            return res.status(BAD_REQUEST).json({ message: 'MISSING_FIELDS' });
        }

        const tweet = await Tweet.findByIdAndUpdate(
            oldTweet._id,
            {
                $set: {
                    content,
                },
            },
            { new: true }
        );
        return res.status(OK).json(tweet);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while updating the Tweet.',
            err: err.message,
        });
    }
};

const deleteTweet = async (req, res) => {
    try {
        // isOwner middleware
        const tweet = req.tweet;

        await Tweet.findByIdAndDelete(tweet._id);

        // delete its likes
        await Like.deleteMany({
            tweet: new mongoose.Types.ObjectId(tweet._id),
        });
        return res.status(OK).json({ message: 'TWEET_DELETED' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while deleting the Tweet.',
            err: err.message,
        });
    }
};

export { getTweets, createTweet, updateTweet, deleteTweet };
