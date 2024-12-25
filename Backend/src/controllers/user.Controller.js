import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from '../utils/cloudinary.js';
import fs from 'fs';
import validator from 'validator';

import {
    BAD_REQUEST,
    COOKIE_OPTIONS,
    CREATED,
    FORBIDDEN,
    NOT_FOUND,
    OK,
    SERVER_ERROR,
} from '../constants/errorCodes.js';

//custom funcn for generating tokens(both) ---> because we will use this funcn often
const generate_Access_And_Refresh_Tokens = async (userid) => {
    try {
        const user = await User.findById(userid);
        if (!user)
            return res
                .status(NOT_FOUND)
                .json({ message: `USER_${userid}_NOT_FOUND` });

        const accessToken = await user.generate_access_token();
        const refreshToken = await user.generate_refresh_token();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            err: err.message,
            message:
                'something went wrong while generating access and refresh tokens !!',
        });
    }
};

const register = async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    try {
        const { username, fullname, email, password } = req.body;
        //check empty fields
        if (!username || !password || !email || !fullname)
            return res.status(BAD_REQUEST).json({ message: 'EMPTY_FIELDS' });

        //@ in  email
        // if( !email.includes("@") )  return res.status(BAD_REQUEST).json({ message: " please enter a valid email. " })
        //better method 👇
        // if (!validator.isEmail(email))
        // {
        //     return res.status(BAD_REQUEST).json({ message: 'Invalid email address' });
        // }

        // // Validate username
        // if (!/^[a-zA-Z0-9_]+$/.test(username))
        // {   //not even spaces
        //     return res.status(BAD_REQUEST).json({ message: 'Invalid username! Only letters, numbers, and underscores are allowed.' });
        // }
        //👆frontend pe lga diya ye sb

        //check duplicacy
        const existingUser = await User.findOne({
            $or: [
                //these $or ...... are mongoDB operators
                {
                    username: username.trim().toLowerCase(),
                },
                {
                    email: email.trim().toLowerCase(),
                },
            ],
        }); // or username:username , email:email     if same value as key write once
        if (existingUser) {
            if (req.files.avatar) {
                //cause we dont need the files then if uploaded
                fs.unlinkSync(req.files.avatar[0].path);
            }
            if (req.files.coverImage) {
                fs.unlinkSync(req.files.coverImage[0].path);
            }
            return res
                .status(BAD_REQUEST)
                .json({ message: `USER_ALREADY_EXIST` }); //conflict
        }

        //encrypt the password
        // const hashedPassword = await bcrypt.hash( password, 10 );     no need now (pre-hook)

        // for uploading the files firstly get their local paths given by multer.
        //avatar
        if (!req.files?.avatar) {
            if (req.files?.coverImage) {
                //cause we dont need the files then if uploaded
                fs.unlinkSync(req.files?.coverImage[0].path);
            }
            return res.status(BAD_REQUEST).json({ message: 'AVATAR_MISSING' });
        }
        const avatarLocalPath = req.files?.avatar[0].path; // no need of else becuase we returned the funcn before
        if (!avatarLocalPath)
            return res.status(SERVER_ERROR).json({ message: 'MULTER_ISSUE' });
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        //check if uploaded correctly or not on cloudinary
        if (!avatar)
            return res
                .status(SERVER_ERROR)
                .json({ message: 'AVATAR_UPLOAD_ISSUE' });
        //get the url
        const avatar_url = avatar.url;
        //coverImage
        let coverImageLocalPath = '';
        let coverImage_url = '';
        if (req.files.coverImage) {
            coverImageLocalPath = req.files.coverImage[0].path;
            if (!coverImageLocalPath)
                return res
                    .status(SERVER_ERROR)
                    .json({ message: 'MULTER_ISSUE' });
            coverImage = await uploadOnCloudinary(coverImageLocalPath);
            if (!coverImage)
                return res
                    .status(SERVER_ERROR)
                    .json({ message: 'COVERIMAGE_UPLOAD_ISSUE' });
            coverImage_url = coverImage.url;
        }

        //create entry
        const user = await User.create(
            /*data*/
            {
                username, // _id will be auto generated in db
                // password:hashedPassword,
                avatar: avatar_url,
                coverImage: coverImage_url,
                password,
                email,
                fullname,
            }
        );

        //remove password and rtoken and check user is created or not
        const createdUser = await User.findById(user._id).select(
            '-password -refreshToken -watchHistory'
        ); // by default all properties are selected so we dont want to send password and rtoken to sent in frontend res
        if (!createdUser)
            return res
                .status(SERVER_ERROR)
                .json({ message: 'REGISTERATION_DB_ISSUE' });

        return res.status(CREATED).json(createdUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while registering the user',
            err: err.message,
        });
    }
};

const login = async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
    try {
        const { loginInput, password } = req.body;

        //check empty fields   //or  !(username || email)
        if (!loginInput || !password)
            return res.status(BAD_REQUEST).json({ message: 'EMPTY_FIELDS' });

        //find user ( can just use username or email)
        // const user = await User.findOne({          //now user not User will be used to call any custom methods or save()
        //    $or: [
        //     {
        //         username: username.trim().toLowerCase()
        //     },
        //     {
        //         email: email.trim().toLowerCase()
        //     }
        // ]
        // });
        /* better method 👇 */
        const isEmail = validator.isEmail(loginInput);
        const user = isEmail
            ? await User.findOne({ email: loginInput.trim().toLowerCase() })
            : await User.findOne({ username: loginInput.trim().toLowerCase() });
        if (!user)
            return res.status(NOT_FOUND).json({ message: `USER_NOT_FOUND` });

        //validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(BAD_REQUEST).json({ message: 'WRONG_PASSWORD' }); //invalid credentials

        //now password is validated so generate access and refresh tokens
        const { accessToken, refreshToken } =
            await generate_Access_And_Refresh_Tokens(user._id);

        const loggedInUser = await User.findById(user._id).select(
            '-password -refreshToken -watchHistory'
        );

        // cookies
        return res
            .status(OK)
            .cookie('tweettube_accessToken', accessToken, {
                ...COOKIE_OPTIONS,
                maxAge: 24 * 60 * 60 * 1000,
            })
            .cookie('tweettube_refreshToken', refreshToken, {
                ...COOKIE_OPTIONS,
                maxAge: 5 * 24 * 60 * 60 * 1000,
            })
            .json(loggedInUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while user authentication ',
            err: err.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        const { _id } = req.user;
        const newuser = await User.findByIdAndUpdate(
            _id,
            {
                $set: { refreshToken: '' },
            },
            {
                new: true, //will return the updated user
            }
        );
        await newuser.save({ validateBeforeSave: false });
        // or
        // const newuser = await User.findById(_id);
        // newuser.refreshToken = "";
        // await newuser.save({validateBeforeSave:false});

        return res
            .status(OK)
            .clearCookie('tweettube_accessToken', COOKIE_OPTIONS)
            .clearCookie('tweettube_refreshToken', COOKIE_OPTIONS)
            .json({ message: 'user logged out successfully.' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something went wrong while logging out user',
            err: err.message,
        });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const receivedRefreshToken =
            req.cookies?.refreshToken || req.body.refreshToken;
        if (!receivedRefreshToken)
            return res
                .status(BAD_REQUEST)
                .json({ message: 'REFRESH_TOKEN_MISSING' });

        //check valid or not
        const decodedToken = jwt.verify(
            receivedRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        if (!decodedToken)
            return res
                .status(BAD_REQUEST)
                .clearCookie('tweettube_refreshToken', COOKIE_OPTIONS)
                .json({ message: 'INVALID_REFRESH_TOKEN' });

        //get a user having same data then match its refreshtoken to check if token is already used or not
        const user = await User.findById(decodedToken._id);
        if (!user)
            return res
                .status(BAD_REQUEST)
                .clearCookie('tweettube_refreshToken', COOKIE_OPTIONS)
                .json({ message: 'USER_NOT_FOUND_WITH_THIS_REFRESH_TOKEN' });

        if (user.refreshToken !== receivedRefreshToken)
            return res
                .status(FORBIDDEN)
                .clearCookie('tweettube_refreshToken', COOKIE_OPTIONS)
                .json({ message: 'REFRESH_TOKEN_EXPIRED_OR_USED' });

        // generate new tokens ( both** )
        const { accessToken, refreshToken } =
            await generate_Access_And_Refresh_Tokens(user._id);

        return res
            .status(OK)
            .cookie('tweettube_accessToken', accessToken, {
                ...COOKIE_OPTIONS,
                maxAge: 24 * 60 * 60 * 1000,
            })
            .cookie('tweettube_refreshToken', refreshToken, {
                ...COOKIE_OPTIONS,
                maxAge: 5 * 24 * 60 * 60 * 1000,
            })
            .json({ accessToken, refreshToken });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happend while refreshing the token',
            err: err.message,
        });
    }
};

const changeCurrentPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmedPassword } = req.body;

        //check for empty fields
        if (!oldPassword || !newPassword || !confirmedPassword)
            return res.status(BAD_REQUEST).json({ message: 'MISSING_FIELDS' });
        //check for new===old
        if (oldPassword === newPassword)
            return res.status(BAD_REQUEST).json({ message: 'OLD_MATCH_NEW' });
        //check for new===confirm
        if (newPassword !== confirmedPassword)
            return res
                .status(BAD_REQUEST)
                .json({ message: 'CONFIRM_DOESNT_MATCH_NEW' });

        // find user by _id because of veerifyJWT middleware we have req.user directly
        const user = await User.findById(req.user._id);

        //check for oldPassword to be correct
        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            user.password
        );
        if (!isPasswordValid)
            return res.status(BAD_REQUEST).json({ message: 'WRONG_PASSWORD' });

        //updating the password
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        return res
            .status(OK)
            .json({ message: 'password updated successfully.' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while updating the password.',
            err: err.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        return res.status(OK).json(user);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while fetching the current user',
            err: err.message,
        });
    }
};

const updateAccountDetails = async (req, res) => {
    try {
        //only allowing email and fullname to update  ( images or any file updates are better to handle in separate controllers )
        const { fullname, email, password } = req.body; //we are taking password to confirm the user
        // check for empty fields
        if (!fullname || !email || !password)
            return res.status(BAD_REQUEST).json({ message: 'MISSING_FIELDS' });

        if (!validator.isEmail(email)) {
            return res.status(BAD_REQUEST).json({ message: 'INVALID_EMAIL' });
        }

        const user = await User.findById(req.user._id);
        //check validity of password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(BAD_REQUEST).json({ message: 'WRONG_PASSWORD' });

        user.fullname = fullname.trim().toLowerCase();
        user.email = email.trim().toLowerCase();
        await user.save({ validateBeforeSave: false });
        const updatedUser = await User.findById(req.user._id).select(
            '-password -refreshToken -watchHistory'
        );

        //cant use this becuase it auto save the doc but we need to check for password
        // const user = await User.findByIdAndUpdate(
        //     req.user?._id,
        //     {
        //         $set:
        //         {
        //             fullname: fullname.trim().toLowerCase(),  // pre hook wont be applied becuase we have said validateBeforeSave:false
        //             email: email.trim().toLowerCase()
        //         }
        //     },
        //     { new:true }  //it just returns the new doc else previous doc will be returned
        //     //but findByIdAndUpdate() auto save the doc wihtout any .save() and 'new'
        // ).select( "-password -refreshToken -watchHistory") //can't use because then compare mein user.password kaam nhi krega

        return res.status(OK).json(updatedUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while updating account details.',
            err: err.message,
        });
    }
};

const updateChannelInfo = async (req, res) => {
    try {
        const { username, description, password } = req.body; //we are taking password to confirm the user
        // check for empty fields
        if (!username || !description || !password)
            return res.status(BAD_REQUEST).json({ message: 'MISSING_FIELDS' });

        const user = await User.findById(req.user._id);
        //check validity of password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(BAD_REQUEST).json({ message: 'WRONG_PASSWORD' });

        user.username = username.trim().toLowerCase();
        user.description = description;
        await user.save({ validateBeforeSave: false });
        const updatedUser = await User.findById(req.user._id).select(
            '-password -refreshToken -watchHistory'
        );

        return res.status(OK).json(updatedUser);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while updating account details.',
            err: err.message,
        });
    }
};

const updateCoverImage = async (req, res) => {
    try {
        // console.log(req.file);
        if (!req.file)
            return res.status(BAD_REQUEST).json({ message: 'FILE_MISSING' }); //now it is working after adding try catch in the multer middleware see in users.js
        const coverImageLocalPath = req.file.path;
        if (!coverImageLocalPath)
            return res.status(SERVER_ERROR).json({ message: 'MULTER_ISSUE' });

        const updatedCoverImage = await uploadOnCloudinary(coverImageLocalPath);
        if (!updatedCoverImage)
            return res
                .stauts(SERVER_ERROR)
                .json({ message: 'COVERIMAGE_UPDATE_ISSUE' });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: { coverImage: updatedCoverImage.url },
            },
            { new: true }
        ).select('-password -refreshToken -watchHistory');

        //delete old file from cloudinary
        const deletedCoverImage = await deleteFromCloudinary(
            req.user.coverImage
        );
        if (deletedCoverImage.result !== 'ok')
            return res
                .status(SERVER_ERROR)
                .json({ message: 'COVERIMAGE_DELETION_ISSUE' });

        return res.status(OK).json(user);
    } catch (err) {
        res.stauts(SERVER_ERROR).json({
            message: 'something went wrong while updating cover image.',
            err: err.message,
        });
    }
};

const updateAvatar = async (req, res) => {
    try {
        // console.log(req.file);
        if (!req.file)
            return res.status(BAD_REQUEST).json({ message: 'AVATAR_MISSING' }); //now it is working after adding try catch in the multer middleware see in users.js
        const avatarLocalPath = req.file.path;
        if (!avatarLocalPath)
            return res.status(SERVER_ERROR).json({ message: 'MULTER_ISSUE' });

        const updatedAvatar = await uploadOnCloudinary(avatarLocalPath);
        if (!updatedAvatar)
            return res
                .stauts(SERVER_ERROR)
                .json({ message: 'AVATAR_UPDATE_ISSUE' });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: { avatar: updatedAvatar.url },
            },
            { new: true }
        ).select('-password -refreshToken -watchHistory');

        //delete old file from cloudinary
        const deletedAvatar = await deleteFromCloudinary(req.user.avatar);
        if (deletedAvatar.result !== 'ok')
            return res
                .status(SERVER_ERROR)
                .json({ message: 'AVATAR_DELETION_ISSUE' });

        return res.status(OK).json(user);
    } catch (err) {
        res.status(SERVER_ERROR).json({
            message: 'something went wrong while updating avatar.',
            err: err.message,
        });
    }
};

const getChannelProfile = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username?.trim())
            return res
                .status(BAD_REQUEST)
                .json({ message: 'MISSING_USERNAME' });

        //setting the pipelines
        const channel = await User.aggregate([
            //stage 1 ===> finding the required user specified by url params
            {
                $match: { username: username.trim().toLowerCase() },
            },
            //stage2 ===> adding the followers field to it
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: '_id',
                    foreignField: 'channel',
                    as: 'subscribers', //array of objects
                },
            },
            //stage3 ===> finding the channels this user has subscribed
            {
                $lookup: {
                    from: 'subscriptions',
                    localField: '_id',
                    foreignField: 'subscriber',
                    as: 'subscribedTo', //array of objects
                },
            },
            //stage4 ==> total no. of videos
            {
                $lookup: {
                    from: 'videos',
                    localField: '_id',
                    foreignField: 'owner',
                    as: 'videosCount',
                    pipeline: [
                        {
                            $match: { isPublished: true },
                        },
                    ],
                },
            },
            //stage5 ==> adding the count fields
            {
                $addFields: {
                    subscribersCount: { $size: '$subscribers' },
                    subscribedToCount: { $size: '$subscribedTo' },
                    //boolean(whether to show subscribe button or subscribed)
                    isSubscribed: {
                        $cond: {
                            if: { $ifNull: [req.user, false] },
                            then: {
                                $cond: {
                                    if: {
                                        $in: [
                                            req.user?._id,
                                            '$subscribers.subscriber',
                                        ],
                                    }, // the subscriber is nothing but the id as its value so these are direclty getting matched here
                                    then: true,
                                    else: false,
                                },
                            },
                            else: false,
                        },
                    },
                    videosCount: { $size: '$videosCount' },
                },
            },
            //stage6 ==> we want to send selected fields in return to the const channel
            {
                $project: {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                    coverImage: 1,
                    subscribedToCount: 1,
                    subscribersCount: 1,
                    isSubscribed: 1,
                    videosCount: 1,
                    description: 1,
                },
            },
        ]);

        //we will get the array of all the matched users(objects/docs) but here in this case it will be only one since unique username
        //console.log(channel);

        if (!channel?.length)
            return res.status(NOT_FOUND).json({ message: 'CHANNEL_NOT_FOUND' });

        return res.status(OK).json(channel[0]);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while getting the channel profile',
            err: err.message,
        });
    }
};

const getwatchhistory = async (req, res) => {
    const { page = 1, limit = 10, term = '' } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const startIndex = (pageNumber - 1) * limit;
    const endIndex = pageNumber * limit;

    try {
        const userForTotalHistory = await User.findById(req.user._id); //⭐it will always have constant no. (totalvideos in the history) we use this to see if we dont have any history at all
        const overallHistoryCount = userForTotalHistory.watchHistory.length;

        // Step:1 Count total videos in the watch history based on search term
        const querySpecificTotalVideosCountPipeline = [
            {
                $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'watchHistory',
                    foreignField: '_id',
                    as: 'watchHistory',
                },
            },
            { $unwind: '$watchHistory' },
            ...(term
                ? [
                      {
                          $match: {
                              $or: [
                                  {
                                      'watchHistory.title': {
                                          $regex: term,
                                          $options: 'i',
                                      },
                                  },
                                  {
                                      'watchHistory.description': {
                                          $regex: term,
                                          $options: 'i',
                                      },
                                  },
                              ],
                          },
                      },
                  ]
                : []),
            { $count: 'totalVideos' },
        ];

        const userHistoryVideoCount = await User.aggregate(
            querySpecificTotalVideosCountPipeline
        );

        const totalVideos = userHistoryVideoCount[0]?.totalVideos || 0;
        const totalPages = Math.ceil(totalVideos / limitNumber); // will round off to nearest integer
        const hasNextPage = pageNumber < totalPages;
        const hasPreviousPage = pageNumber > 1;

        //pipelines
        const user = await User.aggregate([
            /*pipeline*/
            //stage
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id), //because these are mongodb oprs so no auto conversion by mongoose
                },
            },
            //stage
            {
                $lookup: {
                    // will return the user populated with watchHistory array having all detailed video objects
                    from: 'videos',
                    localField: 'watchHistory',
                    foreignField: '_id',
                    as: 'watchHistory', //overwrite
                    //sub-pipeline, we can use sub-pipeline option for every lookup
                    pipeline: [
                        //it will populate the owner field and return the video details
                        //sub-stage
                        {
                            $match: term
                                ? {
                                      $or: [
                                          {
                                              title: {
                                                  $regex: term,
                                                  $options: 'i',
                                              },
                                          },
                                          {
                                              description: {
                                                  $regex: term,
                                                  $options: 'i',
                                              },
                                          },
                                      ],
                                  }
                                : {},
                        },
                        {
                            $lookup: {
                                //this will populate the owner field but will be an array having one object[0] but we dont to use[0] so we can use addfields to overwrite
                                from: 'users',
                                localField: 'owner',
                                foreignField: '_id',
                                as: 'owner',
                                //sub-pipeline
                                pipeline: [
                                    // so jb ye lookup owner field mein data paste krega toh partial hi krega becuase we don't need everything about the user
                                    //sub-stage
                                    {
                                        $project: {
                                            fullname: 1,
                                            username: 1,
                                            avatar: 1,
                                        },
                                    },
                                ], //overwrite
                            },
                        }, // can add more sub pipelines here now to specify the str of the video owner output becuase right now the pipeline was about to populate the owner field as array where[0] has the object having firstname and stuff.....
                        {
                            $addFields: {
                                owner: {
                                    //overwrite******
                                    $first: '$owner', // other syntax $arrayElemAt: [" $owner ",0]
                                },
                                views: {
                                    $size: '$views',
                                },
                            },
                        },
                        {
                            $sort: {
                                createdAt: -1, // Sort before skip and limit
                            },
                        },
                        {
                            $skip: startIndex,
                        },
                        {
                            $limit: limitNumber,
                        },
                    ],
                },
            },
        ]);

        const result = {
            info: {
                overallHistoryCount,
                totalVideos,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            },
            historyVideos: user[0].watchHistory || [],
        };

        return res.status(OK).json(result);
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message: 'something bad happened while getting the watch history',
            err: err.message,
        });
    }
};

const clearWatchHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.watchHistory = [];
        await user.save({ validateBeforeSave: false });
        return res.status(OK).json({ message: 'HISTORY_CLEARED_SUCCESSFULLY' });
    } catch (err) {
        return res.status(SERVER_ERROR).json({
            message:
                'something bad happened while clearing out the watch history',
            err: err.message,
        });
    }
};

export {
    register,
    login,
    logout,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateChannelInfo,
    updateCoverImage,
    updateAvatar,
    getChannelProfile,
    getwatchhistory,
    clearWatchHistory,
};
