const router = require('express').Router();

const achievement = require('../model/achievement');
const audit = require('../model/audit');

const auth = require('./auth');

// 没有添加评论
// 没有测试 修改论文功能
// 数据关联newData--测试

// 获取所有论文成果(审批后才能显示)
router.get('/', async (req, res, next) => {
  try {
    let { pn = 1, size = 10, category, title } = req.query;
    pn = parseInt(pn);
    size = parseInt(size);
    let reqData = {};
    if (category) {
      reqData = { category }
    }
    if (title) {
      reqData = { ...reqData, title: new RegExp(title) }
    }
    let data = await achievement.find({ isShow: true, ...reqData })
      .skip((pn - 1) * size)
      .limit(size)
      .sort({'updateTime': -1})
      .populate({
        path: 'author',
        select: 'username userNum'
      })
      .populate({
        path: 'category',
        select: 'categoryName'
      })
    res.json({
      code: 0,
      msg: '获取所有论文成果成功',
      data,
    })
  } catch(err) {
    next(err);
  }
})

// 获取个人所有论文成果
router.get('/myself', auth, async (req, res, next) => {
  try {
    let { pn = 1, size = 10, category, title } = req.query;
    pn = parseInt(pn);
    size = parseInt(size);
    let reqData = {};
    if (category) {
      reqData = { category }
    }
    if (title) {
      reqData = { ...reqData, title: new RegExp(title) }
    }
    let data = await achievement.find({ author: req.session.user._id, ...reqData })
      .skip((pn - 1) * size)
      .limit(size)
      .sort({'updateTime': -1})
      .populate({
        path: 'author',
        select: 'username userNum'
      })
      .populate({
        path: 'lastAudit',
        select: 'username userNum'
      })
      .populate({
        path: 'category',
        select: 'categoryName'
      })
    res.json({
      code: 0,
      msg: '获取个人所有论文成果成功',
      data,
    })
  } catch(err) {
    next(err);
  }
})

// 获取单个论文成果
router.get('/detail', async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
    }
    let data = await achievement.findOne({ _id: id })
    .populate({
      path: 'category',
      select: 'username userNum'
    })
    .populate({
      path: 'category',
      select: 'categoryName'
    })
    let newReadNumber = data.readNumber + 1;
    data.readNumber = newReadNumber;
    await achievement.updateOne({ _id: id}, {$set: {readNumber: newReadNumber }});
    res.json({
      code: 0,
      msg: '获取单个论文成果成功',
      data,
    })
  } catch(err) {
    next(err);
  }
})

// 添加论文成果
router.post('/', auth, async (req, res, next) => {
  try {
    let { title, content, category, accessoryArr } = req.body;
    if (!title || !content || !category ) {
      res.json({
        msg: '缺乏必要参数'
      })
    } else {
      let author = req.session.user._id;
      let data = await achievement.create({ title, content, author, category, accessoryArr, isShow: false });
      await audit.create({ author, achievement: data._id, newData: { title, content, category, accessoryArr }});
      res.json({
        code: 0,
        msg: '添加成功',
        data
      })
    }
  } catch(err) {
    next(err);
  }
})

// 修改论文成果 -- 没有测试
router.put('/', auth, async (req, res, next) => {
  try {
    const { id, title, content, category, accessoryArr } = req.body;
    if ( !id || !title || !content || !category ) {
      res.json({
        msg: '缺乏必要参数'
      })
    } else {
      // 修改要判断审批表，有未审批的直接替换
      let author = req.session.user._id;
      let findData = await audit.findOne({ achievement: id, auditResult: 'wait' });
      if (findData) {
        await audit.updateOne({ _id: findData._id}, {$set: { newData: { title, content, category, accessoryArr } }});
      } else {
        await audit.create({ author, achievement: id, newData: { title, content, category, accessoryArr }});
      }
      res.json({
        code: 0,
        msg: '修改成功，等待审批',
        isDel: findData ? 'Y' : 'N'
      })
    }
  } catch(err) {
    console.log('err--- ', err)
    res.json({
      err
    })
    next(err);
  }
})

// 删除要删除审批表中未审批的状态，并把数据改为已删除
// 删除论文成果
router.delete('/', auth, async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
    }
    let findData = await achievement.findOne({ _id: id });
    if (findData.author.toString() != req.session.user._id) {
      res.json({ msg: '只能删除自己的论文！' })
      return;
    }
    await achievement.deleteOne({ _id: id }); // 删除论文表
    let findAuditData = audit.find({ achievement: findData._id, author: req.session.user._id });
    if (findAuditData) {
      await audit.update({achievement: findData._id}, {$set: {auditResult: 'del'}})
    }

    // 判断科研成果模块下是否有该类别
    res.json({
      code: 0,
      msg: '删除成功',
    })
  } catch(err) {
    next(err);
  }
})

module.exports = router;