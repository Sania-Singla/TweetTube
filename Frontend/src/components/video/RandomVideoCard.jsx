import { formatDuration } from "../../utils/formatDuration";
import { formatDistanceToNow,parseISO } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

export default function RandomVideoCard({video,reference}) {
    const {_id,title,thumbnail,owner,duration,views,createdAt} = video;
    const {avatar,username,fullname} = owner;
    const formattedDuration = formatDuration(duration);
    const formattedCreatedAt = formatDistanceToNow(parseISO(createdAt), { addSuffix: true });
    const navigate = useNavigate();
    return (
        <div ref={reference} onClick={()=>navigate(`/video/${_id}`)} className="cursor-pointer">
            <div className="relative w-full pt-[56%]">
                <div className="absolute inset-0">
                    <img src={thumbnail} alt={title} className="w-full h-full object-cover"/>
                </div>
                <div className="absolute bottom-2 right-2 bg-[#0c0c0c] opacity-85 px-[6px] text-xl sm:text-[1rem] rounded-md">{formattedDuration}</div>
            </div>
            <div className="flex items-start gap-3">
                <div className="mt-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Link 
                            to={`/channel/${owner.username}`} 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={avatar} alt={fullname} className="h-full w-full object-cover"/>
                        </Link>
                    </div>
                </div>

                <div className="leading-[21px]">
                    <div className="text-[1.2rem] mt-2 font-medium line-clamp-2 leading-[26px] text-[#f4f4f4]">{title}</div>
                    <div className="text-[#c6c6c6] text-[1.06rem] mt-[3px]">{fullname}</div>
                    <div className=" text-[#c6c6c6] text-[0.9rem]">{views} views &bull; {formattedCreatedAt}</div>
                </div>
            </div>
        </div>
    )
}