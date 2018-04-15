var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var config = require('../config/config');

// GET /  首页
router.get('/', function (req, res, next) {
    var imgLocalAddr = config.upload.path + 'index';
    mkdirp(imgLocalAddr, function (err) {
        if (err) {
            return next(err);
        }
        fs.readdir(imgLocalAddr, function (err, filesArr) {
            if (err) {
                return next(err);
            }
            res.render('index', {imgs: filesArr, nav: 'index', title: '首页'});
        });
    });
});
// 签约摄影师
router.get('/photographer/:number', function (req, res, next) {
    var num = req.params.number ? (parseInt(req.params.number) || '') : '';
    if (!num) {
        return res.render('404');
    }
    res.render('photographer' + num, {nav: 'photographer',title:'签约摄影师'});
});
// 作品集锦
router.get('/photo/:photographerNumber', function (req, res, next) {
    var num = req.params.photographerNumber ? (parseInt(req.params.photographerNumber) || '') : '';
    if (!num) {
        return res.render('404');
    }
    var imgLocalAddr = config.upload.path + 'photo/photographer' + num;
    mkdirp(imgLocalAddr, function (err) {
        if (err) {
            return next(err);
        }
        fs.readdir(imgLocalAddr, function (err, filesArr) {
            if (err) {
                return next(err);
            }
            res.render('photo', {imgs: filesArr, nav: 'photo', title: '作品集锦',photographer:'photographer'+num});
        });
    });
});
//获奖作品
router.get('/award', function (req, res, next) {
    res.render('award', {nav: 'award', title: '获奖作品'});
});
//获奖作品详情1
router.get('/award/1', function (req, res, next) {
    res.render('award1', {nav: 'award', title: '获奖作品'});
});
//获奖作品详情2
router.get('/award/2', function (req, res, next) {
    res.render('award2', {nav: 'award', title: '获奖作品'});
});
// 客户评价
router.get('/customer', function (req, res, next) {
    res.render('customer', {nav: 'customer',  title: '客户评价'});
});
//最新动态
router.get('/news', function (req, res, next) {
    res.render('news', {nav: 'news', title: '最新动态'});
});

//最新动态详情1
router.get('/news/1', function (req, res, next) {
    res.render('news1', {nav: 'news', title: '最新动态'});
});
//最新动态详情2
router.get('/news/2', function (req, res, next) {
    res.render('news2', {nav: 'news', title: '最新动态'});
});
//联系我们
router.get('/contact', function (req, res, next) {
    res.render('contact', {nav: 'contact', title:'联系我们'});
});
module.exports = router;