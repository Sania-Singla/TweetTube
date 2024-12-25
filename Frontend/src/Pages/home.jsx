import { useEffect, useState, useCallback, useRef } from 'react';
import videoServices from '../DBservices/videoServices';
import { RandomVideoCard, PulseRandomVideoCard } from '../components';

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
