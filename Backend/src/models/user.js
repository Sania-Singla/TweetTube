const mongoose = require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema( {
    
    username: 
    {
        type:String,
        required:true,       // this is a validation
        unique:true,         // will show error in console 
        index:true,
        trim:true,         // will auto trim the white spaces on start and end so while comparing also do .trim()
        lowercase:true     //to convert some stuff to lowercase before saving toh match vgera krte time bhi unko lowercase mein convert krke match krna
    },
    fullname:
    {
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        index:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
    watchHistory:[                  // as soon as the user click any video its id will be pushed into this array field  and then use lookup to get full data  
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:
    {
        type:String,
        required:true,
        trim:true
    },
    email:
    {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    refreshToken:
    {
        type:String,
        default:""
    },
    description: 
    {
        type: String,
        default: "",
    }
    
},{ timestamps:true } )

// Create a text index on the fullname and username fields
userSchema.index({ fullname: 'text', username: 'text' });

//pre hook (do something just before save)
userSchema.pre( "save",async function(next){                  // create method in mongoose auto save the data as well 
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash( this.password,10 );
    next();
})



// userSchema.methods.isPasswordValid = async function(password){              or we just defined at the use time as in login controller
//     return await bcrypt.compare(password,this.password);
// }


//creating custom methods using schema's methods property to generate the tokens
userSchema.methods.generate_access_token = function() {                                    //just like: const variable = function(){}

    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
}

userSchema.methods.generate_refresh_token = function() {          // we dont define arrow functions becuase they dont have access to 'this' keyword    

        return jwt.sign(
        {
            _id: this._id
            // username: this.username,            // no need
            // email: this.email,
            // fullname: this.fullname
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}


userSchema.methods.updateWatchHistory = async function (videoid) {
    if(this.watchHistory.includes(videoid)) return ;
    this.watchHistory.push(videoid);
    return this.save({validateBeforeSave:false});
}



const User = mongoose.model( "User" , userSchema );      // this User will be saved in database as users collection

module.exports = User;           // we will use this User name to interact with the users collection 

//or module.exports = mongoose.model("User",userSchema);  only