export class UserServices {
    async registerUser(inputs, setData, setLoading) {
        //⭐ we dont need any setData state
        try {
            setLoading(true);
            // const newInputs = {
            //     ...inputs,  //wrong
            //     fullname:`${inputs.firstname} ${inputs.lastname}`
            // }

            const formData = new FormData();

            Object.entries(inputs).forEach(([key, value]) => {
                formData.append(key, value);
            });
            //better way👆rather than appending each property like ==> formData.append("username",inputs.username)

            const res = await fetch("/api/v1/users/register", {
                method: "POST",
                // headers:{"Content-Type":"application/json"},   //formdata sets it automatically
                body: formData,
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                //true
                return this.loginUser(setData, setLoading, { loginInput: inputs.username, password: inputs.password }); //could send inputs.email also any one is fine
                // setData(data);  //ye sb loginUser() se ho jayega
                // return data;
                //⭐important : we are using dispatch(Login) in the register component but that will just set the userData in the store but it won't generate the tokens so thats why we needed to call the login fetch to generate the tokens
            } else if (res.status !== 500) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in registerUser service", err.message);
        } finally {
            setLoading(false);
        }
    }

    async loginUser(setData, setLoading, inputs) {
        try {
            setLoading(true);
            const res = await fetch("/api/v1/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            console.log(data);

            if (res.ok) {
                setData(data);
                return data;
            } else if (res.status !== 500) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in loginUser service", err.message);
        } finally {
            setLoading(false);
        }
    }

    async logoutUser(setLoading) {
        try {
            setLoading(true);
            const res = await fetch("/api/v1/users/logout", {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            console.log(data);
            if (res.status === 500) {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in logoutUser service", err.message);
        } finally {
            setLoading(false);
        }
    }

    async getCurrentUser() {
        try {
            const res = await fetch("/api/v1/users/current-user", {
                method: "GET",
                credentials: "include",
                // headers:{"Authorization": `BEARER ${token}`}    // since these are httpOnly cookies we cant access them via JS so just leave it because vaise bhi ye mobile app ke liye hi tha web mein no need
            });
            const data = await res.json();
            console.log(data);
            
            if (res.ok || res.status !== 500) {
                //⭐⭐ALL AUTH ERRORS ARE HANDLED HERE NO NEED TO HANDLE ANYWHERE ELSE
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in getCurrentUser service", err.message);
        }
    }

    async updatePassword(inputs) {
        try {
            const res = await fetch("/api/v1/users/change-password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                return data;
            } else if (res.status !== 500) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in updatePassword service", err.message);
        }
    }

    async updateAccountDetails(inputs) {
        try {
            const newInputs = {
                email: inputs.email,
                password: inputs.password,
                fullname: `${inputs.firstname} ${inputs.lastname}`,
            };

            // const formData = new FormData();
            // Object.entries(newInputs).forEach(([key, value]) => {
            //     formData.append(key, value);
            // });
            //important⭐⭐⭐if no files are there then use simple json string as body else if using formdata then in backend will have to specify ==> upload.none()

            const res = await fetch("/api/v1/users/update-account", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newInputs),
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                return data;
            } else if (res.status !== 500) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in updateAccountDetails service", err.message);
        }
    }

    async updateAvatar(avatar) {
        try {
            const formData = new FormData();
            formData.append("avatar", avatar);

            const res = await fetch("/api/v1/users/avatar", {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in updateAvatar service", err.message);
        }
    }

    async updateCoverImage(coverImage) {
        try {
            const formData = new FormData();
            formData.append("coverImage", coverImage);

            const res = await fetch("/api/v1/users/cover-image", {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in updateCoverImage service", err.message);
        }
    }

    async updateChannelInfo(inputs) {
        try {
            const res = await fetch("/api/v1/users/update-channel-info", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                return data;
            } else if (res.status !== 500) {
                return data;
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            return console.log("error in updateUsername service", err.message);
        }
    }

    async refreshAccessToken() {}
}

const userServices = new UserServices();
export default userServices;
