var mysql=require('mysql');
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"node"
})

con.connect();

var query="insert into user(name,email,password)values('user','user@gmail.com','user@123')";
// var query="select * from user";

con.query(query,function(error,result,index){
    if(error) throw error;
    console.log(result)
})