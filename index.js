const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
const Port = process.env.PORT;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to DB');
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema);

//Routes

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    User.findOne({email: email}).then((data) => {
        if(data === null) {
            res.send({message:"User not registered"});
        }
        else if (Object.keys(data).length !== 0){
            if (password === data.password){
                res.send({message: "Login Successful", user: data});
            }
            else {
                res.send({message: "Password incorrect"});
            }
        }
    })
})

app.post("/signup", (req, res) => {
    // console.log(req.body);
    const { name, email, password } = req.body;
    User.find({ email: email }).then((data) => {
        if (Object.keys(data).length !== 0) {
            console.log(data);
            res.send({ message: "User already registered" })
        }
        else if (Object.keys(data).length === 0) {
            const user = new User({
                name,
                email,
                password
            })
            user.save().then(res.send({ message: "Successfully Registered , please login now" }))
        }
    })

})

app.listen(Port, () => {
    console.log(`Server has started at port ${Port}`);
})