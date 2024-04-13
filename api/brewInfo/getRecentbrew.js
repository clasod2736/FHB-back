const express = require("express");
const router = express.Router();
const FHB = require("./model/userData.js");

router.get("/getRecentbrew", async (req, res) => {
  try {
    const user = await FHB.findOne({ email: req.query.email });

    const sortedBrews = user.oldBrews.sort((a, b) => b.order - a.order);
    const recentbrew = sortedBrews[0];

    res.send(recentbrew);
    console.log("Sent Recent Brew!");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
