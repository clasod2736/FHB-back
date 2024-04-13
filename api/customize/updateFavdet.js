const express = require("express");
const router = express.Router();
const FHB = require("../../model/userData");

router.put("/updateFavDetails", async function (req, res) {
  const userEmail = req.body.email;
  const newFavs = req.body.favourites;

  try {
    const updateFavDetail = await FHB.findOneAndUpdate(
      {
        email: userEmail,
      },
      {
        $set: {
          favourites: newFavs,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).send(updateFavDetail);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
