var express=require('express');
var mysql=require('mysql');
var bodyParser = require('body-parser');
const { LocalStorage } = require('node-localstorage');
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"node"
})
con.connect();
var app=express();
var localStorage = new LocalStorage('./scratch');
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/',function(req,res){
    if (localStorage.getItem('login') === 'true') {
        res.redirect('/dashboard');
    } else {
        res.render("index");
    }
})
app.get('/Register',function(req,res){
    res.render("Register");
})
app.get('/dashboard',function(req,res){
    if (localStorage.getItem('login') !== 'true') {
        res.redirect('/');
    } else {
        res.render("dashboard");
    }
})
app.post('/',function(req,res){
    var email=req.body.email;
    var password=req.body.password;

    var query="select * from user where email='"+email+"' and password='"+password+"'";
    con.query(query,function(error,result,index){
        if(error) throw error;
        if(result.length == 1){
            res.redirect('/dashboard');
            localStorage.setItem("login", true);
            
        } else {
            res.redirect('/');
        }
    })
})
app.post('/Register',function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.email;

    var query="insert into user (name,email,password) values ('"+name+"','"+email+"','"+password+"')";
    con.query(query,function(error,result,index){
        if(error) throw error;
        res.redirect('/');
    })
})
app.get('/logout', function (req, res) {
    localStorage.removeItem('login');
    res.redirect('/');
});
app.listen(3000);