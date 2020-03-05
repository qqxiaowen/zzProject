const express = require('express');
const router = express.Router();
const facultyMajor = require('../../config/facultyMajor');

// 获取院系映射关系
router.get('/facultyMajor', async (req, res, next) => {
	try {
    res.json({
      code: 0,
      msg: '获取院系映射关系成功',
      data: facultyMajor
    })
	} catch (err) {
		next(err);
	}
})

module.exports = router;