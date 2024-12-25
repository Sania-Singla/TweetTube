import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        commentBy: {
            // as soon as user make a new comment on a video we will set his id to its value and then use lookup to get full data
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        video: {
            // as soon as user make a new comment on a video we will set the video id to its value and then use lookup to get full data
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video',
        },
    },
    { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model('Comment', commentSchema);
