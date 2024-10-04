import { NavLink } from "react-router-dom";
import { useAuthHook } from "../../hooks";

function SideBar() {
    const { userData, loginStatus } = useAuthHook();

    const sideItems = [
        {
            name: "Home",
            path: "",
            icon: <i className="fa-solid fa-house"></i>,
            shouldShow: true,
        },
        {
            name: "Tweets",
            path: "tweets",
            icon: <i className="fa-brands fa-twitter"></i>,
            shouldShow: true,
        },
        {
            name: "Watch history",
            path: "watch-history",
            icon: <i className="fa-solid fa-clock-rotate-left"></i>,
            shouldShow: true,
        },
        {
            name: "My Content",
            path: `/channel/${userData?.username}`, //path: `${userData ? `/channel/${userData.username}` : `guest my content page`}`,
            icon: <i className="fa-solid fa-video"></i>,
            shouldShow: true,
        },
        {
            name: "Liked videos",
            path: "liked-videos",
            icon: <i className="fa-solid fa-thumbs-up"></i>,
            shouldShow: true,
        },
        {
            name: "Subscriptions",
            path: `channel/${userData?.username}/subscribed`,
            icon: <i className="fa-solid fa-user-plus"></i>,
            shouldShow: loginStatus,
        },
        {
            name: "Playlists",
            path: `channel/${userData?.username}/playlists`, // /channel/:${userData.username}/....   we only need color(:) in defining the Route path first time in main.jsx , while navigating we dont need it
            icon: <i className="fa-regular fa-square-plus"></i>,
            shouldShow: loginStatus,
        },
        {
            name: "Admin",
            path: "admin",
            icon: <i className="fa-solid fa-user"></i>,
            shouldShow: loginStatus,
        },
        {
            name: "Subscribers",
            path: "subscribers",
            icon: <i className="fa-solid fa-user-group"></i>,
            shouldShow: true,
        },
    ];

    const bottomItems = [
        {
            name: "Home",
            path: "",
            icon: <i className="fa-solid fa-house"></i>,
            shouldShow: true,
        },
        {
            name: "Tweets",
            path: "tweets",
            icon: <i className="fa-brands fa-twitter"></i>,
            shouldShow: true,
        },
        {
            name: "My Content",
            path: `/channel/${userData?.username}`,
            icon: <i className="fa-solid fa-video"></i>,
            shouldShow: true,
        },
        {
            name: "History",
            path: "watch-history",
            icon: <i className="fa-solid fa-clock-rotate-left"></i>,
            shouldShow: true,
        },
        {
            name: "Settings",
            path: "settings",
            icon: <i className="fa-solid fa-gear"></i>,
            shouldShow: loginStatus,
        },
    ];

    const sideElements = sideItems.map(
        (item) =>
            item.shouldShow && (
                <li key={item.name} value={item.name} className="w-full h-full mb-1">
                    <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                            `${
                                isActive ? "border-[#8871ee]" : "border-[#b5b4b4]"
                            } border-[0.1rem] h-full flex items-center justify-center lg:justify-start group-hover:justify-start hover:border-[#8871ee] py-[7px] px-3 text-lg`
                        }
                    >
                        <span className="text-xl w-5 flex items-center justify-center p-1">{item.icon}</span>{" "}
                        <span className="ml-3 hidden lg:block group-hover:block">{item.name}</span>
                    </NavLink>
                </li>
            )
    );

    const bottomElements = bottomItems.map(
        (item) =>
            item.shouldShow && (
                <li key={item.name} value={item.name} className="w-full h-full">
                    <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                            `${isActive && "text-[#8871ee]"} text-[1.1rem] h-full flex flex-col justify-center pt-1 cursor-pointer`
                        }
                    >
                        {item.icon}
                        <div className="text-[0.95rem]">{item.name}</div>
                    </NavLink>
                </li>
            )
    );

    return (
        <div>
            <aside className="hidden group hover:w-[250px] fixed top-[80px] left-0 h-[calc(100vh-80px)] z-[130] sm:block sm:w-14 border-r-[0.01rem] border-[#b5b4b4] lg:w-[250px] bg-[#0c0c0c] text-white">
                <ul className="m-1">{sideElements}</ul>

                <div className="absolute w-full px-1 bottom-0">
                    <div className="w-full h-full mb-1">
                        <NavLink
                            to="support"
                            className={({ isActive }) =>
                                `${
                                    isActive ? " border-[#8871ee]" : "border-[#b5b4b4] "
                                } group-hover:justify-start  border-[0.1rem] h-full flex items-center justify-center lg:justify-start hover:border-[0.1rem] hover:border-[#8871ee] py-[7px] px-3 text-lg`
                            }
                        >
                            <span className="text-xl w-5 flex items-center justify-center p-1">
                                <i className="fa-regular fa-circle-question"></i>
                            </span>
                            <span className="ml-3 hidden lg:block group-hover:block">Support</span>
                        </NavLink>
                    </div>

                    {loginStatus && (
                        <div className="w-full h-full mb-1">
                            <NavLink
                                to="settings"
                                className={({ isActive }) =>
                                    `${
                                        isActive ? " border-[#8871ee]" : "border-[#b5b4b4] "
                                    } group-hover:justify-start border-[0.1rem] h-full flex items-center justify-center lg:justify-start hover:border-[0.1rem] hover:border-[#8871ee] py-[7px] px-3 text-lg`
                                }
                            >
                                <span className="text-xl w-5 flex items-center justify-center p-1">
                                    <i className="fa-solid fa-gear"></i>
                                </span>
                                <span className="ml-3 hidden lg:block group-hover:block">Settings</span>
                            </NavLink>
                        </div>
                    )}
                </div>
            </aside>

            {/* sidebar for small screens */}
            <aside className="fixed bottom-0 h-[60px] z-[110] w-full sm:hidden flex flex-col items-center justify-center bg-[#0c0c0c] text-white">
                <hr className="w-full border-[0.01rem] border-[#b5b4b4] absolute top-0" />
                <ul className="flex w-full h-full gap-2 items-center justify-evenly text-center font-semibold px-2">{bottomElements}</ul>
            </aside>
        </div>
    );
}

export default SideBar;
