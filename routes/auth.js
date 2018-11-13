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

    // router.get('/google', passport.authenticate('google', {
    //     scope: ['profile', 'openid', 'email']
    // }));

    router.get('/google', function (req, res, next) {
        // console.log(req, res, next);
        var redirectTo = req.query.redirectTo ? req.query.redirectTo : "/";
        req.session.redirectTo = redirectTo;
        console.log("redirectTo: ", redirectTo);
        passport.authenticate('google', {
            scope: ['profile', 'openid', 'email']
        })(req, res, next);
    });

    router.get('/google/callback',
        passport.authenticate('google', {failureRedirect: '/'}),
        function (req, res) {
            console.log(req.query);
            var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        }
    );

    router.get('/kakao', function (req, res, next) {
        // console.log(req, res, next);
        var redirectTo = req.query.redirectTo ? req.query.redirectTo : "/";
        req.session.redirectTo = redirectTo;
        console.log("redirectTo: ", redirectTo);
        passport.authenticate('kakao', {

        })(req, res, next);
    });

    router.get('/kakao/callback',
        passport.authenticate('kakao', {failureRedirect: '/'}),
        function (req, res) {
            console.log(req.query);
            var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        }
    );

    router.get('/naver', function (req, res, next) {
        // console.log(req, res, next);
        var redirectTo = req.query.redirectTo ? req.query.redirectTo : "/";
        req.session.redirectTo = redirectTo;
        console.log("redirectTo: ", redirectTo);
        passport.authenticate('naver', {

        })(req, res, next);
    });

    router.get('/naver/callback',
        passport.authenticate('naver', {failureRedirect: '/'}),
        function (req, res) {
            console.log(req.query);
            var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        }
    );

    router.get('/logout', function (req, res) {
        req.logout();
        var redirectTo = req.query.redirectTo ? req.query.redirectTo : "/";
        res.redirect(redirectTo);
    });

    // module.exports = router;
    return router;

};


