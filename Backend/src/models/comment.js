const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const commentSchema = new mongoose.Schema({

    content:{
        type:String,
        required:true
    },  
    commentBy:{            // as soon as user make a new comment on a video we will set his id to its value and then use lookup to get full data  
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    video:{               // as soon as user make a new comment on a video we will set the video id to its value and then use lookup to get full data 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }

},{ timestamps:true })



commentSchema.plugin(mongooseAggregatePaginate)

const Comment = mongoose.model( "Comment",commentSchema );
module.exports = Comment;