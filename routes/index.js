var express = require('express');
var router = express.Router();
var support = require('../util/support-func');
const dbDAO = require("../util/db-dao");

var request = require("request");
var extractor = require('unfluff');
var cheerio = require('cheerio');
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = support.ensureAuthenticated(req);
  res.render('index', { user: JSON.stringify(user) });
});

router.get('/mypage', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    if(user){
        res.render('mypage', { user: JSON.stringify(user) });
    }else{
        res.redirect("/");
    }

});

router.post('/parseurl', function (req, res, next) {
  var URI = req.body.url;
  var requestOptions = { method: "GET" ,uri: URI ,headers: { "User-Agent": "Mozilla/5.0" } };
  request(requestOptions, function(error, response, body) {
    var imgs = [];

    var data = extractor(body);

    if(data.image !== null){
      try{
        imgs.push(url.resolve(URI, data.image));
      }catch (e){

      }
    }

    var $ = cheerio.load(body);
    $("img").each(function(i, image) {
      try{
        imgs.push(url.resolve(URI, $(image).attr('src')));
      }catch (e){
        // console.log(e);
      }
    });

    data.imgs = imgs;

    // console.log(imgs);
    //console.log(data);

    res.send(data);

  });
});

router.post('/getUserInfo', function (req, res, next) {
    var data = req.body;

    if("userID" in data){
        var userID = data.userID;
        dbDAO.getUserInformation(userID, function (isErr, result) {
            if(isErr){
                res.send(404);
            }else{
                res.send(result);
            }
        });
    }else{
        res.send(404);
    }
});

router.post('/getCapabilities', function (req, res, next) {
    dbDAO.getCapabilities(function (isErr, result) {
        if(isErr){
            res.send(404);
        }else{
            res.send(result);
        }
    });
});

router.post('/getTag', function (req, res, next) {
    dbDAO.getTag(function (isErr, result) {
        if(isErr) {
            res.send(404);
        } else {
            res.send(result);
        }
    });
});

router.post('/mostView', function (req, res, next) {
    dbDAO.getMostViewedBoardListData(function (isErr, result) {
        if(isErr){
            res.send(404);
        }else{
            res.send(result);
        }
    });
});

module.exports = router;
