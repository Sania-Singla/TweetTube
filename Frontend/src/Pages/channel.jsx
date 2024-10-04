import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import channelServices from "../DBservices/channelServices";
import { PulseChannel, LoginPopup } from "../components";
import { useAuthHook } from "../hooks";
import { storeChannelData } from "../Store/Slices/channelSlice";
import { useDispatch } from "react-redux";

export default function ChannelPage() {
    const { username } = useParams();
    const { userData, loginStatus } = useAuthHook();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [isSubscribed, setIsSubscribed] = useState(false); //so that we can imediately give it the update effect without rerender
    const [subscribersCount, setSubscribersCount] = useState(0);
    const navigate = useNavigate();
    const [loginPopup, setLoginPopup] = useState(false);
    const ref = useRef();
    const dispatch = useDispatch();

    function closeLoginPopup(e) {
        if (ref.current === e.target) setLoginPopup(false);
    }

    useEffect(() => {
        channelServices.getChannelProfile(setLoading, username).then((res) => {
            if (res.message === "CHANNEL_NOT_FOUND") navigate("/not-found"); // navigate to 404not found page ⭐⭐⭐
            else {
                setData(res);
                setIsSubscribed(res.isSubscribed);
                setSubscribersCount(res.subscribersCount);
                dispatch(storeChannelData(res));
            }
        });
    }, [username, loginStatus]);

    const options = [
        {
            name: "Videos",
            path: ``,
        },
        {
            name: "Playlists",
            path: `playlists`,
        },
        {
            name: "Subscribed",
            path: `subscribed`,
        },
        {
            name: "Tweets",
            path: `tweets`,
        },
        {
            name: "About",
            path: `about`,
        },
    ];

    const optionsElements = options.map((option) => (
        <div key={option.name} className="flex items-center justify-center w-1/5 mx-[3px]">
            <NavLink
                to={option.path}
                end
                className={({ isActive }) =>
                    `${
                        isActive ? "bg-white font-semibold border-[#8871ee] rounded-t-md text-[#0c0c0c]" : "bg-[#0c0c0c] border-white text-[#8871ee]"
                    } w-full h-full border-b-[0.13rem] text-center text-md md:text-lg py-1`
                }
            >
                {option.name}
            </NavLink>
        </div>
    ));
    //important⭐use 'end' in navlink else if the "" (index root) will always be highlighted

    function toggleSubscribe() {
        channelServices.toggleSubscribe(data._id).then((res) =>
            setIsSubscribed((prev) => {
                if (prev) {
                    setSubscribersCount((prevCount) => prevCount - 1);
                    return false;
                } else {
                    setSubscribersCount((prevCount) => prevCount + 1);
                    return true;
                }
            })
        );
    }

    if (loading) return <PulseChannel />;
    else
        return (
            <div className="text-white">
                {/* coverimage */}
                {data.coverImage ? (
                    <div className="w-full h-[170px] sm:h-[200px] overflow-hidden">
                        <img src={data.coverImage} alt="cover image" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="bg-slate-700 w-full h-[170px] sm:h-[200px]"></div>
                )}
                <div className="relative top-[-15px] flex items-center ml-1">
                    {/* avatar */}
                    <div className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] overflow-hidden rounded-full border-2 border-[#b5b4b4]">
                        <img src={data.avatar} className="w-full h-full object-cover" />
                    </div>

                    {/* channel info */}
                    <div className="ml-[15px]">
                        <div className="text-2xl sm:text-3xl mt-4 sm:mt-1 font-semibold">{data.fullname}</div>

                        <div className="text-lg text-[#c1c1c1]">
                            {"@" + data.username} &bull; {data.videosCount > 1 ? `${data.videosCount} videos` : `${data.videosCount} video`}
                        </div>

                        <div className="text-md text-[#bbbaba]">
                            {subscribersCount} subscribers &bull; {data.subscribedToCount} subscribed
                        </div>

                        {/* subscribe/edit btn */}
                        {userData ? (
                            userData?.username !== username ? (
                                <div className="absolute right-[10px] top-[40px] md:right-[30px] text-[1.1rem]">
                                    {isSubscribed ? (
                                        <button
                                            className="bg-[#d6d5d5] w-[90px] text-[#0c0c0c] px-1 py-1 font-semibold border-[0.01rem] border-[#b5b4b4] active:border-white"
                                            onClick={toggleSubscribe}
                                        >
                                            Subscribed
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-[#8871ee] w-[90px] text-[#0c0c0c] px-1 py-1 font-semibold border-[0.01rem] border-[#b5b4b4] active:border-white"
                                            onClick={toggleSubscribe}
                                        >
                                            Subscribe
                                        </button>
                                    )}
                                </div> //edit btn
                            ) : (
                                <div className="absolute right-[20px] top-[40px] md:right-[30px] text-[1.1rem]">
                                    <button
                                        className="bg-[#8871ee] w-[90px] text-[#0c0c0c] py-[3px] text-lg border-[0.01rem] border-[#b5b4b4] active:border-white"
                                        onClick={() => navigate("/settings")}
                                    >
                                        <i className="fa-solid fa-user-pen text-xl"></i>
                                        <span className="font-semibold  ml-[6px]">Edit</span>
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="absolute right-[20px] top-[40px] md:right-[30px] text-[1.1rem]">
                                <button
                                    className="bg-[#8871ee] w-[90px] text-[#0c0c0c] px-1 py-1 font-semibold border-[0.01rem] border-[#b5b4b4] active:border-white"
                                    onClick={() => {
                                        setLoginPopup(true);
                                        //do something that the task user executed before the popup appears should be also done after he successfully logged in ⭐
                                    }}
                                >
                                    Subscribe
                                </button>
                            </div>
                        )}

                        {/* login popup */}
                        {loginPopup && (
                            <div
                                ref={ref}
                                onClick={closeLoginPopup}
                                className="fixed inset-0 backdrop-blur-sm z-[150] flex items-center justify-center"
                            >
                                <LoginPopup close={() => setLoginPopup(false)} popupText={"Subscribe"} />
                            </div>
                        )}
                    </div>
                </div>
                {/* channel nav bar */}
                <div className="flex items-center justify-evenly w-full mb-[8px] px-1">{optionsElements}</div>
                <hr className="mb-[8px] border-[0.01rem] border-[#b5b4b4]" />
                <Outlet /> {/*because we can't direclty provide props to Outlet so either have to use context api conept or redux store*/}
            </div>
        );
}
