import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loginStatus: false,
    userData: null
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        login: (state,action) => {
            state.loginStatus = true;
            state.userData = action.payload;
        },

        logout: (state,action) => {
            state.loginStatus = false;
            state.userData = null;
        },

    }
})

export default userSlice.reducer;

export const {login, logout} = userSlice.actions;