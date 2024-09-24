const jwt = require("jsonwebtoken");
const User = require("../models/user");

//cookie options
const options = {
    httpOnly:true,
    sameSite:"None",
    secure:true ,
    path:"/",
}

const optionalVerifyJWT = async ( req,res,next ) => {
    const accessToken = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];     //sometimes it could be capital A 
    if(accessToken)     //so we have tokens so now if they are wrong then show unauth and something went wrong on frontend
    {
        try 
        {
            const decodedToken = jwt.verify( accessToken , process.env.ACCESS_TOKEN_SECRET ); 
            if(!decodedToken) 
            {
                return res
                .status(403)
                .clearCookie( "accessToken", options )
                .json({ message: "INVALID_ACCESS_TOKEN" });
            }

            //since token is valid but is this id user in oue db or not
            const user = await User.findById(decodedToken._id).select( "-password -refreshToken -watchHistory" );
            if(!user)  
            {
                return res
                .status(401)
                .clearCookie("accessToken", options)
                .json({ message: "ACCESS_TOKEN_USER_NOT_FOUND" }); 
            }
            req.user = user ;           // we set a custom property name user in the req object so now after the middleware we can directly get the user without password and refreshToken    
        } 
        catch (err) 
        {
            console.log({message:"something went wrong while authorizing ",err:err.message});
            return res
            .status(400)
            .clearCookie("accessToken", options)
            .json({message:"EXPIRED_ACCESS_TOKEN"});
        }
    }
    next();   
}

module.exports = optionalVerifyJWT;