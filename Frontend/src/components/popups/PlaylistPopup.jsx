import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import playlistServices from "../../DBservices/playlistServices";
import { X } from "lucide-react"
import { useAuthHook } from "../../hooks";

export default function PlaylistPopup({close}) {

    const [inputs,setInputs] = useState({
        newPlaylist: "",    //will add checkbox properties in the useEffect
    })

    const [loading,setLoading] = useState(false);
    const [creatingPlaylistLoading,setCreatingPlaylistLoading] = useState(false);
    const [data,setData] = useState([]);
    const {userData} = useAuthHook();
    const {videoId} = useParams();
 
    //on input change()
    async function handleChange(e) {
        const {value,name,type,checked} = e.target;
        if(type === "checkbox")
        {console.log(checked);
            const [target] = data.filter(item=>item.name===name);
            console.log(target);
            if(checked){
                const res = await playlistServices.addVideoToPlaylist(videoId,target._id);
                if(res && res.message==="VIDEO_ADDED_TO_PLAYLIST") {
                    setInputs(prev=>({
                        ...prev,
                        [name]:checked
                    }))
                }
            }else{
                const res = await playlistServices.removeVideoFromPlaylist(target._id,videoId);
                if(res && res.message ==="VIDEO_REMOVED_FROM_PLAYLIST_SUCCESSFULLY") {
                    setInputs(prev=>({
                        ...prev,
                        [name]:checked
                    }))
                }
            }
            
        }else {
            setInputs(prev=>({
                ...prev,
                newPlaylist:value,
            }))
        }
    }    

    useEffect(()=>{
        setLoading(true);
        playlistServices.getUserPlaylistsTitles(userData._id)
        .then(res=>{
            if(res) {
                setData(res);
                res.forEach(playlist => {
                    if(playlist.videos.includes(String(videoId))){
                        setInputs(prev=>({
                            ...prev,
                            [playlist.name]:true,
                        }))
                    }
                    else{
                        setInputs(prev=>({
                            ...prev,
                            [playlist.name]:false,
                        }))
                    }
                });
            }
            setLoading(false);
        })
    },[userData])

    //onsubmit()
    async function handleSubmit(e) {
        e.preventDefault();
        setCreatingPlaylistLoading(true);
        console.log(inputs.newPlaylist)
        const res = await playlistServices.createPlaylist(inputs.newPlaylist);
        if(res) {
            const newRes = await playlistServices.addVideoToPlaylist(videoId,res._id);
            if(newRes){
                close();
            }
        }
        setCreatingPlaylistLoading(false);        
    }

    const existingPlaylists = data?.map(playlist => (   //will get only latest 5
        <li key={playlist._id}>
            <div className="mb-3 flex items-start justify-start gap-4">
                <div className="pt-[5px]">
                    <input 
                        type="checkbox" 
                        checked={inputs[playlist.name]} 
                        name={playlist.name} 
                        id={playlist.name}
                        onChange={handleChange}
                        className="size-4"
                    />
                </div>
                <div>
                    <label 
                        htmlFor={playlist.name} 
                        className="text-md line-clamp-2 leading-6"
                    >
                        {playlist.name}
                    </label>
                </div>
            </div>
        </li>
    ))
    
    return (
        <div className="relative flex flex-col items-center justify-center bg-[#222222] rounded-xl shadow-black shadow-sm w-[250px] px-4 py-6 border-[0.1rem] border-[black]">
            <div className=" w-full text-center">
                <h2 className="text-[1.3rem] font-bold">Save to playlist</h2>
                <button onClick={close} className="absolute top-1 right-1"><X size={22}/></button>
            </div>

            <div className="mt-4">
                {loading && <div className="w-full text-center">Please wait...</div>}
                <ul>{existingPlaylists}</ul>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-start justify-center mt-2 w-full">
                <div className="w-full mt-2">
                    <div><label htmlFor="newPlaylist">Name</label></div>
                    <input 
                        type="text"
                        name="newPlaylist" 
                        id="newPlaylist"
                        value={inputs.newPlaylist}
                        onChange={handleChange}
                        required
                        placeholder="Enter playlist name" 
                        className="h-10 w-full mt-[1px] indent-3 placeholder:text-[#d9d9d9] bg-transparent border-[0.01rem] border-[#e8e8e8] rounded-lg"
                    />
                </div>
                
                <div className="w-full text-center font-semibold mt-4 text-black">
                    <button type="submit" disabled={loading} className="w-[68%] px-1 bg-[#8871ee] text-[1rem] h-9 rounded-lg">
                    {
                        creatingPlaylistLoading ? 
                        <div className="flex items-center justify-center w-full">
                            <svg aria-hidden="true" className="inline w-5 h-5 animate-spin dark:text-[#b5b4b4] fill-[#8871ee]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                        </div> : "Create new playlist"
                    }
                    </button>
                </div>
            </form>
        </div>
    )
}