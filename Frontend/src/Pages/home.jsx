import { useEffect, useState, useCallback, useRef } from 'react';
import { videoServices } from '../DBservices';
import { RandomVideoCard, PulseRandomVideoCard } from '../components';
import { icons } from '../assets/icons';

export default function HomePage() {
    const [loading, setloading] = useState(false);
    const [page, setPage] = useState(1);
    const [videos, setVideos] = useState([]);
    const [videoInfo, setVideoInfo] = useState({});
    const [videosFound, setVideosFound] = useState(true);

    useEffect(() => {
        setloading(true);
        videoServices
            .getRandomVideos(setVideoInfo, videos, setVideos, page, 10)
            .then((data) => {
                if (data.length > 0) setVideosFound(true);
                else setVideosFound(false);
                setloading(false);
            });
    }, [page]);

    /*const observerCallback = useCallback(entries=>{
        const lastVideo = entries[0];     //because we are observing only one element(node)
        if(lastVideo.isIntersecting && videoInfo.hasNextPage) 
        {
            setPage(prev=>prev+1);
        }
    },[videoInfo.hasNextPage])

    useEffect(()=>{
        const observer = new IntersectionObserver(observerCallback,{ threshold: 1 })  //step:1 create an observer and define its callback function on top of it
        if(lastVideoRef.current) {   //because it was undefined intially
            console.log(lastVideoRef.current);
            observer.observe(lastVideoRef.current);   //now it will execute the callback and get passed as the element of the entries array
            
        }
        // return ()=>{
        //     if(lastVideoRef.current)
        //     {
        //         observer.unobserve(lastVideoRef.current);
        //     }
        // }
    },[observerCallback])*/
    //⭐⭐⭐the problem was that everytime new observer was getting created and then even at last video if go little up and then hit end it shows please wait then no videos(as there are no more videos) but we just dont even want the loading effect when we hit the every end . so we needed to define the observer outside and as a ref so that it can presist its previous value between rerenders.👇

    const observer = useRef(); //undefined initially
    const callbackRef = useCallback(
        (node) => {
            if (loading) return; //because we don't wanna keep sending request while it is already loading
            // console.log("1=",observer.current);
            if (observer.current) observer.current.disconnect(); //stops it from watching previous nodes but doesn't unset it so would console the same thing .
            // console.log("2=",observer.current);
            observer.current = new IntersectionObserver((entries) => {
                const lastVideo = entries[0];
                if (lastVideo.isIntersecting && videoInfo.hasNextPage)
                    setPage((prev) => prev + 1);
            });
            if (node) observer.current.observe(node);
        },
        [videoInfo.hasNextPage]
    );

    const videoElements = videos?.map((video, index) => {
        if (videos.length === index + 1)
            return (
                <RandomVideoCard
                    key={video._id}
                    video={video}
                    reference={callbackRef}
                />
            );
        else return <RandomVideoCard key={video._id} video={video} />;
    });

    const pulseEffect = [];
    for (let i = 0; i < 9; i++) {
        pulseEffect.push(<PulseRandomVideoCard key={i} />);
    }

    if (!videosFound) return <div>no videos found!</div>;
    return (
        <div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-7">
                {videoElements}
            </div>

            {loading && page === 1 && (
                <div className="overflow-hidden grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-x-4 gap-y-7 animate-pulse">
                    {pulseEffect}
                </div>
            )}

            {loading && page > 1 && (
                <div className="flex items-center justify-center my-2 w-full">
                    <div className="size-7 fill-[#8871ee] dark:text-[#b4b7b7]">
                        {icons.loading}
                    </div>
                    <span className="text-xl ml-3">Please wait . . .</span>
                </div>
            )}
        </div>
    );
}
