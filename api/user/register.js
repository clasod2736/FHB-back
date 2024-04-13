const express = require("express");
const router = express.Router();
const FHB = require("../../model/userData");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/register", async function (req, res) {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userOldBrews = req.body.oldBrews;
  const userFavs = req.body.favourites;

  bcrypt.hash(userPassword, saltRounds, async (error, hash) => {
    const exisitingEmail = await FHB.findOne({ email: userEmail });

    if (exisitingEmail) {
      res.sendStatus(400);
    } else if (error) {
      res.send({ error: error });
    } else {
      try {
        const newUser = new FHB({
          email: userEmail,
          password: hash,
          oldBrews: userOldBrews,
          favourites: userFavs,
        });
        await newUser.save();

        res.send(newUser._id);
        console.log(`${userEmail} Register Successed!`);
      } catch (error) {
        console.log(error);
        res.sendStatus(404);
      }
    }
  });
});

module.exports = router;
