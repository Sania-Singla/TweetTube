const Tweet = require("../models/tweet");
const Like = require("../models/like");
const mongoose = require("mongoose");
const { isValidObjectId } = require("mongoose");

const get_User_Tweets = async (req,res) => {
    //get userId from params
    //find tweet docs with this userid  // one can do multiple tweets
    //will have to populate the tweetBy field (user)
    //add like & dislike field 
    //add pagination
    try 
    {
        const { userId } = req.params;
        if(!isValidObjectId(userId)) return res.status(400).json({message:"INVALID_USERID"})

        const { page=1, limit=10 } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const startIndex = (pageNumber-1)*limitNumber;
    
        const pipeline = 
        [
            {
                $match:
                {
                    tweetBy: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $sort: { updatedAt: -1 }
            },
            {
                $skip: startIndex
            },
            {
                $limit: limitNumber
            },
            {  //populating the user field
                $lookup:
                {
                    from:"users",                
                    localField:"tweetBy",
                    foreignField:"_id",
                    as:"tweetBy",
                    pipeline:
                    [
                        {
                            $project:
                            {
                                username:1,
                                fullname:1,
                                avatar:1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup:
                {
                    from:"likes",
                    localField:"_id",
                    foreignField:"tweet",
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
            {
                $lookup:
                {
                    from:"likes",
                    localField:"_id",
                    foreignField:"tweet",
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
            {
                $addFields:
                {
                    likes:{ $size: "$likes"},
                    dislikes:{ $size: "$dislikes"}
                }
            }
        ]
        const tweets = await Tweet.aggregate(pipeline);
        if(tweets.length === 0) return res.status(200).json({ message: "NO_TWEETS" })
    
        const totalTweets = await Tweet.countDocuments({tweetBy: new mongoose.Types.ObjectId(userId)})
        const totalPages = totalTweets/limitNumber;
        const hasPreviousPage = pageNumber > 1;
        const hasNextPage = pageNumber < totalPages;
    
        const response = {
            hasNextPage,
            hasPreviousPage,
            totalPages,
            totalTweets,
            tweets
        }
    
        return res.status(200).json(response)
    } 
    catch (err) 
    {
        return res.status(500).json({ message:"something went wrong while fetching the tweets", err:err.message});     
    }
}

const create_Tweet = async (req,res) => {
    //have access to req.user._id                     
    //get content through body            // tweets are a separate field , there is no such thing as tweet on video like we have comment on video
    //create a new Tweet doc
    try 
    {
        const { content } = req.body;
        const tweetDoc = await Tweet.create({
            content: content,
            tweetBy: req.user._id
        })
        if(!tweetDoc) return res.status(500).json({ message:"TWEET_CREATION_DB_ISSUE" })
        return res.status(201).json(tweetDoc)
    } 
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while creating the tweet.",err:err.message})    
    }
}

const update_Tweet = async (req,res) => {
    //get tweetId by req.params  
    //get new content by req.body
    //and update the doc
    try 
    {
        const { tweetId } = req.params;
        if(!isValidObjectId(tweetId)) return res.status(400).json({message:"INVALID_TWEETID"})

        const { content } = req.body;
        const tweet = await Tweet.findById(tweetId);
        if(!tweet) return res.status(400).json({message:"TWEET_NOT_FOUND"})
        tweet.content = content;
        await tweet.save({validateBeforeSave:false});
        //alternative
        // const updatedDoc = await Tweet.findByIdAndUpdate(
        //     tweetId,
        //     {
        //         $set:
        //         {
        //             content
        //         }
        //     },
        //     { new:true }
        // )
        return res.status(200).json(tweet)
    }
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while updating the Tweet.",err:err.message})  
    }
}

const delete_Tweet = async (req,res) => {
    //get tweetId by req.params and delete the doc
    try 
    {
        const { tweetId } = req.params;
        if(!isValidObjectId(tweetId)) return res.status(400).json({message:"INVALID_TWEETID"})

        const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
        if(!deletedTweet) return res.status(400).json({message:"TWEET_NOT_FOUND"});
        const likes = await Like.findOneAndDelete({tweet:new mongoose.Types.ObjectId(deletedTweet._id)});
        return res.status(200).json({ message:"Tweet deleted successfully" })
    }
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while deleting the Tweet.",err:err.message})     
    }
}


module.exports = {
    get_User_Tweets,
    create_Tweet,
    update_Tweet,
    delete_Tweet,
}