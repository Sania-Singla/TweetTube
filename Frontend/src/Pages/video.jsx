import { useNavigate, useParams } from 'react-router-dom';
import videoServices from '../DBservices/videoServices';
import channelServices from '../DBservices/channelServices';
import { useState, useEffect, useRef } from 'react';
import {
    LoginPopup,
    PlaylistPopup,
    VideoPlayer,
    SideVideos,
    Comments,
    PulseVideoPage,
} from '../components';
import { useAuthHook } from '../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faSolidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faRegularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown as faSolidThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown as faRegularThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { icons } from '../assets/icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

function VideoPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [subscribedStatus, setSubscribedStatus] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [likedStatus, setLikedStatus] = useState(false);
    const [disLikedStatus, setDisLikedStatus] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const { videoId } = useParams();
    const { userData } = useAuthHook();
    const navigate = useNavigate();
    const [loginPopup, setLoginPopup] = useState(false);
    const [loginPopupText, setLoginPopupText] = useState('');
    const [playlistPopup, setPlaylistPopup] = useState(false);
    const loginRef = useRef();
    const playlistRef = useRef();
    const [expandDescription, setExpandDescription] = useState(false);
    const bigParentRef = useRef();
    const commentRef = useRef();
    const [expandComments, setExpandComments] = useState(false);

    useEffect(() => {
        setPlaylistPopup(false);
        setLoading(true);
        videoServices.getVideoById(videoId).then((res) => {
            if (
                res.message === 'INVALID_VIDEO_ID' ||
                res.message === 'VIDEO_NOT_FOUND'
            ) {
                navigate('/not-found');
                setLoading(false);
            } else {
                setData(res);
                setSubscribedStatus(res.owner.isSubscribed);
                setSubscribersCount(res.owner.subscribersCount);
                setLikedStatus(res.hasLiked);
                setDisLikedStatus(res.hasDisliked);
                setLikesCount(res.likes);
                setDislikesCount(res.dislikes);
                setLoading(false);
            }
        });
    }, [videoId, userData]);

    function toggleSubscribe() {
        channelServices.toggleSubscribe(data.owner._id).then((res) => {
            setSubscribedStatus((prev) => {
                if (prev) {
                    setSubscribersCount((prevCount) => prevCount - 1);
                    return false;
                } else {
                    setSubscribersCount((prevCount) => prevCount + 1);
                    return true;
                }
            });
        });
    }

    async function toggleLike(toggleStatus) {
        const res = await videoServices.toggelVideoLike(data._id, toggleStatus);
        if (res) {
            if (toggleStatus) {
                setLikedStatus((prev) => {
                    if (prev) {
                        setLikesCount((prevCount) => prevCount - 1);
                        return false;
                    } else {
                        setLikesCount((prevCount) => prevCount + 1);
                        return true;
                    }
                });
                setDisLikedStatus((prev) => {
                    if (prev) {
                        setDislikesCount((prevCount) => prevCount - 1);
                        return false;
                    } else return false;
                });
            } else {
                setLikedStatus((prev) => {
                    if (prev) {
                        setLikesCount((prevCount) => prevCount - 1);
                        return false;
                    } else return false;
                });
                setDisLikedStatus((prev) => {
                    if (prev) {
                        setDislikesCount((prevCount) => prevCount - 1);
                        return false;
                    } else {
                        setDislikesCount((prevCount) => prevCount + 1);
                        return true;
                    }
                });
            }
        }
    }

    function handleLikeClick() {
        if (userData) return toggleLike(true);
        return setLoginPopup(true);
    }

    function handleDislikeClick() {
        if (userData) return toggleLike(false);
        return setLoginPopup(true);
    }

    function closeLoginPopup(e) {
        if (loginRef.current === e.target) setLoginPopup(false);
    }

    function closePlaylistPopup(e) {
        if (playlistRef.current === e.target) setPlaylistPopup(false);
    }

    function handleDescrClick(e) {
        //if(bigParentRef.current !== e.target)//this wont work because click on any child would execute it
        if (!bigParentRef.current.contains(e.target))
            setExpandDescription(false);
    }

    function handleCommentExpandClick(e) {
        if (!commentRef.current.contains(e.target)) setExpandComments(false);
    }

    return (
        <div
            onClick={(e) => {
                handleDescrClick(e);
                handleCommentExpandClick(e);
            }}
            className="absolute p-4 left-0 w-full z-[135] top-[80px] min-h-[calc(100vh-80px)] bg-[#0c0c0c]"
        >
            {loading && ( //pulses
                <PulseVideoPage />
            )}
            {!loading && (
                <div className="flex flex-col lg:flex-row items-start justify-center gap-6 w-full">
                    {' '}
                    {/*full screen*/}
                    <div className="flex flex-col items-center justify-center w-full lg:w-[80%]">
                        <div className="max-w-[900px] lg:max-w-full border-[0.01rem] border-[#252525] rounded-xl overflow-hidden">
                            <VideoPlayer videoFile={data?.videoFile} />
                        </div>

                        <div
                            onClick={() => setExpandDescription(true)}
                            ref={bigParentRef}
                            className="border-[0.01rem] border-[#b5b4b4] bg-[#0c0c0c] rounded-lg cursor-pointer p-4 w-full mt-2 hover:bg-[#191919]"
                        >
                            <div className="flex">
                                {/* title */}
                                <div className="flex flex-col items-start justify-center w-full">
                                    <div className="w-full line-clamp-2 text-[1.3rem] leading-6 font-medium">
                                        {data.title}
                                    </div>
                                    <div className="w-full mt-1 text-gray-400 text-[0.9rem]">
                                        {data.views} views &bull;{' '}
                                        {formatDistanceToNow(
                                            parseISO(data.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </div>
                                </div>

                                <div className="hidden md:flex items-start justify-between gap-4">
                                    {/* like/dislike btn */}
                                    <div className="ml-6">
                                        {userData ? (
                                            userData?.username !==
                                                data.owner.username && (
                                                <div className="flex items-center justify-center rounded-lg bg-[#212121] w-fit h-fit overflow-hidden border-[0.01rem] border-[#b5b4b4]">
                                                    <div
                                                        onClick={
                                                            handleLikeClick
                                                        }
                                                        className="cursor-pointer flex items-center justify-center border-r-[0.01rem] border-[#b5b4b4] hover:bg-[#3f3f3f] px-[5px] py-[6px]"
                                                    >
                                                        <button className="ml-2">
                                                            <FontAwesomeIcon
                                                                size="lg"
                                                                icon={
                                                                    likedStatus
                                                                        ? faSolidThumbsUp
                                                                        : faRegularThumbsUp
                                                                }
                                                                color={'white'}
                                                            />
                                                        </button>
                                                        <p className="mx-[8px]">
                                                            {likesCount}
                                                        </p>
                                                    </div>

                                                    <div
                                                        onClick={
                                                            handleDislikeClick
                                                        }
                                                        className="cursor-pointer flex items-center justify-center px-[5px] py-[6px] hover:bg-[#3f3f3f]"
                                                    >
                                                        <button className="transform -scale-x-100 ml-2">
                                                            <FontAwesomeIcon
                                                                size="lg"
                                                                icon={
                                                                    disLikedStatus
                                                                        ? faSolidThumbsDown
                                                                        : faRegularThumbsDown
                                                                }
                                                                color={'white'}
                                                            />
                                                        </button>
                                                        <p className="mx-[8px]">
                                                            {dislikesCount}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex items-center justify-center rounded-lg bg-[#212121] w-fit overflow-hidden border-[0.01rem] border-[#b5b4b4]">
                                                <div
                                                    onClick={() => {
                                                        setLoginPopupText(
                                                            'Like Video'
                                                        );
                                                        setLoginPopup(true);
                                                    }}
                                                    className="cursor-pointer flex items-center justify-center border-r-[0.01rem] border-[#b5b4b4] hover:bg-[#3f3f3f] px-[5px] py-[6px]"
                                                >
                                                    <button className="ml-2">
                                                        <FontAwesomeIcon
                                                            size="lg"
                                                            icon={
                                                                likedStatus
                                                                    ? faSolidThumbsUp
                                                                    : faRegularThumbsUp
                                                            }
                                                            color={'white'}
                                                        />
                                                    </button>
                                                    <p className="mx-[8px]">
                                                        {likesCount}
                                                    </p>
                                                </div>

                                                <div
                                                    onClick={() => {
                                                        setLoginPopupText(
                                                            'Dislike Video'
                                                        );
                                                        setLoginPopup(true);
                                                    }}
                                                    className="cursor-pointer flex items-center justify-center px-[5px] py-[6px] hover:bg-[#3f3f3f]"
                                                >
                                                    <button className="transform -scale-x-100 ml-2">
                                                        <FontAwesomeIcon
                                                            size="lg"
                                                            icon={
                                                                disLikedStatus
                                                                    ? faSolidThumbsDown
                                                                    : faRegularThumbsDown
                                                            }
                                                            color={'white'}
                                                        />
                                                    </button>
                                                    <p className="mx-[8px]">
                                                        {dislikesCount}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* playlist btn */}
                                    <div className="relative min-w-[90px]">
                                        {userData ? (
                                            <div className="border-[0.01rem] border-[#b5b4b4] rounded-lg overflow-hidden">
                                                <div
                                                    onClick={() =>
                                                        setPlaylistPopup(true)
                                                    }
                                                    className="cursor-pointer w-fit p-[5px] px-3 bg-[#212121] hover:bg-[#3f3f3f]"
                                                >
                                                    <button className="size-[27px] fill-[#f1f1f1] w-full rounded-lg flex items-center justify-center">
                                                        {icons.save}{' '}
                                                        <span className="text-lg pb-[3px] ml-1">
                                                            save
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border-[0.01rem] border-[#b5b4b4] rounded-lg overflow-hidden">
                                                <div
                                                    onClick={() => {
                                                        setLoginPopupText(
                                                            'Save'
                                                        );
                                                        setLoginPopup(true);
                                                    }}
                                                    className="cursor-pointer w-fit p-[5px] px-3 bg-[#212121] hover:bg-[#3f3f3f]"
                                                >
                                                    <button className="size-[27px] fill-[#f1f1f1] w-full rounded-lg flex items-center justify-center">
                                                        {icons.save}{' '}
                                                        <span className="text-lg pb-[3px] ml-1">
                                                            save
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {/* playlist popup */}
                                        {playlistPopup && (
                                            <div
                                                ref={playlistRef}
                                                onClick={closePlaylistPopup}
                                                className="absolute z-[150] right-0"
                                            >
                                                <PlaylistPopup
                                                    close={() =>
                                                        setPlaylistPopup(false)
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* channel info */}
                            <div className="flex flex-col-reverse items-start justify-start w-full mt-4">
                                <div className="flex items-center justify-between w-full mt-6 md:mt-3">
                                    <div
                                        className="flex items-center justify-start"
                                        onClick={() =>
                                            navigate(
                                                `/channel/${data.owner.username}`
                                            )
                                        }
                                    >
                                        <div className="">
                                            <div className="size-[55px] rounded-full overflow-hidden">
                                                <img
                                                    src={data.owner.avatar}
                                                    alt={data.owner.fullname}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start justify-start ml-4 leading-7">
                                            <span className="text-[1.4rem]">
                                                {data.owner.fullname}
                                            </span>
                                            <span className="text-[1rem] text-[#b7b7b7]">
                                                {subscribersCount} subscribers
                                            </span>
                                        </div>
                                    </div>

                                    {/* subscribe/edit btn */}
                                    <div className="text-[1.2rem]">
                                        {userData ? (
                                            userData.username !==
                                            data.owner.username ? (
                                                subscribedStatus ? (
                                                    <button
                                                        className="bg-[#d6d5d5] w-[110px] text-[#0c0c0c] px-1 py-1 font-semibold border-[0.01rem] border-[#b5b4b4] active:border-white"
                                                        onClick={
                                                            toggleSubscribe
                                                        }
                                                    >
                                                        Subscribed
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="bg-[#8871ee] w-[110px] text-[#0c0c0c] px-1 py-1 font-semibold border-[0.01rem] border-[#b5b4b4] active:border-white"
                                                        onClick={
                                                            toggleSubscribe
                                                        }
                                                    >
                                                        Subscribe
                                                    </button>
                                                )
                                            ) : (
                                                //edit btn
                                                <button
                                                    className="bg-[#8871ee] w-[90px] text-[#0c0c0c] py-[3px] text-lg border-[0.01rem] border-[#b5b4b4] active:border-white"
                                                    onClick={() =>
                                                        navigate('/settings')
                                                    }
                                                >
                                                    <i className="fa-solid fa-user-pen text-xl"></i>
                                                    <span className="font-semibold  ml-[6px]">
                                                        Edit
                                                    </span>
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                className="bg-[#8871ee] w-[110px] text-[#0c0c0c] px-1 py-1 font-semibold border-[0.01rem] border-[#b5b4b4] active:border-white"
                                                onClick={() => {
                                                    setLoginPopupText(
                                                        'Subscribe'
                                                    );
                                                    setLoginPopup(true);
                                                    //do something that the task user executed before the popup appears should be also done after he successfully logged in ⭐
                                                }}
                                            >
                                                Subscribe
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* like and save btn for smaller screens */}
                                <div className="md:hidden flex items-center justify-between w-full">
                                    {/* like/dislike btn */}
                                    <div>
                                        {userData ? (
                                            userData?.username !==
                                                data.owner.username && (
                                                <div className="flex items-center justify-center rounded-lg bg-[#212121] w-fit h-fit overflow-hidden border-[0.01rem] border-[#b5b4b4]">
                                                    <div
                                                        onClick={
                                                            handleLikeClick
                                                        }
                                                        className="cursor-pointer flex items-center justify-center border-r-[0.01rem] border-[#b5b4b4] hover:bg-[#3f3f3f] px-[5px] py-[6px]"
                                                    >
                                                        <button className="ml-2">
                                                            <FontAwesomeIcon
                                                                size="lg"
                                                                icon={
                                                                    likedStatus
                                                                        ? faSolidThumbsUp
                                                                        : faRegularThumbsUp
                                                                }
                                                                color={'white'}
                                                            />
                                                        </button>
                                                        <p className="mx-[8px]">
                                                            {likesCount}
                                                        </p>
                                                    </div>

                                                    <div
                                                        onClick={
                                                            handleDislikeClick
                                                        }
                                                        className="cursor-pointer flex items-center justify-center px-[5px] py-[6px] hover:bg-[#3f3f3f]"
                                                    >
                                                        <button className="transform -scale-x-100 ml-2">
                                                            <FontAwesomeIcon
                                                                size="lg"
                                                                icon={
                                                                    disLikedStatus
                                                                        ? faSolidThumbsDown
                                                                        : faRegularThumbsDown
                                                                }
                                                                color={'white'}
                                                            />
                                                        </button>
                                                        <p className="mx-[8px]">
                                                            {dislikesCount}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex items-center justify-center rounded-lg bg-[#212121] w-fit overflow-hidden border-[0.01rem] border-[#b5b4b4]">
                                                <div
                                                    onClick={() => {
                                                        setLoginPopupText(
                                                            'Like Video'
                                                        );
                                                        setLoginPopup(true);
                                                    }}
                                                    className="cursor-pointer flex items-center justify-center border-r-[0.01rem] border-[#b5b4b4] hover:bg-[#3f3f3f] px-[5px] py-[6px]"
                                                >
                                                    <button className="ml-2">
                                                        <FontAwesomeIcon
                                                            size="lg"
                                                            icon={
                                                                likedStatus
                                                                    ? faSolidThumbsUp
                                                                    : faRegularThumbsUp
                                                            }
                                                            color={'white'}
                                                        />
                                                    </button>
                                                    <p className="mx-[8px]">
                                                        {likesCount}
                                                    </p>
                                                </div>

                                                <div
                                                    onClick={() => {
                                                        setLoginPopupText(
                                                            'Dislike Video'
                                                        );
                                                        setLoginPopup(true);
                                                    }}
                                                    className="cursor-pointer flex items-center justify-center px-[5px] py-[6px] hover:bg-[#3f3f3f]"
                                                >
                                                    <button className="transform -scale-x-100 ml-2">
                                                        <FontAwesomeIcon
                                                            size="lg"
                                                            icon={
                                                                disLikedStatus
                                                                    ? faSolidThumbsDown
                                                                    : faRegularThumbsDown
                                                            }
                                                            color={'white'}
                                                        />
                                                    </button>
                                                    <p className="mx-[8px]">
                                                        {dislikesCount}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* playlist btn */}
                                    <div className="relative">
                                        {userData ? (
                                            <div className="border-[0.01rem] border-[#b5b4b4] rounded-lg overflow-hidden">
                                                <div
                                                    onClick={() =>
                                                        setPlaylistPopup(true)
                                                    }
                                                    className="cursor-pointer w-fit py-[5px] px-3 bg-[#212121] hover:bg-[#3f3f3f]"
                                                >
                                                    <button className="size-[27px] fill-[#f1f1f1] w-full rounded-lg flex items-center justify-center">
                                                        {icons.save}{' '}
                                                        <span className="text-lg pb-[3px] ml-1">
                                                            save
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border-[0.01rem] border-[#b5b4b4] rounded-lg overflow-hidden">
                                                <div
                                                    onClick={() => {
                                                        setLoginPopupText(
                                                            'Save'
                                                        );
                                                        setLoginPopup(true);
                                                    }}
                                                    className="cursor-pointer w-fit py-[5px] px-3 bg-[#212121] hover:bg-[#3f3f3f]"
                                                >
                                                    <button className="size-[27px] fill-[#f1f1f1] w-full rounded-lg flex items-center justify-center">
                                                        {icons.save}{' '}
                                                        <span className="text-lg pb-[3px] ml-1">
                                                            save
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {/* playlist popup */}
                                        {playlistPopup && (
                                            <div
                                                ref={playlistRef}
                                                onClick={closePlaylistPopup}
                                                className="absolute z-[150] right-0"
                                            >
                                                <PlaylistPopup
                                                    close={() =>
                                                        setPlaylistPopup(false)
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <motion.hr
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.4 }}
                                className="mt-4"
                            />

                            <div
                                className={`mt-3 text-[0.9rem] w-full break-words ${expandDescription ? 'line-clamp-none' : 'line-clamp-1'}`}
                            >
                                <span>{data.description}</span>
                            </div>
                        </div>

                        {/* comment section */}
                        <div
                            onClick={() => setExpandComments(true)}
                            ref={commentRef}
                            className="cursor-pointer p-4 text-white w-full bg-[#0c0c0c] mt-4 border-[0.01rem] border-[#b5b4b4] rounded-lg"
                        >
                            <Comments expandComments={expandComments} />
                        </div>
                    </div>
                    {/* login popup */}
                    {loginPopup && (
                        <div
                            ref={loginRef}
                            onClick={closeLoginPopup}
                            className="fixed inset-0 backdrop-blur-sm z-[150] flex flex-col items-center justify-center"
                        >
                            <LoginPopup
                                close={() => setLoginPopup(false)}
                                popupText={loginPopupText}
                            />
                        </div>
                    )}
                    {/* side recemondations */}
                    <div className="lg:w-[35%] h-full w-full">
                        <SideVideos />
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideoPage;
