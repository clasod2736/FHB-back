const mongoose = require('mongoose')


async function connectDB () {
    const url = "mongodb+srv://clasod2736:bbW0slDqnopgr0p0@joons.ktbaivy.mongodb.net/?retryWrites=true&w=majority"
    await mongoose.connect(url, {useNewUrlParser: true});
    console.log("database connected")
}

module.exports = connectDB;