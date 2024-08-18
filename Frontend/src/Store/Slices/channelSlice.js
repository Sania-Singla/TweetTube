import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    channelData:{},
}

const channelSlice = createSlice({
    name:"channel",
    initialState,
    reducers:{
        storeChannelData: (state,action) => {
            state.channelData = action.payload;
        },
    }
})

export default channelSlice.reducer;

export const {storeChannelData} = channelSlice.actions;