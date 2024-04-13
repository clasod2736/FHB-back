const express = require("express");
const router = express.Router();
const FHB = require("../../model/userData");

router.post("/saveFavourites", async function (req, res) {
  const userEmail = req.body.email;
  const favouriteBrews = req.body.favourites[0];

  try {
    const user = await FHB.findOne({ email: userEmail });

    if (user) {
      if (user.favourites.length >= 5) {
        res.status(422).send(true);
        return;
      } else if (user.favourites.length < 5) {
        user.favourites.push(favouriteBrews);
        await user.save();
      }
    }

    res.send(user.favourites);
    console.log("Fav saved!");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
