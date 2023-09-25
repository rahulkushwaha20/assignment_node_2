const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const newRegisterSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    username :{
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    address :{
        type : String,
        required : true
    }
});

module.exports = mongoose.model("register",newRegisterSchema);