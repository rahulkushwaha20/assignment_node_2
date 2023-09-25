require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();
const FileStore = require('session-file-store')(session)


const PORT = process.env.PORT || 8000;

//Database connection code
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true

});

const db = mongoose.connection;

db.on("error", (error) =>{console.log(error)});
db.once("open",() =>{console.log("Connecte to databse")});

//middleware

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(session({
    secret : "My secret",
    saveUninitialized : true,
    resave : false,
    store: new FileStore({ path: './session-data' })
}))

app.use((req,res,next) =>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

app.post("/logout",(req,res)=>{
    res.render("login");
})

app.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.redirect("/login");
})

//tamplate engine
app.set("view engine","ejs");

//prefix routes
app.use("",require("./routes/loginres"));

app.listen(PORT,() =>{
    console.log('Server start at http://localhost:${PORT}')
});