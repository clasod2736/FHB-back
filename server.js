const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./database.js");
const FHB = require("./model/userData.js");
require("dotenv").config();

// const port = process.env.PORT || 8080;

//import JWT token function from other file.
const jwtUtils = require("./auth/jwt.js");
//cookie parser
const cookieParser = require("cookie-parser");
//bcrypt password hashing
const bcrypt = require("bcrypt");
const { send } = require("express/lib/response.js");
const saltRounds = 10;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("build"));

//cors setting
app.use(
  cors({
    origin: "https://main--voluble-kashata-776f36.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//Cookie API
app.get("/isAuth", (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  try {
    const decodedAccess = jwtUtils.verifyAccessToken(accessToken);
    console.log(decodedAccess);

    if (decodedAccess === undefined) {
      const decodedRefresh = jwtUtils.verifyRefreshToken(refreshToken);

      if (decodedRefresh !== undefined) {
        const newPaylod = {
          email: decodedRefresh.email,
          password: decodedRefresh.password,
        };

        console.log(newPaylod);
        const newAccessToken = jwtUtils.postAccessToken(newPaylod);

        res.cookie("accessToken", newAccessToken, {
          secure: false,
          httpOnly: true,
        });

        res.send(decodedRefresh).sendStatus(200);
      } else if (decodedRefresh === undefined) {
        res.sendStatus(404);
      }
    } else {
      res.send(decodedAccess);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
app.get("/logOut", (req, res) => {
  try {
    res.cookie("accessToken", undefined).cookie("refreshToken", undefined).send("Cookies deleted");
  } catch (error) {
    console.log(error);
  }
});

//basic router setting
app.use(express.static(path.join(__dirname, "../front-end/build")));
app.get("/", (res, req) => {
  req.sendFile(path.join(__dirname, "../front-end/build/index.html"));
});

// GET current brewing information
app.get("/finish", async (req, res) => {
  console.log(req.query);

  try {
    const userName = await FHB.findOne(req.query);

    res.send(userName.currentBrews);
    console.log(userName.currentBrews);
  } catch (error) {
    console.log(error);
  }
});

//GET history of oldBrews from DB
app.get("/getOldbrews", async (req, res) => {
  console.log(req.query);

  try {
    const user = await FHB.findOne({ email: req.query.email });

    res.send(user.oldBrews);
    console.log("Sent history");
  } catch (error) {
    console.log(error);
  }
});

//GET favourites from DB
app.get("/getFavourites", async (req, res) => {
  console.log(req.query);

  try {
    const user = await FHB.findOne({ email: req.query.email });

    res.send(user.favourites);
    console.log(user.favourites);
    console.log("Sent Favourites");
  } catch (error) {
    console.log(error);
  }
});

// POST user data (register user)
app.post("/register", async function (req, res) {
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
        const newUser = await new FHB({
          email: userEmail,
          password: hash,
          oldBrews: userOldBrews,
          favourites: userFavs,
        });
        await newUser.save();

        res.send(newUser._id);
        console.log("Register Successed!");
      } catch (error) {
        console.log(error);
        res.sendStatus(404);
      }
    }
  });
});

// GET user data for login
app.get("/login", async (req, res) => {
  const userEmail = req.query.email;
  const userPassword = req.query.password;

  try {
    const userInfo = await FHB.findOne({
      email: userEmail,
    });

    if (userInfo) {
      const data = userInfo;

      bcrypt.compare(userPassword, data.password, (error, result) => {
        try {
          if (data.password === null) {
            res.sendStatus(400), send(express);
          } else if (result) {
            res.send(userInfo);
          } else if (!result) {
            res.sendStatus(404);
          }
        } catch (error) {
          console.log(error);
        }
      });

      const accessToken = jwtUtils.postAccessToken(data);
      const refreshToken = jwtUtils.postRefreshToken(data);

      //Send JWT token in the cookie
      try {
        res.cookie("accessToken", accessToken, {
          secure: false,
          httpOnly: true,
        });
        res.cookie("refreshToken", refreshToken, {
          secure: false,
          httpOnly: true,
        });
        res.status(200);
        console.log(userInfo.email, "LoggedIn!");
      } catch (error) {
        console.log("cookies not working");
        res.status(403).send("cookie doesnt sent");
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
  }
});

//POST data oldBrews in database
app.post("/saveHistory", async function (req, res) {
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
    console.log("History Saved!");
  } catch (error) {
    console.log(error);
    res.send("Server Error");
  }
});

//POST favourite brews in database
app.post("/saveFavourites", async function (req, res) {
  const userEmail = req.body.email;
  const favouriteBrews = req.body.favourites[0];

  try {
    const user = await FHB.findOne({ email: userEmail });

    if (user) {
      if (user.favourites.length >= 5) {
        // If the array has 5 or more elements, remove the oldest one
        res.status(422).send("failed");
        return;
      } else if (user.favourites.length < 5) {
        user.favourites.push(favouriteBrews);
        await user.save();
      }
    }

    res.send(user.favourites);
    console.log("favourite!");
  } catch (error) {
    console.log(error);
  }
});

//PUT update Name for favourite(custom)
app.put("/updateFavDetails", async function (req, res) {
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

//PUT Description for favourite
app.put("/updateDescription", async function (req, res) {
  const favName = req.body.favourites.favName;
  const description = req.body.favourites.description;
  console.log(favName, description);

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

//DELETE favourite brew in database
app.delete("/deleteFav", async function (req, res) {
  const favName = req.query.favName;

  try {
    const deleteFav = await FHB.updateOne(
      { "favourites.favName": favName },
      { $pull: { favourites: { favName: favName } } }
    );
    console.log("Fav Deleted!");
    res.send("Favorite deleted successfully.");
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT || 8080);
