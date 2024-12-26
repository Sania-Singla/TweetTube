import { useEffect, useState, useCallback, useRef } from 'react';
import { channelServices } from '../../DBservices';
import { ChannelVideoCard, PulseVideoCard } from '../index';
import { useChannelHook } from '../../hooks';

export default function ChannelVideos() {
    const [loading, setLoading] = useState(true);
    const [videosFound, setVideosFound] = useState(true);
    const [videoInfo, setVideoInfo] = useState({});
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);

    const channelData = useChannelHook();

    useEffect(() => {
        if (page === 1 || videos.length !== videoInfo.totalVideos) {
            setLoading(true);
            channelServices
                .getUserVideos(
                    setVideoInfo,
                    videos,
                    setVideos,
                    setLoading,
                    channelData._id,
                    page,
                    10
                )
                .then((videos) => {
                    if (videos && videos.length > 0) {
                        setVideosFound(true);
                    } else setVideosFound(false);
                });
        }
    }, [page, channelData]);

    const observer = useRef();
    const callbackRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                const lastVideo = entries[0];
                if (lastVideo.isIntersecting && videoInfo?.hasNextPage)
                    setPage((prev) => prev + 1);
            });
            if (node) observer.current.observe(node);
        },
        [videoInfo?.hasNextPage]
    );

    const videoElements = videos?.map((video, index) => {
        if (videos.length === index + 1) {
            return (
                <ChannelVideoCard
                    key={video._id}
                    video={video}
                    reference={callbackRef}
                />
            );
        } else {
            return <ChannelVideoCard key={video._id} video={video} />;
        }
    });

    //pulses
    const pulseEffect = [
        <PulseVideoCard key={1} />,
        <PulseVideoCard key={2} />,
        <PulseVideoCard key={3} />,
        <PulseVideoCard key={4} />,
        <PulseVideoCard key={5} />,
        <PulseVideoCard key={6} />,
    ];

    if (!videosFound) return <div>no videos found !</div>;
    else
        return (
            <div className="pt-[8px]">
                {
                    //because 1 or 2 videos were as grid auto-fit do is that evenly spearding (if only video was covering whole screen so we needed to restrict the col width)
                    videos.length > 1 ? ( //agr 0 hai toh toh vo idhr ayega hi nhi (returned no videos found !)
                        videos.length > 2 ? (
                            <div className="grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4">
                                {videoElements}
                            </div> //so means equal to 2
                        ) : (
                            <div className="grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4 xl:grid-cols-[repeat(3,minmax(320px,1fr))]">
                                {videoElements}
                            </div>
                        )
                    ) : (
                        //means allVideos.length === 1
                        <div className="grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4 md:grid-cols-[repeat(3,minmax(350px,1fr))]">
                            {videoElements}
                        </div>
                    )
                }

                {loading && page === 1 && (
                    <div className="grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-x-4">
                        {pulseEffect}
                    </div>
                )}

                {loading && page !== 1 && (
                    <div className="flex items-center justify-center my-2">
                        <svg
                            aria-hidden="true"
                            className="inline w-7 h-7 animate-spin dark:text-[#b5b4b4] fill-[#8871ee]"
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
}
