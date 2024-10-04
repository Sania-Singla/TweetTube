import { useEffect, useState, useCallback, useRef } from "react";
import channelServices from "../DBservices/channelServices";
import videoServices from "../DBservices/videoServices";
import { VideoList, PulseVideoList } from "../components";
import { useAuthHook } from "../hooks";
import { motion } from "framer-motion";

export default function LikedVideosPage() {
    const { loginStatus } = useAuthHook();
    const [loading, setLoading] = useState(true);
    const [videosFound, setVideosFound] = useState(true);
    const [likedInfo, setLikedInfo] = useState({});
    const [likedVideos, setLikedVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchClick, setSearchClick] = useState(false);

    function handleSearchClick(e) {
        if (e.key === "Enter") {
            setPage(1);
            setLikedVideos([]);
            setSearchClick((prev) => !prev);
        }
        return;
    }

    async function removeFromLikedVideos(id) {
        //call toggle like method
        const res = await videoServices.removeVideoFromLiked(id);
        if (res && res.message === "VIDEO_REMOVED_FROM_LIKED_SUCCESSFULLY") {
        }
    }

    useEffect(() => {
        if (loginStatus) {
            if (!likedInfo.totalVideos || likedVideos.length !== likedInfo.totalVideos) {
                setLoading(true); //because when it rerenders for new page then loading needs to be set as true
                channelServices.getLikedVideos(setLikedVideos, setLoading, setLikedInfo, likedVideos, page, search, 10).then((data) => {
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
                if (lastVideo.isIntersecting && likedInfo.hasNextPage) setPage((prev) => prev + 1);
            });
            if (node) observer.current.observe(node);
        },
        [likedInfo.hasNextPage]
    );

    const videoElements = likedVideos?.map((likeDoc, index) => {
        if (likedVideos.length === index + 1) {
            return <VideoList key={likeDoc._id} video={likeDoc.video} reference={callbackRef} removeFromLikedVideos={removeFromLikedVideos} />;
        } else {
            return <VideoList key={likeDoc._id} video={likeDoc.video} removeFromLikedVideos={removeFromLikedVideos} />;
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
        if (!videosFound) return <div className="text-white">no liked videos</div>;
        else
            return (
                <div>
                    <div className="w-full h-full ">
                        <div className="bg-[#0c0c0c] mb-8 flex items-center justify-center">
                            {" "}
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
                                    animate={{ width: "100%" }}
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
                            <svg
                                aria-hidden="true"
                                class="inline w-7 h-7 animate-spin dark:text-[#b5b4b4] fill-[#8871ee]"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="text-xl ml-3">Please wait . . .</span>
                        </div>
                    )}
                </div>
            );
    } else return <h2 className="text-white">login to get userData</h2>;
}
