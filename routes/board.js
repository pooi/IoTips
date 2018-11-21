var express = require('express');
var router = express.Router();
var support = require('../util/support-func');
const dbDAO = require("../util/db-dao");


/* GET home page. */
router.get('/', function(req, res, next) {
  var user = support.ensureAuthenticated(req);
  res.render('board', { user: JSON.stringify(user), title: "Board" });
});

router.post('/', function (req, res, next) {
   var data = req.body;
   var type = "free";
   var page = 1;
   if("type" in data){
       type = data.type;
   }
   if("page" in data){
       page = data.page;
   }

   dbDAO.getBoardListData(type, page, function (isErr, results) {
       if(isErr){
           res.send(null);
       }else{
           res.send(results);
       }
   })

});

router.post('/related', function (req, res, next) {
    var body = req.body;
    if("parentBoardID" in body) {
        dbDAO.getRelatedBoardListData(body.parentBoardID, function (isErr, results) {
            if (isErr) {
                res.send(null);
            } else {
                res.send(results);
            }
        })
    }

});

router.post('/user', function (req, res, next) {
    var body = req.body;
    if("userID" in body){
        dbDAO.getUserBoardListData(body.userID, function (isErr, results) {
            if(isErr){
                res.send(null);
            }else{
                res.send(results);
            }
        })
    }else{
        res.send(404);
    }
});

router.post('/user/scrap', function (req, res, next) {
    var body = req.body;
    if("userID" in body){
        dbDAO.getUserScrapBoardListData(body.userID, function (isErr, results) {
            if(isErr){
                res.send(null);
            }else{
                res.send(results);
            }
        })
    }else{
        res.send(404);
    }
});

router.post('/user/scrap/save', function (req, res, next) {
    var body = req.body;
    if("userID" in body && "boardID" in body){
        dbDAO.saveScrap(body.boardID, body.userID, function (isErr, scraped, results) {
            if(isErr){
                res.send(404);
            }else{
                res.send(!scraped);
            }
        })
    }else{
        res.send(404);
    }
});

router.get('/free', function(req, res, next) {
    var boardType = "free";
    var page = req.query.page;
    if(page === undefined){
        page = 1;
    }
    if(page < 1)
        page = 1;

    var user = support.ensureAuthenticated(req);
    res.render('board', { user: JSON.stringify(user), title: "자유 게시판", boardType: boardType, page: page });

});

router.get('/question', function(req, res, next) {
    var boardType = "question";
    var page = req.query.page;
    if(page === undefined){
        page = 1;
    }
    if(page < 1)
        page = 1;

    var user = support.ensureAuthenticated(req);
    res.render('board', { user: JSON.stringify(user), title: "질문 게시판", boardType: boardType, page: page });
});

router.get('/review', function(req, res, next) {
    var boardType = "review";
    var page = req.query.page;
    if(page === undefined){
        page = 1;
    }
    if(page < 1)
        page = 1;

    var user = support.ensureAuthenticated(req);
    res.render('board', { user: JSON.stringify(user), title: "품평 게시판", boardType: boardType, page: page });
});

router.get('/ecosystem', function(req, res, next) {
    var boardType = "ecosystem";
    var page = req.query.page;
    if(page === undefined){
        page = 1;
    }
    if(page < 1)
        page = 1;

    var user = support.ensureAuthenticated(req);
    // res.render('ecosystem_board', { user: JSON.stringify(user), boardType: boardType, page: page });
    res.render('board', { user: JSON.stringify(user), title: "구성도 게시판", boardType: boardType, page: page });
});


router.get('/regist', function(req, res, next) {
    var boardType = req.query.boardType;
    if(boardType === undefined){
        boardType = "free";
    }
    // console.log(boardType);
    var user = support.ensureAuthenticated(req);
    res.render('regist', { user: JSON.stringify(user), boardType: boardType });
});

router.post('/regist', function (req, res, next) {

    var user = support.ensureAuthenticated(req);
    if(user){
        var data = req.body;
        console.log(data);
        dbDAO.registBoard(user.db_id, data, function(result, boardID){
            var returnData = {
                isSuccess:result,
                boardID: boardID
            };
            if(result){
                res.send(returnData);
            }else{
                res.send(returnData);
            }
        });
    }

});

router.get('/ecosystem/regist', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('ecosystem_regist', { user: JSON.stringify(user) });
});

router.get('/graph', function(req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('graph_test', { user: JSON.stringify(user) });
});

router.post('/getDetail', function(req, res, next){
    var data = req.body;
    if("boardID" in data){
        dbDAO.getBoardDetailFromID(data.boardID, function (isErr, result) {
            if(isErr){
                res.send(404);
            }else{
                res.send(result);
                // var content = result.content;
                // if(content != null){
                //     console.log(content);
                // }
                // var json = JSON.parse(content);
                // console.log(json);
                // delete result.content;
                // res.render('detail', { user: JSON.stringify(user), result: JSON.stringify(result), content: JSON.stringify(json) });
            }
        });
    }else{
        res.send(404);
    }
});

router.post('/comments', function(req, res, next){
    var data = req.body;
    if("boardID" in data){
        var boardID = req.body.boardID;
        dbDAO.getBoardComments(boardID, function (isErr, results) {
            if(isErr){
                res.send(404);
            }else{
                res.send(results);
            }
        })
    }else{
        res.send(404);
    }
});

router.post('/registComment', function (req, res, next) {
    var data = req.body;
    if("boardID" in data && "content" in data && "parentCommentID" in data && "graph" in data){
        var boardID = req.body.boardID;
        var user = support.ensureAuthenticated(req);
        dbDAO.registComment(user.db_id, boardID, data.content, data.parentCommentID, data.graph, function (isSuccess) {
            res.send(isSuccess);
        });
    }else{
        res.send(404);
    }
});

router.post('/reviews', function(req, res, next){
    var data = req.body;
    if("boardID" in data && "size" in data){
        dbDAO.getReview(data.boardID, data.size, function (isErr, results) {
            if(isErr){
                res.send(404);
            }else{
                res.send(results);
            }
        })
    }else{
        res.send(404);
    }
});

router.post('/reviewSummary', function(req, res, next){
    var data = req.body;
    if("boardID" in data){
        dbDAO.getReviewSummary(data.boardID, function (isErr, result) {
            if(isErr){
                res.send(404);
            }else{
                res.send(result);
            }
        })
    }else{
        res.send(404);
    }
});

router.post('/registReview', function (req, res, next) {
    var data = req.body;
    if("boardID" in data && "title" in data && "content" in data && "rating" in data && "nickname" in data){
        var boardID = req.body.boardID;
        var user = support.ensureAuthenticated(req);
        dbDAO.registReview(user.db_id, boardID, data.title, data.content, data.rating, data.nickname, function (isSuccess) {
            if(isSuccess){
                res.send({
                    statusCode: 200
                });
            }else{
                res.send({
                    statusCode: 500,
                    errorMsg: "Error"
                });
            }
        });
    }else{
        res.send(404);
    }
});



router.get('/:id', function (req, res, next) {
    var user = support.ensureAuthenticated(req);
    res.render('detail', { user: JSON.stringify(user), boardID: req.params.id });
    // dbDAO.getBoardDetailFromID(req.params.id, function (isErr, result) {
    //     if(isErr){
    //         res.send(result);
    //     }else{
    //         var content = result.content;
    //         if(content != null){
    //             console.log(content);
    //         }
    //         var json = JSON.parse(content);
    //         console.log(json);
    //         delete result.content;
    //         res.render('detail', { user: JSON.stringify(user), result: JSON.stringify(result), content: JSON.stringify(json) });
    //     }
    // });
});



module.exports = router;
