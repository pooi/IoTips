var express = require('express');
var router = express.Router();
var support = require('../util/support-func');



/* GET home page. */
router.get('/', function(req, res, next) {
  var user = support.ensureAuthenticated(req);
  res.render('board', { user: JSON.stringify(user), title: "Board" });
});

router.get('/free', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('board', { user: JSON.stringify(user), title: "자유 게시판" });
});

router.get('/question', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('board', { user: JSON.stringify(user), title: "질문 게시판" });
});

router.get('/review', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('board', { user: JSON.stringify(user), title: "품평 게시판" });
});


router.get('/ecosystem', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('ecosystem_board', { user: JSON.stringify(user) });
});

router.get('/ecosystem/regist', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('regist', { user: JSON.stringify(user) });
});

router.get('/graph', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('graph_test', { user: JSON.stringify(user) });
});

module.exports = router;
