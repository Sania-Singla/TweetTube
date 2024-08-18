import { useNavigate,Link } from "react-router-dom";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { formatDuration } from "../index";
import { icons } from "../../assets/icons";

function VideoList({video,reference, isWatchHistory=false, isSearchResultVideoList=false,removeFromLikedVideos=null}) {
    
    const {_id,title,thumbnail,description,duration,owner,views,createdAt} = video;
    const {avatar,fullname} = owner;
    const navigate = useNavigate();

    const formattedDuration = formatDuration(duration);
    const formattedCreatedAt = formatDistanceToNow(parseISO(createdAt), { addSuffix: true });

    return (//important⭐adding a "/" can make a route absolute prevent appending
        <div ref={reference} onClick={()=>navigate(`/video/${_id}`)} className="flex flex-col sm:flex-row relative mb-4 hover:bg-[#2121219d] pb-2 sm:pb-0 cursor-pointer">

            <div>
                <div className="relative pt-[58%] sm:pt-[180px] sm:w-[280px]" >
                    <div className="absolute inset-0">
                        <img src={thumbnail} alt="thumbnail" className="w-full h-full object-cover"/>
                    </div>
                    <div className="bg-[#0c0c0c] opacity-90 text-white w-fit px-[6px] rounded-md text-lg sm:text-[0.95rem] absolute bottom-2 right-2">{formattedDuration}</div>
                </div>
            </div>

            {/* info */}
            <div className="hidden sm:block ml-2 mt-1 sm:mt-0 sm:ml-3">  
                <div className="mb-3 text-[1.3rem] font-medium text-white line-clamp-2">
                    {title}
                </div>

                <div className="flex items-center mt-[8px] relative">
                    <div>
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                            <Link 
                                to={`/channel/${owner.username}`} 
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img src={avatar} className='w-full h-full object-cover'/>
                            </Link>
                        </div>
                    </div>
                    <span className="ml-2 text-xl text-[#f7f7f7]">{fullname}</span>
                </div>
        
                <div className="mt-2 text-[0.9rem] text-[#cccbcb]">
                    {views} views &bull; {formattedCreatedAt}
                </div>

                <div className="text-[15.5px] text-[#b0afaf] line-clamp-2 mt-[5px]" /* or => overflow-hidden whitespace-nowrap text-ellipsis (remeber the parent container should be rescticted to width (max-w-))*/>
                    {description}
                </div> 

                {
                    !isSearchResultVideoList && !isWatchHistory && 
                    <div className="w-fit flex justify-center items-center absolute right-2 top-2 text-[#c3c2c2]">
                        <button className="w-7 h-7 text-2xl flex items-center justify-center" onClick={(e)=>{e.stopPropagation();removeFromLikedVideos(_id);}}>
                            <div className="fill-none hover:stroke-[#d90303] stroke-[#a40000] size-full">{icons.delete}</div>
                        </button>
                    </div> 
                }
            </div>
            

            {/* info for smaller screens */}
            <div className="ml-2 mt-2 sm:hidden flex items-start">  
                <div>
                    <div className="w-12 h-12 overflow-hidden rounded-full mt-1">
                        <Link 
                            to={`/channel/${owner.username}`} 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={avatar} className='w-full h-full object-cover'/>
                        </Link>
                    </div>
                </div>

                <div className="ml-3 leading-[22px] w-full relative ">
                    <div className={`text-[1.3rem] font-medium text-white line-clamp-2 ${isWatchHistory?"":"pr-10"} leading-6`}>{title}</div>
                    <div className="text-[1.1rem] text-[#b5b4b4] mt-1">{fullname}</div>
                    <div className="text-[0.9rem] text-[#b5b4b4]">{views} views &bull; {formattedCreatedAt} </div>
                    
                    {
                        !isSearchResultVideoList && !isWatchHistory && 
                        <div className="w-fit mr-1 flex flex-col justify-center items-center absolute right-0 top-0 text-[#c3c2c2]">
                            <button className="w-7 h-7 text-2xl flex items-center justify-center" onClick={(e)=>{e.stopPropagation();removeFromLikedVideos(_id);}}>
                                <div className="fill-none hover:stroke-[#d90303] stroke-[#a40000] size-full">{icons.delete}</div>
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default VideoList