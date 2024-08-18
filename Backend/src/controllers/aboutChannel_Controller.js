const Video = require("../models/video");
const mongoose = require("mongoose");
const User = require("../models/user");

const get_About_Channel = async (req,res) => {
    //get the userId by req.params
    //get total videos, subscribers, views(unique), tweets 
    try 
    {
        const {userId} = req.params;
        const videos = await Video.aggregate([
            {
                $match: {owner: new mongoose.Types.ObjectId(userId)}
            },
            {
                $unwind:"$views"
            },
            {
                $group:
                {
                    _id:null,
                    views:{ $addToSet:"$views"}
                }
            }
        ])

        const user = await User.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:
                {
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"channel",
                    as:"subscribers"            
                }
            },
            {
                $lookup:
                {
                    from:"videos",
                    localField:"_id",
                    foreignField:"owner",
                    as:"videos"
                }
            },
            {
                $lookup:
                {
                    from:"tweets",
                    localField:"_id",
                    foreignField:"tweetBy",
                    as:"tweets"
                }
            },
            {
                $addFields:
                {
                    totalSubscribers:{ $size:"$subscribers" },
                    totalVideos:{$size:"$videos"},
                    totalTweets:{$size:"$tweets"}
                }
            },
            {
                $project:
                {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                    email:1,
                    coverImage: 1,
                    description:1,
                    totalSubscribers: 1,
                    totalVideos:1,
                    totalTweets:1,
                    createdAt:1,   
                }
            }
        ])

        if(!user) return res.status(400).json({message:"CHANNEL_NOT_FOUND"});

        const result = {
            ...user[0],
            totalViews: videos[0]?.views.length || 0,
        }
        return res.status(200).json(result);
    } 
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while fetching the channel about.",err:err.message})    
    }
}

//will add links opr soon⭐⭐

module.exports = {
    get_About_Channel,
}