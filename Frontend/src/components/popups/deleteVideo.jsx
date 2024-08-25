import { X } from "lucide-react";
import { icons } from "../../assets/icons";
import { useState } from "react";
import adminServices from "../../DBservices/adminServices";

export default function DeleteVideoPopup({close,video}) {

    const [checked,setChecked] = useState(false);

    async function handleDeleteVideo(e) {
        close();
        const res = await adminServices.deleteVideo(video.id);
        if(res) {}
    }

    return (
        <div className="p-4 bg-[#13161f] backdrop-blur-sm border-[0.01rem] border-[#757575] border-dotted rounded-md shadow-black shadow-md w-[500px]">
            <div className="flex items-start justify-start w-full">
                <div className="p-[4px] bg-[#fbb4b4] overflow-hidden rounded-full w-[30px] mt-1">
                    <div className="size-full fill-none stroke-[#cd0000]">{icons.delete}</div>
                </div>
                <div className="ml-3 ">
                    <h2 className="text-[1.3rem] font-medium">Permanently delete this video?</h2>
                    <h2 className="text-[0.9rem] text-[#b5b4b4] font-medium">Once its deleted, you will not be able to recover it.</h2>
                    <h2 className="text-md font-medium text-[#ebebeb] mt-3"><span className="mr-[5px] font-medium text-[1.1rem]">Title -</span>{video.title}</h2>
                    <div className="flex items-center justify-start text-[#ebebeb]">
                        <div className="mr-3"><span className="mr-[5px] font-medium text-[1.1rem]">views :</span>{video.views}</div>
                        <div><span className="mr-[5px] font-medium text-[1.1rem]">likes :</span>{video.likes}</div>
                    </div>
                </div>
                <button onClick={close} className="absolute right-1 top-1"><X size={27}/></button>
            </div>

            <div className="flex items-center justify-start w-full mt-4">
                <input 
                    type="checkbox" 
                    id="delete-checkbox" 
                    name="delete-checkbox" 
                    checked={checked} 
                    onChange={(e)=>setChecked(e.target.checked)}
                    className="size-4"
                />
                <label htmlFor="delete-checkbox" className="ml-3 text-lg leading-6">I understand that deleting is permanent, and can't be undone</label>
            </div>

            <div className="flex items-center justify-center gap-5 mt-6 w-full">
                <div className="hover:bg-[#2a2a2a] w-full text-center  border-[0.01rem] border-[#b5b4b4] text-lg">
                    <button onClick={close} className="p-2 w-full">Cancel</button>
                </div>
                <div className="cursor-pointer hover:font-medium w-full border-transparent text-center border-[0.01rem] hover:border-[#b5b4b4] bg-[#cd0000] text-black text-lg">
                    <button onClick={handleDeleteVideo} disabled={!checked} className="disabled:cursor-not-allowed p-2 w-full">Delete</button>
                </div>
            </div>
        </div>
    )
}