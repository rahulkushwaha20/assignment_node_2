const express = require("express");
const router = express.Router();
const User = require('../models/users');
const multer = require("multer");
const fs = require("fs");

//image upload
var storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null,'./uploads');
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

//this is middleware for upload
var upload = multer({
    storage : storage,
}).single("image");

//insert data for database route

router.post("/add",upload,(req,res) => {
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.filename,
    });
    user.save((err) =>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else{
            req.session.message = {
                type : 'success',
                message: "User Add successfully"
            };
            res.redirect("/");
        }
    })
});


//display all the users
router.get('/', (req,res) => {
    User.find().exec((err, users) =>{
        if(err){
            res.json({ message : err.message})
        }else{
            res.render('index',{
                title : "Home Page",
                users : users,
            });
        }
    });
});

router.get('/add',(req,res) =>{
    res.render("add_user", { title : "Add User"})
})

//edit route get
router.get('/edit/:id', (req, res) =>{
    let id = req.params.id;
    User.findById(id,(err,user) =>{
        if(err){
            res.redirect("/");
        }else{
            if(user == null){
                res.redirect("/");
            }else{
                res.render('edit_users',{
                    title : "Edit Page",
                    user : user
                })
            }
        }
    })
})

//update route post method

router.post("/update/:id",upload, (req,res) =>{
    let id = req.params.id;
    let new_image = "";
    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else{
        new_image = req.body.old_image;

    }

    User.findByIdAndUpdate(id, {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        image : new_image,
    }, (err, result) =>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else{
            req.session.message = {
                type : 'success',
                message: "User Update successfully"
            };
            res.redirect("/");
        }
    })
})

//Delete route

router.get("/delete/:id", (req,res) =>{
    let id = req.params.id;
    User.findByIdAndRemove(id,(err,result) => {
        if(result.image != ""){
            try{
                fs.unlinkSync("./uploads/" + result.image);
            }catch(err){
                console.log(err);
            }
        }
            if(err){
                res.json({message: err.message});
            }else{
                req.session.message = {
                    type : 'info',
                    message: "User Delete successfully"
                };
                res.redirect("/");
            }
        
    })
})

module.exports = router;