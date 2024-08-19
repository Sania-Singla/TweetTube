import { useNavigate } from "react-router-dom";

export default function TweetsPage() {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 z-[140] bg-[#0c0c0c]">
            <div className="flex flex-col items-center justify-center h-full w-full gap-4">
                <div className="font-semibold text-3xl underline underline-offset-4">Page is under Build</div>
                <div className="w-96 h-96 rounded-xl overflow-hidden">
                    <img src="/not_found.gif" className="h-full w-full object-cover" alt="404 not found"/>                
                </div>
                <div>
                    <button onClick={()=>navigate("/")} className="bg-[#8871ee] text-black font-medium p-3 text-2xl rounded-sm hover:bg-slate-900 hover:text-[#8871ee] border-transparent border-[0.01rem] border-dotted transition-all  hover:border-[#b5b4b4]">Return to Home</button>
                </div>
            </div>
        </div>
    )
}