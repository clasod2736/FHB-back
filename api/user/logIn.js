const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwtUtils = require("../../jwt/jwt");
const { send } = require("express/lib/response.js");
const FHB = require("./model/userData.js");

router.post("/login", async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  try {
    const userInfo = await FHB.findOne({
      email: userEmail,
    });

    if (userInfo) {
      const data = userInfo;

      bcrypt.compare(userPassword, data.password, (error, result) => {
        try {
          if (data.password === null) {
            res.sendStatus(400), send(express);
          } else if (!result) {
            res.sendStatus(404);
          }
        } catch (error) {
          console.log(error);
        }
      });

      const accessToken = jwtUtils.postAccessToken(data);
      const refreshToken = jwtUtils.postRefreshToken(data);

      // Send JWT tokento the client
      res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userInfo: userInfo,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
