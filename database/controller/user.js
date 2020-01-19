const express = require('express');
const router = express.Router();

const user = require('../model/user');

const adminAuth = require('./adminAuth');
const auth = require('./auth');

// 注册管理员用户
router.post('/addAdminUser', adminAuth, async (req, res, next) => {
	try {
		let { username, userNum, password, desc, sex, avatar, faculty, major } = req.body;

		let findData = await user.findOne({ userNum });
		if (!username || !password || !userNum) {
			res.json({
				msg: '缺少必要参数'
			})
		} else if (findData) {
			res.json({
				msg: '该账号已被注册'
			})
		} else {
			if (!avatar) {
				let avatarNumber = Math.floor(Math.random() * 9);
				avatar = `http://public.mawenli.com/avatar${avatarNumber}.png`;
			}
			let data = await user.create({ username, userNum, password, desc, sex, avatar, faculty, major, isAdministrator: true, jobName: '管理员' });
			res.json({
				code: 0,
				msg: '添加用户成功',
				data
			})
		}
	} catch (err) {
		next(err);
	}
})

// 注册普通用户
router.post('/addUser', async (req, res, next) => {
	try {
		let { username, userNum, password, desc, sex, avatar, faculty, major } = req.body;

		let findData = await user.findOne({ userNum });
		if (!username || !password || !userNum) {
			res.json({
				msg: '缺少必要参数'
			})
		} else if (findData) {
			res.json({
				msg: '该账号已被注册'
			})
		} else {
			if (!avatar) {
				let avatarNumber = Math.floor(Math.random() * 9);
				avatar = `http://public.mawenli.com/avatar${avatarNumber}.png`;
			}
			let data = await user.create({ username, userNum, password, desc, sex, avatar, faculty, major });
			res.json({
				code: 0,
				msg: '添加用户成功',
				data
			})
		}
	} catch (err) {
		next(err);
	}
})

// 获取全部用户 isAdministrator默认false
router.get('/userList', adminAuth, async (req, res, next) => {
	try {
		let { pn = 1, size = 10, isAdministrator = false, faculty, major } = req.query;
		pn = parseInt(pn);
		size = parseInt(size);
		let reqData = {
			isAdministrator
		}
		if (faculty && major) {
			reqData = { ...reqData, faculty, major };
		} else if (faculty) {
			reqData = { ...reqData, faculty };
		}

		let data = await user.find(reqData)
			.skip((pn - 1) * size)
			.limit(size)
			.select('-password');
		let count = await user.count(reqData);
		res.json({
			code: 0,
			msg: '获取普通用户成功',
			data,
			count
		})

	} catch (err) {
		next(err);
	}
})

// 获取单个普通用户
router.get('/userDetail', adminAuth, async (req, res, next) => {
	try {
		let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
		}

		let data = await user.findById({ _id: id }).select('-password');
		if (data) {
			res.json({
				code: 0,
				msg: '获取单个用户成功',
				data
			})
		} else {
			res.json({ msg: '传入的id值有误' });
		}

	} catch (err) {
		if (err.kind === 'ObjectId') {
			res.json({ msg: '传入的id值有误' });
		}
		next(err);
	}
})

// 删除单个普通用户
router.delete(`/`, adminAuth, async (req, res, next) => {
	try {
		let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
		}
		let data = await user.deleteOne({ _id: id });
		if (data.n === 0) {
			res.json({ msg: '不存在该id' });
		} else {
			res.json({
				code: 0,
				msg: '删除成功',
			})
		}

	} catch (err) {
		if (err.kind === 'ObjectId') {
			res.json({ msg: '传入的id值有误' });
		}
		next(err);
	}
})

// 管理员为普通用户初始化密码
router.put('/initPassword', adminAuth, async(req, res, next) => {
	try {
		let { id } = req.query;
		if (!id) {
			res.json({ msg: '缺乏id参数' });
		}
		let findData = await user.findById({ _id: id });
		if (!findData) {
			res.json({ msg: '没有该用户' });
		} else if (findData.isAdministrator) {
			res.json({ msg: '不可初始化管理员密码' });
		} else {
			await user.updateOne({ _id: id }, {$set: { password: '123456' }});
			res.json({
				code: 0,
				msg: '初始化密码成功'
			})
		}
		
	} catch(err) {
		next(err);
	}
})

// 分割线----------------------------------------------

// 获取个人信息
router.get('/myself', auth, async (req, res, next) => {
	try {
		let _id = req.session.user._id;

		let userData = await user.findById({ _id }).select('-password');
		res.json({
			code: 0,
			msg: '获取个人信息成功',
			data: userData
		})
	} catch (err) {
		next(err);
	}
})

// 修改个人信息
router.put('/myself', auth, async (req, res, next) => {
	try {
		let _id = req.session.user._id;
		let { username, desc, sex, avatar, jobName, faculty, major } = req.body;
		if (!username || !desc || (typeof sex)==='undefined' || !avatar || !jobName || !faculty || !major) {
			res.json({
				msg: '缺乏必要参数'
			})
		} else {
			await user.updateOne({ _id }, { $set: { username, desc, sex, avatar, jobName, faculty, major }});
			res.json({
				code: 0,
				msg: '修改个人信息成功',
			})
		}
	} catch (err) {
		next(err);
	}
})

// 修改个人密码
router.put('/password', auth, async (req, res, next) => {
	try {
		let _id = req.session.user._id;
		let { password, newPassword } = req.body;
		if (!password || !newPassword ) {
			res.json({
				msg: '缺乏必要参数'
			})
		} else {
			let findData = await user.findById({ _id });
			if (findData.password === password) {
				await user.updateOne({ _id }, { $set: { password: newPassword }});
				res.json({
					code: 0,
					msg: '修改个人密码成功'
				})
			} else {
				res.json({ msg: '输入的原密码错误' });
			}
			
		}
	} catch (err) {
		next(err);
	}
})

// // 分割线----------------------------------------------

// 用户登录
router.post('/login', async (req, res, next) => {
	try {
		let { userNum, password } = req.body;
		if (userNum && password) {

			let userData = await user.findOne({ userNum });
			if (!userData) {
				res.json({
					msg: '该用户不存在',
					userData,
				})
			} else if (userData && userData.password == password) {
				req.session.user = userData;
				res.json({
					code: 0,
					msg: '用户登录成功',
					data: userData
				})
			} else {
				res.json({ msg: '密码错误' });
			}
		} else {
			res.json({ msg: '账号/密码不能为空' });
		}

	} catch (err) {
		next(err);
	}
})

// 退出登录
router.get('/logout', auth, (req, res) => {
	req.session.user = ''
	res.json({
		code: 0,
		msg: '退出登录成功'
	})
})

module.exports = router;