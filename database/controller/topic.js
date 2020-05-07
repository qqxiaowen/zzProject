const express = require('express');
const router = express.Router();

const auth = require('./auth');
const topic = require('../model/topic');

// 添加一个主题
router.post('/', auth, async (req, res, next) => {
  try {
    let { title, content } = req.body;
    let data = await topic.create({ title, content, user: req.session.user._id })
    res.json({
      code: 0,
      msg: '创建主题成功',
      data
    })

  } catch (err) {
    next(err)
  }
})

// 获取所有的主题
router.get('/', async (req, res, next) => {
  try {
    let { pn = 1, size = 10, title } = req.query;
    let reqData = {};
    if (title) {
      reqData = { title: new RegExp(title) }
    }
    pn = parseInt(pn);
    size = parseInt(size);
    let count = await topic.count({ ...reqData });
    let data = await topic.find({ ...reqData })
      .limit(size)
      .skip((pn - 1) * size)
      .sort({'updateTime': -1})
      .populate({
        path: 'user',
        select: 'username userNum avatar'
      })
    res.json({
      code: 0,
      msg: '获取全部主题',
      data,
      count
    })

  } catch (err) {
    console.log('-----err: ', err)
    res.json({
      msg: err.ReferenceError
    })
    next(err)
  }
})

// 获取单个主题
router.get('/detail', async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
		}
    let data = await topic.findById(id)
      .populate({
        path: 'user',
        select: 'username userNum avatar'
      })
      .populate({
        path: 'common',
        select: '-topic',
        populate: {
          path: 'user',
          select: '-_id username userNum avatar'
        }
      })
      // .populate({
      //   path: 'common.user',
      //   select: 'username userNum avatar'
      // })
    res.json({
      code: 0,
      msg: '获取单个主题成功',
      data
    })

  } catch (err) {
    next(err)
  }
})

// 删除单个主题 
router.delete('/', auth, async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
    }
    let findData = await topic.findById(id);
    if (!findData) {
      res.json({ msg: '未找到该信息' });
      return;
    }
    if (findData.user == req.session.user._id) {
      await topic.deleteOne({ _id: id })
      res.json({
        code: 0,
        msg: '删除主题成功'
      })
    } else {
      res.json({ msg: '只能创建人删除该主题' })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router;