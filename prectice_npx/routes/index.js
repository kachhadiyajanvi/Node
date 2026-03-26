var express = require('express');
var router = express.Router();
var user = require('../Controller/usercontroller');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })
router.get('/', user.select_data);
router.post('/',upload.single('image'), user.insert_data);
router.get('/dash', user.show);

module.exports = router;
