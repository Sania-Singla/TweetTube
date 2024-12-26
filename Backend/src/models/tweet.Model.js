import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        owner: {
            // as soon as user make a new comment on a video we will set his id to its value and then use lookup to get full data
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

export const Tweet = mongoose.model('Tweet', tweetSchema);
