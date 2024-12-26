import { useState } from 'react';
import { userServices } from '../../DBservices';
import { useDispatch } from 'react-redux';
import { logout } from '../../Store/Slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { icons } from '../../assets/icons';

export default function Logout() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleClick() {
        await userServices.logoutUser(setLoading);
        navigate('/');
        dispatch(logout());
    }

    return (
        <div className="bg-[#8871ee] text-[#0c0c0c] h-full w-[70px] font-semibold flex items-center justify-center text-lg py-1 border-[0.01rem] border-[#b5b4b4] active:border-white">
            <button
                onClick={handleClick}
                disabled={loading}
                className="disabled:cursor-not-allowed w-full h-full"
            >
                {loading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="size-5 fill-[#8871ee] dark:text-[#b4b7b7]">
                            {icons.loading}
                        </div>
                    </div>
                ) : (
                    'Logout'
                )}
            </button>
        </div>
    );
}
