var mysql=require('mysql');
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"node"
})
con.connect();

exports.select=(req,res)=>{
    res.render('index');
}
exports.dashboard=(req,res)=>{
    res.render('dashboard');
}
exports.create=(req,res)=>{
    var email=req.body.email;
    var password=req.body.password;
    var query="insert into admin(email,password)values('"+email+"','"+password+"')";
    con.query(query,function(err,result,index){
        if(err) throw err;
        res.redirect('/dashboard');
    })
}