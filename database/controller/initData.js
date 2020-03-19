const express = require('express');
const router = express.Router();

const user = require('../model/user');
const faculty = require('../model/faculty');
const major = require('../model/major');
const category = require('../model/category');

// 批量添加学生
router.get('/user', async (req, res, next) => {
	try {
    let isFirstInit = await user.findOne({username: 'admin'});
    if (isFirstInit) {
      res.json({ msg: '不可重复始化过数据' });
      return;
    }
    let addAdminUser = await user.create({
      username: 'admin',
      userNum: 'admin',
      password: '123456',
      desc: '第一个管理员哦',
      isAdministrator: true,
      jobName: '管理员',
      avatar: 'http://public.mawenli.xyz/avatar0.png',
      sex: 1,
    })
    // 测试批量添加学生
    let addUser = await user.insertMany([
      {
        username: '用户1',
        userNum: '1001',
        password: '123456',
        desc: '这是第1个普通用户',
        avatar: 'http://public.mawenli.xyz/avatar1.png',
        sex: 1,
      },
      {
        username: '用户2',
        userNum: '1002',
        password: '123456',
        desc: '这是第2个普通用户',
        avatar: 'http://public.mawenli.xyz/avatar1.png',
        sex: 1,
      },
      {
        username: '用户3',
        userNum: '1003',
        password: '123456',
        desc: '这是第3个普通用户',
        avatar: 'http://public.mawenli.xyz/avatar1.png',
        sex: 1,
      },
      {
        username: '用户4',
        userNum: '1004',
        password: '123456',
        desc: '这是第4个普通用户',
        avatar: 'http://public.mawenli.xyz/avatar1.png',
        sex: 1,
      },
      {
        username: '用户5',
        userNum: '1005',
        password: '123456',
        desc: '这是第5个普通用户',
        avatar: 'http://public.mawenli.xyz/avatar1.png',
        sex: 1,
      }
    ])
    res.json({
      code: 0,
      msg: '初始化用户成功',
      addAdminUser,
      addUser
    })
	} catch (err) {
		next(err);
	}
})

// 批量添加院系-专业
router.get('/facultyMajor', async(req, res, next) => {
  try {
    let isFirstInit = await faculty.findOne({facultyName: '信息工程学院'});
    if (isFirstInit) {
      res.json({ msg: '不可重复始化过数据' });
      return;
    }
    let addFacaulty = await faculty.insertMany([
      { facultyName: '信息工程学院' },
      { facultyName: '国际学院' },
      { facultyName: '生物工程系' },
      { facultyName: '化学化工系' },
      { facultyName: '体育系' },
    ])
    let addMajor = await major.insertMany([
      {
        majorName: "软件工程",
        faculty: addFacaulty[0]._id
      },
      {
        majorName: "网络工程",
        faculty: addFacaulty[0]._id
      },
      {
        majorName: "计算机科学与技术",
        faculty: addFacaulty[0]._id
      },
      {
        majorName: "软件工程",
        faculty: addFacaulty[1]._id
      },
    ])

    res.json({
      code: 0,
      msg: '初始化院系专业成功',
      addFacaulty,
      addMajor
    })
  } catch(err) {
    next(err);
  }
})

// 批量添加类目
router.get('/category', async(req, res, next) => {
  try {
    let isFirstInit = await category.findOne({categoryName: '专利'});
    if (isFirstInit) {
      res.json({ msg: '不可重复始化过数据' });
      return;
    }
    let addCategory = await category.insertMany([
      { categoryName: '专利' },
      { categoryName: '著作' },
      { categoryName: '项目' },
      { categoryName: '软件' },
    ])
    res.json({
      code: 0,
      msg: '初始化类目信息成功',
      addCategory
    })
  } catch(err) {
    next(err);
  }
})
module.exports = router;