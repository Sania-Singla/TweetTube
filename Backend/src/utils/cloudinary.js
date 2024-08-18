const cloudinary = require('cloudinary').v2;
const fs = require("fs");

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const upload_On_Cloudinary = async ( localFilePath ) => {

    try 
    {
        if( !localFilePath ) return res.status(500).json({ message: "couldn't get the file path." });
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload( localFilePath, { resource_type:'auto' });
        
        //file uploaded successfully so now get the url and remove the file from server.
        console.log( "file uploaded successfully!!", response.url );
        fs.unlinkSync( localFilePath ); 
        // console.log(response);
        return response;          // or directly response.url
    } 
    catch (err) 
    {
        //removing the locally temporary saved file as the upload opr. failed ( don't want to keep any currpted .. files on server )
        fs.unlinkSync(localFilePath);
        return console.log("something wrong happened while uploading file on cloudinary; error: ", err);
    }
}

const delete_From_Cloudinary = async (URL) => {
    try
    {
        //delete old file in cloudinary only method is to use public_id 
        //str. of url==> http://-----/----/resource_type/------/-----/<public-id>.extension
        const public_id = URL.split("/").pop().split(".")[0];
        const resource_type = URL.split("/")[4];
        const result = await cloudinary.uploader.destroy( public_id,{ resource_type , invalidate:true })
        //.then((result)=> console.log(result));   //will show {result:"ok"}
        return result;
    }
    catch(err)
    {
        return console.log("something wrong happened while deleting file from cloudinary; error: ", err);
    }
}

module.exports = { upload_On_Cloudinary, delete_From_Cloudinary } ;
