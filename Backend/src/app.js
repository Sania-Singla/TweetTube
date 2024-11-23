const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended:false }));  
app.use(express.static("../public"));
app.use(cookieParser());

// CORS configuration
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

//route importing
const userRouter = require("./routes/users");
const videoRouter = require("./routes/videos");
const likeRouter = require("./routes/likes");
const commentRouter = require("./routes/comments");
const tweetRouter = require("./routes/tweets");
const subscriptionRouter = require("./routes/subscriptions");
const playlistRouter = require("./routes/playlists");
const healthRouter = require("./routes/healthcheck");
const dashboardRouter = require("./routes/dashboard");
const aboutRouter = require("./routes/about");


app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos",videoRouter);
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/comments",commentRouter);
app.use("/api/v1/tweets",tweetRouter);
app.use("/api/v1/subscriptions",subscriptionRouter);
app.use("/api/v1/playlists",playlistRouter);
app.use("/api/v1/healthCheck",healthRouter);
app.use("/api/v1/dashboard",dashboardRouter);
app.use("/api/v1/about",aboutRouter);


module.exports = app;