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

// login user
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

//post user data (register user)
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

//update menu name
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
//update mthod name
app.put('/method', async function (req, res) {
    const userName = req.body.name
    const methodName = req.body.currentBrews.methodName
    console.log(methodName)

    try {
        const updateMenuName = await FHB.findOneAndUpdate({
            "name" : userName
        }, {
            $set:{
            "currentBrews.methodName" : methodName
        }
        }, {
            new: true
        });

        res.status(200).json(updateMenuName);
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
})