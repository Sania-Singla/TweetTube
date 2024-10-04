import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { formatDuration } from "../index";

export default function RecemendationVideoList({ video, reference }) {
    const { _id, title, thumbnail, duration, owner, views, createdAt } = video;
    const { fullname } = owner;
    const navigate = useNavigate();

    const formattedDuration = formatDuration(duration);
    const formattedCreatedAt = formatDistanceToNow(parseISO(createdAt), { addSuffix: true });

    return (
        //important⭐adding a "/" can make a route absolute prevent appending
        <div
            ref={reference}
            onClick={() => navigate(`/video/${_id}`)}
            className="flex items-start justify-start relative mb-3 hover:bg-[#2121219d] cursor-pointer"
        >
            <div className="relative w-[215px] pt-1">
                <div className="w-[215px] h-[135px]  rounded-xl overflow-hidden">
                    <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#0c0c0c] opacity-90 text-white w-fit px-[6px] pb-[1px] rounded-md text-[0.95rem] absolute bottom-2 right-2">
                    {formattedDuration}
                </div>
            </div>

            {/* info */}
            <div className="ml-3">
                <div className="text-[1.1rem] font-medium text-white line-clamp-2">{title}</div>
                <div className="text-[1.1rem] text-[#b7b7b7] mt-2">{fullname}</div>
                <div className="text-[0.9rem] text-[#b7b7b7] mt-[2px]">
                    {views} views &bull; {formattedCreatedAt}
                </div>
            </div>
        </div>
    );
}
