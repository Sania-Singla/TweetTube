import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

function PlaylistCard({ playlist, reference }) {
    const { _id, name, videos, totalVideos, createdAt, description } = playlist;
    const [views, setViews] = useState(0);
    const lastIndex = videos.length - 1;
    const navigate = useNavigate();
    const formattedCreatedAt = formatDistanceToNow(parseISO(createdAt), {
        addSuffix: true,
    });

    useEffect(() => {
        videos?.forEach((video) => {
            setViews((prev) => prev + video.views);
        });
    }, []);

    return (
        <div
            ref={reference}
            onClick={() => navigate(`/playlist/${_id}`)}
            className="w-full group leading-6 cursor-pointer"
        >
            <div className="w-full pt-[60%] relative">
                <div className="group-hover:opacity-50">
                    {videos[lastIndex] ? (
                        <div className="absolute inset-0">
                            <img
                                src={videos[lastIndex].thumbnail}
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
                            {name}
                        </div>
                        <div className="text-[#b5b4b4] text-[0.9rem]">
                            {views} Views &bull; {formattedCreatedAt}{' '}
                        </div>
                    </div>
                    <div className=" w-[30%] text-end text-[1.1rem]">
                        {totalVideos > 1
                            ? `${totalVideos} Videos`
                            : `${totalVideos} Video`}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaylistCard;
