//jshint esversion:6
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import env from "dotenv";
import md5 from "md5";
import bcrypt from "bcrypt";

env.config();

const app = express();
const port = 3000;
const saltRounds =10;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/UserDB");

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

const User = new mongoose.model("user",userSchema);

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.get("/register",(req,res)=>{
    res.render("register.ejs");
});

app.post("/register",async (req,res)=>{
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const newUser = await new User({
        email: req.body.username,
        password: hash
    });
    newUser.save().then(()=>{
        res.render("secrets.ejs");
    }).catch((err)=>{
        console.log(err);
    })
});

app.post("/login",(req,res)=>{
    
    const username = req.body.username;
    const password = req.body.password
    User.findOne({email:username}).then((founduser)=>{
        if(founduser){
            if(bcrypt.compare(password, founduser.password)){
                res.render("secrets.ejs");
            }
        }
    }).catch((err)=>{console.log(err)});
});

app.get("/logout",(req,res)=>{
    res.redirect("/");
});


app.listen(port,()=>{
    console.log(`server started at port number ${port}`);
});