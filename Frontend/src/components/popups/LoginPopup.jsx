import { useState } from 'react';
import { userServices } from '../../DBservices';
import { useDispatch } from 'react-redux';
import { login } from '../../Store/Slices/userSlice';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { icons } from '../../assets/icons';

function LoginPopup({ popupText, close }) {
    const [inputs, setInputs] = useState({
        loginInput: '',
        password: '',
    });

    const [error, setError] = useState({
        root: '',
    });

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const disptach = useDispatch();

    //on input change()
    function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    }

    //onsubmit()
    async function handleSubmit(e) {
        e.preventDefault();

        if (error.loginInput || error.password) return;
        const userData = await userServices.loginUser(
            setData,
            setLoading,
            inputs
        );
        if (userData) {
            disptach(login(userData));
            close();
        } else {
            setError((prevError) => ({
                ...prevError,
                root: 'Invalid Credentials.',
            }));
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-[#13161f] backdrop-blur-sm opacity-90 border-[0.01rem] border-[#757575] border-dotted rounded-md shadow-black shadow-md w-[400px] pt-5 pb-3">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                    <Link to="/">
                        <img src="/sunflower.jpg" alt="logo" />
                    </Link>
                </div>
                <h2 className="text-[1.5rem] mt-2">Sign in to {popupText}</h2>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 0.3 }}
                    className=" h-[0.005rem] mt-[2px] bg-[#9e9e9e]"
                ></motion.div>
                <button onClick={close} className="absolute right-1 top-1">
                    <X size={27} />
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-start justify-center mt-2"
            >
                <div className="w-full h-7">
                    {error.root && (
                        <p className="text-red-600 w-full text-[1.1rem] text-center">
                            {error.root}
                        </p>
                    )}
                </div>

                <div className="w-full mt-2">
                    <div>
                        <label htmlFor="loginInput">
                            <span className="text-red-600">*</span>{' '}
                            Username/email :{' '}
                        </label>
                        {error.loginInput && (
                            <span className="text-red-600 text-sm">
                                {' '}
                                {error.loginInput}
                            </span>
                        )}
                    </div>

                    <input
                        type="text"
                        name="loginInput"
                        id="loginInput"
                        value={inputs.loginInput}
                        onChange={handleChange}
                        required
                        placeholder="enter your username or email"
                        className="h-10 w-[320px] mt-[1px] indent-3 placeholder:text-[#d9d9d9] bg-transparent border-[0.01rem] border-[#e8e8e8] rounded-[5px]"
                    />
                </div>

                <div className="mt-3">
                    <div>
                        <label htmlFor="password">
                            <span className="text-red-600">*</span> Password :{' '}
                        </label>
                        {error.password && (
                            <span className="text-red-600 text-sm">
                                {' '}
                                {error.password}
                            </span>
                        )}
                    </div>

                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={inputs.password}
                        onChange={handleChange}
                        required
                        placeholder="enter your password"
                        className="h-10 w-[320px] mt-[1px] indent-3 bg-transparent placeholder:text-[#d9d9d9]  border-[0.01rem] border-[#e8e8e8] rounded-[5px]"
                    />
                </div>

                <div className="w-full text-center mt-7">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8871ee] text-lg h-10 border-[0.09rem] border-[#e8e8e8] border-dotted"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center w-full">
                                <div className="size-5 fill-[#8871ee] dark:text-[#b4b7b7]">
                                    {icons.loading}
                                </div>
                            </div>
                        ) : (
                            'Login'
                        )}
                    </button>

                    <h3 className="text-lg mt-1">
                        don't have an Account yet ?
                        <Link
                            to="/register"
                            className="text-[1rem] text-[#8871ee] brightness-125"
                        >
                            {' '}
                            Sign up{' '}
                        </Link>
                    </h3>
                </div>
            </form>
        </div>
    );
}

export default LoginPopup;
