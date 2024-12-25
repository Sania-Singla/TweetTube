import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import channelReducer from './Slices/channelSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        channel: channelReducer,
    },
});

export default store;
