import { useCallback, useEffect, useRef, useState } from 'react';
import { icons } from '../assets/icons';
import { adminServices } from '../DBservices';
import { useAuthHook } from '../hooks';
import { format } from 'date-fns';
import {
    DeleteVideoPopup,
    UploadVideoPopup,
    UploadingVideoPopup,
    VideoUploadedPopup,
    VideoUpdatedPopup,
    VideoUpdatingPopup,
    EditVideoPopup,
    PulseAdminPage,
} from '../components';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
    const [stats, setStats] = useState({});
    const [search, setSearch] = useState('');
    const [videos, setVideos] = useState([]);
    const [videosInfo, setVideosInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [videosLoading, setVideosLoading] = useState(false);
    const [page, setPage] = useState(1);
    const { userData } = useAuthHook();
    const [uploadVideoPopup, setUploadVideoPopup] = useState(false);
    const [uploadingPopup, setUploadingPopup] = useState(false);
    const [videoUploadedPopup, setVideoUploadedPopup] = useState(false);
    const [videoUpdatingPopup, setVideoUpdatingPopup] = useState(false);
    const [videoUpdatedPopup, setVideoUpdatedPopup] = useState(false);
    const [deleteVideoPopup, setDeleteVideoPopup] = useState(false);
    const [editVideoPopup, setEditVideoPopup] = useState(false);
    const [fileSize, setFileSize] = useState(0);
    const navigate = useNavigate();
    const [controller, setController] = useState(null);

    const [videoForDelete, setVideoForDelete] = useState({
        id: null,
        title: '',
        likes: null,
        views: null,
    });
    const [videoForEdit, setVideoForEdit] = useState({
        id: null,
        title: '',
        description: '',
        thumbnail: null,
    });

    useEffect(() => {
        setLoading(true);
        adminServices.getChannelStats(setStats).then((data) => {
            adminServices
                .getAdminVideos(setVideos, setVideosInfo, 1, 10)
                .then((data) => setLoading(false));
        });
    }, []);

    useEffect(() => {
        if (page > 1 && videos.length !== videosInfo.totalVideos) {
            setVideosLoading(true);
            adminServices
                .getAdminVideos(setVideos, setVideosInfo, page, 10)
                .then((data) => setVideosLoading(false));
        }
    }, [page]);

    const statItems = [
        {
            icon: icons.adminVideos,
            text: 'Total Videos',
            count: stats?.totalVideos,
        },
        {
            icon: icons.adminViews,
            text: 'Total Views',
            count: stats?.totalViews,
        },
        {
            icon: icons.adminSubscribers,
            text: 'Total Subscribers',
            count: stats?.totalSubscribers,
        },
        {
            icon: icons.adminLikes,
            text: 'Total Likes',
            count: stats?.totalLikes,
        },
    ];

    const statElements = statItems?.map((item) => {
        return (
            <div
                key={item.text}
                className="border-[0.1rem] border-[#b5b4b4] p-4 w-full"
            >
                <div className="rounded-full overflow-hidden w-fit size-[35px]">
                    <div className=" size-full stroke-[#8871ee] p-1 fill-none bg-[#E4D3FF]">
                        {item.icon}
                    </div>
                </div>
                <div className="text-[#c4c4c4] text-[1.15rem]  mt-4">
                    {item.text}
                </div>
                <div className="text-white text-[1.65rem] font-medium">
                    {item.count}
                </div>
            </div>
        );
    });

    async function handleTogglePublish(id, status) {
        const res = await adminServices.togglePublish(id, !status);
        if (res) {
            setVideos((prev) =>
                prev.map((video) => {
                    if (video._id === id)
                        return {
                            ...video,
                            isPublished: !status,
                        };
                    else return video;
                })
            );
        }
    }

    function handleDeleteClick(video) {
        setVideoForDelete({
            title: video.title,
            id: video._id,
            views: video.views,
            likes: video.likes,
        });
        setDeleteVideoPopup(true);
    }

    function handleEditClick(video) {
        setVideoForEdit({
            title: video.title,
            id: video._id,
            thumbnail: video.thumbnail,
            description: video.description,
        });
        setEditVideoPopup(true);
    }

    const observer = useRef();
    const callbackRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                const lastVideo = entries[0];
                if (lastVideo.isIntersecting && videosInfo.hasNextPage)
                    setPage((prev) => prev + 1);
            });
            if (node) observer.current.observe(node);
        },
        [videosInfo.hasNextPage]
    );

    const videoElements = videos
        ?.filter((video) => {
            const title = video.title.toLowerCase();
            if (search && title.includes(search.toLowerCase())) return video;
            if (!search) return video;
        })
        .map((video, index) => {
            const date = new Date(video.createdAt);
            const formattedDate = format(date, 'dd/MM/yyyy');
            return (
                <tr
                    key={video._id}
                    ref={videos.length === index + 1 ? callbackRef : null}
                    className="border-b-[0.01rem] border-b-slate-600"
                >
                    <td className="">
                        <div className="flex items-center justify-center">
                            <label
                                htmlFor={video._id}
                                className="relative inline-block w-12 cursor-pointer overflow-hidden"
                            >
                                <input
                                    type="checkbox"
                                    id={video._id}
                                    className="peer sr-only"
                                    checked={video.isPublished}
                                    onChange={() =>
                                        handleTogglePublish(
                                            video._id,
                                            video.isPublished
                                        )
                                    }
                                />
                                <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
                            </label>
                        </div>
                    </td>

                    <td className="text-center px-8">
                        <div className="w-[130px]">
                            {video.isPublished ? (
                                <div className="w-full flex items-center justify-center">
                                    <div className="w-[100px] border-[0.01rem] border-[#008300] text-lg rounded-full px-1 py-[2px] text-[#008300]">
                                        Published
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full flex items-center justify-center">
                                    <div className="w-[130px] border-[0.01rem] border-[#ba0000] rounded-full px-1 py-[2px] text-lg text-[#ba0000]">
                                        Unpublished
                                    </div>
                                </div>
                            )}
                        </div>
                    </td>

                    <td className="py-[13px]">
                        <div
                            onClick={() => navigate(`/video/${video._id}`)}
                            className="flex items-center justify-start w-full cursor-pointer"
                        >
                            <div className="size-[45px] rounded-full overflow-hidden">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="size-full object-cover"
                                />
                            </div>
                            <div className="text-[1.1rem] font-medium ml-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[250px]">
                                {video.title}
                            </div>
                        </div>
                    </td>

                    <td className=" text-center text-[1.1rem]">
                        {formattedDate}
                    </td>
                    <td className=" text-center text-[1.1rem] ">
                        {video.views}
                    </td>
                    <td className=" text-center text-[1.1rem]">
                        {video.comments}
                    </td>

                    <td className="">
                        <div className="flex items-center justify-center">
                            <div className="rounded-[12px] bg-[#d4ffd4] px-2 py-[2px] text-[#196619] text-[1.1rem]">
                                {video.likes} likes
                            </div>
                            <div className="rounded-[12px] bg-[#ffd2d2] px-2 py-[2px] ml-4 text-[#ba2828] text-[1.1rem]">
                                {video.dislikes} dislikes
                            </div>
                        </div>
                    </td>

                    <td className="">
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={(e) => handleDeleteClick(video)}
                                className="size-[27px] fill-none stroke-[#b5b4b4] hover:stroke-[#a40000] "
                            >
                                {icons.dustbin}
                            </button>
                            <button
                                onClick={(e) => handleEditClick(video)}
                                className="size-[25px] fill-none stroke-[#b5b4b4] hover:stroke-[#8871ee]"
                            >
                                {icons.edit}
                            </button>
                        </div>
                    </td>
                </tr>
            );
        });

    return (
        <div
            className={`absolute p-10 left-0 w-full ${uploadVideoPopup || videoUploadedPopup || uploadingPopup || deleteVideoPopup || editVideoPopup || videoUpdatingPopup || videoUpdatedPopup ? '' : 'z-[135]'} top-[80px] min-h-[calc(100vh-80px)] bg-[#0c0c0c]`}
        >
            {loading && (
                <div>
                    <PulseAdminPage />
                </div>
            )}
            {!loading && (
                <div className="w-full">
                    <div className="leading-7 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <div className="text-[1.7rem] font-bold">
                                Welcome Back, {userData?.fullname}
                            </div>
                            <div className="text-[1.05rem] mt-1 text-[#d0d0d0]">
                                Seamless Video Management, Elevated Results.
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={() => setUploadVideoPopup(true)}
                                className="w-full h-full flex items-center justify-center bg-[#8871ee] border-dotted border-[#b5b4b4] border-[0.01rem] text-black p-2 text-[1.15rem] font-semibold"
                            >
                                <div className="size-[22px] fill-none stroke-black mr-2">
                                    {icons.uploadPlus}
                                </div>
                                <div>Upload video</div>
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-7">
                        {statElements}
                    </div>

                    <div className="w-full">
                        <div className="w-full max-w-[600px] h-full flex items-center justify-center relative my-8">
                            <input
                                type="text"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-10 text-[1rem] indent-11 rounded-full bg-transparent text-white  placeholder:text-[1.15rem] placeholder:text-[#b5b4b4] focus:outline-none border-[0.1rem] border-[#b5b4b4] focus:border-[#8871ee]"
                            />
                            <div className="absolute top-0 left-0 flex items-center justify-center w-12 h-full">
                                <div className="text-[1.2rem] text-[#b5b4b4]">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-scroll w-full">
                            <table className=" border-[0.1rem] border-[#b5b4b4] w-full text-nowrap text-[#efefef]">
                                <thead>
                                    <tr className="w-full border-b-[0.1rem] border-[#b5b4b4]">
                                        <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                            Status
                                        </th>
                                        <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                            Status
                                        </th>
                                        <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                            Video
                                        </th>
                                        <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                            Date uploaded
                                        </th>
                                        <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                            Views
                                        </th>
                                        <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                            Comments
                                        </th>
                                        <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                            Ratings
                                        </th>
                                        <th className="text-[1.13rem] font-bold py-[18px] px-6">
                                            Options
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>{videoElements}</tbody>
                            </table>
                            {videosLoading && page > 1 && (
                                <div className="w-full">
                                    <div className="flex items-center justify-center w-full my-2">
                                        <div className="size-5 fill-[#8871ee] dark:text-[#b4b7b7]">
                                            {icons.loading}
                                        </div>
                                        <span className="text-md ml-3">
                                            Please wait . . .
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* popups */}

            {uploadVideoPopup && (
                <div className="fixed overflow-scroll inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-start">
                    <UploadVideoPopup
                        controller={controller}
                        setController={setController}
                        close={() => setUploadVideoPopup(false)}
                        setUploadVideoPopup={setUploadVideoPopup}
                        setFileSize={setFileSize}
                        setUploadingPopup={setUploadingPopup}
                        setVideoUploadedPopup={setVideoUploadedPopup}
                    />
                </div>
            )}

            {uploadingPopup && fileSize && (
                <div className="fixed inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-center">
                    <UploadingVideoPopup
                        controller={controller}
                        setController={setController}
                        fileSize={fileSize.toFixed(2)}
                        close={() => setUploadingPopup(false)}
                    />
                </div>
            )}

            {videoUploadedPopup && fileSize && (
                <div className="fixed inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-center">
                    <VideoUploadedPopup
                        fileSize={fileSize.toFixed(2)}
                        close={() => setVideoUploadedPopup(false)}
                    />
                </div>
            )}

            {deleteVideoPopup && videoForDelete.id && (
                <div className="fixed inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-center">
                    <DeleteVideoPopup
                        close={() => setDeleteVideoPopup(false)}
                        video={videoForDelete}
                    />
                </div>
            )}

            {videoUpdatedPopup && videoForEdit.id && (
                <div className="fixed inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-center">
                    <VideoUpdatedPopup
                        close={() => setVideoUpdatedPopup(false)}
                        video={videoForEdit}
                    />
                </div>
            )}

            {videoUpdatingPopup && videoForEdit.id && (
                <div className="fixed inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-center">
                    <VideoUpdatingPopup
                        close={() => setVideoUpdatingPopup(false)}
                        video={videoForEdit}
                    />
                </div>
            )}

            {editVideoPopup && videoForEdit.id && (
                <div className="fixed overflow-scroll inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-center">
                    <EditVideoPopup
                        close={() => setEditVideoPopup(false)}
                        setEditVideoPopup={setEditVideoPopup}
                        setVideoUpdatingPopup={setVideoUpdatingPopup}
                        setVideoUpdatedPopup={setVideoUpdatedPopup}
                        video={videoForEdit}
                    />
                </div>
            )}
        </div>
    );
}
