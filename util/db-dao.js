var conn = require('../config/db')();

exports.isAlreadyRegisteredUser = function (userId, callback) {
    var sql = "SELECT * FROM user WHERE user_id=?;";
    conn.query(sql, [userId], function(err, results) {
        if (err) {
            console.log(err);
        } else {
            // console.log("Result: ", results);
            callback(results.length > 0);
        }
    });
};

exports.createNewUser = function (userId, name, email, photo, provider, callback) {

    var sql = "SELECT * FROM user WHERE user_id=?;";
    conn.query(sql, [userId], function(err, results) {
        if (err) {
            console.log(err);
            callback(false);
        } else {
            if(results.length > 0){
                console.log("Already registered user");
                var sql = "UPDATE user SET name=?, email=?, photo=?, last_login_date=CURRENT_TIMESTAMP WHERE user_id=?;";
                conn.query(sql, [name, email, photo, userId], function(err, results) {
                    if (err) {
                        console.log(err);
                        callback(false);
                    } else {
                        console.log("UPDATE: ", results);
                        callback(true);
                    }
                });
            }else{ // new user
                console.log("New user");
                var nickname = email.split("@")[0] + "-" + provider[0];
                var sql = "INSERT user(user_id, name, nickname, email, photo, provider) VALUES(?, ?, ?, ?, ?, ?);";
                conn.query(sql, [userId, name, nickname, email, photo, provider], function(err, results) {
                    if (err) {
                        console.log(err);
                        callback(false);
                    } else {
                        console.log("INSERT: ", results);
                        callback(true);
                    }
                });
            }
        }
    });
};

exports.getAdditionalUserData = function(userId, callback){
    var returnData = {};
    var sql = "SELECT * FROM user WHERE user_id=?;";
    conn.query(sql, [userId], function(err, results) {
        if(err){
            consoole.log(err);
            callback(null);
        }else{
            var result = results[0];
            returnData['db_id'] = result.id;
            returnData['nickname'] = result.nickname;
            returnData['rgt_date'] = result.rgt_date.toJSON();
            returnData['last_login_date'] = result.last_login_date.toJSON();
            callback(returnData);
        }
    });
};

exports.registBoard = function (id, data, callback) {
    // var sql = "INSERT INTO board (user_id, type, title, content) VALUES(?, ?, ?, ?)";

    var argu = [];
    var values = [];

    argu.push("user_id");
    values.push(id);

    if("type" in data){
        argu.push("type");
        values.push(data.type);
    }

    if("title" in data){
        argu.push("title");
        values.push(data.title);
    }

    if("content" in data){
        argu.push("content");
        values.push(JSON.stringify(data.content));
    }

    if("graph" in data){
        argu.push("graph");
        values.push(data.graph);
    }

    var sql = "INSERT INTO board (" + argu.join() + ") VALUES(";
    for(var i=0; i<argu.length; i++){
        sql += "?";
        if(i+1 < argu.length){
            sql += ",";
        }
    }
    sql += ")";

    conn.query(sql, values, function(err, result){
        if(err){
            callback(false);
        }else{
            console.log(result);
            callback(true);
        }
    })

};

exports.getBoardListData = function (type, page, callback) {
    var pageStep = 20;
    page = Math.max(page-1, 0);
    var sql = "SELECT A.*, B.nickname as nickname, IFNULL(C.num, 0) as numOfComment, IFNULL(D.num, 0) as numOfLike " +
        "FROM board as A " +
        "LEFT OUTER JOIN ( " +
        "SELECT * FROM user " +
        "GROUP BY id) as B on(B.id = A.user_id) " +
        "LEFT OUTER JOIN ( " +
        "SELECT board_id, COUNT(id) as num FROM comment " +
        "GROUP BY board_id) as C on(C.board_id = A.id) " +
        "LEFT OUTER JOIN ( " +
        "SELECT board_id, COUNT(id) as num FROM recommend " +
        "GROUP BY board_id) as D on(D.board_id = A.id) " +
        "WHERE type=? " +
        "ORDER BY id DESC " +
        "LIMIT ?,?";

    conn.query(sql, [type, page*pageStep, pageStep], function(err, results){
        if(err){
            callback(true, err);
        }else{
            // console.log(results);
            callback(false, results);
        }
    })
};

exports.getBoardDetailFromID = function (boardID, callback) {
    var sql = "UPDATE board SET hit=hit+1 WHERE id=?;" +
        "SELECT A.*, B.nickname as nickname " +
        "FROM board as A " +
        "LEFT OUTER JOIN ( " +
        "SELECT * FROM user " +
        "GROUP BY id) as B on(B.id = A.user_id) " +
        "WHERE A.id=?;";

    conn.query(sql, [boardID, boardID], function(err, results){
        if(err){
            callback(true, err);
        }else{
            console.log(results[1][0]);
            callback(false, results[1][0]);
        }
    })
};

exports.getBoardComments = function (boardID, callback) {
    var sql = "SELECT A.*, B.nickname as nickname, B.photo as user_photo " +
        "FROM comment as A " +
        "LEFT OUTER JOIN ( " +
        "SELECT * FROM user " +
        "GROUP BY id) as B on(B.id = A.user_id) " +
        "WHERE A.board_id=?";

    conn.query(sql, [boardID], function(err, results){
        if(err){
            callback(true, err);
        }else{
            console.log(results);
            callback(false, results);
        }
    })
};

exports.registComment = function (userID, boardID, content, parentCommentID, callback) {
    var sql = "";
    var argument = [userID, boardID, content];

    if(parentCommentID === null){
        sql = "INSERT INTO comment(user_id, board_id, content) VALUES(?,?,?)";
    }else{
        sql = "INSERT INTO comment(user_id, board_id, content, parent, depth) VALUES(?,?,?,?,?)";
        argument.push(parentCommentID);
        argument.push(2);
    }

    conn.query(sql, argument, function(err, results){
        if(err){
            callback(false);
        }else{
            callback(true);
        }
    })
};

exports.getUserInformation = function (userID, callback) {
      var sql = "SELECT * FROM user WHERE id=?";

    conn.query(sql, [userID], function(err, results){
        if(err){
            callback(true, err);
        }else{
            callback(false, results[0]);
        }
    })
};