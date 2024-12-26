import { useEffect, useState, useCallback, useRef } from 'react';
import { channelServices, videoServices } from '../DBservices';
import { VideoList, PulseVideoList } from '../components';
import { useAuthHook } from '../hooks';
import { motion } from 'framer-motion';
import { icons } from '../assets/icons';

export default function LikedVideosPage() {
    const { loginStatus } = useAuthHook();
    const [loading, setLoading] = useState(true);
    const [videosFound, setVideosFound] = useState(true);
    const [likedInfo, setLikedInfo] = useState({});
    const [likedVideos, setLikedVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchClick, setSearchClick] = useState(false);

    function handleSearchClick(e) {
        if (e.key === 'Enter') {
            setPage(1);
            setLikedVideos([]);
            setSearchClick((prev) => !prev);
        }
        return;
    }

    async function removeFromLikedVideos(id) {
        //call toggle like method
        const res = await videoServices.removeVideoFromLiked(id);
        if (res && res.message === 'VIDEO_REMOVED_FROM_LIKED_SUCCESSFULLY') {
        }
    }

    useEffect(() => {
        if (loginStatus) {
            if (
                !likedInfo.totalVideos ||
                likedVideos.length !== likedInfo.totalVideos
            ) {
                setLoading(true); //because when it rerenders for new page then loading needs to be set as true
                channelServices
                    .getLikedVideos(
                        setLikedVideos,
                        setLoading,
                        setLikedInfo,
                        likedVideos,
                        page,
                        search,
                        10
                    )
                    .then((data) => {
                        if (data.info.overAllLikedVideosCount > 0) {
                            setVideosFound(true);
                        } else setVideosFound(false);
                    });
            } else setLoading(false);
        }
    }, [loginStatus, page, searchClick]);

    const observer = useRef();
    const callbackRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                const lastVideo = entries[0];
                if (lastVideo.isIntersecting && likedInfo.hasNextPage)
                    setPage((prev) => prev + 1);
            });
            if (node) observer.current.observe(node);
        },
        [likedInfo.hasNextPage]
    );

    const videoElements = likedVideos?.map((likeDoc, index) => {
        if (likedVideos.length === index + 1) {
            return (
                <VideoList
                    key={likeDoc._id}
                    video={likeDoc.video}
                    reference={callbackRef}
                    removeFromLikedVideos={removeFromLikedVideos}
                />
            );
        } else {
            return (
                <VideoList
                    key={likeDoc._id}
                    video={likeDoc.video}
                    removeFromLikedVideos={removeFromLikedVideos}
                />
            );
        }
    });

    const pulseEffect = [
        <PulseVideoList key={1} />,
        <PulseVideoList key={2} />,
        <PulseVideoList key={3} />,
        <PulseVideoList key={4} />,
        <PulseVideoList key={5} />,
    ];

    if (loginStatus) {
        if (!videosFound)
            return <div className="text-white">no liked videos</div>;
        else
            return (
                <div>
                    <div className="w-full h-full ">
                        <div className="bg-[#0c0c0c] mb-8 flex items-center justify-center">
                            {' '}
                            {/*sticky top-[calc(80px-0.01rem)] z-[120]*/}
                            <div className="px-2 w-[60%] h-10 flex items-center">
                                <div className="bg-transparent text-[#b5b4b4] h-full flex items-center pt-4 justify-center text-xl mr-3">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                                <motion.input
                                    type="text"
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={handleSearchClick}
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full focus:outline-none placeholder:text-[#b5b4b4] bg-transparent text-[#e6e6e6] text-lg pt-3 indent-1 border-b-[0.01rem] border-[#b5b4b4]"
                                />
                            </div>
                        </div>
                        {videoElements}
                    </div>

                    {loading && page === 1 && <div>{pulseEffect}</div>}

                    {loading && page !== 1 && (
                        <div className="flex items-center justify-center my-2">
                            <div className="size-7 fill-[#8871ee] dark:text-[#b4b7b7]">
                                {icons.loading}
                            </div>
                            <span className="text-xl ml-3">
                                Please wait . . .
                            </span>
                        </div>
                    )}
                </div>
            );
    } else return <h2 className="text-white">login to get userData</h2>;
}
