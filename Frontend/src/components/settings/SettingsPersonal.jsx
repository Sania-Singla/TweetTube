import { useState, useEffect } from 'react';
import { useAuthHook } from '../../hooks';
import { userServices } from '../../DBservices';
import { useDispatch } from 'react-redux';
import { login } from '../../Store/Slices/userSlice';

export default function SettingsPersonal() {
    // const [loading,setLoading] = useState(true);    // krlo agr krni hai loading state but no need because this is more like a static page because store se hi info aa ri hai so won't take any time
    const { userData } = useAuthHook();
    const dispatch = useDispatch();

    const defaultValues = {
        firstname: userData.fullname.includes(' ')
            ? userData.fullname.split(' ')[0]
            : userData.fullname,
        lastname: userData.fullname.includes(' ')
            ? userData.fullname.split(' ')[1]
            : '',
        email: userData.email,
        password: '',
    };

    const defaultErrors = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    };

    const [inputs, setInputs] = useState(defaultValues);
    const [error, setError] = useState(defaultErrors);

    // Validate inputs on blur
    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (name === 'email') {
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
                ? setError((prevError) => ({ ...prevError, email: '' }))
                : setError((prevError) => ({
                      ...prevError,
                      email: 'please enter a valid email.',
                  }));
        }

        if (name === 'firstname') {
            /^[a-zA-Z]+$/.test(value)
                ? setError((prevError) => ({ ...prevError, firstname: '' }))
                : setError((prevError) => ({
                      ...prevError,
                      firstname: 'only letters are allowed.',
                  }));
        }

        if (name === 'lastname') {
            /^[a-zA-Z]+$/.test(value)
                ? setError((prevError) => ({ ...prevError, lastname: '' }))
                : setError((prevError) => ({
                      ...prevError,
                      lastname: 'only letters are allowed.',
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
        if (
            error.email ||
            error.firstname ||
            (inputs.lastname && error.lastname)
        )
            return;
        const newData = await userServices.updateAccountDetails(inputs);
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
                    Personal Info
                </p>
                <p className="text-[1rem] text-[#c5c5c5]">
                    Update your personal details here.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full sm:min-w-[40%] sm:max-w-[60%] lg:max-w-[70%] mt-2 sm:mt-0 p-5 border-[0.01rem] border-[#b5b4b4] rounded-[10px] relative"
            >
                <div className="flex flex-col items-center justify-between lg:flex-row lg:gap-5">
                    <div className="w-full">
                        <div className="mb-[2px]">
                            <label htmlFor="firstname"> First name : </label>
                            {error.firstname && (
                                <span className="text-red-600 text-sm">
                                    {error.firstname}
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            name="firstname"
                            id="firstname"
                            placeholder="Enter first name"
                            value={inputs.firstname}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className="w-full bg-transparent border-[0.01rem] border-[#b5b4b4] h-10 text-[1.05rem] rounded-md indent-2 mb-2"
                        />
                    </div>
                    <div className="w-full">
                        <div className="mb-[2px]">
                            <label htmlFor="lastname"> Last name : </label>
                            {error.lastname && (
                                <span className="text-red-600 text-sm">
                                    {error.lastname}
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            name="lastname"
                            id="lastname"
                            placeholder="Enter last name"
                            value={inputs.lastname}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className="w-full bg-transparent border-[0.01rem] border-[#b5b4b4] h-10 text-[1.05rem] rounded-md indent-2 mb-2"
                        />
                    </div>
                </div>

                <div className="w-full">
                    <div className="mb-[2px]">
                        <label htmlFor="email"> Email : </label>
                        {error.email && (
                            <span className="text-red-600 text-sm">
                                {error.email}
                            </span>
                        )}
                    </div>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter email"
                        value={inputs.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        className="w-full bg-transparent border-[0.01rem] border-[#b5b4b4] h-10 text-[1.05rem] rounded-md indent-2 mb-2"
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
