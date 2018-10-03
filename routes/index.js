var express = require('express');
var router = express.Router();
var support = require('../util/support-func');

var request = require("request");
var extractor = require('unfluff');
var cheerio = require('cheerio');
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req);
  var user = support.ensureAuthenticated(req);
  res.render('index', { user: JSON.stringify(user) });
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
    console.log(data);

    res.send(data);

  });
});

module.exports = router;
