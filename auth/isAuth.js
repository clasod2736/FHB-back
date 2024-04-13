const express = require("express");
const router = express.Router();
const jwtUtils = require("../jwt/jwt");

router.get("/isAuth", (req, res) => {
  // load tokens
  const accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.headers["refresh-token"];

  // verify token
  const decodedAccess = jwtUtils.verifyAccessToken(accessToken);
  const decodedRefresh = jwtUtils.verifyRefreshToken(refreshToken);

  try {
    if (decodedAccess) {
      const accessPayload = {
        email: decodedAccess.email,
      };
      res.json({ userEmail: accessPayload.email }).status(200);
    } else if (decodedRefresh) {
      const newPayload = {
        email: decodedRefresh.email,
      };

      const newAccessToken = jwtUtils.postAccessToken(newPayload);

      res
        .json({
          newAccessToken: newAccessToken,
          userEmail: newPayload.email,
        })
        .status(200);
      console.log("New access token generated");
    } else res.sendStatus(404);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
