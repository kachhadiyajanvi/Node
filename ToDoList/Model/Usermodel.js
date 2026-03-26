const { default: mongoose } = require("mongoose");
var userschema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
})
module.exports=mongoose.model("admin",userschema);