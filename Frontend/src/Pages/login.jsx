import { useState } from 'react';
import userServices from '../DBservices/userServices';
import { useDispatch } from 'react-redux';
import { login } from '../Store/Slices/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
                                    <svg
                                        aria-hidden="true"
                                        className="inline w-5 h-5 animate-spin dark:text-[#b5b4b4] fill-[#8871ee]"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
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
