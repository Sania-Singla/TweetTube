import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import {
    BAD_REQUEST,
    FORBIDDEN,
    COOKIE_OPTIONS,
    SERVER_ERROR,
    NOT_FOUND,
} from '../constants/errorCodes.js';

const extractAccessToken = (req) => {
    return (
        req.cookies?.tweettube_accessToken ||
        req.headers['authorization']?.split(' ')[1] //sometimes it could be capital A
    );
};

const verifyJWT = async (req, res, next) => {
    try {
        const accessToken = extractAccessToken(req);

        if (!accessToken) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'ACCESS_TOKEN_MISSING' });
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        if (!decodedToken) {
            return res
                .status(FORBIDDEN)
                .clearCookie('tweettube_accessToken', COOKIE_OPTIONS)
                .json({ message: 'INVALID_ACCESS_TOKEN' });
        }

        //since token is valid but is this id user in oue db or not
        const user = await User.findById(decodedToken._id).select(
            '-password -refreshToken -watchHistory'
        );
        if (!user) {
            return res
                .status(NOT_FOUND)
                .clearCookie('tweettube_accessToken', COOKIE_OPTIONS)
                .json({ message: 'ACCESS_TOKEN_USER_NOT_FOUND' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .clearCookie('tweettube_accessToken', COOKIE_OPTIONS)
            .json({ message: 'EXPIRED_ACCESS_TOKEN', err: err.message });
    }
};

const optionalVerifyJWT = async (req, res, next) => {
    try {
        const accessToken = extractAccessToken(req);

        if (accessToken) {
            const decodedToken = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            if (!decodedToken) {
                return res
                    .status(FORBIDDEN)
                    .clearCookie('tweettube_accessToken', COOKIE_OPTIONS)
                    .json({ message: 'INVALID_ACCESS_TOKEN' });
            }

            //since token is valid but is this id user in oue db or not
            const user = await User.findById(decodedToken._id).select(
                '-password -refreshToken -watchHistory'
            );
            if (!user) {
                return res
                    .status(NOT_FOUND)
                    .clearCookie('tweettube_accessToken', COOKIE_OPTIONS)
                    .json({ message: 'ACCESS_TOKEN_USER_NOT_FOUND' });
            }

            req.user = user;
        }
        next();
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .clearCookie('tweettube_accessToken', COOKIE_OPTIONS)
            .json({ message: 'EXPIRED_ACCESS_TOKEN', err: err.message });
    }
};

export { verifyJWT, optionalVerifyJWT };
