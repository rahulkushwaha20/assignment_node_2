const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get('/index',(req,res) =>{ 
    User.find().exec((err,user) => {
        if(err){
            console.log("error");
        }else{
            res.render('index',{
               user : user 
            })
        }
    })
 })

 router.get("/add",(req,res) =>{
    res.render("add_user");
 });

 router.post("/add",(req,res) => {
    const user = new User({
        name: req.body.name,
        roll_no : req.body.roll_no
    });
    user.save((err) =>{
        if(err){
            console.log("Error");
        }else{
            console.log("Sucsess");
            res.redirect("/");
        }
    })
 });



 router.get("/edit/:id",(req,res) => {
    let id = req.params.id;
    User.findById(id,(err,user) =>{
        if(err){
            console.log("Erroer");
        }else{
            if(user == null){
                res.redirect("/");
            }else{
                res.render("edit_user",{
                    user : user
                })
            }
        }
    })
 });

 router.post("/update/:id",(req,res) => {
    let id = req.params.id;
    User.findByIdAndUpdate(id,{
        name : req.body.name,
        roll_no : req.body.roll_no
    }, (err,result) =>{
        if(err){
            console.log("error");
        }else{
            console.log("success");
            res.redirect("/");
        }

    })
 });

 router.get("/delete/:id",(req,res) =>{
    let id = req.params.id;
    User.findByIdAndRemove(id,(err,result) =>{
        if(err){
            console.log("Error");
        }else{
            console.log("Success");
            res.redirect("/");
        }
    })
 })


module.exports = router;