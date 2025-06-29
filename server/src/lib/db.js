import mongoose from 'mongoose'

export const connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected: ", connection.connection.host)
    } catch (error) {
        console.error("MongoDB connection error: ", error)
    }
}
