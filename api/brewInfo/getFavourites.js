const express = require("express");
const router = express.Router();
const FHB = require("./model/userData.js");

router.get("/getFavourites", async (req, res) => {
  try {
    const user = await FHB.findOne({ email: req.query.email });

    res.send(user.favourites);
    console.log("Sent Favourites");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
