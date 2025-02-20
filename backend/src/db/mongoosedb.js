const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://purvagalani:root123@carmart1.te9rl.mongodb.net/newcrm");
        console.log("Connected to DB");
    } catch (error) {
        console.log("Not connected to DB", error);
    }
}

module.exports = connectDB;
