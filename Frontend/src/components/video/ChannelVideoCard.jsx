import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from 'date-fns';


function formatDuration(seconds) {
    const pad = (num) => ( String(num).padStart(2,"0") )     //implicit return   //.padStart() string method that pads a string with some other string("0") until in reaches a certain length (2) 
    const hours = Math.floor(seconds/3600);
    const minutes = Math.floor(( seconds%3600)/60);
    const remainingSeconds  = String(seconds%60).slice(0,2)

    return hours > 0 ? `${hours}:${pad(minutes)}:${pad(remainingSeconds)}` : `${pad(minutes)}:${pad(remainingSeconds)}`
    //or 
    // return [
    //     hours > 0 ? hours : null,    //could pad hours too if you want i don't
    //     pad(minutes),
    //     pad(String(remainingSeconds).slice(0,2))
    // ].filter(Boolean).join(":")  //.join() makes a string from array & we can define separator in .join() (default is the comma)
}

function ChannelVideoCard({video,reference}) {

    const {_id,title,views,thumbnail,duration,createdAt} = video;
    const navigate = useNavigate();

    const formattedDuration = formatDuration(duration);
    const formattedCreatedAt = formatDistanceToNow(parseISO(createdAt), { addSuffix: true });

    return (
        <div ref={reference} onClick={()=>navigate(`/video/${_id}`)} className="w-full hover:bg-[#1c1c1c] leading-6 cursor-pointer">
            <div className="relative w-full pt-[60%]" >
                <div className="absolute inset-0">
                    <img src={thumbnail} alt="thumbnail" className="w-full h-full object-cover"/>
                </div>
                <div className="absolute bottom-2 right-2 bg-[#0c0c0c] opacity-85 px-[6px] text-xl sm:text-[1rem] rounded-md">{formattedDuration}</div>
            </div>

            <div className="p-2">  
                <div className="text-[1.2rem] text-white">{video.title}</div>
                <div className="mt-[2px] text-[#b5b4b4] text-[0.9rem]">{views} views &bull; {formattedCreatedAt}</div>
            </div>
        </div>
    )
}

export default ChannelVideoCard