var express = require('express');
var router = express.Router();
var support = require('../util/support-func');
const dbDAO = require('../util/db-dao');
 
router.get('/', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('curation', { user: JSON.stringify(user), title: "Curation" });
});

/*
router.post('/', function (req, res, next) {
    var data = req.body;
    var type = "composition";
    var page = 1;

    if("type" in data) {
        type = data.type;
    }
    if("page" in data) {
        page = data.page;
    }

})
*/

router.post('/', function(req, res, next) {
    var data = res.body;

});

router.get('/ecosystem', function(req, res, next) {
    var curationType = "ecosystem";
    
    var user = support.ensureAuthenticated(req);
    res.render('curation_ecosystem', { user: JSON.stringify(user), title: "구성 큐레이션", curationType: curationType});
    
});

router.get('/product', function(req, res, next) {
    var curationType = "product";
    
    var user = support.ensureAuthenticated(req);
    res.render('curation_product', { user: JSON.stringify(user), title: "제품 큐레이션", curationType: curationType});
    
});

router.post('/curateProduct', function (req, res, next) {
    var data = req.body;

    dbDAO.curateProduct(data, function (isErr, result) {
        if(isErr){
            res.send(404);
        }else{
            res.send(result);
        }
    });
});

router.post('/curateEcosystem', function (req, res, next) {
    var data = req.body;

    dbDAO.curateEcosystem(data, function (isErr, result) {
        if(isErr) {
            res.send(404);
        } else {
            res.send(result);
        }
    });
});

module.exports = router;