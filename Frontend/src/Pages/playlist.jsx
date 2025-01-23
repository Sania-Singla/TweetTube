import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { icons } from '../assets/icons';
import useAuthHook from '../hooks/authHook';
import { formatDuration } from '../utils/formatDuration';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import {
    EditPlaylistPopup,
    DeletePlaylistPopup,
    PulsePlaylistPage,
} from '../components';
import { playlistServices } from '../DBservices';
import toast from 'react-hot-toast';

export default function PlaylistPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [videos, setVideos] = useState([]);
    const [views, setViews] = useState(0);
    const { userData } = useAuthHook();
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [editPlaylistPopup, setEditPlaylistPopup] = useState(false);
    const [deletePlaylistPopup, setDeletePlaylistPopup] = useState(false);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        setLoading(true);
        playlistServices.getPlaylistById(playlistId).then((res) => {
            if (
                res?.message === 'PLAYLIST_NOT_FOUND' ||
                res?.message === 'INVALID_PLAYLISTID'
            ) {
                navigate('/not-found');
                setLoading(false);
            } else {
                setData(res);
                setVideos(res.videos);
                res.videos?.forEach((video) => {
                    setViews((prev) => prev + video.views);
                });
                setLoading(false);
            }
        });
    }, [playlistId, rerender]);

    async function removeVideoFromPlaylist(videoId) {
        const res = await playlistServices.removeVideoFromPlaylist(
            data._id,
            videoId
        );
        if (res && res.message === 'VIDEO_REMOVED_FROM_PLAYLIST_SUCCESSFULLY') {
            // setVideos(prev=>(prev.filter(video=>video._id!==videoId)));
        }
    }

    async function deletePlaylist() {
        const res = await playlistServices.deletePlaylist(data._id);
        if (res && res.message === 'PLAYLIST_DELETED_SUCCESSFULLY') {
            toast.success('Playlist Deleted Successfully');
            navigate('/');
        }
    }

    const videoElements = videos?.map((video) => {
        const {
            _id,
            title,
            thumbnail,
            description,
            duration,
            owner,
            views,
            createdAt,
        } = video;
        const { avatar, fullname, username } = owner;
        const formattedDuration = formatDuration(duration);
        const formattedCreatedAt = formatDistanceToNow(parseISO(createdAt), {
            addSuffix: true,
        });
        return (
            <div
                key={_id}
                onClick={() => navigate(`/video/${_id}`)}
                className="flex flex-col sm:flex-row relative mb-4 hover:bg-[#2121219d] pb-2 sm:pb-0 cursor-pointer border-[0.01rem] border-[#b5b4b4] w-full"
            >
                <div>
                    <div className="relative pt-[57%] sm:pt-[180px] sm:w-[280px]">
                        <div className="absolute inset-0">
                            <img
                                src={thumbnail}
                                alt="thumbnail"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="bg-[#0c0c0c] opacity-90 text-white w-fit px-[6px] rounded-md text-lg sm:text-[0.95rem] absolute bottom-2 right-2">
                            {formattedDuration}
                        </div>
                    </div>
                </div>

                {/* info */}
                <div className="hidden sm:block ml-2 mt-1 pr-10 sm:mt-0 sm:ml-3 max-w-[200px] md:max-w-[50%] lg:max-w-[55%]">
                    <div className="mb-3 text-[1.3rem] font-medium text-white line-clamp-2">
                        {title}
                    </div>

                    <div className="flex items-center mt-[8px] relative">
                        <div>
                            <div className="w-10 h-10 overflow-hidden rounded-full">
                                <Link
                                    to={`/channel/${username}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <img
                                        src={avatar}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>
                        </div>
                        <span className="ml-2 text-xl text-[#f7f7f7]">
                            {fullname}
                        </span>
                    </div>

                    <div className="mt-2 text-[0.9rem] text-[#cccbcb]">
                        {views} views &bull; {formattedCreatedAt}
                    </div>

                    <div className="text-[15.5px] text-[#b0afaf] line-clamp-1 mt-[5px] leading-5">
                        {description}
                    </div>

                    {userData && userData._id === data.createdBy._id && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                removeVideoFromPlaylist(_id);
                            }}
                            className="absolute right-2 top-1 size-[25px] fill-none stroke-[#a40000]"
                        >
                            {icons.delete}
                        </div>
                    )}
                </div>

                {/* info for smaller screens */}
                <div className="ml-2 mt-2 sm:hidden flex items-start">
                    <div>
                        <div className="w-12 h-12 overflow-hidden rounded-full mt-1">
                            <Link
                                to={`/channel/${username}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={avatar}
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        </div>
                    </div>

                    <div className="ml-3 leading-[22px] w-full relative">
                        <div className="text-[1.3rem] font-medium text-white line-clamp-2 w-full pr-10 leading-6">
                            {title}
                        </div>
                        <div className="text-[1.1rem] text-[#b5b4b4] mt-1">
                            {fullname}
                        </div>
                        <div className="text-[0.9rem] text-[#b5b4b4]">
                            {views} views &bull; {formattedCreatedAt}{' '}
                        </div>
                        {userData && userData._id === data.createdBy._id && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeVideoFromPlaylist(_id);
                                }}
                                className="absolute right-2 top-1 size-[25px] fill-none hover:stroke-[#d90303] stroke-[#a40000]"
                            >
                                {icons.delete}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className="">
            {loading && (
                <div>
                    <PulsePlaylistPage />
                </div>
            )}
            {!loading && data.createdAt && (
                <div className="flex flex-col xl:flex-row gap-y-[40px] gap-x-[30px]">
                    <div>
                        <div className="sm:w-[450px]">
                            <div className="w-full leading-6">
                                <div className="w-full pt-[60%] relative">
                                    <div className="">
                                        {videos[0] ? (
                                            <div className="absolute inset-0">
                                                <img
                                                    src={videos[0].thumbnail}
                                                    alt="thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="bg-slate-700 absolute inset-0">
                                                <div className="w-full h-full flex flex-col items-center pt-16 sm:pt-12 ">
                                                    <div className="flex items-center justify-center">
                                                        <i className="fa fa-video-slash text-4xl"></i>
                                                        <span className="text-[1.5rem] ml-2">
                                                            Empty Playlist !
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-2 py-1 min-h-[70px] flex items-start justify-between absolute inset-x-0 bottom-0 border-t-[0.01rem] border-[#b5b4b4] bg-slate-950 bg-opacity-80 backdrop-blur-sm ">
                                        <div className="w-[70%]">
                                            <div className="text-[1.2rem] text-white line-clamp-2">
                                                {data.name}
                                            </div>
                                            <div className="text-[#b5b4b4] text-[0.9rem]">
                                                {views} Views &bull;{' '}
                                                {formatDistanceToNow(
                                                    parseISO(data.createdAt),
                                                    { addSuffix: true }
                                                )}{' '}
                                            </div>
                                        </div>
                                        <div className=" w-[30%] text-end text-[1.1rem]">
                                            {data.totalVideos} Videos
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {userData &&
                                userData._id === data.createdBy._id && (
                                    <div className="w-full flex items-center justify-around px-12 mt-4">
                                        <button
                                            onClick={() =>
                                                setDeletePlaylistPopup(true)
                                            }
                                            className=" w-[110px] py-2 flex items-center justify-center group hover:bg-slate-900 overflow-hidden bg-[#8871ee] rounded-md hover:border-[#b5b4b4] border-dotted border-transparent border-[0.01rem]"
                                        >
                                            <div className="flex items-center justify-center">
                                                <div>
                                                    <div className="group-hover:stroke-[#a40000] stroke-black size-[25px] fill-none">
                                                        {icons.delete}
                                                    </div>
                                                </div>
                                                <div className="group-hover:text-[#a40000] text-black font-semibold text-[1.15rem] ml-2">
                                                    Delete
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() =>
                                                setEditPlaylistPopup(true)
                                            }
                                            className="py-2 w-[110px] flex items-center justify-center group hover:bg-slate-900 overflow-hidden bg-[#8871ee] rounded-md hover:border-[#b5b4b4] border-dotted border-transparent border-[0.01rem]"
                                        >
                                            <div className="flex items-center justify-center">
                                                <div>
                                                    <div className="group-hover:stroke-[#8871ee] stroke-black size-[23px] fill-none">
                                                        {icons.edit}
                                                    </div>
                                                </div>
                                                <div className="group-hover:text-[#8871ee] text-black font-semibold text-[1.15rem] ml-2">
                                                    Edit
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                )}

                            <div className="mt-3">
                                <div className="leading-8 text-[1.5rem] font-medium">
                                    {data.name}
                                </div>
                                <div
                                    onClick={() =>
                                        navigate(
                                            `/channel/${data.createdBy.username}`
                                        )
                                    }
                                    className="cursor-pointer flex items-center justify-start mt-5 w-fit"
                                >
                                    <div>
                                        <div className="size-[50px] overflow-hidden rounded-full">
                                            <img
                                                src={data.createdBy.avatar}
                                                alt={data.createdBy.avatar}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="ml-4 leading-6 pb-[6px]">
                                        <div className="text-[1.3rem] font-medium">
                                            {data.createdBy.fullname}
                                        </div>
                                        <div className="text-[1rem] text-[#b5b4b4]">
                                            {'@' + data.createdBy.username}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[1.1rem] text-[#c5c5c5] mt-3 line-clamp-3">
                                    {data.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        {data.totalVideos ? (
                            videoElements
                        ) : (
                            <div>empty Playlist</div>
                        )}
                    </div>
                </div>
            )}
            {editPlaylistPopup && (
                <div className="fixed overflow-scroll inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-center">
                    <EditPlaylistPopup
                        close={() => setEditPlaylistPopup(false)}
                        playlist={data}
                        setRerender={setRerender}
                    />
                </div>
            )}
            {deletePlaylistPopup && (
                <div className="fixed overflow-scroll inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-center">
                    <DeletePlaylistPopup
                        close={() => setDeletePlaylistPopup(false)}
                        deletePlaylist={deletePlaylist}
                    />
                </div>
            )}
        </div>
    );
}
