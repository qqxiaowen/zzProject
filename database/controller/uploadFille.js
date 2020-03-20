const router = require('express').Router();
const multiparty = require('multiparty');
const formidable = require('formidable');
const auth = require('./auth');
const fs = require('fs');
const path = require("path");

router.post('/', auth, (req, res) => {
  let storeFileUrl = path.join(__dirname, '../../upload');
  let storeFileUrlPersonage= `${storeFileUrl}/${req.session.user.userNum}`
  fs.readdir(storeFileUrl, (err, data) => { // 读取upload下所有文件夹
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
    // console.log(fields, file);
    fs.rename(file.file[0].path, `${storeFileUrlPersonage}/${file.file[0].originalFilename}`, reNameErr => {
      if (reNameErr) {
        // console.log('reNameErr: ', reNameErr);
      } else {
        res.json({
          fields,
          file,
          err,
          reNameErr,
          filePath:`${storeFileUrlPersonage}/${file.file[0].originalFilename}`
        })
      }
    })
  });
})

// router.post('/', (req, res) => {
//   const form = new formidable.IncomingForm();
//   form.keepExtensions = true; // 设置存储文件的后缀名和上传的文件名一致
//   form.multiples = false; // 如果前端表单设置了multiples,这个值需要设置为true,后端接收的文件为一个数组
//   form.uploadDir = path.join(__dirname, '../../upload');
//   console.log('req.body: ', req);
//   form.parse(req, function(err, fields, files) {
//     if (err) {
//       res.json({
//         msg: err
//       })
//     } else {
//       res.json({
//         code: 0,
//         err,
//         fields,
//         files
//       })
//     }
//   })
// })

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