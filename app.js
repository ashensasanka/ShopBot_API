const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.json());
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const mongoUrl = "mongodb+srv://ashen1:ashen123@cluster0.fskzj5a.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl,{

}).then(()=>{console.log("Connected to MongoDB");})
.catch(e=>console.log(e));

require('./userDetails');

app.use(bodyParser.json());

const User = mongoose.model("UserInfo");

app.post('/api/insertAddress', (req, res) => {
    const { address } = req.body;
  
    // Insert the address into the "orderDetails" collection
    const newAddress = new User({ address });
    newAddress.save((err, doc) => {
      if (err) {
        res.status(500).json({ error: 'Error inserting address' });
      } else {
        res.json({ message: 'Address inserted successfully' });
      }
    });
  });

app.post("/register", async(req, res)=>{
    const { fname, lname, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldUser = await User.findOne({email});

        if (oldUser){
            return res.send({error:"User Exists"});
        }
        await User.create({
            fname,
            lname,
            email,
            password: encryptedPassword,
        });
        res.send({status:"Ok"})
    } catch (error) {
        res.send({status:"error"})
    }
});

app.post("/login-user", async (req, res)=> {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user){
        return res.json({error: "User Exists"});
    }
    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign({email:user.email}, JWT_SECRET);
        if (res.status(201)) {
            return res.json({ status: "ok", data: token });
          } else {
            return res.json({ error: "error" });
          }
        }
    res.json({ status: "error", error: "InvAlid Password" });
});

app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const useremail = user.email;
        User.findOne({email: useremail}).then((data)=>{
            res.send({status:"ok", data:data});
        }).catch((error)=>{
            res.send({status:"error", data: error});
        });
    } catch (error) {
        
    }
});

app.listen(5000,()=> {
    console.log("Sever Started");
});

