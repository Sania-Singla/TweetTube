import { icons } from "../assets/icons";
import { NavLink } from "react-router-dom";

export default function SupportPage() {
    return (
        <div className="flex flex-col items-center pt-[60px]">
            <div className="bg-[#e3d0fd] rounded-full w-fit p-[3px]">
                <div className="size-[145px] brightness-125 text-[#6d50ec]">{icons.support}</div>
            </div>
            <div className="mt-6 text-[1.6rem] font-semibold">Contact me for any issue or Support</div>
            <div className="mt-6 text-center">
                <div className="mb-2 flex items-center justify-start">
                    <div className="size-[35px] mr-5">{icons.link}</div>
                    <div>
                        <p className="text-[1.2rem] font-semibold">LinkedIn</p>
                        <NavLink to={"https://www.linkedin.com/in/sania-singla/"} className="text-blue-500 text-[0.9rem]">
                            /sania-singla
                        </NavLink>
                    </div>
                </div>

                <div className="mb-2 flex items-center justify-start">
                    <div className="size-[35px] mr-5">{icons.link}</div>
                    <div>
                        <p className="text-[1.2rem] font-semibold">GitHub</p>
                        <NavLink to={"https://github.com/Sania-Singla"} className="text-blue-500 text-[0.9rem]">
                            /Sania-Singla
                        </NavLink>
                    </div>
                </div>
                <div className="mb-2 flex items-center justify-start">
                    <div className="size-[35px] mr-5">{icons.link}</div>
                    <div>
                        <p className="text-[1.2rem] font-semibold">Twitter</p>
                        <NavLink to={"https://x.com/sania_singla"} className="text-blue-500 text-[0.9rem]">
                            /sania_singla
                        </NavLink>
                    </div>
                </div>
                <div className="mb-2 flex items-center justify-start">
                    <div className="size-[35px] mr-5">{icons.link}</div>
                    <div>
                        <p className="text-[1.2rem] font-semibold">Discord</p>
                        <NavLink to={"https://discord.com/channels/@sania_singla"} className="text-blue-500 text-[0.9rem]">
                            @sania_singla
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
