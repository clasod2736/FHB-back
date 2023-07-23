const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser")
const connectDB = require('./database.js')
const FHB = require(('./model.js'))
const port = process.env.port || 8080;

connectDB();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

//basic router setting
app.use(express.static(path.join(__dirname, '../front-end/homebrewing/build')));
app.get('/', (res, req) => {
    req.sendFile(path.join(__dirname, '../front-end/homebrewing/build/index.html'));
  })

// GET user data for login
app.get ('/login', async (req, res) => {
    console.log(req.query)

    try {
        const userEmail = await FHB.findOne(req.query)
        res.send(userEmail)
        console.log(userEmail)
    } 
    catch (error) {
        console.log(error)
        res.send(error)
    }
})

// GET current brewing information
app.get ('/finish', async (req, res) => {
    console.log(req.query)

    try {
        const userName = await FHB.findOne(req.query);

        res.send(userName.currentBrews);
        console.log(userName.currentBrews);
    } catch (error) {
        console.log(error)
    }
})

//GET history of oldBrews from DB
app.get ('/getOldbrews', async (req, res) => {

    try {
        const userName = await FHB.findOne(req.query);

        res.send(userName.oldBrews);
        console.log("Sent history");
    } catch (error) {
        console.log(error)
    }
})

//GET favourites from DB
app.get ('/getFavourites', async (req, res) => {

    try {
        const userName = await FHB.findOne(req.query);

        res.send(userName.favourites);
        console.log("Sent Favourites");
    } catch (error) {
        console.log(error)
    }
})

// POST user data (register user)
app.post('/register', async function (req, res) {

    console.log("req: ", req.body)
    const userName = req.body.name;
    const userEmail = req.body.email;
    const userCurrentBrews = req.body.currentBrews;
    const userOldBrews  = req.body.oldBrews;
    const userFavs  = req.body.favourites;

    try {

     const newUser = await new FHB({
            name : userName,
            email : userEmail,
            currentBrews : userCurrentBrews,
            oldBrews: userOldBrews,
            favourites: userFavs
        });
        await newUser.save();

         res.sendStatus(200);
        
    } catch (error) {
        console.log(error);
        res.sendStatus
    }   
})

//POST data oldBrews in database
app.post('/saveHistory', async function (req, res) {
    const userName = req.body.name;
    const oldBrews =req.body.oldBrews[0];

    try {
        const user = await FHB.findOne({ name : userName });

        if (user) {

            if (user.oldBrews.length >= 10) {
                // If the array has 10 or more elements, remove the oldest one
                user.oldBrews.shift();
            }

            user.oldBrews.push(oldBrews);
            await user.save();
        }

        res.send(user.oldBrews)
        console.log("History!")

    } catch (error) {
        console.log(error)
    }
})

//POST favourite brews in database
app.post('/saveFavourites', async function (req, res) {
    const userName = req.body.name;
    const favouriteBrews =req.body.favourites[0];

    try {
        const user = await FHB.findOne({ name : userName });

        if (user) {

            if (user.favourites.length >= 5) {
                // If the array has 5 or more elements, remove the oldest one
                res.status(422).send('failed')
                return
            } 
            else if(user.favourites.length < 5) {

                user.favourites.push(favouriteBrews);
                await user.save();
            }

        }

        res.send(user.favourites)
        console.log("favourite!")

    } catch (error) {
        console.log(error)
    }
})

// PUT-update menu name
app.put('/menu', async function (req, res) {
    const userName = req.body.name
    const coffeeName = req.body.currentBrews.menuName
    console.log(coffeeName)

    try {
        const updateMenuName = await FHB.findOneAndUpdate({
            "name" : userName
        }, {
            $set:{
            "currentBrews.menuName" : coffeeName
        }
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).json(updateMenuName);
    } catch (error) {
        console.log(error)
    }
})

//PUT-update method name
app.put('/method', async function (req, res) {
    const userName = req.body.name
    const methodName = req.body.currentBrews.methodName
    console.log(methodName)

    try {
        const updateMethodName = await FHB.findOneAndUpdate({
            "name" : userName
        }, {
            $set:{
            "currentBrews.methodName" : methodName
        }
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).json(updateMethodName);
    } catch (error) {
        console.log(error)
    }
})

//PUT-update recipe for current brewing
app.put('/recipe', async function (req, res) {
    const userName = req.body.name
    const serve = req.body.currentBrews.serve
    const coffee = req.body.currentBrews.coffee
    const roasting = req.body.currentBrews.roasting
    const grind  = req.body.currentBrews.grind
    console.log(serve, roasting, grind);

    try {
        const updateCureentRecipe = await FHB.findOneAndUpdate({
            "name" : userName
        }, {
            $set:{
            "currentBrews.serve" : serve,
            "currentBrews.coffee" : coffee,
            "currentBrews.roasting" : roasting,
            "currentBrews.grind" : grind,
        }
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).json(updateCureentRecipe);
    } catch (error) {
        console.log(error)
    }
})

//PUT reset current Brews
app.put('/deleteCurrentBrew', async function (req, res) {
    const userName = req.body.name
    const menuName = req.body.currentBrews.menuName
    const methodName = req.body.currentBrews.methodName
    const serve = req.body.currentBrews.serve
    const coffee = req.body.currentBrews.coffee
    const roasting = req.body.currentBrews.roasting
    const grind  = req.body.currentBrews.grind

    try {
        const resetCureentRecipe = await FHB.findOneAndUpdate({
            "name" : userName
        }, {
            $set:{
                "currentBrews.menuName" : menuName,
                "currentBrews.methodName" : methodName,
                "currentBrews.serve" : serve,
                "currentBrews.coffee" : coffee,
                "currentBrews.roasting" : roasting,
                "currentBrews.grind" : grind
        }
        }, {
            new: true,
            runValidators: true
        })
        console.log("resetCureentRecipe!");
        res.status(200).json(resetCureentRecipe);
    } catch (error) {
        console.log(error)
    }
})

//PUT APIs for Custom FavDetails
//PUT menuName in favourites
app.put('/putMenuName', async function (req, res) {
    const favName = req.body.favourites.favName
    const menuName = req.body.favourites.menuName

    try {
        const updateMenuName = await FHB.findOneAndUpdate({
            "favourites.favName" : favName
        }, {
            $set:{
            "favourites.menuName" : menuName
        }
        }, {
            new: true,
            runValidators: true
        });
        console.log(menuName, "customed.")
        res.status(200).json(updateMenuName);
    } catch (error) {
        console.log(error)
    }
})



//DELETE favourite brew in database
app.delete('/deleteFav', async function(req, res)  {
    const favName = req.query.favName;

    try {

            const deleteFav = await FHB.updateOne(
                {}, 
                { $pull: {"favourites" :{ favName: favName}}
            });
            console.log("Fav Deleted!")
            res.send(deleteFav)
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
})