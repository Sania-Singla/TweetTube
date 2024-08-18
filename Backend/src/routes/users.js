const { 
    register_User, 
    login_User, 
    logout_User, 
    refresh_Access_Token, 
    change_Current_Password, 
    get_Current_User, 
    update_Account_Details, 
    update_Channel_Info,
    update_Cover_Image, 
    update_Avatar, 
    get_Channel_Profile, 
    get_watch_history,
    clear_Watch_History,
} = require("../controllers/user_Controller");

const express = require("express");
const userRouter = express.Router();
const verifyJWT = require("../middleware/authorize");
const optionalVerifyJWT = require("../middleware/optionalAuthorize");
const upload = require("../middleware/multer");

userRouter.route("/register")
.post( upload.fields([
    {
        name: "avatar",       // these are field names , should be same in frontend
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount:1
    }
]), register_User );


userRouter.route("/login")
.post( login_User );


//secured routes
userRouter.route("/logout")
.post( verifyJWT, logout_User );


userRouter.route("/refresh-token")
.post( refresh_Access_Token );


userRouter.route("/change-password")
.patch( verifyJWT, change_Current_Password );


userRouter.route("/current-user")
.get( verifyJWT, get_Current_User );


userRouter.route("/update-account")              // can use put/post  too since we are not getting into too much of context here
.patch( verifyJWT, update_Account_Details );

userRouter.route("/update-channel-info") 
.patch( verifyJWT, update_Channel_Info );


userRouter.route("/cover-image")
.patch( verifyJWT, ( req,res,next ) => {
    try 
    {
        upload.single("coverImage") ( req, res, (err) => /*console.log('req.file:', req.file)*/ next() );
    } 
    catch (error) 
    {
        return res.status(500).json({ message:"Catch block error in multer middleware.", error });
    }
}, update_Cover_Image );


userRouter.route("/avatar")
.patch( verifyJWT, ( req,res,next ) => {
    try 
    {
        upload.single("avatar") ( req, res, (err) => /*console.log('req.file:', req.file)*/ next() );
    } 
    catch (error) 
    {
        return res.status(500).json({ message:"Catch block error in multer middleware.", error });
    }
},update_Avatar);


userRouter.route("/channel/:username")              // don't apply colon(:) in the url while testing 
.get( optionalVerifyJWT, get_Channel_Profile );


userRouter.route("/watch-History")
.get( verifyJWT, get_watch_history );

userRouter.route("/clear-History")
.delete( verifyJWT, clear_Watch_History );



module.exports = userRouter;