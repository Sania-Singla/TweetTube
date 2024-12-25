import { OK } from '../constants/errorCodes.js';

const healthCheck = async (req, res) => {
    return res
        .status(OK)
        .json({ message: 'everything is ok, Health is good.' });
};

export { healthCheck };
