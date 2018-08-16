var express = require('express');
var router = express.Router();
var support = require('./support-func');

/* GET home page. */
router.get('/', function(req, res, next) {
  // if(req.hasOwnProperty("user")){
  //     console.log(req.user);
  // }
  var user = support.ensureAuthenticated(req);
  console.log(user);
  res.render('index', { user: JSON.stringify(user) });
  // if(user === null){
  //     res.render('index', { user: JSON.stringify(user) });
  // }else{
  //     res.render('index', { user: JSON.stringify(user) });
  // }
});

module.exports = router;
