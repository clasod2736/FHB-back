const express = require("express");
const router = express.Router();
const FHB = require("../../model/userData");

router.put("/logOut", async function (req, res) {
  const userEmail = req.body.userEmail;

  try {
    await FHB.findOneAndUpdate(
      {
        email: userEmail,
      },
      {
        $set: {
          refreshToken: "",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(userEmail, "Logged Out");
    res.status(200);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
