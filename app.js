var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var config = require('./config/config');
var winston = require('winston');
var expressWinston = require('express-winston');

var routes = require('./routes/index');

var app = express();

app.set('env',config.debug ? 'development' : 'production');
app.set('port', process.env.PORT || config.port);
app.set('trust proxy', 'loopback, 127.0.0.1'); 		// 指定子网和 IP 地址
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave:false,
    saveUninitialized:false,
    name: 'yinglou',// 设置 cookie 中保存 session id 的字段名称
    secret: 'yinglou1',// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    cookie: {
        maxAge: 3600000// 过期时间3600s，过期后 cookie 中的 session id 自动删除
    }
}));

// 添加模板必需的变量
app.use(function (req, res, next) {
    res.locals.title = '';
    res.locals.nav = '';
    next();
});
// 正常请求的日志
app.use(expressWinston.logger({
    transports:[
        new (winston.transports.Console)({
            json:false,
            colorize:true
        }),
        new winston.transports.File({
            json:false,
            filename: config.logsDir +'success.log'
        })
    ],
    meta:false
}));

routes(app);

// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports:[
        new winston.transports.Console({
            json:false,
            colorize:true
        }),
        new winston.transports.File({
            json:false,
            filename: config.logsDir +'error.log'
        })
    ]
}));

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(config.port, function () {
        console.log(`listening on port ${config.port}`);
    });
}

module.exports = app;
