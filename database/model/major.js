const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const major = new Schema({
    majorName: String,
    desc: {
        type: String,
        default: '还没有添加简介哟'
    },
    faculty: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'faculty'
    }
},{versionKey: false, timestamps: {createdAt: 'createTime', updatedAt: 'updateTime'}})

module.exports = mongoose.model('major', major);