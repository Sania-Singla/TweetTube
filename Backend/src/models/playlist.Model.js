import mongoose from 'mongoose';
const playlistSchema = new mongoose.Schema(
    {
        owner: {
            // createdBy
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        videos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Video',
            },
        ],
        description: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Playlist = mongoose.model('Playlist', playlistSchema);
