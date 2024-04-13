const express = require("express");
const router = express.Router();
const FHB = require("./model/userData.js");

router.post("/saveHistory", async function (req, res) {
  const userEmail = req.body.email;
  const oldBrews = req.body.oldBrews[0];

  try {
    const user = await FHB.findOne({ email: userEmail });

    if (user) {
      if (user.oldBrews.length >= 50) {
        // If the array has 10 or more elements, remove the oldest one
        user.oldBrews.shift();
      }

      user.oldBrews.push(oldBrews);
      await user.save();
    } else {
      res.status(404).send("Hisotry not saved!");
    }

    res.send(user.oldBrews);
    console.log("Recent history Saved!");
  } catch (error) {
    console.log(error);
    res.send("Server Error");
  }
});

module.exports = router;
