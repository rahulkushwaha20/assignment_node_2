const mongoose = require("mongoose");
const newUserSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    roll_no :{
        type : String,
        required : true
    }
});

module.exports = mongoose.model("user",newUserSchema);