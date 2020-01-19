const user = require('../model/user');
module.exports = function (req, res, next) {
  if (req.session && req.session.user) { // 登录后
    let id = req.session.user._id;
    user.findById(id).then(data => {
      if (data.isAdministrator) { // 管理员用户
        next();
      } else {
        res.json({
          code: 402,
          msg: '权限不足'
        })
      }
    })
  } else {
    res.json({
      code: 401,
      msg: '登录状态失效'
    })
  }
}