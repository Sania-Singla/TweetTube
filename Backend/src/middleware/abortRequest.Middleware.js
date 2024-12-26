export const checkAborted = async (req, res, next) => {
    req.connectionClosed = false;
    req.connection.on('close', () => {
        req.connectionClosed = true;
        console.log('request aborted by client.');
    });

    next();
};
