var express=require('express');
var mysql=require('mysql');
var localstorage = require('local-storage');
var bodyParser = require('body-parser');
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"student_manage"
})
con.connect();
var app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/',function(req,res){
    if(localstorage.get('loginschool')==true){
        res.redirect("/school");
    }else if(localstorage.get('loginstaff')>0){
        res.redirect("/staff");
    }else{
        res.render("index");
    }
})
app.post('/',function(req,res){

    var name=req.body.name;
    var password=req.body.password;    
    
    if(name=="admin" && password=="123"){
        var query="select * from school where name='"+name+"' and password='"+password+"'";
        con.query(query,function(error,result,index){
            if(error) throw error;
            if(result.length==1){
                localstorage.set('loginschool',true);
                res.redirect("/school");
            }else{
                res.redirect("/");
            }
        })
    }else{
        
        var query="select * from staff where name='"+name+"' and password='"+password+"'";
        con.query(query,function(error,result,index){
            if(error) throw error;
            if(result.length==1){
                var userId = result[0].id;
                localstorage.set('loginstaff',userId);
                res.redirect("/staff");
            }else{
                res.redirect("/");
            }
           
        })
    }
})
// ===================School=====================
app.get('/school',function(req,res){
    if(localstorage.get('loginschool')==true){
        res.render("school");
    }else{
        res.redirect("/");
    }
})
app.get('/add_staff',function(req,res){
    if(localstorage.get('loginschool')==true){
        res.render("add_staff");
    }else{
        res.redirect("/");
    }
})
app.get('/view_staff',function(req,res){
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        var query="select * from staff";

        con.query(query,function(error,result,index){
            if(error) throw error;
            res.render("view_staff",{result});       
        })
    }
})
app.post('/add_staff',function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var query="insert into staff(name,email,password) values ('"+name+"','"+email+"','"+password+"')";
    con.query(query,function(error,result,index){
        if(error) throw error;
        res.redirect('/add_staff');
    })
})

app.get('/staff_delete/:id',function(req,res){
    var query="delete from staff where id="+req.params.id;

    con.query(query,function(error,result,index){
        if(error) throw error;
        res.redirect('/view_staff');       //GET
    })
})
app.get('/staff_update/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from staff where id =" + id;

    con.query(query, function(error, result, index) {
        if(error) throw error;
        res.render("staff_update", { userData: result[0] });
    })
})
app.post('/staff_update/:id', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var query = "update staff set name='"+name+"', email='"+email+"', password='"+password+"' where id='"+id+"'";
    con.query(query, function(error, result, index) {
        if(error) throw error;
        res.redirect('/view_staff');  
    });
});

app.get('/add_standard',function(req,res){
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        res.render("add_standard");       
    }
})
app.post('/add_standard',function(req,res){
    var staff_id=req.body.staff;
    var standard=req.body.standard;
    var query="insert into standard(std)values('"+standard+"')";
    con.query(query,function(error,result,index){
        if(error) throw error;
        res.redirect("/add_standard");  
    })
})

app.get('/add_divison',function(req,res){
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        var query="select * from standard";
        var staffquery="select * from staff";

        con.query(query,function(error,result,index){
            if(error) throw error;
            con.query(staffquery,function(error,resultstaff){
                if(error) throw error;
                res.render("add_divison",{result,resultstaff}); 
            })
                  
        })
    }
})
app.post('/add_divison',function(req,res){
    var std_id=req.body.std;
    var divison=req.body.divison;
    var staff=req.body.staff;
    var query="insert into divison(std_id,divison,staff_id)values('"+std_id+"','"+divison+"','"+staff+"')";
    con.query(query,function(error,result,index){
        if(error) throw error;
        res.redirect("/add_divison");  
    })
})
app.get('/add_student', function(req, res) {
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        var standardQuery = "select * from standard";

        con.query(standardQuery, function(standardError, standards) {
            if (standardError) throw standardError;
            res.render("add_student", { standards});
        });
    }
});
app.post('/add_student',function(req,res){
    var std=req.body.std;
    var div=req.body.div;
    var s_name=req.body.student_name;
    var email=req.body.email;
    var contact=req.body.contact;
    var query="insert into student (std,divison,name,email,contact) values('"+std+"','"+div+"','"+s_name+"','"+email+"','"+contact+"')";
    con.query(query,function(error,result,index){
        if(error) throw error;
        res.redirect("/add_student");  
    })
})
app.get('/divisions/:standardId', function(req, res) {
    const standardId = req.params.standardId;
    const query = `SELECT * FROM divison WHERE std_id = ${standardId}`;
    con.query(query, function(error, results) {
        if (error) {
            console.error('Error fetching divisions:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});
app.get('/view_student',function(req,res){
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        var query = "SELECT student.*, divison.divison AS divison, standard.std AS std FROM student INNER JOIN divison ON student.divison = divison.id INNER JOIN standard ON student.std = standard.id";
        
        con.query(query,function(error,result,index){
            if(error) throw error;
            res.render("view_student",{result});       
        })
    }
})
app.get('/viewStdDiv_student', function(req, res) {
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        var standardQuery = "select * from standard";

        con.query(standardQuery, function(standardError, standards) {
            if (standardError) throw standardError;
            res.render("viewStdDiv_student",{standards});
        });
    }
});
app.get('/show_student',function(req,res){
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        res.render("show_student");       
    }
});
app.post('/viewStdDiv_student', function(req, res) {
    var std = req.body.std;
    var div = req.body.div;
    var query = "select * from student where std='"+std+"' and divison='"+div+"'";
    con.query(query, function(error, result) {
        if (error)  throw error;
        if(result.length>0){
            res.render("show_student", { result: result });
        }
    });
});
app.get('/manage_staff',function(req,res){
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        var query = "SELECT divison.*, standard.std AS std, staff.name AS name FROM divison INNER JOIN standard ON divison.std_id = standard.id INNER JOIN staff ON divison.staff_id = staff.id";
        con.query(query,function(error,result,index){
            if(error) throw error;
            res.render("manage_staff",{result});       
        })
    }
});
app.get('/assignother_task/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from divison where id =" + id;

    con.query(query, function(error, result, index) {
        if(error) throw error;
        var staffQuery = "select * from staff";
        con.query(staffQuery, function(err, staffResult) {
            if(err) throw err;
            res.render("manage_task_update", { userData: result[0], staffList: staffResult });
        });
    })
});
app.post('/assignother_task/:id', function(req, res) {
    var id = req.params.id;
    var staff_id=req.body.staff;
    var query = "update divison set staff_id='"+staff_id+"' where id='"+id+"'";
    con.query(query, function(error, result, index) {
        if(error) throw error;
        res.redirect('/manage_staff');  
    })
});
app.get('/view_resultAll',function(req,res){
    if(localstorage.get('loginschool')==true){
        var query = "SELECT result.*, student.name AS name FROM result INNER JOIN student ON result.student_id = student.id";
        con.query(query,function(error,result){
            if(error) throw error;
            res.render('view_resultAll',{result});
        })
    }else{
        res.redirect("/");
    }
})
app.get('/view_resultStdDiv', function(req, res) {
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        var standardQuery = "select * from standard";

        con.query(standardQuery, function(standardError, standards) {
            if (standardError) throw standardError;
            res.render("view_resultStdDiv",{standards});
        });
    }
});
app.get('/show_resultStdDiv',function(req,res){
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        res.render("show_resultStdDiv");       
    }
});
app.post('/view_resultStdDiv', function(req, res) {
    var std = req.body.std;
    var div = req.body.div;
    var query = "SELECT result.*, student.name AS name FROM result INNER JOIN student ON result.student_id = student.id where result.std='"+std+"' and result.divison='"+div+"'";
    con.query(query, function(error, result){
        if (error)  throw error;
        if(result.length>0){
            res.render("show_resultStdDiv", { result: result });
        }
    });
});
app.get('/view_rank', function(req, res) {
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        var standardQuery = "select * from standard";

        con.query(standardQuery, function(standardError, standards) {
            if (standardError) throw standardError;
            res.render("view_rank",{standards});
        });
    }
});
app.get('/show_rank',function(req,res){
    if (localstorage.get('loginschool') != true) {
        res.redirect("/");
    } else {
        res.render("show_rank");       
    }
});
app.post('/view_rank', function(req, res) {
    var std = req.body.std;
    var query = "SELECT result.*, student.name AS name FROM result INNER JOIN student ON result.student_id = student.id where result.std='"+std+"' ORDER BY result.total DESC LIMIT 3";
    con.query(query, function(error, result){
        if (error)  throw error;
        res.render("show_rank", { result: result });
    });
});
// ======================Staff===============================
app.get('/staff',function(req,res){
    if(localstorage.get('loginstaff')>0){
        res.render("staff");
    }else{
        res.redirect("/");
    }
})
app.get('/viewStaff_student',function(req,res){
    if(localstorage.get('loginstaff')>0){
        var query="select * from divison where staff_id="+localstorage.get('loginstaff');
        con.query(query,function(error,result){
            if(error) throw error;
            var selectquery="select * from student where std='"+result[0].std_id+"' and divison='"+result[0].id+"'";
            con.query(selectquery,function(error,studentdata){
                if(error) throw error;
                res.render("viewStaff_student",{result:studentdata});
            })

        })
    }else{
        res.redirect("/");
    }
})
app.get('/add_result/:id',function(req,res){
    var id=req.params.id;
    if(localstorage.get('loginstaff')>0){
        var query="select * from result where student_id="+id;
        con.query(query,function(error,result){
            if(error) throw error;
            if(result.length==0){
                res.render("add_result");
            }else{
                res.redirect("/viewStaff_student")
            }
        })
        
    }else{
        res.redirect("/");
    }
})
app.post('/add_result/:id',function(req,res){
    var id=req.params.id;
    var sub1=parseInt(req.body.sub1);
    var sub2=parseInt(req.body.sub2);
    var sub3=parseInt(req.body.sub3);
    var sub4=parseInt(req.body.sub4);
    var sub5=parseInt(req.body.sub5);
    var total=sub1+sub2+sub3+sub4+sub5;
    if(sub1>33 && sub2>33 && sub3>33 && sub4>33 && sub5>33){
        var persantage=total/5;
    }else{
        var persantage=0;
    }
    if(sub1>sub2 && sub1>sub3 && sub1>sub4 && sub1>sub5){
        var maximum=sub1;
    }else if(sub2>sub3 && sub2>sub4 && sub2>sub5){
        var maximum=sub2;
    }else if(sub3>sub4 && sub3>sub4){
        var maximum=sub3;
    }else if(sub4>sub5){
        var maximum=sub4;
    }else{
        var maximum=sub5;
    }

    if(sub1<sub2 && sub1<sub3 && sub1<sub4 && sub1<sub5){
        var minimum=sub1;
    }else if(sub2<sub3 && sub2<sub4 && sub2<sub5){
        var minimum=sub2;
    }else if(sub3<sub4 && sub3<sub4){
        var minimum=sub3;
    }else if(sub4<sub5){
        var minimum=sub4;
    }else{
        var minimum=sub5;
    }
    var cnt=0;
    if(sub1<33){
        cnt++;
    }
    if(sub2<33){
        cnt++;
    }
    if(sub3<33){
        cnt++;
    }
    if(sub4<33){
        cnt++;
    }
    if(sub5<33){
        cnt++;
    }
    if(cnt==1 || cnt==2){
        var result="ATKT";
    }else if(cnt==0){
        var result="PASS";
    }else{
        var result="FAIL";
    }
    var selectquery="select * from student where id="+id;
    con.query(selectquery,function(error,selectresult){
        if(error) throw error;
        var query="insert into result (student_id,sub1,sub2,sub3,sub4,sub5,total,persantage,result,minimum,maximum,divison,std) values('"+id+"','"+sub1+"','"+sub2+"','"+sub3+"','"+sub4+"','"+sub5+"','"+total+"','"+persantage+"','"+result+"','"+minimum+"','"+maximum+"','"+selectresult[0].divison+"','"+selectresult[0].std+"')";
        con.query(query,function(error,result_student){
            if(error) throw error;
            res.redirect("/viewStaff_student");
        }) 
    })
    
})
app.get('/view_result',function(req,res){
    if(localstorage.get('loginstaff')>0){
        var query = "SELECT result.*, student.name AS name FROM result INNER JOIN student ON result.student_id = student.id";
        con.query(query,function(error,result){
            if(error) throw error;
            res.render("view_result",{result});
        })        
    }else{
        res.redirect("/");
    }
})
app.get('/view_resultStudent',function(req,res){
    if(localstorage.get('loginstaff')>0){
        res.render("view_resultStudent");
    }else{
        res.redirect("/");
    }
})
app.get('/single_student',function(req,res){
    if(localstorage.get('loginstaff')>0){
        res.render("single_student");
    }else{
        res.redirect("/");
    }
})
app.post('/view_resultStudent',function(req,res){
    var roll=req.body.roll;
    var name=req.body.name;
    var query = "SELECT result.*, student.name AS name FROM result INNER JOIN student ON result.student_id = student.id where result.student_id='"+roll+"' and student.name='"+name+"'";
    con.query(query,function(error,result){
        if(error) throw error;
        res.render("single_student",{result});
    })
})
app.get('/manage_result',function(req,res){
    if(localstorage.get('loginstaff')>0){
        var query = "SELECT result.*, student.name AS name FROM result INNER JOIN student ON result.student_id = student.id";
        con.query(query,function(error,result){
            if(error) throw error;
            res.render("manage_result",{result});
        })
    }else{
        res.redirect("/");
    }
})
app.get('/update_result/:id', function(req, res) {
    var id = req.params.id;
    var query = "select * from result where id="+id;

    con.query(query, function(error, result, index) {
        if(error) throw error;
        res.render("update_result", { userData: result[0] });
    })
})
app.post('/update_result/:id', function(req, res) {
    var id = req.params.id;
    var sub1=parseInt(req.body.sub1);
    var sub2=parseInt(req.body.sub2);
    var sub3=parseInt(req.body.sub3);
    var sub4=parseInt(req.body.sub4);
    var sub5=parseInt(req.body.sub5);
    var total=sub1+sub2+sub3+sub4+sub5;
    if(sub1>33 && sub2>33 && sub3>33 && sub4>33 && sub5>33){
        var persantage=total/5;
    }else{
        var persantage=0;
    }
    if(sub1>sub2 && sub1>sub3 && sub1>sub4 && sub1>sub5){
        var maximum=sub1;
    }else if(sub2>sub3 && sub2>sub4 && sub2>sub5){
        var maximum=sub2;
    }else if(sub3>sub4 && sub3>sub4){
        var maximum=sub3;
    }else if(sub4>sub5){
        var maximum=sub4;
    }else{
        var maximum=sub5;
    }

    if(sub1<sub2 && sub1<sub3 && sub1<sub4 && sub1<sub5){
        var minimum=sub1;
    }else if(sub2<sub3 && sub2<sub4 && sub2<sub5){
        var minimum=sub2;
    }else if(sub3<sub4 && sub3<sub4){
        var minimum=sub3;
    }else if(sub4<sub5){
        var minimum=sub4;
    }else{
        var minimum=sub5;
    }
    var cnt=0;
    if(sub1<33){
        cnt++;
    }
    if(sub2<33){
        cnt++;
    }
    if(sub3<33){
        cnt++;
    }
    if(sub4<33){
        cnt++;
    }
    if(sub5<33){
        cnt++;
    }
    if(cnt==1 || cnt==2){
        var result="ATKT";
    }else if(cnt==0){
        var result="PASS";
    }else{
        var result="FAIL";
    }

    var query = "update result set sub1='"+sub1+"', sub2='"+sub2+"', sub3='"+sub3+"', sub4='"+sub4+"', sub5='"+sub5+"', total='"+total+"', persantage='"+persantage+"', minimum='"+minimum+"', maximum='"+maximum+"', result='"+result+"' where id='"+id+"'";
    con.query(query, function(error, result, index) {
        if(error) throw error;
        res.redirect('/manage_result');  
    });
});
// =================Student=======================
app.get('/student',function(req,res){
    var standardQuery = "select * from standard";

    con.query(standardQuery, function(standardError, standards) {
        if (standardError) throw standardError;
        res.render("student", { standards});
    });
})
app.post('/student',function(req,res){
    var std=req.body.std;
    var div=req.body.div;
    var s_id=req.body.student_name;
    var query = "SELECT result.*, student.* FROM result INNER JOIN student ON result.student_id = student.id where student.std='"+std+"' and student.divison='"+div+"' and result.student_id='"+s_id+"' ";

    con.query(query,function(error,result,index){
        if(error) throw error;
        if(result.length==1){
            res.render("show_result",{result}); 
        }    
    })
})
app.get('/show_result',function(req,res){
    res.render("show_result");
})
// ==========================log out-===========================
app.get('/logout', function (req, res) {
    localstorage.remove('loginschool');
    localstorage.remove('loginstaff');
    res.redirect('/');
});
app.listen(3000);