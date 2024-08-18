const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    description:{
        type:String,
    },  
    name:{
        type:String,
        required:true
    }


},{ timestamps:true })

const Playlist = mongoose.model("Playlist",playlistSchema);
module.exports = Playlist;