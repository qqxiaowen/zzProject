var express = require('express');
var router = express.Router();

// router.get('/', function (req, res, next) {
//     res.render('index');
// });

// router.get('/admin', function (req, res, next) {
//     res.render('indexAdmin');
// });

router.use('/init', require('../database/controller/initData'));
router.use('/user', require('../database/controller/user'));
module.exports = router;