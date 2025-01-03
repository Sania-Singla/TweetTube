import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
export const app = express();

// Configurations

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('../public'));
app.use(cookieParser());
const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(',') : [];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || whitelist.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
        optionsSuccessStatus: 200,
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Routes

import {
    userRouter,
    videoRouter,
    likeRouter,
    commentRouter,
    tweetRouter,
    subscriptionRouter,
    playlistRouter,
    healthRouter,
    dashboardRouter,
    aboutRouter,
} from './routes/index.js';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/tweets', tweetRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/healthCheck', healthRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/about', aboutRouter);

// production mode
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../Frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, '..', 'Frontend', 'dist', 'index.html')
        );
    });
}
