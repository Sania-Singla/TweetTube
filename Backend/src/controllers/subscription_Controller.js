const mongoose = require("mongoose");
const Subscription = require("../models/subscription");
const {isValidObjectId} = require("mongoose")

//channelId is also someone's userId so dont confuse ki ye channelId kya hai ye channelId 😉 
const toggle_Subscribe = async (req,res) => {
    //have access to req.user
    //get the channel id from req.params
    //check for existing doc => a) if found delete the doc
    //                          b) if not found create a new doc ( here no worries about true/flase => either we have doc or not )
    try 
    {
        const { channelId } = req.params;
        if(!isValidObjectId(channelId)) return res.status(400).json({message:"INVALID_CHANNELID"})

        if(channelId === (req.user._id).toString()) return res.status(400).json({message:"OWN_CHANNEL"})
        const existingDoc = await Subscription.findOne({
            subscriber: new mongoose.Types.ObjectId(req.user._id),
            channel: new mongoose.Types.ObjectId(channelId)
        })
        if(!existingDoc)
        {
            //create a new doc
            const createdDoc = await Subscription.create({
                subscriber: req.user._id,
                channel: channelId
            })
            if(!createdDoc) return res.status(500).json({ message: "SUBSDOC_CREATION_DB_ISSUE" })
            
            return res.status(201).json(createdDoc) 
        }
        else //so we do have a doc
        {
            //delete the doc
            const deletedDoc = await Subscription.findByIdAndDelete(existingDoc._id)
            if(!deletedDoc) return res.status(500).json({ message: "SUBSDOC_REMOVAL_DB_ISSUE" })
            
            return res.status(200).json(deletedDoc) 
        }
    } 
    catch (err) 
    {
        return res.status(500).json({ message:"something went wrong while toggling the subscribe", err:err.message});     
    }
}

const get_Channel_Subscribers = async (req,res) => {
    //have access to req.user
    //get the channelId from req.params
    //write the pipeline
    //populate the subscriber field
    try 
    {
        const { channelId } = req.params;
        if(!isValidObjectId(channelId)) return res.status(400).json({message:"INVALID_CHANNELID"})

        const subscribers = await Subscription.aggregate([
            {
                $match:
                {
                    channel: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup:
                {
                    from:"users",
                    localField:"subscriber",
                    foreignField:"_id",
                    as:"subscriber",
                    pipeline:
                    [
                        {
                            $project:
                            {
                                username:1,
                                fullname:1,
                                avatar:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:
                {
                    subscriber:
                    {
                        $first:"$subscriber"
                    }
                }
            },
            {
                $project:
                {
                    subscriber:1,
                    _id:0
                }
            },
            {
                $unwind: "$subscriber"
            },
            {
                $replaceRoot: { newRoot: "$subscriber" }
            }
        ])
        if(subscribers.length === 0) return res.status(200).json({message:"NO_SUBSCRIBERS_FOUND"})
        
        return res.status(200).json(subscribers)
    } 
    catch (err) 
    {
        return res.status(500).json({ message:"something went wrong while fetching the subscribers", err:err.message});     
    }
}

const get_Subscribed_Channels = async (req,res) => {
    //have access to req.user
    //get the userId from req.params
    //write the pipeline
    //populate the channel field
    try 
    {
        const { userId } = req.params;
        if(!isValidObjectId(userId)) return res.status(400).json({message:"INVALID_USERID"})

        const subscribedChannels = await Subscription.aggregate([
            {
                $match:
                {
                    subscriber: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:
                {
                    from:"users",
                    localField:"channel",
                    foreignField:"_id",
                    as:"channel",
                    pipeline:
                    [
                        {
                            $lookup:
                            {
                                from:"subscriptions",
                                localField:"_id",
                                foreignField:"channel",
                                as:"subscribers"             //array of objects
                            }
                        },
                        {
                            $addFields:
                            {
                                subscribersCount:{ $size:"$subscribers" },
                                // subscribed:true
                            }
                        },
                        {
                            $project:{
                                username:1,
                                fullname:1,
                                avatar:1,
                                subscribersCount:1,
                                // subscribed:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields:
                {
                    channel:
                    {
                        $first:"$channel"
                    }
                }
            },
            {
                $project:
                {
                    channel:1,
                    _id:0
                }
            },
            {
                $unwind: "$channel"
            },
            {
                $replaceRoot: { newRoot: "$channel" }
            }
        ])
        // if(subscribedChannels.length === 0) return res.status(200).json({message:"NO channels subscribed."})
        //was causing issue on frontend becuase we need an array to map so dont worry it will return an empty array thats all
        
        return res.status(200).json(subscribedChannels)
    } 
    catch (err) 
    {
        return res.status(500).json({ message:"something went wrong while fetching the subscribed channels", err:err.message});  
    }
}


module.exports = {
    toggle_Subscribe,
    get_Channel_Subscribers,
    get_Subscribed_Channels
}