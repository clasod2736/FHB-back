const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const connectDB = require("./database.js");
require("dotenv").config();

// RestfulAPIs
const isAuthRouter = require("./auth/isAuth.js");
const userRegister = require("./api/user/register.js");
const userLogIn = require("./api/user/logIn.js");
const userLogOut = require("./api/user/logOut.js");
const saveFavs = require("./api/customize/saveFavs.js");
const updateFavdetails = require("./api/customize/updateFavdet.js");
const updateFavdesc = require("./api/customize/updateFavdesc.js");
const deleteFav = require("./api/customize/deleteFav.js");
const getOldbrew = require("./api/brewInfo/getOldbrews.js");
const getRecentbrew = require("./api/brewInfo/getRecentbrew.js");
const saveHistory = require("./api/brewInfo/saveHistory.js");
const getFavourites = require("./api/brewInfo/getFavourites.js");

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

/* Handling User Data */
// POST user data for login
app.use(userLogIn);

// Log out and delete refresh token in DB
app.user(userLogOut);

// POST user data (register user)
app.use(userRegister);

//Auth with JWT tokens
app.use(isAuthRouter);

/* Hnadling user's brew data*/
//GET history list from DB
app.use(getOldbrew);

//GET Recent Brew history.
app.use(getRecentbrew);

//GET favourite list from DB
app.use(getFavourites);

//POST data oldBrew to history in databas
app.use(saveHistory);

/* Customizing user brew datas */
//POST favourite brews in database
app.use(saveFavs);

//PUT update Name for favourite(custom)
app.use(updateFavdetails);

//PUT Description for favourite
app.use(updateFavdesc);

//DELETE favourite brew in database
app.use(deleteFav);

app.listen(process.env.PORT || 8080);
