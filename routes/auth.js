if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

module.exports = function (app) {

    var express = require('express');
    var exec = require('child_process').exec;
    var session = require('express-session');

    var router = express.Router();
    var passport = require('passport');
    var conn = require('../config/db')();
    var sessionData = require('../config/session')(session);

    var support = require('../util/support-func');

    app.use(session(sessionData));

    require('./passport')(passport);
    app.use(passport.initialize());
    app.use(passport.session()); //로그인 세션 유지

    router.get('/google', passport.authenticate('google', {
        scope: ['profile', 'openid', 'email']
    }));

    router.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            console.log(req.query);
            res.redirect('/');
        });

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    // module.exports = router;
    return router;

};


