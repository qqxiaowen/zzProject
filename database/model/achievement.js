const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const achievement = new Schema({
  title: String, // 标题
  content: String, // 内容
  author: { // 作者
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  category: { // 关联类别
    type: Schema.Types.ObjectId,
    ref: 'category'
  },
  readNumber: { // 浏览数
    type: Number,
    default: 0
  },
  accessoryArr: { // 附件数组
    type: Array,
    default: []
  },
  isShow: { // 是否为所有人显示
    type: Boolean,
    default: false
  },
  // isAudit: { // 是否在审批中 
  //   type: Boolean,
  //   default: true
  // },
  lastAudit: { // 最后一次审批（新增审批）关联审批人（管理员）
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
  
},{versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}})

module.exports = mongoose.model('achievement', achievement);