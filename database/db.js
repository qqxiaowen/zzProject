const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/zzProject', {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '链接失败'));

db.once('open', function() {
    console.log('连接数据库成功');
});

module.exports = db;