var express = require('express');
var router = express.Router();
var support = require('../util/support-func');
const dbDAO = require('../util/db-dao');

router.get('/', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('partners', { user: JSON.stringify(user), title: "Partners" });
});

module.exports = router;