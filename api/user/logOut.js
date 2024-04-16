const express = require("express");
const router = express.Router();
const FHB = require("../../model/userData");

router.put("/logOut", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const deleteRefresh = await FHB.findOneAndUpdate(
      {
        email: userEmail,
      },
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(userEmail, "Logged Out");
    res.status(200).send(deleteRefresh);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = router;
