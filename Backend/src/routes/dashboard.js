const express = require("express");
const dashboardRouter = express.Router();
const verifyJWT = require("../middleware/authorize");
const { 
    get_Channel_Stats,
    get_Channel_Videos
} = require("../controllers/dashboard_Controller");

dashboardRouter.use(verifyJWT);

dashboardRouter.route("/channelStats").get(get_Channel_Stats)

dashboardRouter.route("/channelVideos").get(get_Channel_Videos)


module.exports = dashboardRouter;