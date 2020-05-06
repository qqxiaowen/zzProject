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
router.use('/faculty', require('../database/controller/faculty'));
router.use('/major', require('../database/controller/major'));
router.use('/category', require('../database/controller/category'));
router.use('/upload', require('../database/controller/upload'));
router.use('/config', require('../database/controller/facultyMajor'));
router.use('/achievement', require('../database/controller/achievement'));
router.use('/audit', require('../database/controller/audit'));
router.use('/topic', require('../database/controller/topic'));
router.use('/common', require('../database/controller/common'));
module.exports = router;