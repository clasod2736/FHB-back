const jwt = require('jsonwebtoken')
const cors = require('cors');
require('dotenv').config();

const getAccessToken = (userData) => {
    try {
        const token = jwt.sign({
            userEmail:userData.email,
            password:userData.password
        }, process.env.ACCESS_SECRET, {
            expiresIn: "5m",
            issuer: "user"
        })
        return token
    }
    catch (error) {
        console.log(error)
    }
}

const getRefreshToken = (userData) => {
    try {
        const token = jwt.sign({
            userEmail:userData.email,
            password:userData.password
        }, process.env.REFRESH_SECRET, {
            expiresIn: "48h",
            issuer: "user"
        })
        return token
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAccessToken,
    getRefreshToken
};