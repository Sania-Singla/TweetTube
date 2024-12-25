import { Link, useNavigate, NavLink, useSearchParams } from 'react-router-dom';
import { Logout } from '../index';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthHook } from '../../hooks';
import videoServices from '../../DBservices/videoServices';

function Header() {
    const { loginStatus, userData } = useAuthHook();
    const [hamburgurMenuDisplay, setHamburgurMenuDisplay] = useState(false);
    const navigate = useNavigate();
    const ref = useRef();
    const inputRef = useRef();
    const cancelSearchRef = useRef();
    const [searchQuery] = useSearchParams();
    const initialQuery = searchQuery.get('search_query');
    const [search, setSearch] = useState(initialQuery || '');
    const [dropDownResults, setDropDownResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    function handleSearch(query) {
        if (query) {
            setShowDropdown(false);
            inputRef.current.blur();
            navigate(`/results?search_query=${query}`);
        }
    }

    //drop-down fetch
    useEffect(() => {
        videoServices.getSearchData(search).then((data) => {
            if (data) {
                setDropDownResults([
                    ...new Set(
                        data.results?.map((result) => {
                            //set is used to remove any repetive value from the set
                            const title = result.title.toLowerCase();
                            const fullname =
                                result.owner.fullname.toLowerCase();
                            if (title.includes(search.toLowerCase()))
                                return title;
                            else if (fullname.includes(search.toLowerCase()))
                                return fullname;
                        })
                    ),
                ]);
            }
        });
    }, [search]);

    function handleBlur(e) {
        //COMMON ISSUE:⭐because to disappear the dropdown on blur event we were not able to interact with the options even so thats why give the disappear a delay until then the navigation would happen
        // Prevent hiding dropdown if relatedTarget is the cancel button
        if (
            cancelSearchRef.current &&
            e.relatedTarget === cancelSearchRef.current
        )
            return; /*When an element loses focus (a blur event), relatedTarget tells us which element is about to gain focus.If the focus is shifting to another element within the same document (like from an input field to a button), relatedTarget will point to that button.If the focus is leaving the document entirely (like when clicking outside the browser window), relatedTarget will be null.*/

        setTimeout(() => {
            setShowDropdown(false);
        }, 250);
    }

    const dropDownItemsElements = dropDownResults?.map((item, index) => (
        <div
            key={index}
            onClick={() => handleSearch(item)}
            className="cursor-pointer hover:bg-[#393939] px-4 py-1 line-clamp-1"
        >
            <i className="fa-solid fa-magnifying-glass text-[1.05rem] text-[#b5b5b5]"></i>
            <span className="pl-[10px] text-[1.1rem] text-white">{item}</span>
        </div>
    ));

    function closeHamburgurMenu(e) {
        if (ref.current === e.target) setHamburgurMenuDisplay(false);
    }

    const hamburgurVariants = {
        beginning: {
            x: '100vw',
        },
        end: {
            x: 0,
            transition: {
                type: 'tween',
            },
        },
        exit: {
            x: '100vw',
            transition: {
                type: 'tween',
            },
        },
    };

    //objects array
    const navItems = [
        {
            name: 'Login',
            path: 'login',
            show: !loginStatus,
        },
        {
            name: 'Signup',
            path: 'register',
            show: !loginStatus,
        },
    ];

    //elements array
    const navElements = navItems.map(
        (item) =>
            item.show && (
                <li
                    key={item.name}
                    value={item.name}
                    className="bg-[#8871ee] text-[#0c0c0c] text-center h-full w-[70px] flex items-center justify-center text-lg font-semibold  border-[0.01rem] border-[#b5b4b4] active:border-white "
                >
                    <button
                        onClick={() => navigate(item.path)}
                        className="w-full h-full"
                    >
                        {item.name}
                    </button>
                </li>
            )
    );

    //hamburgur items
    const hamburgurItems = [
        {
            name: 'Home',
            path: '',
            icon: <i className="fa-solid fa-house"></i>,
            shouldShow: true,
        },
        {
            name: 'Tweets',
            path: 'tweets',
            icon: <i className="fa-brands fa-twitter"></i>,
            shouldShow: true,
        },
        {
            name: 'Watch history',
            path: 'watch-history',
            icon: <i className="fa-solid fa-clock-rotate-left"></i>,
            shouldShow: true,
        },
        {
            name: 'My Content',
            path: `/channel/${userData?.username}`,
            icon: <i className="fa-solid fa-video"></i>,
            shouldShow: true,
        },
        {
            name: 'Liked videos',
            path: 'liked-videos',
            icon: <i className="fa-solid fa-thumbs-up"></i>,
            shouldShow: true,
        },
        {
            name: 'Subscriptions',
            path: `channel/${userData?.username}/subscribed`,
            icon: <i className="fa-solid fa-user-plus"></i>,
            shouldShow: loginStatus,
        },
        {
            name: 'Playlists',
            path: `channel/${userData?.username}/playlists`, // /channel/:${userData.username}/....   we only need color(:) in defining the Route path first time in main.jsx , while navigating we dont need it
            icon: <i className="fa-regular fa-square-plus"></i>,
            shouldShow: loginStatus,
        },
        {
            name: 'Admin',
            path: 'admin',
            icon: <i className="fa-solid fa-user"></i>,
            shouldShow: loginStatus,
        },
        {
            name: 'Subscribers',
            path: 'subscribers',
            icon: <i className="fa-solid fa-user-group"></i>,
            shouldShow: true,
        },
        {
            name: 'Support',
            path: 'support',
            icon: <i className="fa-regular fa-circle-question"></i>,
            shouldShow: true,
        },
        {
            name: 'Settings',
            path: 'settings',
            icon: <i className="fa-solid fa-gear"></i>,
            shouldShow: loginStatus,
        },
    ];

    const hamburgurElements = hamburgurItems.map(
        (item) =>
            item.shouldShow && (
                <li
                    key={item.name}
                    value={item.name}
                    onClick={() => setHamburgurMenuDisplay(false)}
                    className="w-full h-full mb-2"
                >
                    <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                            `${
                                isActive
                                    ? 'border-[#8871ee]'
                                    : 'border-[#b5b4b4]'
                            } border-[0.01rem] h-full flex items-center justify-start hover:border-[#8871ee] py-1 px-3 text-[1.05rem]`
                        }
                    >
                        <span className="text-md w-5 flex items-center justify-center">
                            {item.icon}
                        </span>{' '}
                        <span className="ml-3">{item.name}</span>
                    </NavLink>
                </li>
            )
    );

    return (
        <header className="w-full h-[80px] fixed top-0 z-[140] border-b-[0.01rem] border-[#b5b4b4] bg-[#0c0c0c] text-white flex items-center justify-between px-5">
            <div className="">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                    <Link to="">
                        <img
                            src="/sunflower.jpg"
                            alt="logo"
                            className="h-full w-full object-cover"
                        />
                    </Link>
                </div>
            </div>

            <div className="w-full h-full flex items-center justify-center relative">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch(search);
                    }}
                    className="w-full px-7 lg:w-[650px] h-11 flex items-center justify-center relative"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search"
                        value={search}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={handleBlur}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-full text-[1rem] rounded-l-lg indent-3 bg-transparent text-white border-[0.01rem] border-[#545454] placeholder:text-[1.15rem] placeholder:text-[#b5b4b4] focus:outline-none focus:border-[#8871ee]"
                    />
                    <button
                        type="button"
                        ref={cancelSearchRef}
                        onClick={() => {
                            setSearch('');
                            inputRef.current.focus();
                        }}
                        className={`${
                            search ? 'block' : 'hidden'
                        } absolute top-[3px] right-[87px] text-2xl text-[#cbcbcb] hover:bg-[#343434] size-10 rounded-full flex items-center justify-center`}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <button
                        type="submit"
                        className="cursor-pointer bg-[#191919] text-[#cbcbcb] hover:bg-[#242424] rounded-r-lg h-full w-16 text-[1.4rem] border-[.01rem] border-[#545454] active:border-[#3d3d3d]"
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>

                {/* search drop-down */}
                {showDropdown && dropDownResults.length > 0 && (
                    <div className="absolute top-[85%] w-[90%] lg:w-[600px] bg-[#1c1c1c] rounded-xl overflow-hidden py-3 shadow-sm shadow-[#000000]">
                        {dropDownItemsElements}
                    </div>
                )}
            </div>

            {loginStatus ? (
                <div className="hidden sm:flex h-full gap-5 items-center">
                    <div className="h-9">
                        <Logout />
                    </div>

                    <div className="w-11 h-11 border-[0.01rem] border-[#b5b4b4] overflow-hidden rounded-full ">
                        <Link to={`channel/${userData?.username}`}>
                            <img
                                src={userData?.avatar}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="hidden sm:flex h-full items-center">
                    <ul className="flex items-center gap-6 h-9">
                        {navElements}
                    </ul>
                </div>
            )}

            {/* hamburgur button */}
            <div className="sm:hidden pr-2">
                <button
                    className="text-[2.3rem] flex items-center hover:text-[#8871ee] active:text-[#674be8]"
                    onClick={() => setHamburgurMenuDisplay(true)}
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            {/* hamburgur menu */}
            <AnimatePresence>
                {hamburgurMenuDisplay && (
                    <motion.div
                        ref={ref}
                        onClick={closeHamburgurMenu}
                        className="fixed inset-0 z-[130] h-full sm:hidden"
                        variants={hamburgurVariants}
                        initial="beginning"
                        animate="end"
                        exit="exit"
                    >
                        <div className="w-[55%] h-full ml-auto bg-[#0c0c0c] relative border-l-[0.01rem] border-[#b5b4b4]">
                            <div className="h-[80px] border-b-[0.01rem] border-[#b5b4b4] flex items-center px-4 relative">
                                <div
                                    onClick={() =>
                                        setHamburgurMenuDisplay(false)
                                    }
                                    className="w-[50px] h-[50px] rounded-full overflow-hidden"
                                >
                                    <Link to="">
                                        <img
                                            src="/sunflower.jpg"
                                            alt="logo"
                                            className="h-full w-full object-cover"
                                        />
                                    </Link>
                                </div>
                                {loginStatus && (
                                    <div className="h-9 absolute right-[15px]">
                                        <Logout />
                                    </div>
                                )}
                            </div>

                            <div className="p-2 w-full">
                                <ul className="">{hamburgurElements}</ul>
                            </div>

                            <div
                                onClick={() => setHamburgurMenuDisplay(false)}
                                className="h-[80px] w-full absolute bottom-0 px-3 flex items-center justify-start"
                            >
                                {loginStatus && (
                                    <div
                                        onClick={() =>
                                            navigate(
                                                `channel/${userData?.username}`
                                            )
                                        }
                                        className="cursor-pointer flex h-full w-fit gap-[10px] items-center justify-start"
                                    >
                                        <div className="w-[47px] h-[47px] border-[0.01rem] border-[#b5b4b4] overflow-hidden rounded-full ">
                                            <div>
                                                <img
                                                    src={userData?.avatar}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start justify-center pb-[5px] leading-[23px]">
                                            <div className="text-[1.15rem]">
                                                {userData?.fullname}
                                            </div>
                                            <div className="text-[0.9rem] text-[#b5b4b4]">
                                                {'@' + userData?.username}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {!loginStatus && (
                                    <div className="w-full">
                                        <ul className="flex items-center gap-5 h-9">
                                            {navElements}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Header;
