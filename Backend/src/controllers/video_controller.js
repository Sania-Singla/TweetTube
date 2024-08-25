const mongoose  = require("mongoose");
const User = require("../models/user");
const Video = require("../models/video");
const Comment = require("../models/comment");
const Like = require("../models/like");
const fs = require("fs");
const { upload_On_Cloudinary, delete_From_Cloudinary } = require("../utils/cloudinary");
const { isValidObjectId } = require("mongoose");

const get_Random_Videos = async ( req,res ) => {
    //fetch all videos from db
    //add pagination & sorting

    try 
    {
        const {page=1,limit=10} = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const startIndex = (pageNumber-1)*limitNumber;
        const endIndex = pageNumber*limitNumber; 

        const videos = await Video.aggregate([
            {
                $match:{isPublished:true}
            },
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner",
                    pipeline:[
                        {
                            $project:{
                                _id:1,
                                username:1,
                                fullname:1,
                                avatar:1,
                            }
                        }
                    ]
                }
            },
            {
                $addFields:{
                    owner:{$first:"$owner"}
                }
            },
            {
                $addFields:{
                    views:{$size:"$views"}
                }
            },
            {
                $sort:{updatedAt: -1}
            },
            {
                $skip:startIndex
            },
            {
                $limit:limitNumber
            }
        ])

        const totalVideos = await Video.countDocuments({});
        const totalPages = Math.ceil(totalVideos/limitNumber);
        const hasNextPage = pageNumber < totalPages;
        const hasPreviousPage = pageNumber > 1;

        const result = {
            info:{
                totalPages,
                totalVideos,
                hasNextPage,
                hasPreviousPage,
            },
            videos
        }

        return res.status(200).json(result)
    } 
    catch (err) {
        return res.status(500).json({message:"something bad happened while fetching random videos.",err:err.message})
    }
} 

const get_All_Videos = async ( req,res ) => {
    //get the userid from query and find all the videos with that owner id (there is no need to populate the owner field)
    //we have access to req.user
    //pagination: we need page, limit
    //for additional features like sorting we will need sortBy, sortType 
    
    try 
    {
        const { userId, query="", sortType="desc", sortBy="createdAt", page=1, limit=10 } = req.query;             // query means search term right now we are not implementing that will see in future (easy)
        if(!isValidObjectId(userId)) return res.status(400).json({message:"INVALID_USERID"})

        //all will be strings by default 
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const startIndex = (pageNumber-1)*limitNumber;
        const endIndex = pageNumber*limitNumber;
    
        //pipeline
        const pipeline = [
            //stage 1
            {
                $match:
                {
                    owner: new mongoose.Types.ObjectId(userId),
                    isPublished:true
                }
            },
            {
                $addFields:{
                    views:{$size:"$views"}
                }
            },
            {
                $sort:{
                    updatedAt: -1           //(desc => -1 and asc => 1)
                }
            },
            //stage 3
            {
                $skip: startIndex                   // will directly go to that index skipping all docs before that 
            },
            //stage 4
            {
                $limit: limitNumber            // will give only this number of docs so saves time if user was satisfied with this much andd not willint to go to next page
            }
        ]
    
        //checking if have sortBy and sortType so will add an additional stage for sorting (stage 4)
        // if(sortBy && sortType)
        // {
        //     const sortStage = {
        //         //stage 5
        //         $sort:{
        //             [sortBy]: sortType === "desc" ? -1 : 1           //(desc => -1 and asc => 1)
        //         }
        //     }
        //     pipeline.push(sortStage);
        // }
    
        //executing the pipeline
        const videos = await Video.aggregate(pipeline);
        //if(videos.length === 0) return res.status(200).json({ message: "NO videos found." });   //if we set 204 status, it was causing an issue in frontend regarding the response is not json also we handled it on frontend so no need here

        //calculating has next and prev page or not
        const totalVideos = await Video.countDocuments({owner:new mongoose.Types.ObjectId(userId)})
        const totalPages = Math.ceil(totalVideos/limitNumber);      // will round off to nearest integer
        const hasNextPage = pageNumber < totalPages;  
        const hasPreviousPage = pageNumber > 1;
        /* alternative
        const hasNextPage = endIndex < totalVideos;
        const hasPreviousPage = startIndex > 0;
        */
    
        //sending the response 
        const result = {
            info:{
                totalVideos,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            },
            videos
        }
        return res.status(200).json(result);
    } 
    catch (err)
    {
        return res.status(500).json({message:"something bad happened while fetching the videos",err:err.message})    
    }
}

const toggle_Publish = async (req,res) => {
    try {
        const {videoId,Status} = req.params;
        if(!videoId) return res.status(400).json({ message:"VIDEOID_MISSING" });
        if(!isValidObjectId(videoId)) return res.status(400).json({message:"INVALID_VIDEO_ID"})

        const video = await Video.findById(videoId);
        if(!video) return res.status(400).json({ message:"VIDEO_NOT_FOUND" })
        
        video.isPublished = Status;
        await video.save({ validateBeforeSave:false });
        return res.status(200).json(video);
        
    } catch (err) {
        return res.status(500).json({message:"something bad happened while toggling the publish video",err:err.message})    
    }
}

const publish_a_Video = async ( req,res ) => {
    //since user(the one publishing the video) should be logged in so we have req.user 
    //get the video file,thumbnail through multer and upload on cloudinary and get the url
    //get the description,title from req.body
    //confirm the uploads/urls
    //create entry in the videos collection
    //return the response as the video info and the message
    let videoFile,thumbnail;
    try 
    {
        // req.customConnectionClosed = false;

        // req.on('close', () => {
        //     req.customConnectionClosed = true;
        // });
        
        if(!req.files?.videoFile || !req.files?.thumbnail ) return res.status(400).json({ message:"VIDEOFILE_THUMBNAIL_MISSING" });
        const { title, description } = req.body; 
        if( !title || !description ) return res.status(400).json({ message:"TITLE_DESCR_MISSING" });
        const videoFile_Localpath = req.files.videoFile[0].path;
        const thumbnail_Localpath = req.files.thumbnail[0].path;

        console.log("videoFilePath=",videoFile_Localpath,"thumbnail_path=",thumbnail_Localpath);

        if (req.connectionClosed) {
            console.log("Connection closed, aborting video and thumbnail upload...");
            console.log("had nothing to clean yet & request closed...");
            return; // Preventing further execution
        }

        //upload video 
        videoFile = await upload_On_Cloudinary(videoFile_Localpath);
        if(req.connectionClosed) {
            console.log("video uploaded but request cancelled so now deleting the video from cloudinary and returning with a cancelled message");
            await delete_From_Cloudinary(videoFile.url);
            console.log("deleted the video from cloudinary");
            fs.unlinkSync(thumbnail_Localpath);  //we dont need the thumbnail now because we are not going to upload it anymore
            return;
        }

        //upload thumbnail
        thumbnail = await upload_On_Cloudinary(thumbnail_Localpath);
        if(req.connectionClosed) {
            console.log("uploaded both but request cancelled so now deleting both from cloudinary and returning with a cancelled message");
            await delete_From_Cloudinary(videoFile.url);
            await delete_From_Cloudinary(thumbnail.url);
            console.log("deleted both");
            return;
        }

        // console.log("videoFile=",videoFile,"thumbnail=",thumbnail);   // it contains the duration property for a video file in seconds
        
        if(!videoFile || !thumbnail) return res.status(500).json({ message:"VIDEO_UPLOAD_ISSUE" });
        
        //create entry
        const video = await Video.create({
            description,
            title,
            duration:videoFile.duration,
            thumbnail: thumbnail.url,
            videoFile: videoFile.url,
            owner: req.user._id,
            //views: //will be default yet 
            //is published:false // will add later
        });
        const publishedVideo = await Video.findById(video._id);
        if(!publishedVideo) return res.status(500).json({message:"VIDEODOC_CREATION_DB_ISSUE"});
        
        if(req.connectionClosed) {
            console.log("uploaded both and created entry in db but request cancelled so now deleting both from cloudinary and the video doc from db and returning with a cancelled message");
            await delete_From_Cloudinary(videoFile.url);
            await delete_From_Cloudinary(thumbnail.url);
            await Video.findByIdAndDelete(video._id);
            console.log("deleted the video");
            return;
        }
    
        return res.status(201).json(publishedVideo);
    } catch (err) 
    {
        if(videoFile) await delete_From_Cloudinary(videoFile.url);
        if(thumbnail) await delete_From_Cloudinary(thumbnail.url);
        return res.status(500).json({message:"something bad happened while publishing the video",err:err.message})    
    }    
} 

const update_a_Video = async ( req,res ) => {
    //get video id from req.params // for finding in db
    //allowing to change the title , description and thumbnail
    //req.user is accessable
    //*****we can only update the video if we are the owner of the video*****
    //get the thumbnail(multer), title & description
    // upload the thumbnail on cloudinary 
    //verify the uploads/urls
    //return the new video model
    try 
    {
        const { videoid } = req.params;               // toh url mein bhi /:videoid ==> same likhna hoga
        if(!videoid) return res.status(400).json({ message:"VIDEO_MISSING" });
        if(!isValidObjectId(videoid)) return res.status(400).json({message:"INVALID_VIDEOID"})

        const video = await Video.findById(videoid);
        if (!video) return res.status(400).json({message:"VIDEO_NOT_FOUND"})
    
        const oldThumbnail_url = video.thumbnail;  // because baad mein fir ye update krde hai hmne 
    
        if(!video.owner.equals(req.user._id)) return res.status(401).json({ message:"NOT_THE_OWNER" });
        //or video.owner.toString() !== req.user?._id.toString()   ==> .equals() method is provided by mongoose to compare the ids without string conversion
    
        //so we are the owner at this point
        const { description, title } = req.body;
        if( !description || !title ) return res.status(400).json({ message:"TITLE_DESCR_MISSING" });

        if(!req.file) return res.status(400).json({ message:"THUMBNAIL_MISSING" });
    
        //so we do have file at this point
        const newThumbnail_Localpath = req.file.path;
        const newThumbnail =await upload_On_Cloudinary(newThumbnail_Localpath);
        if(!newThumbnail) return res.status(500).json({ message:"THUMBNAIL_UPDATE_ISSUE" });
    
        //updating
        video.description = description;
        video.title = title;
        video.thumbnail = newThumbnail.url; 
        // const video = await Video.findByIdAndUpdate(
        //     videoid,
        //     {
        //         $set:
        //         {
        //             thumbnail: newThumbnail.url,                     //AVOIDING ANOTHER DATABASE CALL BY ABOVE CODE
        //             description,
        //             title
        //         }
        //     },
        //     { new: true }
        // );
        await video.save({ validateBeforeSave:false })    //no need if using findbyidandupdate()
        //deleting old thumbnail
        const deletedThumbnail = await delete_From_Cloudinary(oldThumbnail_url);
        if( deletedThumbnail.result !== "ok" ) return res.status(500).json({message:"OLD_THUMBNAIL_DELETION_ISSUE" })
        return res.status(200).json(video);
    } 
    catch (err) 
    {
        if(newThumbnail) await delete_From_Cloudinary(newThumbnail.url);
        return res.status(500).json({message:"something bad happened while updating the video",err:err.message})    
    }

}

const delete_a_Video = async ( req,res ) => {
    //get the video id by params 
    //find it in the db
    //you should be the owner of the video
    //then just delete the video
    try 
    {
        const { videoid } = req.params;
        if(!videoid) return res.status(400).json({ message:"VIDEOID_MISSING" });
        if(!isValidObjectId(videoid)) return res.status(400).json({message:"INVALID_VIDEOID"})

        const video = await Video.findById(videoid);
        if (!video) return res.status(400).json({message:"VIDEO_DOESNT_EXIST"})
        //checking for the owner
        if(!video.owner.equals(req.user._id)) return res.status(401).json({ message:"NOT_THE_OWNER" });
    
        //deleting the files from cloudinary 
        const deletedThumbnail = await delete_From_Cloudinary(video.thumbnail);
        const deletedVideoFile = await delete_From_Cloudinary(video.videoFile);
        if( deletedVideoFile.result !== "ok" || deletedThumbnail.result!== "ok" ) return res.status(500).json({message:"VIDEOFILE_THUMBNAIL_DELETION_ISSUE" })
        const deletedVideo = await Video.findByIdAndDelete(video._id);     // videoid
        const comments = await Comment.deleteMany({video:new mongoose.Types.ObjectId(video._id)});
        const likes = await Like.deleteMany({video:new mongoose.Types.ObjectId(video._id)});
        
        return res.status(200).json({message:"VIDEO_DELETED_SUCCESSFULLY"});
    } catch (err) 
    {
        return res.status(500).json({message:"something bad happened while deleting the video",err:err.message})    
    }
}

const get_Video_By_Id  = async ( req,res ) => {   // will be used while playing the videos on clicking and showing the owner details under the videos 
    //get the id from params and find the video
    //have access to req.user
    //increment the views of the video 
    //push the video id to the user watch history  //sub-pipeline won't work (can't avoid the extra db call) becuase they cant presist the changes
    //populate the owner before returning the video using aggregation pipelines
    try 
    {
        const { videoid } = req.params;
        if(!videoid) return res.status(400).json({ message:"VIDEOID_MISSING" });
        if(!isValidObjectId(videoid)) return res.status(400).json({message:"INVALID_VIDEO_ID"});

        const video = await Video.findById(videoid);
        if(!video) return res.status(400).json({ message:"VIDEO_NOT_FOUND" });
        if(req.user) 
        {
            //pushing the videoid into the watchHistory****
            const user = await User.findById(req.user?._id);
            await user.updateWatchHistory(videoid);

            //pushing the userid into the views**** 
            await video.increment_Views(user._id);
        }
        else{
            await video.increment_Views(req.ip);
        }
    
        //aggregation pipeline
        const detailedVideo = await Video.aggregate([
            {
                $match:
                {
                    _id: new mongoose.Types.ObjectId(videoid)    // becuase url se toh hmme "71584619797071074jag" is form mein milegi (no autoconversion since mongodb opr not mongoose)
                }
            },
            {
                $lookup:
                {
                    from:"users",                // we are in video model
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner",  //overwrite
                    pipeline:
                    [
                        //pushing the videoid in history array // we are inside owner field so can directly operate with watchHistroy ( just like in watch history first we did lookup to populate the watchhistory ke andr ke video ids then in the sub pipeline(we entered inside the history array can also say in the each video model element becuase all are same) then we used lookup to get the owner field populated) ==> intersting *******
                        // {
                        //     $addFields:
                        //     {   
                        //         watchHistory:
                        //         {
                        //             $cond:
                        //             {
                        //                 if:{ $in: [ videoid,"$watchHistory"] },
                        //                 then:"$watchHistory",                                         
                        //                 else:{ $concatArrays:[ "$watchHistory",[videoid] ] }
                        //             }
                        //         }
                        //     }
                        // },
                        //this approach is working but not retaining in the original doc and reseting everytime so we will have to concat it separately (not our fault this is how mongodb works sometimes) 
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
                            $addFields:
                            {
                                subscribersCount: { $size:"$subscribers" },
                                isSubscribed: req.user ? {
                                    $cond:
                                    {
                                        if:{ $in:[ req.user._id, "$subscribers.subscriber" ]},
                                        then: true,
                                        else: false
                                    }
                                }: false
                            }
                        },
                        {
                            $project:
                            {
                                fullname:1,
                                username:1,
                                avatar:1,
                                isSubscribed:1,
                                subscribersCount:1
                            }
                        }
                    ]
                }
            },
            //get likes array
            {
                $lookup:
                {
                    from:"likes",
                    localField:"_id",
                    foreignField:"video",
                    as:"likes",
                    pipeline:
                    [
                        {
                            $match:{liked:"true"}
                        }
                    ]
                } //array likes[]
            },
            //get dislikes array
            {
                $lookup:
                {
                    from:"likes",
                    localField:"_id",
                    foreignField:"video",
                    as:"dislikes",
                    pipeline:
                    [
                        {
                            $match:{liked:"false"}
                        }
                    ]
                } //array dislikes[]
            },
            {
                $addFields:
                {
                    views:
                    {$size:"$views"},
                    owner:
                    {$first:"$owner"},
                    likes:                            //overwrite
                    {$size:"$likes"},
                    dislikes:                           //overwrite
                    {$size:"$dislikes"},
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
            }
        ])
    
    
        return res.status(200).json(detailedVideo[0]);
    } 
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while fetching the video",err: err.message})
    }


}

const get_Search_Data = async ( req,res ) => {  //get videos based on matched title or fullname or username
    try 
    {
        const {page=1,limit=10,query=""} = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const startIndex = (pageNumber-1)*limitNumber;

        //getting the results
        const results = await Video.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner",
                    pipeline:[
                        {
                            $project:{
                                _id:1,
                                fullname:1,
                                username:1,
                                avatar:1,
                            }
                        }
                    ]
                }
            },
            { $unwind:"$owner" },
            {
                $match:query?{
                    $or:[
                        {title:{$regex:query,$options:"i"}},
                        {"owner.fullname":{$regex:query,$options:"i"}}
                    ],
                    isPublished:true,
                }:{isPublished:true},
                
            },
            {
                $addFields:{
                    views:{$size:"$views"}
                }
            },
            {
                $sort: { title:1 }
            },
            { $skip:startIndex },
            { $limit:limitNumber }
        ])

        //calculating total no. of results
        const totalResults = await Video.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner"
                }
            },
            { $unwind:"$owner" },
            {
                $match:query?{
                    $or:[
                        {title:{$regex:query,$options:"i"}},
                        {"owner.fullname":{$regex:query,$options:"i"}}
                    ],
                    isPublished:true,
                }:{isPublished:true},
            },
            { $count:"totalResults" }
        ])
 
        const totalMatches = totalResults[0]?.totalResults || 0;
        const totalPages = Math.ceil(totalMatches/limitNumber);      // will round off to nearest integer
        const hasNextPage = pageNumber < totalPages;  
        const hasPreviousPage = pageNumber > 1;

        const result = {
            info:{
                hasNextPage,
                hasPreviousPage,
                totalPages,
                totalMatches
            },
            results
        }

        return res.status(200).json(result);
    } 
    catch (err) 
    {
        return res.status(500).json({message:"something bad happened while fetching the video titles",err: err.message})
    }
}


module.exports = {
    get_Random_Videos,
    get_All_Videos,
    toggle_Publish,
    publish_a_Video,
    update_a_Video,
    delete_a_Video,
    get_Video_By_Id,
    get_Search_Data
}