const express = require("express");
const router = express.Router();
const FHB = require("./model/userData.js");

router.put("/updateDescription", async function (req, res) {
  const favName = req.body.favourites.favName;
  const description = req.body.favourites.description;

  try {
    const updateMenuName = await FHB.findOneAndUpdate(
      {
        "favourites.favName": favName,
      },
      {
        $set: {
          "favourites.$.description": description,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(description, "saved.");
    res.status(200).send(updateMenuName);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
