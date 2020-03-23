const router = require('express').Router();

const category = require('../model/category');

const adminAuth = require('./adminAuth');

// 获取所有类别信息
router.get('/', async (req, res, next) => {
  try {
    let data = await category.find();
    res.json({
      code: 0,
      msg: '获取所有类别信息成功',
      data,
    })
  } catch(err) {
    next(err);
  }
})

// 获取单个类别信息
router.get('/categoryDetail', async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
		}

    let data = await category.findById(id);
    res.json({
      code: 0,
      msg: '获取单个类别信息成功',
      data
    })
  } catch(err) {
    next(err);
  }
})

// 添加类别
router.post('/', adminAuth, async (req, res, next) => {
  try {
    let {categoryName, desc = '很懒，没有添加简介'} = req.body;
    if (!categoryName) {
      res.json({
        msg: '缺乏类别名称'
      })
    }
    let isRequire = await category.findOne({categoryName, desc});
    if (isRequire) {
      res.json({
        msg: '已有该类别'
      })
    } else {
      let data = await category.create({categoryName, desc});
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

// 修改类别
router.put('/', adminAuth, async (req, res, next) => {
  try {
		
    let {id, categoryName, desc} = req.body;
    if (!id) {
			res.json({ msg: '缺乏id参数' });
		}
    
    await category.updateOne({_id: id},{$set: {categoryName, desc}});
    res.json({
      code: 0,
      msg: '修改成功'
    })
  } catch(err) {
    next(err);
  }
})

// 删除类别
router.delete('/', adminAuth, async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
		}

    // 判断科研成果模块下是否有该类别
    await category.updateOne({_id: id},{$set: {isShow: false}});
    res.json({
      code: 0,
      msg: '删除成功',
    })
  } catch(err) {
    next(err);
  }
})

module.exports = router;