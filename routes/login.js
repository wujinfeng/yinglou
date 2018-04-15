var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var userpasswd = {
    user:'a',
    password:'a'
};

function md5 (text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

// 登陆页面
router.get('/', function (req, res, next) {
    res.render('login',{nav: '', title: '登陆'});
});
// 登陆请求
router.post('/', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if(!username || !password){
        return res.render('login',{nav: '', title: '登陆'});
    }
    if(userpasswd.user == username && userpasswd.password == password){
        var yinglouToken = md5(username+password);
        req.session.yinglou = yinglouToken;
        res.render('welcome',{username:username,nav: '', title: '登陆'});
    }else{
        res.render('login',{nav: '', title: '登陆'});
    }
});

module.exports = router;