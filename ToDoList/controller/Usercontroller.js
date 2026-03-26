var usermodel=require('../Model/Usermodel');
const bcrypt = require('bcrypt');
const storage = require('node-persist');
storage.init( /* options ... */ )


exports.insert=async(req,res)=>{
    var b_pass= await bcrypt.hash(req.body.password,12);
    req.body.password=b_pass;

    var data=await usermodel.create(req.body);
    res.status(200).json({
        status:"data insert",
        data
    })
}

exports.login=async(req,res)=>{

    var user_status=await storage.getItem('login_user');
    if(user_status==undefined){
        var data=await usermodel.find({"email":req.body.email});
        if(data.length==1){
            bcrypt.compare(req.body.password,data[0].password,async function(err,result){
                if(result==true){
                    await storage.setItem('login_user',data[0].id);
                    res.status(200).json({
                        status:"login Success"
                    })
                }else{
                    res.status(200).json({
                        status:"Check your Email and Password"
                    })
                }
                
            })
        }else{
            res.status(200).json({
                status:"Check your Email and Password"
            })
        }
    }else{
        res.status(200).json({
            status:"user is already login"
        })
    }

       
}
exports.logout=async(req,res)=>{
    await storage.clear();
    res.status(200).json({
        status:"logout success"
    })
}