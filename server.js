const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const connectDB = require("./database.js");
const FHB = require("./model/userData.js");
require("dotenv").config();

// RestfulAPIs
const isAuthRouter = require("./auth/isAuth.js");
const userRegister = require("./api/user/register.js");
const userLogIn = require("./api/user/logIn.js");
const saveFavs = require("./api/customize/saveFavs.js");
const updateFavdetails = require("./api/customize/updateFavdet.js");
const updateFavdesc = require("./api/customize/updateFavdesc.js");
const deleteFav = require("./api/customize/deleteFav.js");

connectDB();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("build"));

//cors setting
app.use(
  cors({
    origin: "https://voluble-kashata-776f36.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const clientDomain = "https://voluble-kashata-776f36.netlify.app";

app.get(clientDomain, (req, res) => {
  try {
    res.send(response.data);
  } catch (error) {
    res.send(error);
  }
});

// for server app.
app.get("/", (req, res) => {
  res.send(`Server is running..., Current client sied domain: ${clientDomain}`);
});

//Auth with JWT tokens
app.use(isAuthRouter);

//GET history of oldBrews from DB
app.get("/getOldbrews", async (req, res) => {
  try {
    const user = await FHB.findOne({ email: req.query.email });

    res.send(user.oldBrews);
  } catch (error) {
    console.log(error);
  }
});

//GET Recent Brew history.
app.get("/getRecentbrew", async (req, res) => {
  try {
    const user = await FHB.findOne({ email: req.query.email });

    const sortedBrews = user.oldBrews.sort((a, b) => b.order - a.order);
    const recentbrew = sortedBrews[0];

    res.send(recentbrew);
    console.log("Sent Recent Brew!");
  } catch (error) {
    console.log(error);
  }
});

//GET favourites from DB
app.get("/getFavourites", async (req, res) => {
  try {
    const user = await FHB.findOne({ email: req.query.email });

    res.send(user.favourites);
    console.log("Sent Favourites");
  } catch (error) {
    console.log(error);
  }
});

// POST user data (register user)
app.use(userRegister);

// POST user data for login
app.use(userLogIn);

//POST data oldBrews in databas
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
    console.log("Recent history Saved!");
  } catch (error) {
    console.log(error);
    res.send("Server Error");
  }
});

//POST favourite brews in database
app.use(saveFavs);

//PUT update Name for favourite(custom)
app.use(updateFavdetails);

//PUT Description for favourite
app.use(updateFavdesc);

//DELETE favourite brew in database
app.use(deleteFav);

app.listen(process.env.PORT || 8080);
