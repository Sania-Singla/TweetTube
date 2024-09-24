const {   
    get_Random_Videos,
    get_All_Videos,
    toggle_Publish,
    publish_a_Video,
    update_a_Video,
    delete_a_Video,
    get_Video_By_Id,
    get_Search_Data,
} = require("../controllers/video_controller");

const express = require("express");
const videoRouter = express.Router();
const upload = require("../middleware/multer");
const verifyJWT = require("../middleware/authorize");
const optionalVerifyJWT = require("../middleware/optionalAuthorize");
const { checkAborted } = require("../middleware/abortRequest");

videoRouter.route("/random-videos")
.get(get_Random_Videos)

videoRouter.route("/search-data")
.get(get_Search_Data)

videoRouter.route("/toggle-publish/:videoId/:Status")
.get(verifyJWT,toggle_Publish)


videoRouter.route("/:videoid")
.get(optionalVerifyJWT,get_Video_By_Id)
.delete( verifyJWT, delete_a_Video )
.patch(verifyJWT, ( req,res,next ) => {
    try 
    {
        upload.single("thumbnail") ( req, res, (err) =>  next() )
    } 
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while updating the thumbnail."});
    }
}, update_a_Video )

videoRouter.route("/")
.get(get_All_Videos)
.post(verifyJWT, upload.fields([
    {
        name:"videoFile",
        maxCount:1
    },
    {
        name:"thumbnail",
        maxCount:1
    }
]),checkAborted, publish_a_Video )


module.exports = videoRouter;