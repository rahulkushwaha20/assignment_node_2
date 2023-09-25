const mongoose = require("mongoose");
const newUserSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    dept :{
        type : String,
        required : true 
    },
    roll_no :{
        type : String,
        required : true
    },
    address :{
        type : String,
        required : true  
    }
});

module.exports = mongoose.model("user",newUserSchema);