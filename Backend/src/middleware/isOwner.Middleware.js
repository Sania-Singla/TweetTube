import {
    BAD_REQUEST,
    SERVER_ERROR,
    NOT_FOUND,
} from '../constants/errorCodes.js';
import { Video, Tweet, Playlist } from '../models/index.js';
import { isValidObjectId } from 'mongoose';

/**
 * Generic middleware to check if the authenticated user is the owner of the resource.
 * @param {mongoose.Model} Model - The Mongoose model to query (e.g., Video, Tweet, Playlist).
 * @param {string} idParam - The name of the request parameter containing the resource ID.
 * @param {string} fieldToMatchWith - The field in the model to match with the authenticated user's ID.
 * @param {string} notFoundMessage - The message to return if the resource is not found.
 * @param {string} notOwnerMessage - The message to return if the user is not the owner of the resource.
 * @param {string} requestKey - The key to attach the resource to on the request object.
 * @returns {Function} Express middleware function specific for that model.
 */

const isOwner = (
    Model,
    idParam,
    fieldToMatchWith,
    notFoundMessage,
    notOwnerMessage,
    requestKey
) => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[idParam];

            if (!resourceId || !isValidObjectId(resourceId)) {
                return res.status(BAD_REQUEST).json({
                    message: `MISSING_OR_INVALID_${idParam.toUpperCase()}`,
                });
            }

            const resource = await Model.findById(resourceId);
            if (!resource) {
                return res.status(NOT_FOUND).json({ message: notFoundMessage });
            }

            if (!resource[fieldToMatchWith].equals(req.user._id)) {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: notOwnerMessage });
            }

            // Attach the resource to the request object
            req[requestKey] = resource;
            next();
        } catch (err) {
            return res.status(SERVER_ERROR).json({
                message: `Something went wrong while checking ownership for ${idParam}`,
                err: err.message,
            });
        }
    };
};

const isVideoOwner = isOwner(
    Video,
    'videoId',
    'owner',
    'VIDEO_NOT_FOUND',
    'NOT_THE_OWNER',
    'video'
);

const isTweetOwner = isOwner(
    Tweet,
    'tweetId',
    'tweetBy',
    'TWEET_NOT_FOUND',
    'NOT_THE_OWNER',
    'tweet'
);

const isPlaylistOwner = isOwner(
    Playlist,
    'playlistId',
    'createdBy',
    'PLAYLIST_NOT_FOUND',
    'NOT_THE_OWNER',
    'playlist'
);

export { isOwner, isVideoOwner, isTweetOwner, isPlaylistOwner };
