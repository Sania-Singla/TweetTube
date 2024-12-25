import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true,
        },
        duration: {
            //from cloudinary
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
            index: true,
        },
        owner: {
            // as soon as user publish a video we will set his id to its value and then use lookup to get full data
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        videoFile: {
            type: String, //cloudinary url
            required: true,
        },
        views: [
            {
                //since it is not an id so we cant pupulate it
                type: String,
            },
        ],
        isPublished: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true }
);

// Create a text index on the title field
videoSchema.index({ title: 'text' }); //so that for searching purposes it is quick

videoSchema.methods.increment_Views = async function (userOrIp) {
    let viewerIdentifier;
    if (typeof userOrIp === 'string') {
        // It's an IP address (string)
        viewerIdentifier = `ip:${userOrIp}`;
    } else {
        // It's a user ID (object)
        viewerIdentifier = `user:${userOrIp.toString()}`;
    }
    if (this.views.includes(viewerIdentifier)) return 'true';
    this.views.push(viewerIdentifier);
    return this.save({ validateBeforeSave: false });
};

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);
