const multer = require('multer');

//storing the file in disk with name (original name) and in folder (public/temp)

const storage = multer.diskStorage({
    destination: function( req, file, cb) {
        cb( null, "./public/temp" )               // ../../public/temp  won't work
    },
    filename: function( req, file, cb) {
        cb( null, file.originalname )
    }
});


const upload = multer({ storage: storage }); // or const upload = multer({ storage });
module.exports = upload;


/* if you see (req,file,cb) : we have direct access to the file which req doesn't provide that is why multer is used as a middleware 
and now we can directly use req.files */