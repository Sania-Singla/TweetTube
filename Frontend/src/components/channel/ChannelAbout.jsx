import { useEffect, useState } from "react";
import channelServices from "../../DBservices/channelServices";
import { icons } from "../../assets/icons";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import { PulseChannelAbout } from "../video/Pulses";
import { useChannelHook } from "../../hooks";

function ChannelAbout() {
    const [loading, setLoading] = useState(true);
    const channelData = useChannelHook();
    const [aboutData, setAboutData] = useState({});

    useEffect(() => {
        setLoading(true);
        channelServices.getChannelAbout(setLoading, channelData._id).then((Data) => {
            if (Data.message === "CHANNEL_NOT_FOUND") navigate("/"); // navigate to 404not found page ⭐⭐⭐
            else setAboutData(Data);
        });
    }, [channelData]);

    if (loading) return <PulseChannelAbout />;
    else {
        const date = new Date(aboutData.createdAt);
        const formattedDate = format(date, "dd/MM/yyyy");
        return (
            <div className="w-full py-3 px-12">
                <div className="text-3xl font-semibold">{"@" + aboutData.username}</div>
                <div className="text-[1.1rem] text-gray-100 mt-4">{aboutData.description}</div>
                <div className="text-2xl font-semibold mt-5">Channel details</div>

                <div className="w-full mt-5">
                    <p className="flex items-center mb-2 gap-3 text-[1.1rem]">
                        <span className="size-[28px]">{icons.mail}</span>
                        <NavLink className="text-blue-500 pb-1">{aboutData.email}</NavLink>
                    </p>
                    <p className="flex items-center mb-2 gap-3 text-[1.1rem]">
                        <span className="size-[28px]">{icons.globe}</span>
                        <NavLink
                            className="text-blue-500 pb-1"
                            to={`/channel/${aboutData.username}`}
                        >{`https://tweettube/channel/${aboutData.username}`}</NavLink>
                    </p>
                    <p className="flex items-center mb-2 gap-3 text-[1.1rem]">
                        <span className="size-[28px]">{icons.video}</span>
                        <span>{`${aboutData.totalVideos} Videos`}</span>
                    </p>
                    <p className="flex items-center mb-2 gap-3 text-[1.1rem]">
                        <span className="size-[28px]">{icons.eye}</span>
                        <span>{`${aboutData.totalViews} Views`}</span>
                    </p>
                    <p className="flex items-center mb-2 gap-3 text-[1.1rem]">
                        <span className="size-[28px]">{icons.subscribers}</span>
                        <span>{`${aboutData.totalSubscribers} Subscribers`}</span>
                    </p>
                    <p className="flex items-center mb-2 gap-3 text-[1.1rem]">
                        <span className="size-[28px]">{icons.chat}</span>
                        <span>{`${aboutData.totalTweets} Tweets`}</span>
                    </p>
                    <p className="flex items-center mb-2 gap-3 text-[1.1rem]">
                        <span className="size-[28px]">{icons.exclamation}</span>
                        <span>{`Joined on ${formattedDate}`}</span>
                    </p>
                </div>
            </div>
        );
    }
}

export default ChannelAbout;
