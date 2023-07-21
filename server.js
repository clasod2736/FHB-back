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

// POST user data (register user)
app.post('/register', async function (req, res) {

    console.log("req: ", req.body)
    const userName = req.body.name;
    const userEmail = req.body.email;
    const userCurrentBrews = req.body.currentBrews;
    const userOldBrews  = req.body.oldBrews;

    try {

     const newUser = await new FHB({
            name : userName,
            email : userEmail,
            currentBrews : userCurrentBrews,
            oldBrews: userOldBrews

        });
        await newUser.save();

         res.sendStatus(200);
        
    } catch (error) {
        console.log(error);
        res.sendStatus
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
            new: true
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
            new: true
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
    const roasting = req.body.currentBrews.roasting
    const grind  = req.body.currentBrews.grind
    console.log(serve, roasting, grind);

    try {
        const updateCureentRecipe = await FHB.findOneAndUpdate({
            "name" : userName
        }, {
            $set:{
            "currentBrews.serve" : serve,
            "currentBrews.roasting" : roasting,
            "currentBrews.grind" : grind,
        }
        }, {
            new: true
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
                "currentBrews.roasting" : roasting,
                "currentBrews.grind" : grind
        }
        }, {
            new: true
        })
        console.log(resetCureentRecipe);
        res.status(200).json(resetCureentRecipe);
    } catch (error) {
        console.log(error)
    }
})

//POST data oldBrews in database
app.post('/saveRecipe', async function (req, res) {
    const userName = req.body.name;
    const oldBrews =req.body.oldBrews[0];

    try {
        const user = await FHB.findOne({ name : userName });

        if (user) {
            user.oldBrews.push(oldBrews);
            await user.save();
        }

        res.send(user.oldBrews)
        console.log(user.oldBrews)

    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
})