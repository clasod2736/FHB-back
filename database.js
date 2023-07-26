const mongoose = require('mongoose')
require('dotenv').config();
const { MONGODB_URL } = process.env;


async function connectDB () {
    await mongoose.connect(MONGODB_URL, {useNewUrlParser: true});
    console.log("database connected")
}

module.exports = connectDB;