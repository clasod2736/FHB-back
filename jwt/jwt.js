const jwt = require("jsonwebtoken");
require("dotenv").config();

//create access tokens
const postAccessToken = (userData) => {
  try {
    const token = jwt.sign(
      {
        email: userData.email,
        id: userData._id,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "5m",
        issuer: "user",
      }
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

//create refresh tokens
const postRefreshToken = (userData) => {
  try {
    const token = jwt.sign(
      {
        email: userData.email,
        id: userData._id,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "24h",
        issuer: "user",
      }
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

//verify tokens
const verifyAccessToken = (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    return decoded;
  } catch (error) {
    console.log(error);
  }
};

const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    return decoded;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  postAccessToken,
  postRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
