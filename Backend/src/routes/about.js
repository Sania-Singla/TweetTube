const { 
    get_About_Channel,

} = require("../controllers/aboutChannel_Controller");

const express = require("express");
const aboutRouter = express.Router();

aboutRouter.route("/:userId")
.get(get_About_Channel);

//⭐⭐⭐ will add links feature for contact information 

module.exports = aboutRouter;