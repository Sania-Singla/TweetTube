import { useState } from 'react';
import { userServices } from '../DBservices';
import { useDispatch } from 'react-redux';
import { login } from '../Store/Slices/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { icons } from '../assets/icons';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [inputs, setInputs] = useState({
        loginInput: '', //could be username/email
        password: '',
    });

    const [error, setError] = useState({
        root: '',
    });

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const disptach = useDispatch();
    const navigate = useNavigate();

    //on input change()
    function handleChange(e) {
        const { value, name } = e.target;
        return setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    }

    const inputFields = [
        {
            id: 'loginInput',
            name: 'loginInput',
            type: 'text',
            placeholder: 'Enter username or email',
            required: true,
            label: 'Username or email',
        },
        {
            id: 'password',
            name: 'password',
            type: 'password',
            placeholder: 'Enter your password',
            required: true,
            label: 'Password',
        },
    ];

    const inputElements = inputFields.map((input) => (
        <div className="w-[320px] mb-5" key={input.id}>
            <div className="mb-[1px]">
                {input.required && (
                    <span className="text-red-600 mr-[2px]">*</span>
                )}
                <label htmlFor={input.id}>{input.label}</label>
            </div>
            <input
                type={input.type}
                placeholder={input.placeholder}
                required={input.required}
                name={input.name}
                value={inputs[input.name]}
                onChange={handleChange}
                className="h-10 w-full indent-3 bg-transparent border-[0.01rem] border-[#b5b4b4] rounded-[5px]"
            />
        </div>
    ));

    //onsubmit()
    async function handleSubmit(e) {
        e.preventDefault();

        if (error.loginInput || error.password) return;
        const userData = await userServices.loginUser(
            setData,
            setLoading,
            inputs
        );
        if (
            userData.message === 'USER_NOT_FOUND' ||
            userData.message === 'WRONG_PASSWORD'
        ) {
            setError((prevError) => ({
                ...prevError,
                root: 'wrong password.',
            }));
        } //because req gyi hai becuase agr details hi entered nhi thi toh hmne request bhene hi nhi dii  //so user is not found message received from backend
        else {
            toast.success('Login Successfull');
            disptach(login(userData));
            navigate('/');
        }
    }

    return (
        <div className="fixed inset-0 bg-[#0c0c0c] z-[150] flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                        <Link to="/">
                            <img src="/sunflower.jpg" alt="logo" />
                        </Link>
                    </div>
                    <h2 className="font-semibold text-[1.65rem] mt-5">LOGIN</h2>
                    <h3 className="text-lg mt-1">
                        Don't have an Account yet ?
                        <Link
                            to="/register"
                            className="text-[1rem] text-blue-700"
                        >
                            {' '}
                            Sign up
                        </Link>
                    </h3>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '120%' }}
                        transition={{ duration: 0.3 }}
                        className=" h-[0.005rem] mt-2 bg-[#9e9e9e]"
                    ></motion.div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-3 flex flex-col items-start justify-center"
                >
                    {error.root && (
                        <p className="text-red-600 w-full text-md mb-2 text-center">
                            {error.root}
                        </p>
                    )}
                    {inputElements}
                    <div className="w-full text-center mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="disabled:cursor-not-allowed w-full bg-[#8871ee] text-lg h-12 border-[0.09rem] border-[#b5b4b4] border-solid hover:border-dotted hover:bg-[#6856b5]"
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
                    </div>
                </form>
            </div>
        </div>
    );
}
