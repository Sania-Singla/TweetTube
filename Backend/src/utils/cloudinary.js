import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) throw new Error('CLOUDIANRY_FILE_PATH_MISSING');

        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        //file uploaded successfully so now get the url and remove the file from server.
        console.log('file uploaded successfully!!', response.url);
        fs.unlinkSync(localFilePath);
        // console.log(response);
        return response; // or directly response.url
    } catch (err) {
        //removing the locally temporary saved file as the upload opr. failed ( don't want to keep any currpted .. files on server )
        fs.unlinkSync(localFilePath);
        return console.log(
            'something wrong happened while uploading file on cloudinary; error: ',
            err.message
        );
    }
};

const deleteFromCloudinary = async (URL) => {
    try {
        if (!URL) {
            throw new Error('url missing');
        }
        //delete old file in cloudinary only method is to use public_id
        //str. of url==> http://-----/----/resource_type/------/-----/<public-id>.extension
        const public_id = URL.split('/').pop().split('.')[0];
        const resource_type = URL.split('/')[4];
        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type,
            invalidate: true,
        });
        //.then((result)=> console.log(result));   //will show {result:"ok"}
        return result;
    } catch (err) {
        return console.log(
            'something wrong happened while deleting file from cloudinary; error: ',
            err
        );
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
