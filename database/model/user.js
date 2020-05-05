const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  userNum: {
    type: String,
    unique: true,
    require: true
  },
  password: String,
  desc: {
    type: String,
    default: '还没有添加简介哟'
  },
  sex: Number,
  avatar: String,
  isAdministrator: {
    type: Boolean,
    default: false
  },
  jobName: {
    type: String,
    default: '普通用户'
  },
  faculty: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'faculty'
  },
  major: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'major'
  },
  auditNum: {
    type: Number,
    default: 0
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'createTime',
    updatedAt: 'updateTime'
  }
})

module.exports = mongoose.model('user', user);