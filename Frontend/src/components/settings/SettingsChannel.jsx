import { useState } from 'react';
import { useAuthHook } from '../../hooks';
import { userServices } from '../../DBservices';
import { useDispatch } from 'react-redux';
import { login } from '../../Store/Slices/userSlice';

export default function SettingsChannel() {
    const { userData } = useAuthHook();
    const dispatch = useDispatch();

    const defaultValues = {
        username: userData.username,
        password: '',
        description: userData.description,
    };

    const defaultErrors = {
        username: '',
        password: '',
    };

    const [inputs, setInputs] = useState(defaultValues);
    const [error, setError] = useState(defaultErrors);

    // Validate inputs on blur
    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (name === 'username') {
            /^[a-zA-Z0-9_]+$/.test(value)
                ? setError((prevError) => ({ ...prevError, username: '' }))
                : setError((prevError) => ({
                      ...prevError,
                      username:
                          'only numbers, letters and underscores are allowed.',
                  }));
        }
    };

    function handleInputChange(e) {
        const { name, value } = e.target;
        return setInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (error.username) return;
        const newData = await userServices.updateChannelInfo(inputs);
        if (newData.message === 'WRONG_PASSWORD')
            return setError((prevError) => ({
                ...prevError,
                password: 'wrong password.',
            }));
        else {
            dispatch(login(newData));
            setError(defaultErrors);
            setInputs((prev) => ({ ...prev, password: '' }));
        }
    }

    function handleReset() {
        setError(defaultErrors);
        setInputs(defaultValues);
    }

    return (
        <div className="w-full h-full bg-[#0c0c0c] flex flex-col p-3 sm:flex-row sm:justify-between gap-4">
            <div className="">
                <p className="text-[1.23rem] text-[#f2f2f2] mb-[3px]">
                    Channel Info
                </p>
                <p className="text-[1rem] text-[#c5c5c5]">
                    Update your channel details here.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full sm:min-w-[40%] sm:max-w-[60%] lg:max-w-[70%] mt-2 sm:mt-0 p-5 border-[0.01rem] border-[#b5b4b4] rounded-[10px] relative"
            >
                <div className="w-full mb-2">
                    <div className="mb-[2px]">
                        <label htmlFor="username"> User name : </label>
                        {error.username && (
                            <span className="text-red-600 text-sm">
                                {error.username}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center border-[0.01rem] border-[#b5b4b4] h-10 rounded-md">
                        <div className="pl-2 pr-3">tweettube.com/</div>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter username"
                            value={inputs.username}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className="w-full bg-transparent border-l-[0.01rem] border-[#b5b4b4] rounded-l-0 rounded-r-md h-full text-[1.05rem] indent-2"
                        />
                    </div>
                </div>

                <div className="w-full">
                    <div className="mb-[2px]">
                        <label htmlFor="description"> Description : </label>
                        {error.username && (
                            <span className="text-red-600 text-sm">
                                {error.username}
                            </span>
                        )}
                    </div>
                    <textarea
                        name="description"
                        id="description"
                        rows={5}
                        placeholder="Enter channel description"
                        value={inputs.description}
                        onChange={handleInputChange}
                        className="w-full pt-[3px] bg-transparent border-[0.01rem] border-[#b5b4b4] text-[1.05rem] rounded-md indent-2"
                    />
                </div>

                <div className="w-full">
                    <div>
                        <label htmlFor="password">Password : </label>
                        {error.password && (
                            <span className="text-red-600 text-sm">
                                {error.password}
                            </span>
                        )}
                    </div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter Your password"
                        required
                        value={inputs.password}
                        onChange={handleInputChange}
                        className="mt-[2px] w-full bg-transparent border-[0.01rem] border-[#b5b4b4] h-10 text-[1.05rem] rounded-md indent-2 mb-5"
                    />
                </div>

                <hr className="border-[0.01rem] border-[#b5b4b4] absolute w-full left-0" />

                <div className="flex items-center justify-end mt-5 gap-5 w-full">
                    <button
                        type="reset"
                        onClick={handleReset}
                        className="bg-[#0c0c0c] border-[0.01rem] border-[#b5b4b4] rounded-lg py-1 px-2 text-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-[#8871ee] border-[0.01rem] text-[#0c0c0c] border-[#b5b4b4] border-dotted py-[3.2px] px-2 text-lg"
                    >
                        Save changes
                    </button>
                </div>
            </form>
        </div>
    );
}
