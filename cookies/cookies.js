/*
this apis will use again when I implement session and cookies 


//those just for setting
//cookie parser
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

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
            path: "/",
            domain: "https://main--voluble-kashata-776f36.netlify.app/",
            secure: true,
            httpOnly: true,
            sameSite: "none",
          });
  
          res.send(decodedRefresh).sendStatus(200);
        } else if (decodedRefresh === undefined) {
          console.log("decodedRefresh Err");
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



app.post("/login", async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

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
        const accessCookie = res.cookie("accessToken", accessToken, {
          path: "/",
          domain: "https://main--voluble-kashata-776f36.netlify.app/",
          secure: true,
          httpOnly: true,
          sameSite: "none",
        });
        const refreshCookie = res.cookie("refreshToken", refreshToken, {
          path: "/",
          domain: "https://main--voluble-kashata-776f36.netlify.app/",
          secure: true,
          httpOnly: true,
          sameSite: "none",
        });
        res.status(200);
        console.log(userInfo.email, "LoggedIn!");

        console.log(accessCookie.cookie, refreshCookie.cookie);
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


// app.get("/logOut", (req, res) => {
//   try {
//     res.cookie("accessToken", undefined).cookie("refreshToken", undefined).send("Cookies deleted");
//   } catch (error) {
//     console.log(error);
//   }
// });

  */
