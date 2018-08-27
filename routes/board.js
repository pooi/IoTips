var express = require('express');
var router = express.Router();
var support = require('../util/support-func');



/* GET home page. */
router.get('/', function(req, res, next) {
  var user = support.ensureAuthenticated(req);
  res.render('board', { user: JSON.stringify(user) });
});

router.get('/regist', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('regist', { user: JSON.stringify(user) });
});

module.exports = router;
