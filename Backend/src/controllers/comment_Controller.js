const Comment = require("../models/comment");
const mongoose = require("mongoose");
const {isValidObjectId} = require("mongoose")


const get_Video_Comments = async (req,res) => {
    //get videoId from req.params
    //apply pagination 
    try 
    {
        const { videoId } = req.params;
        if(!isValidObjectId(videoId)) return res.status(400).json({message:"INVALID_VIDEOID"})
        const { page=1, limit=10, sortBy="updatedAt", sortType="desc", query="" } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const startIndex = (pageNumber-1)*limit;
        const pipeline = [
            {
                $match:
                {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"commentBy",
                    foreignField:"_id",
                    as:"commentBy",
                    pipeline:[
                        {
                            $project:{
                                avatar:1,
                                fullname:1,
                                username:1
                            }
                        }
                    ]
                }
            },
            {
                $lookup:{
                    from:"likes",
                    foreignField:"comment",
                    localField:"_id",
                    as:"likes",
                    pipeline:[
                        {
                            $match:{liked:"true"}
                        }
                    ]
                }
            },
            {
                $lookup:{
                    from:"likes",
                    foreignField:"comment",
                    localField:"_id",
                    as:"dislikes",
                    pipeline:[
                        {
                            $match:{liked:"false"}
                        }
                    ]
                }
            },
            {
                $addFields:{
                    likes:{$size:"$likes"},
                    dislikes:{$size:"$dislikes"},
                    hasLiked:req.user ? {
                        $cond:{
                            if:{ $in: [req.user._id,"$likes.likedBy"] },       
                            then:true,
                            else:false
                        }
                    } : false,
                    hasDisliked:req.user ? {
                        $cond:{
                            if:{ $in: [req.user._id,"$dislikes.likedBy"] },       
                            then:true,
                            else:false
                        }
                    } : false
                }
            },
            {
                $unwind:"$commentBy"
            },
            {
                $skip: startIndex
            },
            {
                $limit: limitNumber
            },
            {
                $project:{
                    video:0
                }
            }
        ]
        if(sortBy && sortType)
        {
            const sortStage = {
                $sort:{
                    [sortBy]: sortType === "desc" ? -1 : 1 
                }
            }
            pipeline.push(sortStage);
        }
        const comments = await Comment.aggregate(pipeline);
    
        const totalComments = await Comment.countDocuments({video:new mongoose.Types.ObjectId(videoId)});
        const totalPages = Math.ceil(totalComments/limitNumber);
        const hasNextPage = pageNumber < totalPages ;
        const hasPreviousPage = pageNumber > 1;
    
        // if(comments.length === 0 ) return res.status(200).json({ message:"NO_COMMENTS_FOUND" });
    
        const response = {
            info:{
                hasNextPage,
                hasPreviousPage,
                totalComments,
                totalPages,
            },
            comments
        }
    
        return res.status(200).json(response)
    } 
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while fetching the comments.",err:err.message})           
    }
}

const add_Comment = async (req,res) => {
    //have access to req.user._id
    //get content through body
    //get videoId through req.params
    //create a new comment doc
    try 
    {
        const { videoId } = req.params;
        if(!isValidObjectId(videoId)) return res.status(400).json({message:"INVALID_VIDEOID"})
        const { content } = req.body;
        const commentDoc = await Comment.create({
            video: videoId,
            content: content,
            commentBy: req.user._id
        })
        if(!commentDoc) return res.status(500).json({ message:"COMMENTDOC_CREATION_DB_ISSUE" });
        const comment = await Comment.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(commentDoc._id)
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"commentBy",
                    foreignField:"_id",
                    as:"commentBy",
                    pipeline:[
                        {
                            $project:{
                                avatar:1,
                                fullname:1,
                                username:1,
                            }
                        }
                    ]
                }
            },
            {
                $unwind:"$commentBy"
            },
            {
                $addFields:{
                    hasLiked: false,
                    hasDisliked: false,
                    likes: 0,
                    dislikes:0
                }
            }
        ])
        return res.status(201).json(comment[0])
    } 
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while creating the comment.",err:err.message})    
    }
}

const update_Comment = async (req,res) => {
    //get commentId by req.params   // becuase we can add multiple comments to same video
    //get new content by req.body
    //and update the doc
    try 
    {
        const { commentId } = req.params;
        if(!isValidObjectId(commentId)) return res.status(400).json({message:"INVALID_COMMENTID"})
        const { content } = req.body;
        const comment = await Comment.findById(commentId);
        if(!comment) return res.status(400).json({message:"COMMENT_NOT_FOUND"})
        comment.content = content;
        await comment.save({validateBeforeSave:false});
        //alternative
        // const updatedDoc = await Comment.findByIdAndUpdate(
        //     commentId,
        //     {
        //         $set:
        //         {
        //             content
        //         }
        //     },
        //     { new:true }
        // )
        return res.status(200).json(comment)
    }
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while updating the comment.",err:err.message})  
    }
}

const delete_Comment = async (req,res) => {
    //get commentId by req.params and delete the doc
    try 
    {
        const { commentId } = req.params;
        if(!isValidObjectId(commentId)) return res.status(400).json({message:"INVALID_COMMENTID"})
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if(!deletedComment) return res.status(400).json({message:"COMMENT_NOT_FOUND"});
        return res.status(200).json({message:"comment deleted successfully" })
    }
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while deleting the comment.",err:err.message})     
    }
}


module.exports = {
    add_Comment,
    update_Comment,
    delete_Comment,
    get_Video_Comments
}