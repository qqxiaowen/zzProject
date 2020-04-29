const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const audit = new Schema({
  author: { // 作者
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  approver: { // 审批人
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  auditText: String, // 审批备注
  newData: {
    title: String,
    content: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category'
    },
    accessoryArr: Array,
  }, // 审批内容
  auditResult: { // 审批状态
    type: String,
    default: 'wait' // wait yes no del
  },
  achievement: { // 论文成果_id
    type: Schema.Types.ObjectId,
    ref: 'achievement'
  },
},{versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}})

module.exports = mongoose.model('audit', audit);