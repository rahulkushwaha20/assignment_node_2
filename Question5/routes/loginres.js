const express = require("express");
const router = express.Router();
const users = require("../models/register");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.get('/',(req,res) =>{ 
    res.render("login");
 })

// Rendering of buttons Done Now handling post requests
router.post("/login",async(req,res)=>{
    const {username,password}=req.body;
    let user= await users.findOne({username});
    if(!user)
    return res.redirect("/register");
    // Make sure this compare function is await else it will go on the remaining procedure without actually comparing whether we have the right user or not and it will login regardless.
    const isUser=await bcrypt.compare(password,user.password);
    if(!isUser){
        // We need to do return res.render to make sure further statements do not get executed and we redirect from here itself.
       return res.render("login",{message:"Invalid Password"});
    }
    else{
        const token=jwt.sign({_id:user._id},"jsiufbdiufbuibfIU");
        res.cookie("token",token,{
            httpOnly: true,
            expires: new Date(Date.now()+60*1000),
        })
        res.redirect("index");
    }
})



router.get("/register",(req,res) =>{
    res.render("register");
 });


 router.post("/register",async(req,res)=>{
    const {name,username,password,address}=req.body;
    let user= await users.findOne({username});// Inside findOne u need to send an object
    if(user){
        res.redirect("/login");
    }
    console.log(name,username,password,address);
    const hashedPassword= await bcrypt.hash(password,10); // 10 is a salt that we need to mention
    user=await users.create({
        name,
        username,
        address,
        password: hashedPassword,
        
    }); // It is an async function

    // This is done to hide the exact id of the document that will be created inside the users collection everytime a new user registers. We pass an object having key of _id with value of that particular document's id and we encrypt it using jwt and an algorithn which is a string in this case.
    const token=jwt.sign({_id:user._id},"jsiufbdiufbuibfIU");
    res.cookie("token",token,{
        httpOnly: true,
        expires: new Date(Date.now()+60*1000),
    })
    res.redirect("/");
})



// Authentication function
const authentication=async(req,res)=>{
    const {token}=req.cookies;
    if(token){
        // Extracting the original ID form the cookie, we decode using the token
        const iD=jwt.verify(token,"jsiufbdiufbuibfIU");
        const user= await users.findById(iD);
        if(user)
           return res.render("logout",{name:user.name});
    }
    return res.redirect("/login");
}

router.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.redirect("/login");
})


router.use("",require("./router"));
module.exports = router;


