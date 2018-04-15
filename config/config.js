var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: false,

    //日志路径
    logsDir:path.join(__dirname, '../logs/'),

    // 程序运行的端口
    port: 3000,

    // 文件上传配置
    upload: {
        path: path.join(__dirname, '../public/img/'),
        url: 'http://172.16.0.169:3000/img/',
        //1MB
        fileLimit: 1048576,
        fileMaxCount: 10
    }
};


module.exports = config;
