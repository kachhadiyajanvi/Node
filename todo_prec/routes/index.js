var express = require('express');
var router = express.Router();
var user=require('../controller/usercontroller')
/* GET home page. */
router.get('/', user.select);
router.post('/',user.create);
router.get('/dashboard',user.dashboard);

module.exports = router;
