const {
    add_Comment,
    update_Comment,
    delete_Comment,
    get_Video_Comments
} = require("../controllers/comment_Controller");

const verifyJWT = require("../middleware/authorize");
const optionalVerifyJWT = require("../middleware/optionalAuthorize");
const express = require("express");
const commentRouter = express.Router();


commentRouter.route("/:videoId")
.get(optionalVerifyJWT,get_Video_Comments)
.post(verifyJWT,add_Comment)

commentRouter.route("/:commentId")
.patch(verifyJWT,update_Comment)
.delete(verifyJWT,delete_Comment)


module.exports = commentRouter;
