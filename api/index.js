const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
var bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');

const secret = 'sadadadsdasd13';

const salt = bcrypt.genSaltSync(10);

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://liyikai2005:yikai2005@cluster0.kbxchyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username, 
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/login', async (req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json('ok');
        });
    }
    else {
        res.status(400).json('wrong credentials');
    }
});

app.listen(4000);

//mongodb+srv://liyikai2005:yikai2005@cluster0.kbxchyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0