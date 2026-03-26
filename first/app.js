var express=require('express');
var app=express();

app.get('/',function(req,res){
    res.send('hello');
})
app.get('/second',function(req,res){
    res.send('hello And welcome to creative multimedia institue');
})
app.listen(3000);