import { X } from "lucide-react";
import { icons } from "../../assets/icons";

export default function VideoUploadedPopup({ fileSize, close }) {
    return (
        <div className="p-4 flex flex-col items-center justify-center bg-[#13161f] backdrop-blur-sm border-[0.01rem] border-[#757575] border-dotted rounded-md shadow-black shadow-md w-[500px] pt-5 pb-3">
            <div className="flex flex-col items-start justify-center w-full">
                <h2 className="text-[1.3rem] font-medium">Video Uploaded !!</h2>
                <h2 className="text-[0.9rem] text-[#b5b4b4] font-medium">Track your video uploading process.</h2>
                <button onClick={close} className="absolute right-4 top-7">
                    <X size={27} />
                </button>
            </div>

            <div className="flex items-start justify-start w-full border-[0.01rem] rounded-md border-[#d7d7d7] p-3 mt-4">
                <div className="p-[4px] bg-[#E4D3FF] overflow-hidden rounded-full">
                    <div className="size-[25px] fill-none stroke-[#8871ee]">{icons.uploadingVideoIcon}</div>
                </div>
                <div className="ml-3">
                    <div className="text-[1.05rem]">Dashboard prototype recording.mp4</div>
                    <div className="text-[0.9rem] text-[#ececec]">{fileSize} MB</div>
                    <div className="flex items-center justify-start w-full mt-2">
                        <div className="fill-[#8871ee] size-[25px]">{icons.tick}</div>
                        <span className="text-md ml-[6px]">Uploaded Successfully</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-5 mt-6 w-full">
                <div className="hover:bg-[#2a2a2a] w-full text-center  border-[0.01rem] border-[#b5b4b4] text-lg">
                    <button onClick={close} className="p-2 w-full">
                        Close
                    </button>
                </div>
                <div className="cursor-pointer hover:font-medium w-full border-transparent text-center border-[0.01rem] hover:border-[#b5b4b4] bg-[#8871ee] text-black text-lg">
                    <button onClick={close} className="p-2 w-full">
                        Finish
                    </button>
                </div>
            </div>
        </div>
    );
}
