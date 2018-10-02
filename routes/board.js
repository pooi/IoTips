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
    res.render('board', { user: JSON.stringify(user), title: "자유 게시판", boardType: "free" });
});

router.get('/question', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('board', { user: JSON.stringify(user), title: "질문 게시판", boardType: "question" });
});

router.get('/review', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('board', { user: JSON.stringify(user), title: "품평 게시판", boardType: "review" });
});


router.get('/ecosystem', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('ecosystem_board', { user: JSON.stringify(user) });
});


router.get('/regist', function(req, res, next) {
    var boardType = req.query.boardType;
    if(boardType === undefined){
        boardType = "free";
    }
    console.log(boardType);
    var user = support.ensureAuthenticated(req);
    res.render('regist', { user: JSON.stringify(user), boardType: boardType });
});

router.get('/ecosystem/regist', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('ecosystem_regist', { user: JSON.stringify(user) });
});

router.get('/graph', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('graph_test', { user: JSON.stringify(user) });
});

module.exports = router;
