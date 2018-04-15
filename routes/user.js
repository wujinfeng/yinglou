var multer = require('multer');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var async = require('async');
var mkdirp = require('mkdirp');
var config = require('../config/config');
var express = require('express');
var router = express.Router();


//只有登陆过的用户才可以执行下面操作

//检测是否登陆，包含有session.yinglou字段
router.use(function (req, res, next) {
   if(!req.session.yinglou){
       res.redirect('/');
   }else{
       next();
   }
});

/**
 * 图片存储:路径，文件名
 */
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //let creatorId = 'w' ;// req.user.id;
        let dir = req.body.pathdir;
        let path = config.upload.path + dir;
        mkdirp(path, function (err) {
            cb(err, path);
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

/**
 * 过滤图片
 * @param req
 * @param file
 * @param cb
 */
var fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
/**
 * 限制文件大小，个数
 * @type {{fileSize: number, files: number}}
 */
var limits = {fileSize: config.upload.fileLimit, files: config.upload.fileMaxCount};
var upload = multer({storage: storage, fileFilter: fileFilter, limits: limits});


router.get('/upload', function (req, res, next) {
    res.render('upload',{nav:'upload'});
});

//浏览图片
router.get('/imgs', function (req, res, next) {
    let dir = req.query.dir || 'index';
    var pageimg = '';
    if (dir == 'index') {
        pageimg = 'index';
    } else if (dir.indexOf('photo') > -1) {
        pageimg = 'photo'
    }
    let imgLocalAddr = config.upload.path + dir + '/';
    mkdirp(imgLocalAddr, function (err) {
        if (err) {
            return next(err);
        }
        fs.readdir(imgLocalAddr, function (err, filesArr) {
            if (err) {
                return next(err);
            }
            res.render('imgsUploaded', {imgs: filesArr,dir:dir, pageimg: pageimg, title: '图片资源',nav:'upload'});
        });
    });
});

//文件上传  /user/upload
router.post('/upload', upload.array('file', config.upload.fileMaxCount), function (req, res, next) {
    res.redirect('/user/upload');
});

//删除图片 /user/delete/:dir/:file
router.get('/delete', function (req, res, next) {
    var dir = req.query.path;
    if (!dir) {
        return res.redirect('/user/imgs');
    }
    let imgLocalAddr = path.join(config.upload.path, '../' + dir);
    fs.unlink(imgLocalAddr, (err)=> {
        if (err) {
            return next(err);
        }
        res.redirect('/user/imgs');
    });
});

module.exports = router;