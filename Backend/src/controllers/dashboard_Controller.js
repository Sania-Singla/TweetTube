const Video = require("../models/video");
const Subscription = require("../models/subscription");
const mongoose = require("mongoose");


const get_Channel_Stats = async (req,res) => {
    //have access to req.user
    //get total videos, subscribers & views(unique)
    try 
    {
        const videos = await Video.aggregate([
            {
                $match:
                {
                    owner: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $unwind:"$views"
            },
            {
                $group:
                {
                    _id:null,
                    views:{ $addToSet:"$views"},
                }
            }
        ])

        const likes = await Video.aggregate([
            {
                $match:
                {
                    owner: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {     //getting likes
                $lookup:
                {
                    from:"likes",
                    localField:"_id",
                    foreignField:"video",
                    as:"likes",
                    pipeline:
                    [
                        {
                            $match:
                            {
                                liked:"true"
                            }
                        }
                    ]
                }
            },{
                $addFields:{
                    likes:{$size:"$likes"}
                }
            }
        ])
        
        let totalLikes = 0;
        likes.forEach(likeDoc => {
            totalLikes += likeDoc.likes;
        });

        const subscribers = await Subscription.countDocuments({channel: new mongoose.Types.ObjectId(req.user._id)})

        const response = {
            channelUsername:req.user.username,
            channelName:req.user.fullname,
            totalViews: videos[0].views.length,
            totalLikes,
            totalVideos:videos.length,
            totalSubscribers: subscribers,  
        }
        return res.status(200).json(response);
    } 
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while fetching the channel stats.",err:err.message})    
    }
}


const get_Channel_Videos = async (req,res) => {
    //have access to req.user
    //get total videos & views/likes/dislikes/comments on each video
     
    //getting my videos and counting the likes/dislikes on each (views toh already doc mein hain hii)
    try {
        const {limit,page} = req.query;
        const limitNumber = parseInt(limit);
        const pageNumber = parseInt(page);
        const startIndex = (pageNumber-1)*limitNumber;
        const videos = await Video.aggregate([
            {
                $match:
                {
                    owner: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {     //getting likes
                $lookup:
                {
                    from:"likes",
                    localField:"_id",
                    foreignField:"video",
                    as:"likes",
                    pipeline:
                    [
                        {
                            $match:
                            {
                                liked:"true"
                            }
                        }
                    ]
                }
            },
            {     //getting dislikes
                $lookup:
                {
                    from:"likes",
                    localField:"_id",
                    foreignField:"video",
                    as:"dislikes",
                    pipeline:
                    [
                        {
                            $match:
                            {
                                liked:"false"
                            }
                        }
                    ]
                }
            },
            {   //getting comments
                $lookup:
                {
                    from:"comments",
                    localField:"_id",
                    foreignField:"video",
                    as:"comments"
                }
            },
            {
                $addFields:
                {
                    likes:
                    {
                        $size:"$likes"
                    },
                    dislikes:
                    {
                        $size:"$dislikes"
                    },
                    comments:
                    {
                        $size:"$comments"
                    },
                    views:
                    {
                        $size:"$views"
                    }
                }
            },
            {
                $sort:{
                    createdAt:-1
                }
            },
            {
                $skip:startIndex
            },
            {
                $limit:limitNumber
            },
            {
                $project:
                {
                    views:1,
                    likes:1,
                    dislikes:1,
                    comments:1,
                    thumbnail:1,
                    createdAt:1,
                    updatedAt:1,
                    title:1,
                    description:1,
                    isPublished:1,
                }
            }
        ])

        const totalVideos = await Video.countDocuments({owner:new mongoose.Types.ObjectId(req.user._id)});
        const totalPages = Math.ceil(totalVideos/limitNumber);      // will round off to nearest integer
        const hasNextPage = pageNumber < totalPages;  
        const hasPreviousPage = pageNumber > 1;
    
        const result ={
            info:{
                hasNextPage,
                hasPreviousPage,
                totalVideos,
                totalPages,
            },
            videos,
        }
        return res.json(result);

    } catch (err) {
        return res.status(500).json({message:"something went wrong while fetching channel videos for admin page",err:err.message})
    }
}


module.exports = {
    get_Channel_Stats,
    get_Channel_Videos
}