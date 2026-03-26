const mysql = require('mysql');
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node"
});
con.connect();

exports.select_data = async (req, res) => {
  res.render("index");
};
exports.show=async(req,res)=>{
  var query="select * from admin";
  con.query(query,function(error,result,index){
    if(error) throw error;
    res.render("dash",{result:result});
  })
  
}
exports.insert_data =  async (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    var image = req.file.filename;
    var query = "INSERT INTO admin(name,email,password,image) VALUES ('"+name+"','"+email+"','"+password+"','"+image+"')";
    con.query(query, function(error, result, fields) {
      if (error) throw error;
      res.redirect("/dash");
    });
};


