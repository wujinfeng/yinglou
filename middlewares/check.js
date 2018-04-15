

module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        var user = 'ww';
        //var user = req.cookies.token;
        if (!user) {
            return res.redirect('/');
        } else {
            req.user = user;
            res.locals.user = user;
            next();
        }
    }
};