const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faculty = new Schema({
  facultyName: String,
  desc: {
    type: String,
    default: '还没有添加简介哟'
  }
},{versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}})

module.exports = mongoose.model('faculty', faculty);