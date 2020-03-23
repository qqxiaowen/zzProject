const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const category = new Schema({
  categoryName: String,
  desc: {
    type: String,
    default: '还没有添加简介哟'
  },
  isShow: {
    type: Boolean,
    default: true
  }
},{versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}})

module.exports = mongoose.model('category', category);