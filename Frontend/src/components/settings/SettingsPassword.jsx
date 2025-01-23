import { useState } from 'react';
import { userServices } from '../../DBservices';
import toast from 'react-hot-toast';

export default function SettingsPassword() {
    const defaultValues = {
        oldPassword: '',
        newPassword: '',
        confirmedPassword: '',
    };

    const defaultErrors = {
        oldPassword: '',
        newPassword: '',
        confirmedPassword: '',
    };

    const [inputs, setInputs] = useState(defaultValues);
    const [error, setError] = useState(defaultErrors);

    // Validate inputs on blur
    const handleBlur = (e) => {
        const { name, value } = e.target;

        if (name === 'newPassword') {
            value.length >= 8
                ? setError((prevError) => ({ ...prevError, newPassword: '' }))
                : setError((prevError) => ({
                      ...prevError,
                      newPassword: 'password must be atleast 8 characters.',
                  }));
        }

        if (name === 'confirmedPassword') {
            value === inputs.newPassword
                ? setError((prevError) => ({
                      ...prevError,
                      confirmedPassword: '',
                  }))
                : setError((prevError) => ({
                      ...prevError,
                      confirmedPassword: "passwords don't match.",
                  }));
        }
    };

    function handleChange(e) {
        const { name, value } = e.target;
        return setInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (error.newPassword || error.confirmedPassword) return;

        const data = await userServices.updatePassword(inputs);

        if (data.message === 'OLD_MATCH_NEW')
            return setError((prevError) => ({
                ...prevError,
                newPassword: "new password shouldn't match old.",
            }));
        else if (data.message === 'WRONG_PASSWORD')
            return setError((prevError) => ({
                ...prevError,
                oldPassword: 'wrong password.',
            }));
        else handleReset();
    }

    function handleReset() {
        toast.success('Password updated successfully');
        setError(defaultErrors);
        setInputs(defaultValues);
    }

    return (
        <div className="w-full h-full bg-[#0c0c0c] flex flex-col p-3 sm:flex-row sm:justify-between gap-4">
            <div className="">
                <p className="text-[1.23rem] text-[#f2f2f2] mb-[3px]">
                    Change Password
                </p>
                <p className="text-[1rem] text-[#c5c5c5]">
                    Update your current password here.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full sm:min-w-[40%] lg:min-w-[70%] sm:max-w-[60%] mt-2 sm:mt-0 p-5 border-[0.01rem] border-[#b5b4b4] rounded-[10px] relative"
            >
                <div className="w-full">
                    <div className="mb-[2px]">
                        <label htmlFor="oldPassword">
                            {' '}
                            Current password :{' '}
                        </label>
                        {error.oldPassword && (
                            <span className="text-red-600 text-sm">
                                {error.oldPassword}
                            </span>
                        )}
                    </div>
                    <input
                        type="password"
                        name="oldPassword"
                        id="oldPassword"
                        placeholder="Enter current password"
                        value={inputs.oldPassword}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-[0.01rem] border-[#b5b4b4] h-10 text-[1.05rem] rounded-md indent-2 mb-4"
                    />
                </div>
                <div className="w-full mb-3">
                    <div className="mb-[2px]">
                        <label htmlFor="newPassword"> New password : </label>
                        {error.newPassword && (
                            <span className="text-red-600 text-sm">
                                {error.newPassword}
                            </span>
                        )}
                    </div>
                    <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        required
                        placeholder="Create new password"
                        value={inputs.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full bg-transparent border-[0.01rem] border-[#b5b4b4] h-10 text-[1.05rem] rounded-md indent-2 "
                    />
                    <span className="text-[#e5e5e5] text-[13px]">
                        Your new password must be atleast 8 characters.
                    </span>
                </div>

                <div className="w-full">
                    <div className="mb-[2px]">
                        <label htmlFor="confirmedPassword">
                            {' '}
                            Confirm password :{' '}
                        </label>
                        {error.confirmedPassword && (
                            <span className="text-red-600 text-sm">
                                {error.confirmedPassword}
                            </span>
                        )}
                    </div>
                    <input
                        type="password"
                        name="confirmedPassword"
                        id="confirmedPassword"
                        placeholder="Confirm new password"
                        value={inputs.confirmedPassword}
                        onChange={handleChange}
                        onInput={handleBlur} //because no input after this so no possible click other than canel or submit
                        required
                        className="w-full bg-transparent border-[0.01rem] border-[#b5b4b4] h-10 text-[1.05rem] rounded-md indent-2 mb-5"
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
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
}
