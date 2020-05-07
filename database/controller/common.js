const express = require('express');
const router = express.Router();

const common = require('../model/common');
const topic = require('../model/topic');
const auth = require('./auth');

// 添加一条评论
router.post('/', auth, async (req, res, next) => {
  try {
    let { content, id } = req.body;
    let topicData = await topic.findById(id) // 查找主题
    if (topicData) { // 如果存在这个主题
      let commondata = await common.create({ content, topic: id, user: req.session.user._id })
      await topicData.update({ $push: { common: commondata._id } })
      res.json({
        code: 0,
        msg: '添加评论成功',
        data: commondata
      })
    } else {
      res.json({
        msg: '不存在此主题',
        topicData
      })
    }

  } catch (err) {
    next(err)
  }
})

// 查看某条主题下的所有评论
router.get('/topic', async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
		}
    let { pn = 1, size = 10 } = req.query;
    pn = parseInt(pn)
    size = parseInt(size)
    let count = await common.count({ topic: id })
    let data = await common.find({ topic: id })
      .limit(size)
      .skip((pn - 1) * size)
      .sort({'updateTime': -1})
      .populate({
        path: 'user',
        select: 'username nicheng avatar'
      })
    res.json({
      code: 0,
      msg: '获取主题下的评论成功',
      data,
      count
    })

  } catch (err) {
    next(err)
  }
})

// 删除某条评论
router.delete('/', auth, async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
    }
    let findData = await common.findById(id);
    if (!findData) {
      res.json({ msg: '未找到该信息' });
      return;
    }
    if (findData.user == req.session.user._id) {
      await common.deleteOne({ _id: id })
      res.json({
        code: 0,
        msg: '删除评论成功'
      })
    } else {
      res.json({ msg: '只能创建人删除该主题' })
    }

  } catch (err) {
    console.log('---------------err: ',err)
    next(err)
  }
})

module.exports = router;