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

//post test api
app.post('/register', async function (req, res) {

    console.log("req: ", req.body)
    const userName = req.body.name;
    const userEmail = req.body.email;
    const userBrews = req.body.brews;

    try {

     const newUser = await new FHB({
            name : userName,
            email : userEmail,
            brews : userBrews
        });
        await newUser.save();

         res.sendStatus(200);
        
    } catch (error) {
        console.log(error);
         res.send("didn't work?")
    }   
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
})