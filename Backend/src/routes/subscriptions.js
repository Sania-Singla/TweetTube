const {
    toggle_Subscribe,
    get_Channel_Subscribers,
    get_Subscribed_Channels
} = require("../controllers/subscription_Controller");

const verifyJWT = require("../middleware/authorize");
const express = require("express");
const subscriptionRouter = express.Router();


subscriptionRouter.route("/toggle/:channelId")
.get(verifyJWT,toggle_Subscribe);

subscriptionRouter.route("/subscribers/:channelId")
.get(verifyJWT,get_Channel_Subscribers);

subscriptionRouter.route("/subscribedTo/:userId")
.get(get_Subscribed_Channels);


module.exports = subscriptionRouter;