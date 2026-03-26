var express = require('express');
var router = express.Router();

var user=require('../controller/Usercontroller');
// router.get('/',user.data_select);
router.get('/logout',user.logout);
// router.get('/delete/:id',user.data_delete);
router.post('/insert',user.insert);
router.post('/',user.login);
// router.post('/update/:id',user.data_update);


module.exports = router;
