import { useEffect, useState } from 'react';
import channelServices from '../../DBservices/channelServices';
import { useChannelHook } from '../../hooks';
import { PulseSubscribedChannel } from '../index';
import { useNavigate } from 'react-router-dom';

function ChannelSubscribed() {
    const [loading, setLoading] = useState(true);
    const [subscribedFound, setSubscribedFound] = useState(true);
    const [subscribedChannels, setSubscribedChannels] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const channelData = useChannelHook();

    useEffect(() => {
        channelServices
            .getSubscribedChannels(setLoading, channelData._id)
            .then((res) => {
                if (res && res.length > 0) {
                    setSubscribedChannels(
                        res.map((channel) => ({
                            ...channel,
                            subscribedStatus: true, //new property added
                        }))
                    );
                    setSubscribedFound(true);
                } else setSubscribedFound(false);
            });
    }, [channelData]);

    const handleSubscribeClick = (_id) => {
        channelServices.toggleSubscribe(_id).then((res) => {
            if (res) {
                setSubscribedChannels((prev) =>
                    prev.map((channel) => {
                        if (channel._id === _id) {
                            return {
                                ...channel,
                                subscribedStatus: !channel.subscribedStatus,
                            };
                        }
                        return channel;
                    })
                );
            }
        });
    };

    const subscribersElements = subscribedChannels
        ?.filter((channel) => {
            if (search === '') return channel;
            else if (channel.fullname.includes(search)) return channel;
        })
        .map((channel) => {
            const {
                _id,
                avatar,
                fullname,
                username,
                subscribersCount,
                subscribedStatus,
            } = channel;

            return (
                <div className="flex items-center mb-4 relative" key={_id}>
                    <div
                        className="flex items-center justify-center cursor-pointer"
                        onClick={() => navigate(`/channel/${username}`)}
                    >
                        <div className="w-[50px] rounded-full overflow-hidden h-[50px] md:h-[60px] md:w-[60px]">
                            <img
                                src={avatar}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="ml-3">
                            <div className="text-[1.3rem] md:text-[1.4rem] ">
                                {fullname}
                            </div>
                            <div className="text-[0.9rem] text-[#b5b4b4]">
                                {subscribersCount} Subscribers
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-1 top-[9px] md:top-[8px]">
                        {subscribedStatus ? (
                            <button
                                className="bg-[#d6d5d5] w-[100px] text-[#0c0c0c] px-1 py-1 md:py-[5px] md:text-[1.15rem] text-[1.1rem] font-normal border-[0.01rem] border-[#b5b4b4] active:border-white"
                                onClick={() => {
                                    handleSubscribeClick(_id);
                                }}
                            >
                                Subscribed
                            </button>
                        ) : (
                            <button
                                className="bg-[#8871ee] w-[100px] text-[#0c0c0c] px-1 py-1 md:py-[5px] md:text-[1.15rem] text-[1.1rem] font-normal border-[0.01rem] border-[#b5b4b4] active:border-white"
                                onClick={() => handleSubscribeClick(_id)}
                            >
                                Subscribe
                            </button>
                        )}
                    </div>
                </div>
            );
        });

    //pulses
    const pulseEffect = [
        <PulseSubscribedChannel key={1} />,
        <PulseSubscribedChannel key={2} />,
        <PulseSubscribedChannel key={3} />,
        <PulseSubscribedChannel key={4} />,
    ];

    if (!subscribedFound)
        return <div>no subscriberd channels !</div>; //loading is already false then
    else
        return (
            <div className="mt-4 px-2y">
                <div className="px-2 w-full h-10 bg-[#f5f5f5] flex items-center border-[0.01rem] overflow-hidden border-[#b5b4b4] rounded-lg">
                    <div className="text-[#aeb1bd] h-full flex items-center justify-center text-lg">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-full focus:outline-none  bg-transparent text-black text-lg indent-2 "
                    />
                </div>

                <div className="mt-4">{subscribersElements}</div>

                {loading && <div className="mt-3">{pulseEffect}</div>}
            </div>
        );
}

export default ChannelSubscribed;
