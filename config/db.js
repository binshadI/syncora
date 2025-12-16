const mongoose = require('mongoose')
require('dotenv').config();


async function connectDb() {
    try {
        await mongoose.connect(process.env.CONNECTIONSTRING);
        console.log("database connected");

    } catch (e) {
        console.log(e)
    }
}


module.exports = connectDb