const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

//const allowedOrigins = process.env.ORIGIN.split(',');   //array

app.use( (req,res,next)=>{                                // copied from davegrey and it worked 😉 for third party cookies and all 
    const origin = req.headers.origin;
    if(process.env.ORIGIN.includes(origin))
    {
        res.setHeader("Access-Control-Allow-Credentials",true);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");    
    }
    next();
})

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || process.env.ORIGIN.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    // credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({ extended:false }));  
app.use(express.static("../public"));
app.use(cookieParser());


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