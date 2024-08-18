const mongoose = require("mongoose");
const Like = require("../models/like");
const {isValidObjectId} = require("mongoose")

const toggle_Video_Like = async (req,res) => {
    //will have access to req.user
    //get video id by params 
    /*****from frontend we will send a query parameter as toggleStatus=true/false to specify like button clicked or dislike button clicked *****/   
    //whether clicked on like or dislike => find the like doc with req.user._id if exist then check its liked status (true/false) 
    //if not found that means will have to create a doc and depending on like clicked (set to true) , dislike clicked (set to false)
    //if found then delete the document then =>a) if oppostie clicked alter the liked status.
    //                                         b) if same clicked then delete the doc.
    // remember one thing remove the like doesn't mean disliked
    try 
    {
        const { videoId } = req.params;
        if(!isValidObjectId(videoId)) return res.status(400).json({message:"INVALID_VIDEO_ID"});

        const { toggleStatus } = req.query;    //toggleStatus will be a string

        const existingLikeDoc = await Like.findOne({
            video: new mongoose.Types.ObjectId(videoId),
            likedBy: new mongoose.Types.ObjectId(req.user._id)
        })
        if(!existingLikeDoc)  //new interaction 
        {
            const likeDoc = await Like.create({
                video: videoId,
                likedBy: req.user._id,
                liked: toggleStatus,       
                // no need to set the comment and tweet to anything they simple wont we present there in the created doc ok 
            })
            if(!likeDoc) return res.status(500).json({ message:"DOC_CREATION_DB_ISSUE" })
            if(toggleStatus==="true") return res.status(201).json({message:"VIDEO_LIKED"})
            if(toggleStatus==="false") return res.status(201).json({message:"VIDEO_DISLIKED"})
        }
        //so we have found an existing doc. now the liked status in it could be true or false so we need to toggle it or may be delete the doc, lets see
        if(existingLikeDoc.liked === "true")
        {
            if (toggleStatus === "true")
            {
                //so this means the video was liked before and now we removed the like (doesn't mean disliked) so delete the doc
                const deletedDoc = await Like.findByIdAndDelete(existingLikeDoc._id);
                if(!deletedDoc) return res.status(500).json({ message:"DOC_DELETION_DB_ISSUE" })
                return res.status(200).json({ message:"LIKE_REMOVED" })
            }
            else  
            {
                //so this means the video was liked before and now we disliked it so toggle the liked status
                existingLikeDoc.liked = "false";
                await existingLikeDoc.save(); // remember it will not return anything 
                return res.status(200).json({ message: "LIKE_REMOVED_AND_DISLIKED" })
                //alternative but by above method we save a db call
                // const newLikeDoc = await Like.findByIdAndUpdate(
                //     existingLikeDoc._id,
                //     {
                //         $set:{
                //             liked:false
                //         }
                //     },
                //     { new:true}
                // )
                // if(!newLikeDoc) return res.status(500).json({message:"something wrong happend while updating the doc."})
                //return res.status(200).json({ newLikeDoc, message:"removed the like & disliked the video successfully." })
            }
        }
        else if(existingLikeDoc.liked === "false")
        {
            if (toggleStatus === "false")
            {
                //so this means the video was disliked before and now we removed the dislike (doesn't mean liked) so delete the doc
                const deletedDoc = await Like.findByIdAndDelete(existingLikeDoc._id);
                if(!deletedDoc) return res.status(500).json({ message:"DOC_DELETION_DB_ISSUE" })
                return res.status(200).json({ message:"DISLIKE_REMOVED" })
            }
            else  
            {
                //so this means the video was disliked before and now we liked it so toggle the liked status
                existingLikeDoc.liked = "true";
                await existingLikeDoc.save(); // remember it will not return anything 
                return res.status(200).json({ message: "DISLIKE_REMOVED_AND_LIKED" })
                //alternative but by above method we save a db call
                // const newLikeDoc = await Like.findByIdAndUpdate(
                //     existingLikeDoc._id,
                //     {
                //         $set:{
                //             liked:true
                //         }
                //     },
                //     { new:true}
                // )
                // if(!newLikeDoc) return res.status(500).json({message:"something wrong happend while updating the doc."})
                // return res.status(200).json({ newLikeDoc, message:"removed the dislike & liked the video successfully." })
            }
        }
    } 
    catch (err) 
    {
        return res.status(500).json({ message:"something bad happened while toggling the video like", err:err.message })    
    }
}

const toggle_Comment_Like = async (req,res) => {
    //will have access to req.user
    //get comment id by params 
    /*****from frontend we will send a query parameter as toggleStatus=true/false to specify like button clicked or dislike button clicked *****/   
    //whether clicked on like or dislike => find the like doc with req.user._id if exist then check its liked status (true/false) 
    //if not found that means will have to create a doc and depending on like clicked (set to true) , dislike clicked (set to false)
    //if found then delete the document then =>a) if oppostie clicked alter the liked status.
    //                                         b) if same clicked then delete the doc.
    // remember one thing remove the like doesn't mean disliked
    try 
    {
        const { commentId } = req.params;
        if(!isValidObjectId(commentId)) return res.status(400).json({message:"INVALID_COMMENTID"})
        const { toggleStatus } = req.query;
        const existingLikeDoc = await Like.findOne({
            comment: new mongoose.Types.ObjectId(commentId),
            likedBy: new mongoose.Types.ObjectId(req.user._id)
        })
        if(!existingLikeDoc)  //new interaction 
        {
            const like = await Like.create({
                comment: commentId,
                likedBy: req.user._id,
                liked: toggleStatus,      
                // no need to set the video and tweet to anything they simple wont we present there in the created doc ok 
            })
            if(!like) return res.status(500).json({ message:"DOC_CREATION_DB_ISSUE" })
            if(toggleStatus==="true") return res.status(201).json({message:"COMMENT_LIKED"})
            if(toggleStatus==="false") return res.status(201).json({message:"COMMENT_DISLIKED"})
        }
        //so we have found an existing doc. now the liked status in it could be true or false so we need to toggle it or may be delete the doc, lets see
        if(existingLikeDoc.liked === "true")
        {
            if (toggleStatus === "true")
            {
                //so this means the comment was liked before and now we removed the like (doesn't mean disliked) so delete the doc
                const deletedDoc = await Like.findByIdAndDelete(existingLikeDoc._id);
                if(!deletedDoc) return res.status(500).json({ message:"DOC_DELETION_DB_ISSUE" })
                return res.status(200).json({ message:"LIKE_REMOVED" })
            }
            else  
            {
                //so this means the comment was liked before and now we disliked it so toggle the liked status
                existingLikeDoc.liked = "false";
                await existingLikeDoc.save(); // remember it will not return anything 
                return res.status(200).json({ message: "LIKE_REMVOED_AND_DISLIKED" })
            }
        }
        else if(existingLikeDoc.liked === "false")
        {
            if (toggleStatus === "false")
            {
                //so this means the comment was disliked before and now we removed the dislike (doesn't mean liked) so delete the doc
                const deletedDoc = await Like.findByIdAndDelete(existingLikeDoc._id);
                if(!deletedDoc) return res.status(500).json({ message:"DOC_DELETION_DB_ISSUE" })
                return res.status(200).json({ message:"DISLIKE_REMOVED" })
            }
            else  
            {
                //so this means the comment was disliked before and now we liked it so toggle the liked status
                existingLikeDoc.liked = "true";
                await existingLikeDoc.save(); // remember it will not return anything 
                return res.status(200).json({ message: "DISLIKE_REMVOED_AND_LIKED" })
            }
        }
    } 
    catch (err) 
    {
        return res.status(500).json({ message:"something bad happened while toggling the comment like", err:err.message })    
    }
}

const toggle_Tweet_Like = async (req,res) => {
    //will have access to req.user
    //get tweet id by params 
    /*****from frontend we will send a query parameter as toggleStatus=true/false to specify like button clicked or dislike button clicked *****/   
    //whether clicked on like or dislike => find the like doc with req.user._id if exist then check its liked status (true/false) 
    //if not found that means will have to create a doc and depending on like clicked (set to true) , dislike clicked (set to false)
    //if found then delete the document then =>a) if oppostie clicked alter the liked status.
    //                                         b) if same clicked then delete the doc.
    // remember one thing remove the like doesn't mean disliked
    try 
    {
        const { tweetId } = req.params;
        if(!isValidObjectId(tweetId)) return res.status(400).json({message:"invalid tweet id"})
        const { toggleStatus } = req.query;
        const existingLikeDoc = await Like.findOne({
            tweet: new mongoose.Types.ObjectId(tweetId),
            likedBy: new mongoose.Types.ObjectId(req.user._id)
        })
        if(!existingLikeDoc)  //new interaction 
        {
            const like = await Like.create({
                tweet: tweetId,
                likedBy: req.user._id,
                liked: toggleStatus,      
                // no need to set the comment and video to anything they simple wont we present there in the created doc ok 
            })
            if(!like) return res.status(500).json({ message:"something wrong happened while creating the new doc." })
            return res.status(201).json({createdDoc: like, message:"tweet liked or disliked successfully (new doc created)"})
        }
        //so we have found an existing doc. now the liked status in it could be true or false so we need to toggle it or may be delete the doc, lets see
        if(existingLikeDoc.liked === "true")
        {
            if (toggleStatus === "true")
            {
                //so this means the tweet was liked before and now we removed the like (doesn't mean disliked) so delete the doc
                const deletedDoc = await Like.findByIdAndDelete(existingLikeDoc._id);
                if(!deletedDoc) return res.status(500).json({ message:"something wrong happened while deleting the doc." })
                return res.status(200).json({ deletedDoc, message:"like removed (document deleted)" })
            }
            else  
            {
                //so this means the tweet was liked before and now we disliked it so toggle the liked status
                existingLikeDoc.liked = "false";
                await existingLikeDoc.save(); // remember it will not return anything 
                return res.status(200).json({ newLikeDoc: existingLikeDoc, message: "removed the like & disliked the tweet successfully." })
            }
        }
        else if(existingLikeDoc.liked === "false")
        {
            if (toggleStatus === "false")
            {
                //so this means the tweet was disliked before and now we removed the dislike (doesn't mean liked) so delete the doc
                const deletedDoc = await Like.findByIdAndDelete(existingLikeDoc._id);
                if(!deletedDoc) return res.status(500).json({ message:"something wrong happened while deleting the doc." })
                return res.status(200).json({ deletedDoc, message:"dislike removed (document deleted)" })
            }
            else  
            {
                //so this means the tweet was disliked before and now we liked it so toggle the liked status
                existingLikeDoc.liked = "true";
                await existingLikeDoc.save(); // remember it will not return anything 
                return res.status(200).json({ newLikeDoc: existingLikeDoc, message: "removed the dislike & liked the tweet successfully." })
            }
        }
    } 
    catch (err) 
    {
        return res.status(500).json({ message:"something bad happened while toggling the tweet like", err })    
    }
}

const get_Liked_Videos = async (req,res) => {
    //have access to req.user 
    //just find the like docs with the user id and liked to be true
    const {page=1, limit=10, term=""} = req.query;             
    
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const startIndex = (pageNumber-1)*limitNumber;
    const endIndex = pageNumber*limitNumber;
    
    try
    {

        //step:1 count total liked videos in the db 
        const userLikedVideoCount = await Like.countDocuments({
            likedBy: new mongoose.Types.ObjectId(req.user._id),
            liked: "true"
        })

        // Step:1 Count total videos in the watch history based on search term
        const querySpecificTotalVideosCountPipeline = [
            {
                $match: { 
                    likedBy: new mongoose.Types.ObjectId(req.user._id) ,
                    liked: "true"
                }
            },
            {
                $lookup: {
                    from:"videos",
                    localField:"video",
                    foreignField:"_id",
                    as:"video",
                    pipeline:(term ? [
                                {
                                    $match: {
                                        $or: [
                                            { title: { $regex: term, $options: "i" } },
                                            { description: { $regex: term, $options: "i" } }
                                        ]
                                    }
                                }
                            ] : []),
                }
            },
            { $unwind: "$video" },
            { $count: "totalVideos" }
        ];

        const searchSpecificLikedVideoCount = await Like.aggregate(querySpecificTotalVideosCountPipeline);

        const totalVideos = searchSpecificLikedVideoCount[0]?.totalVideos || 0;
        const totalPages = Math.ceil(totalVideos/limitNumber);      // will round off to nearest integer
        const hasNextPage = pageNumber < totalPages;  
        const hasPreviousPage = pageNumber > 1;

        const likedVideos = await Like.aggregate([
            {
                $match:
                {
                    likedBy: new mongoose.Types.ObjectId(req.user._id),
                    liked: "true"
                }
            },
            {
                $lookup:
                {
                    from:"videos",
                    localField:"video",
                    foreignField:"_id",
                    as:"video",
                    pipeline:
                    [   
                        {
                            $match: term ? {
                                $or: [
                                    { title: { $regex: term, $options: "i" } },
                                    { description: { $regex: term, $options: "i" } }
                                ]
                            } : {}
                        },                 
                        {
                            $lookup:
                            {   
                                from:"users",
                                localField:"owner",
                                foreignField:"_id", 
                                as:"owner",
                                pipeline:
                                [        
                                    {
                                        $project:
                                        {
                                            fullname: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]             
                            }
                        },
                        {
                            $addFields:
                            {
                                owner:
                                {      
                                    $first: "$owner"                  
                                },
                                views:{$size:"$views"}
                            }
                        },
                    ]
                }
            },
            // {                            ⭐this is also sending the like docs as empty objects because there video not match query term but we don't want those docs at all so used unwind that will remove the empty objects
            //     $addFields:
            //     {
            //         video: {$first:"$video"}
            //     }
            // },
            { $unwind: "$video" },
            {
                $project: {
                    video:1
                }
            },
            {
                $sort: {
                    updatedAt: -1 // Sort before skip and limit
                }
            },
            { $skip: startIndex },
            { $limit: limitNumber },
        ])

        const result = {
            info:{
                overAllLikedVideosCount:userLikedVideoCount,
                totalVideos,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            },
            likedVideos
        }

        // if(likedVideos.length === 0) return res.status(204).json({ message:"no liked videos found." })
        return res.status(200).json(result)
    }
    catch(err)
    {
        return res.status(500).json({message:"something bad happened while fetching the liked videos",err:err.message})
    }
}

const remove_From_Liked_Videos = async (req,res) => {
    //toggle the like for this video
    //have access to req.user
    try
    {
        const {videoId} = req.params;
        const likeDoc = await Like.findOneAndDelete({
            video: new mongoose.Types.ObjectId(videoId),
            likedBy: new mongoose.Types.ObjectId(req.user._id),
            liked: "true"
        })

        return res.status(200).json({message:"VIDEO_REMOVED_FROM_LIKED_SUCCESSFULLY"})
    }
    catch(err)
    {
        return res.status(500).json({message:"something bad happened while fetching the liked videos",err:err.message})
    }
}


const get_Disliked_Videos = async (req,res) => {
    //have access to req.user 
    //just find the like docs with the user id and liked to be false
    try
    {
        const dislikedVideos = await Like.aggregate([
            {
                $match:
                {
                    likedBy: new mongoose.Types.ObjectId(req.user._id),
                    liked: "false"
                }
            },
            {
                $lookup:
                {
                    from:"videos",
                    localField:"video",
                    foreignField:"_id",
                    as:"video",
                    pipeline:
                    [                    
                        {
                            $lookup:
                            {   
                                from:"users",
                                localField:"owner",
                                foreignField:"_id", 
                                as:"owner",
                                pipeline:
                                [        
                                    {
                                        $project:
                                        {
                                            fullname: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]             
                            }
                        },
                        {
                            $addFields:
                            {
                                owner:
                                {      
                                    $first: "$owner"                  
                                }
                            }
                        }
                    ]
                }
            },
            {
                $addFields:
                {
                    video:
                    {
                        $first:"$video"
                    }
                }
            },
            {
                $project:
                {
                    video:1,
                }
            }
        ])

        if(dislikedVideos.length === 0) return res.status(200).json({message:"no disliked videos found."})
        return res.status(200).json(dislikedVideos)
    }
    catch(err)
    {
        return res.status(500).json({message:"something bad happened while fetching the liked videos",err})
    }
}

module.exports = {
    toggle_Video_Like,
    toggle_Comment_Like,
    toggle_Tweet_Like,
    get_Liked_Videos,
    remove_From_Liked_Videos,
    get_Disliked_Videos
}