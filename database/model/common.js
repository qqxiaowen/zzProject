const mongoose = require('mongoose')
const Schema = mongoose.Schema

const common = new Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user'
  },
  content: String,
  topic: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'topic'
  }

}, { versionKey: false, timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })

module.exports = mongoose.model('common', common);