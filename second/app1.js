var express=require('express');
var app=express();
var mysql=require('mysql');

var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"node"
})
con.connect();

app.set("view engine","ejs");
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/',function(req,res){
    res.sendFile(__dirname+"/index.html");
})
// app.get('/update',function(req,res){
//     res.render("update");
// })
app.get('/ejs',function(req,res){
    var query="select * from user";

    con.query(query,function(error,result,index){
        if(error) throw error;
        res.render("index",{result});       
    })
})

app.post('/ejs',function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;

    var query="insert into user(name,email,password) values ('"+name+"','"+email+"','"+password+"')";

    con.query(query,function(error,result,index){
        if(error) throw error;
        res.redirect('/ejs');       //GET
    })
})

app.get('/delete/:id',function(req,res){
    var query="delete from user where id="+req.params.id;

    con.query(query,function(error,result,index){
        if(error) throw error;
        res.redirect('/ejs');       //GET
    })
})

app.get('/update/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from user where id =" + id;

    con.query(query, function(error, result, index) {
        if(error) throw error;
        res.render("update", { userData: result[0] });
    })
})

app.post('/update/:id', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var query = "update user set name='"+name+"', email='"+email+"', password='"+password+"' where id='"+id+"'";
    con.query(query, function(error, result, index) {
        if(error) throw error;
        res.redirect('/ejs');  
    });
});
app.listen(3000);