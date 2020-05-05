const router = require('express').Router();

const achievement = require('../model/achievement');
const audit = require('../model/audit');
const user = require('../model/user');

const auth = require('./auth');
const adminAuth  = require('./adminAuth');

// 获取管理员所有审批
router.get('/admin', adminAuth, async (req, res, next) => {
  try {
    let { pn = 1, size = 10, auditResult } = req.query;
    pn = parseInt(pn);
    size = parseInt(size);
    let reqData = {};
    if (auditResult) {
      reqData = { auditResult }
    }
    let data = await audit.find({ ...reqData })
      .skip((pn - 1) * size)
      .limit(size)
      .sort({'updateTime': -1})
      .populate({
        path: 'author',
        select: 'username userNum'
      })
      .populate({
        path: 'newData.category',
        select: 'categoryName',
      })
      .populate({
        path: 'facultyName',
        select: 'facultyName'
      })
    res.json({
      code: 0,
      msg: '获取管理员所有论文成果成功',
      data,
    })
  } catch(err) {
    next(err);
  }
})

// 获取个人所有审批
router.get('/myself', auth, async (req, res, next) => {
  try {
    let { pn = 1, size = 10, auditResult } = req.query;
    pn = parseInt(pn);
    size = parseInt(size);
    let reqData = {};
    if (auditResult) {
      reqData = { auditResult }
    }
    let data = await audit.find({ ...reqData, author: req.session.user._id })
      .skip((pn - 1) * size)
      .limit(size)
      .sort({'updateTime': -1})
      .populate({
        path: 'author',
        select: 'username userNum'
      })
      .populate({
        path: 'newData.category',
        select: 'categoryName',
      })
      .populate({
        path: 'facultyName',
        select: 'facultyName'
      })
    res.json({
      code: 0,
      msg: '获取所有个人所有审批成功',
      data,
    })
  } catch(err) {
    next(err);
  }
})

// 管理员获取已审批的论文成果
router.get('/audited', adminAuth, async (req, res, next) => {
  try {
    let { pn = 1, size = 10, auditResult } = req.query;
    pn = parseInt(pn);
    size = parseInt(size);
    let reqData = {};
    if (auditResult) {
      reqData = { auditResult }
    }
    let data = await audit.find({ ...reqData, approver: req.session.user._id })
      .skip((pn - 1) * size)
      .limit(size)
      .sort({'updateTime': -1})
      .populate({
        path: 'author',
        select: 'username userNum'
      })
      .populate({
        path: 'newData.category',
        select: 'categoryName',
      })
      .populate({
        path: 'facultyName',
        select: 'facultyName'
      })
    res.json({
      code: 0,
      msg: '获取管理员已审批的论文成果成功',
      data,
    })
  } catch(err) {
    next(err);
  }
})

// 获取单个审批详情
router.get('/detail', auth, async (req, res, next) => {
  try {
    let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
    }
    let data = await audit.findOne({ _id: id })
      .populate({
        path: 'author',
        select: 'username userNum'
      })
      .populate({
        path: 'newData.category',
        select: 'categoryName',
      })
      .populate({
        path: 'facultyName',
        select: 'facultyName'
      })
    res.json({
      code: 0,
      msg: '获取单个审批详情成功',
      data,
    })
  } catch(err) {
    next(err);
  }
})

// 审批论文成果
router.post('/', adminAuth, async (req, res, next) => {
  try {
    let { id, auditResult, auditText } = req.body;
    
    if (id && (auditResult === 'yes' || auditResult === 'no') ) {

      let findData = await audit.findOne({ _id: id });
      if (!findData) {
        res.json({ msg: '未找到该审批记录' })
      } else if (findData && findData.auditResult !== 'wait') {
        res.json({
          msg: '该审批记录不是审批状态',
          auditResult: findData.auditResult
        })
      } else {
        await audit.updateOne({ _id: id }, {$set: { auditResult, auditText, approver: req.session.user._id }})
        await user.updateOne({ _id: req.session.user._id }, {$inc: { auditNum: 1 }}) // 审批数+1
        let resultData;
        if (auditResult === 'yes') { // 修改论文后的审批有问题
          const { title, content, category, accessoryArr } = findData.newData;
          resultData = await achievement.updateOne({ _id: findData.achievement }, {$set: { isShow: true, lastAudit: req.session.user._id, title, content, category, accessoryArr }})
        } else if (auditResult === 'no') {
          resultData = await achievement.updateOne({ _id: findData.achievement }, {$set: { lastAudit: req.session.user._id }})
        }
        res.json({
          code: 0,
          msg: '审批成功成功',
          auditResult,
          resultData
        })
      }
    } else {
      res.json({
        msg: '缺乏必要参数/auditResult不合规范',
        auditResult
      })
    }
  } catch(err) {
    next(err);
  }
})

module.exports = router;