const router = require('express').Router();

const major = require('../model/major');

const adminAuth = require('./adminAuth');

// 获取所有专业信息 暂时不用
router.get('/', async (req, res, next) => {
  try {

    let data = await major.find()
              .populate({
                path: 'faculty',
                select: 'facultyName'
              });
    res.json({
      code: 0,
      msg: '获取所有专业信息成功',
      data
    })
      
  } catch(err) {
    next(err);
  }
})

// 获取某个院系下的所有专业信息
router.get('/faculty', async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
		}

    let data = await major.find({faculty: id})
              .populate({
                path: 'faculty',
                select: 'facultyName'
              });
    res.json({
      code: 0,
      msg: '获取某个院系下的专业信息成功',
      data
    })
      
  } catch(err) {
    next(err);
  }
})

// 获取单个专业
router.get('/majorDetail', async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
		}
    let data = await major.findById({_id: id})
              .populate({
                  path: 'faculty',
                  select: 'facultyName'
              });
    res.json({
      code: 0,
      msg: '获取某个专业信息成功',
      data
    })
  } catch(err) {
    next(err);
  }
})

// 添加专业
router.post('/', adminAuth, async (req, res, next) => {
  try {
    let {faculty, majorName, desc} = req.body;

    let isRequire = await major.findOne({faculty, majorName});
    if (isRequire) {
      res.json({
        code: 300,
        msg: '专业名冲突'
      })
    } else {

      let data = await major.create({faculty, majorName, desc});
      res.json({
        code: 0,
        msg: '添加成功',
        // data
      })
    }
  } catch(err) {
    next(err);
  }
})

// 修改专业
router.put('/', adminAuth, async (req, res, next) => {
  try {
    let {id, faculty, majorName, desc} = req.body;
    if (!id) {
			res.json({ msg: '缺乏id参数' });
		}

    await major.updateOne({_id: id}, {$set: {faculty, majorName, desc}});
    res.json({
      code: 0,
      msg: '修改成功'
    })

  } catch(err) {
    next(err);
  }
})

// 删除专业
router.delete('/', adminAuth, async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
		}

    await major.deleteOne({_id: id});
    res.json({
      code: 0,
      msg: '删除成功'
    })

  } catch(err) {
    next(err);
  }

})


module.exports = router;