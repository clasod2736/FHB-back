const jwt = require("jsonwebtoken");
require("dotenv").config();

//Post tokens
const postAccessToken = (userData) => {
  try {
    const token = jwt.sign(
      {
        email: userData.email,
        password: userData.password,
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
const postRefreshToken = (userData) => {
  try {
    const token = jwt.sign(
      {
        email: userData.email,
        password: userData.password,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "48h",
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
