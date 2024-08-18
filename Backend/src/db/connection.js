const mongoose =require("mongoose");

const DB_NAME="final";

const Connect_DB = async () => {
    try
    {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`);
        console.log(`MONGODB connection successfull !! , host: ${connectionInstance.connection.host}`);
    }
    catch(err)
    {
        console.log("MONGODB connection FAILED !!",err);
    }
}

module.exports = Connect_DB;