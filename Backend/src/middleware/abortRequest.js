const checkAborted = async (req,res,next) => {
    req.connection.on('close',()=>{
        req.connectionClosed = true;
        console.log("request aborted by client.");
    });

    req.connectionClosed = false;
    next();
}

module.exports = {checkAborted};