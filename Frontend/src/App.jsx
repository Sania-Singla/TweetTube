import { useDispatch } from 'react-redux';
import { Layout } from './components';
import { useEffect, useState } from 'react';
import { login, logout } from './Store/Slices/userSlice';
import { userServices } from './DBservices';
import { icons } from './assets/icons';

export default function App() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        (async function getCurrentUser() {
            try {
                setLoading(true);
                const user = await userServices.getCurrentUser();
                if (user && !user.message) dispatch(login(user));
                else dispatch(logout());
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return loading ? (
        <div className="text-white bg-[#0c0c0c] h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <div className="size-[80px] fill-[#8871ee] dark:text-[#b4b7b7]">
                    {icons.loading}
                </div>
                <div className="text-3xl mt-2">Please wait ...</div>
                <div className="text-lg mt-2 text-[#c4c2c2]">
                    Please refresh the page if it takes too long
                </div>
            </div>
        </div>
    ) : (
        <Layout />
    );
}
