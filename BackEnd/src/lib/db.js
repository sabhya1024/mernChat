import mongoose from 'mongoose'

import dotenv from 'dotenv'

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.db_conn);
        console.log(`DB connected : ${conn.connection.host}`)
        
    }
    catch (error) {
        console.log('Failed to connect to DB. ')
        process.exit(1);
    }
}

export default connectDB

