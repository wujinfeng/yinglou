//var checkLogin = require('../middlewares/check').checkLogin;

module.exports = function (app) {


    app.use('/', require('./page'));
    app.use('/login',  require('./login'));
    app.use('/user', require('./user'));

    // 404 page
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.render('404');
        }
    });
};
