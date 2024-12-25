import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}${process.env.DB_NAME}`
        );
        return console.log(
            `MongoDB connected !! , host: ${connectionInstance.connection.host}`
        );
    } catch (err) {
        return console.log('MongoDB connection Failed !!', err);
    }
};
