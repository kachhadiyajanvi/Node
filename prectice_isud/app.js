var express=require('express');
var mysql=require('mysql');
var bodyParser = require('body-parser');
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"node",
})

con.connect();
var app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: false }))
app.get("/",function(req,res){
    var query="select * from user";
    con.query(query,function(error,result,index){
        if(error) throw error;
        res.render("index",{result});
    })
    
})
app.post("/",function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;

    var query="insert into user (name,email,password) values('"+name+"','"+email+"','"+password+"')";
    con.query(query,function(error,result,index){
        if(error) throw error;
        res.redirect('/');  
    })

})
app.get("/delete/:id",function(req,res){
    var id=req.params.id;
    var query="Delete from user where id="+id;
    con.query(query,function(error,result,index){
        if(error) throw error;
        res.redirect('/');  
    })
})

app.listen(3000);