const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let db;

const connectDb = async () => {
    try {
        const mongoString = process.env.DATABASE_URL;
        await mongoose.connect(mongoString);
        db = mongoose.connection;
        console.log('Connected to MongoDB');
        return db; // Returning the connection object
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

const getDb = () => db;

module.exports = { connectDb, getDb };
