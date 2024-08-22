const mongoose =require("mongoose");

const Connect_DB = async () => {
    try
    {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}${process.env.DB_NAME}`);
        console.log(`MONGODB connection successfull !! , host: ${connectionInstance.connection.host}`);
    }
    catch(err)
    {
        console.log("MONGODB connection FAILED !!",err);
    }
}

module.exports = Connect_DB;