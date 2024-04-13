const express = require("express");
const router = express.Router();
const FHB = require("./model/userData.js");

router.get("/getOldbrews", async (req, res) => {
  try {
    const user = await FHB.findOne({ email: req.query.email });

    res.send(user.oldBrews);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
