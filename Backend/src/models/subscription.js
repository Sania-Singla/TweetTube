const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({

    subscriber:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},{ timestamps:true })

const Subscription = mongoose.model( "Subscription", subscriptionSchema );           // saved as subscriptions collection
module.exports = Subscription ;