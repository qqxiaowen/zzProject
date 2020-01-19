const express = require('express');
const router = express.Router();

const user = require('../model/user');

// 注册管理员用户
router.get('/', async (req, res, next) => {
	try {
    let addAdminUser = await user.create({
      username: 'admin',
      userNum: 'admin',
      password: '123456',
      desc: '第一个管理员哦',
      isAdministrator: true,
      jobName: '管理员',
      avatar: 'http://public.mawenli.xyz/avatar0.png',
      sex: 1,
      faculty: '01',
      major: '0101'
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
        faculty: '10',
        major: '1001'
      },
      {
        username: '用户2',
        userNum: '1002',
        password: '123456',
        desc: '这是第2个普通用户',
        avatar: 'http://public.mawenli.xyz/avatar1.png',
        sex: 1,
        faculty: '10',
        major: '1002'
      },
      {
        username: '用户3',
        userNum: '1003',
        password: '123456',
        desc: '这是第3个普通用户',
        avatar: 'http://public.mawenli.xyz/avatar1.png',
        sex: 1,
        faculty: '10',
        major: '1003'
      },
      {
        username: '用户4',
        userNum: '1004',
        password: '123456',
        desc: '这是第4个普通用户',
        avatar: 'http://public.mawenli.xyz/avatar1.png',
        sex: 1,
        faculty: '11',
        major: '1101'
      },
      {
        username: '用户5',
        userNum: '1005',
        password: '123456',
        desc: '这是第5个普通用户',
        avatar: 'http://public.mawenli.xyz/avatar1.png',
        sex: 1,
        faculty: '11',
        major: '1102'
      }
    ])
    res.json({
      code: 0,
      msg: '初始化数据成功',
      addAdminUser,
      addUser
    })
	} catch (err) {
		next(err);
	}
})

module.exports = router;