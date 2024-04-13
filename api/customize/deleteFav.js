const express = require("express");
const router = express.Router();
const FHB = require("./model/userData.js");

router.delete("/deleteFav", async function (req, res) {
  const favName = req.query.favName;

  try {
    await FHB.updateOne(
      { "favourites.favName": favName },
      { $pull: { favourites: { favName: favName } } }
    );
    console.log("Fav Deleted!");
    res.sendStatus(200);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

module.exports = router;
