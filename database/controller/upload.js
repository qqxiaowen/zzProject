const router = require('express').Router();
const multiparty = require('multiparty');
const auth = require('./auth');
const fs = require('fs');
const path = require("path");

router.post('/uploadFile', auth, (req, res) => {
  let storeFileUrl = path.join(__dirname, '../../public/uploadFile');
  let storeFileUrlPersonage= `${storeFileUrl}/${req.session.user.userNum}`
  fs.readdir(storeFileUrl, (err, data) => { // 读取uploadFile下所有文件夹
    if (err) { console.log(err); return; }
    let isExitFolder = false; // 是否有该用户的文件上传文件夹
    data.forEach(item => {
      if (item === req.session.user.userNum) {
        isExitFolder = true;
      }
    })
    if (!isExitFolder) {
      fs.mkdir(storeFileUrlPersonage , err => { console.log(err); return; })
    }
  })
  let form = new multiparty.Form();
  form.uploadDir = storeFileUrlPersonage; // 设置单文件大小
  form.maxFilesSize = 5 * 1024 * 1024; // 设置单文件大小限制 5m
  form.parse(req, function(err, fields, file){
    console.log('--------fields, file: ', fields, file);
    fs.rename(file.file[0].path, `${storeFileUrlPersonage}/${file.file[0].originalFilename}`, reNameErr => {
      if (reNameErr) {
        res.join({
          msg: '失败',
          reNameErr: reNameErr
        })
      } else {
        res.json({
          code: 0,
          err,
          filePath:`http://zz.mawenli.com/uploadFile/${req.session.user.userNum}/${file.file[0].originalFilename}`,
        })
      }
    })
  });
})

router.post('/uploadImg', auth, (req, res) => {
  let storeFileUrl = path.join(__dirname, '../../public/uploadImg');
  let storeFileUrlPersonage= `${storeFileUrl}/${req.session.user.userNum}`
  fs.readdir(storeFileUrl, (err, data) => { // 读取uploadImg下所有文件夹
    if (err) { console.log(err); return; }
    let isExitFolder = false; // 是否有该用户的文件上传文件夹
    data.forEach(item => {
      if (item === req.session.user.userNum) {
        isExitFolder = true;
      }
    })
    if (!isExitFolder) {
      fs.mkdir(storeFileUrlPersonage , err => { console.log(err); return; })
    }
  })
  let form = new multiparty.Form();
  form.uploadDir = storeFileUrlPersonage; // 设置单文件大小
  form.maxFilesSize = 5 * 1024 * 1024; // 设置单文件大小限制 5m
  form.parse(req, function(err, fields, file){
    console.log('----------------file ', file)
    let oladFilePath = file.file[0].path;
    res.json({
      code: 0,
      err,
      filePath: `http://zz.mawenli.com${oladFilePath.split('public')[1]}`,
    })
  });
})

// router.post('/', (req, res) => {
//   const form = new multiparty.Form();
//   // res.setHeader('text/plain');
//   // var msg = {info:'',img:''};
//   // form.encoding = 'utf-8';
//   console.log(req.body);
//   form.uploadDir = path.join(__dirname, '../../upload');
//   form.maxFilesSize = 5 * 1024 * 1024; // 设置单文件大小限制 5m
//   //form.maxFields = 1000;  设置所以文件的大小总和
//   form.parse(req, function(err, fields, files) {
//     if(err){
//       res.json({
//         msg: err
//       })
//       return ;
//     }
//     // console.log(files.files[0].originalFilename);
//     // msg.img=path.join(__dirname,'/uploads/'+ files.files[0].originalFilename);
//     // console.log(msg.img);
//     // msg.info = '上传成功'
//     // msg.len = files.length;
//     // res.writeHead(200,{"Content-type":"text/html;charset=UTF-8"});
//     // res.send(msg);
//     res.json({
//       err,
//       fields,
//       files
//     })
//   });
// })

module.exports = router;