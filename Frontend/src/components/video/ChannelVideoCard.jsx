import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { formatDuration } from '../../utils/formatDuration';

function ChannelVideoCard({ video, reference }) {
    const { _id, title, views, thumbnail, duration, createdAt } = video;
    const navigate = useNavigate();

    const formattedDuration = formatDuration(duration);
    const formattedCreatedAt = formatDistanceToNow(parseISO(createdAt), {
        addSuffix: true,
    });

    return (
        <div
            ref={reference}
            onClick={() => navigate(`/video/${_id}`)}
            className="w-full hover:bg-[#1c1c1c] leading-6 cursor-pointer"
        >
            <div className="relative w-full pt-[60%]">
                <div className="absolute inset-0">
                    <img
                        src={thumbnail}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute bottom-2 right-2 bg-[#0c0c0c] opacity-85 px-[6px] text-xl sm:text-[1rem] rounded-md">
                    {formattedDuration}
                </div>
            </div>

            <div className="p-2">
                <div className="text-[1.2rem] text-white">{title}</div>
                <div className="mt-[2px] text-[#b5b4b4] text-[0.9rem]">
                    {views} views &bull; {formattedCreatedAt}
                </div>
            </div>
        </div>
    );
}

export default ChannelVideoCard;
