const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({

    content:{
        type:String,
        required:true
    },  
    tweetBy:{                 // as soon as user make a new comment on a video we will set his id to its value and then use lookup to get full data  
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

},{ timestamps:true })


const Tweet = mongoose.model( "Tweet",tweetSchema );
module.exports = Tweet;