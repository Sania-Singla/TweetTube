import { X } from 'lucide-react';
import { icons } from '../../assets/icons';

export default function UploadingVideoPopup({ video, close }) {
    return (
        <div className="p-4 flex flex-col items-center justify-center bg-[#13161f] backdrop-blur-sm border-[0.01rem] border-[#757575] border-dotted rounded-md shadow-black shadow-md w-[500px]">
            <div className="flex flex-col items-start justify-center w-full">
                <h2 className="text-[1.3rem] font-medium">Updating Video...</h2>
                <h2 className="text-[0.9rem] text-[#b5b4b4] font-medium">
                    Track your video updating process.
                </h2>
                <button onClick={close} className="absolute right-1 top-1">
                    <X size={27} />
                </button>
            </div>

            <div className="flex items-start justify-start w-full border-[0.01rem] rounded-md border-[#d7d7d7] p-3 mt-4">
                <div className="p-[4px] bg-[#E4D3FF] overflow-hidden rounded-full">
                    <div className="size-[25px] fill-none stroke-[#8871ee]">
                        {icons.uploadingVideoIcon}
                    </div>
                </div>
                <div className="ml-3">
                    <div className="text-[1.05rem]">
                        Updating - {video.title}
                    </div>
                    <div className="flex items-center justify-start w-full mt-2">
                        <div className="size-5 fill-[#8871ee] dark:text-[#b4b7b7]">
                            {icons.loading}
                        </div>
                        <span className="text-md ml-3">Updating...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
