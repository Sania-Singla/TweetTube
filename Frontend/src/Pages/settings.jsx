import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { PulseSettings } from '../components';
import { useAuthHook } from '../hooks';
import { userServices } from '../DBservices';
import { useDispatch } from 'react-redux';
import { login } from '../Store/Slices/userSlice';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { userData } = useAuthHook();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const coverImageRef = useRef();
    const avatarRef = useRef();

    useEffect(() => {
        if (userData) setLoading(false); //although since getting data from store only so won't take any time so no need of loading and pulses
    }, []);

    const options = [
        {
            name: 'Personal Information',
            path: ``,
        },
        {
            name: 'Channel Information',
            path: `change-channel-info`,
        },
        {
            name: 'Change Password',
            path: `change-password`,
        },
    ];

    const optionsElements = options.map((option) => (
        <div
            key={option.name}
            className="flex items-center justify-center w-1/3 mx-[3px]"
        >
            <NavLink
                to={option.path}
                end
                className={({ isActive }) =>
                    `${
                        isActive
                            ? 'bg-white font-semibold border-b-[0.13rem] border-[#8871ee] text-[#0c0c0c]'
                            : 'text-[#ffffff]'
                    } py-[3px] w-full h-full text-center text-[1rem] md:text-[1.05rem]`
                }
            >
                {option.name}
            </NavLink>
        </div>
    ));

    function coverImageInput() {
        coverImageRef.current.click();
    }

    function avatarInput() {
        avatarRef.current.click();
    }

    async function handleFileChange(e) {
        console.log(`changed${e.target.name}`);
        let { files, name } = e.target;
        if (name === 'avatar' && files[0]) {
            const avatar = files[0];
            const data = await userServices.updateAvatar(avatar);
            if (data) {
                toast.success('Avatar updated successfully');
                dispatch(login(data));
            }
        } else if (name === 'coverImage' && files[0]) {
            const coverImage = files[0];
            const data = await userServices.updateCoverImage(coverImage);
            if (data) {
                toast.success('Cover Image updated successfully');
                dispatch(login(data));
            }
        }
    }

    if (loading) {
        // pulses
        return <PulseSettings />;
    } else {
        return (
            <div className="text-white relative">
                <div className="w-full relative">
                    {userData.coverImage ? (
                        <div className="w-full h-[170px] sm:h-[200px] overflow-hidden">
                            <img
                                src={userData.coverImage}
                                alt="cover image"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="bg-slate-700 w-full h-[170px] sm:h-[200px]"></div>
                    )}

                    {/* coverImage update input and btn */}
                    <input
                        ref={coverImageRef}
                        type="file"
                        name="coverImage"
                        id="coverImage"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={coverImageInput}
                        className="bg-white opacity-70 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-[6px] rounded-lg"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="35px"
                            viewBox="0 -960 960 960"
                            width="35px"
                            fill="black"
                        >
                            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                        </svg>
                    </button>
                </div>

                <div className="relative top-[-15px] flex items-center ml-1">
                    <div className="relative w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] overflow-hidden rounded-full border-2 border-[#b5b4b4]">
                        <div className="">
                            <img
                                src={userData.avatar}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* avatar update input and btn */}
                        <input
                            ref={avatarRef}
                            type="file"
                            id="avatar"
                            name="avatar"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={avatarInput}
                            className="bg-white opacity-70 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-[4px] rounded-lg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="30px"
                                viewBox="0 -960 960 960"
                                width="30px"
                                fill="black"
                            >
                                <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                            </svg>
                        </button>
                    </div>

                    <div className="ml-[15px]">
                        <div className="text-2xl sm:text-3xl mt-4 sm:mt-1 font-semibold">
                            {userData.fullname}
                        </div>
                        <div className="text-lg text-[#c1c1c1]">
                            {'@' + userData.username}
                        </div>
                    </div>

                    <div className="absolute right-[20px] top-[40px] md:right-[30px]">
                        <button
                            className="bg-[#8871ee] text-[#0c0c0c] p-[4px] text-lg border-[0.01rem] border-[#b5b4b4] active:border-white"
                            onClick={() =>
                                navigate(`/channel/${userData.username}`)
                            }
                        >
                            <span className="font-semibold">View channel</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-evenly w-full mb-[6px]">
                    {optionsElements}
                </div>

                <hr className="mb-[6px] border-[0.01rem] border-[#b5b4b4]" />

                <Outlet />
            </div>
        );
    }
}
