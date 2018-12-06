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

exports.createNewUser = function (userId, name, nickname, email, photo, provider, callback) {

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
                if(nickname === null){
                    nickname = email.split("@")[0] + "-" + provider[0];
                }
                // var nickname = email.split("@")[0] + "-" + provider[0];
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
            console.log(err);
            callback(null);
        }else{
            var result = results[0];
            returnData['db_id'] = result.id;
            returnData['name'] = result.name;
            returnData['nickname'] = result.nickname;
            returnData['email'] = result.email;
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

    if("tags" in data){
        argu.push("tags");
        values.push(JSON.stringify(data.tags));
    }

    if("parent" in data){
        argu.push("parent_board_id");
        values.push(data.parent);
    }

    var products = [];
    var platforms = [];
    if("products" in data){
        products = data.products;
    }
    if("platforms" in data){
        platforms = data.platforms;
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
            callback(false, null);
        }else{
            console.log(result);
            var boardID = result.insertId;
            if(products.length > 0 || platforms.length > 0){
                saveProductsAndPlatforms(boardID, products, platforms, callback);
            }else{
                callback(true, boardID);
            }
        }
    })

};

function saveProductsAndPlatforms(boardID, products, platforms, callback){
    var product_sql = "INSERT INTO board_product(id, board_id, title, description, company, currency, price, image, urls, capability) VALUES ?;";
    var platform_sql = "INSERT INTO board_platform(id, board_id, title, description, company, currency, price, image, urls) VALUES ?;";

    var sql = "";
    var values = [];
    if(products.length > 0){
        sql += product_sql;
        var product_values = [];
        for(var i=0; i<products.length; i++){
            var product = products[i];
            var value = [];
            value.push(product.id); value.push(boardID); value.push(product.title); value.push(product.description); value.push(product.company);
            value.push(product.currency); value.push(product.price); value.push(product.image); value.push(JSON.stringify(product.urls));
            value.push(JSON.stringify(product.capability));
            product_values.push(value);
        }
        values.push(product_values);
    }

    if(platforms.length > 0){
        sql += platform_sql;
        var platform_values = [];
        for(var i=0; i<platforms.length; i++){
            var platform = platforms[i];
            var value = [];
            value.push(platform.id); value.push(boardID); value.push(platform.title); value.push(platform.description); value.push(platform.company);
            value.push(platform.currency); value.push(platform.price); value.push(platform.image); value.push(JSON.stringify(platform.urls));
            platform_values.push(value);
        }
        values.push(platform_values);
    }

    conn.query(sql, values, function(err, result){
        if(err){
            callback(false, null);
        }else{
            console.log(result);
            callback(true, boardID);
        }
    })
}

exports.getBoardListData = function (type, page, query, callback) {
    var pageStep = 20;
    page = Math.max(page-1, 0);

    var countSql = "select count(id) as total FROM board WHERE type=?";

    var sql = "";
    if(type === "ecosystem"){
        sql = "SELECT A.*, B.nickname as nickname, IFNULL(C.num, 0) as numOfComment, IFNULL(D.num, 0) as numOfLike, P.product_images as product_images " +
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
            "LEFT OUTER JOIN ( " +
            "SELECT board_id, group_concat(image) as product_images FROM board_product " +
            "GROUP BY board_id) as P on(P.board_id = A.id) "+
            "WHERE type=? ";
    }else{
        sql = "SELECT A.*, B.nickname as nickname, IFNULL(C.num, 0) as numOfComment, IFNULL(D.num, 0) as numOfLike " +
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
            "WHERE type=? ";
    }


    var countArguments = [type];
    var arguments = [type];

    if(query !== null){
        sql += " AND (title like ? OR content like ? OR tags like ?) ";
        arguments.push("%" + query + "%");
        arguments.push("%" + query + "%");
        arguments.push("%" + query + "%");

        countSql += " AND (title like ? OR content like ? OR tags like ?) ";
        countArguments.push("%" + query + "%");
        countArguments.push("%" + query + "%");
        countArguments.push("%" + query + "%");
    }
    sql += "ORDER BY id DESC LIMIT ?,?";

    arguments.push(page*pageStep);
    arguments.push(pageStep);

    var totalSql = countSql + ";" + sql + ";";
    var totalArguments = countArguments.concat(arguments);

    conn.query(totalSql, totalArguments, function(err, results){
        if(err){
            callback(true, err);
        }else{
            if(type === "ecosystem") {
                for (var i = 0; i < results[1].length; i++) {
                    var result = results[1][i];
                    if (result.product_images !== null) {
                        var product_urls = result.product_images;
                        var array = product_urls.split(",");
                        results[1][i].product_images = array;
                    }
                }
            }
            // console.log(results);
            callback(false, results);
        }
    })
};

exports.getRelatedBoardListData = function (parentBoardID, callback) {
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
        "WHERE parent_board_id=? " +
        "ORDER BY id DESC " +
        "LIMIT 0,10";

    conn.query(sql, [parentBoardID], function(err, results){
        if(err){
            callback(true, err);
        }else{
            // console.log(results);
            callback(false, results);
        }
    })
};

exports.getMostViewedBoardListData = function (callback) {
    var sql = "SELECT A.*, B.nickname as nickname, IFNULL(C.num, 0) as numOfComment, IFNULL(D.num, 0) as numOfLike, P.product_images as product_images " +
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
        "LEFT OUTER JOIN ( " +
        "SELECT board_id, group_concat(image) as product_images FROM board_product " +
        "GROUP BY board_id) as P on(P.board_id = A.id) "+
        "WHERE type='ecosystem' " +
        "ORDER BY hit DESC " +
        "LIMIT 0, 12";

    conn.query(sql, [], function(err, results){
        if(err){
            callback(true, err);
        }else{

            for(var i=0; i<results.length; i++){
                var result = results[i];
                if(result.product_images !== null){
                    var product_urls = result.product_images;
                    var array = product_urls.split(",");
                    results[i].product_images = array;
                }
            }
            callback(false, results);
        }
    })
};


exports.getUserEcosystemBoardListData = function (userID, callback) {

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
        "WHERE A.user_id=? AND type=?" +
        "ORDER BY id DESC " +
        "LIMIT 0,10";

    conn.query(sql, [userID, "my_ecosys"], function(err, results){
        if(err){
            callback(true, err);
        }else{
            // console.log(results);
            callback(false, results);
        }
    })
};

exports.getUserBoardListData = function (userID, callback) {

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
        "WHERE A.user_id=? " +
        "ORDER BY id DESC " +
        "LIMIT 0,10";

    conn.query(sql, [userID], function(err, results){
        if(err){
            callback(true, err);
        }else{
            // console.log(results);
            callback(false, results);
        }
    })
};

exports.getUserScrapBoardListData = function (userID, callback) {

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
        "WHERE A.id in (SELECT board_id FROM scrap WHERE user_id=?) " +
        "ORDER BY id DESC " +
        "LIMIT 0,10";

    conn.query(sql, [userID], function(err, results){
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
        "SELECT A.*, B.nickname as nickname, IFNULL((SELECT title FROM board WHERE id=A.parent_board_id), NULL) as parent_title " +
        "FROM board as A " +
        "LEFT OUTER JOIN ( " +
        "SELECT * FROM user " +
        "GROUP BY id) as B on(B.id = A.user_id) " +
        "WHERE A.id=?;" +
        "select * from board_product where board_id=?;" +
        "select * from board_platform where board_id=?;";

    conn.query(sql, [boardID, boardID, boardID, boardID], function(err, results){
        if(err){
            callback(true, err);
        }else{
            // console.log(results[1][0]);
            var data = {
                result: results[1][0],
                products: results[2],
                platforms: results[3]
            };
            console.log(data);
            callback(false, data);
        }
    })
};

exports.getBoardComments = function (boardID, callback) {
    var sql = "SELECT A.*, B.nickname as nickname, B.photo as user_photo " +
        "FROM comment as A " +
        "LEFT OUTER JOIN ( " +
        "SELECT * FROM user " +
        "GROUP BY id) as B on(B.id = A.user_id) " +
        "WHERE A.board_id=? " +
        "ORDER BY id ASC";

    conn.query(sql, [boardID], function(err, results){
        if(err){
            callback(true, err);
        }else{
            console.log(results);
            callback(false, results);
        }
    })
};

exports.registComment = function (userID, boardID, content, parentCommentID, graph, callback) {
    var sql = "";
    var argument = [userID, boardID, content];

    if(parentCommentID === null){
        if(graph === null){
            sql = "INSERT INTO comment(user_id, board_id, content) VALUES(?,?,?)";
        }else{
            sql = "INSERT INTO comment(user_id, board_id, content, graph) VALUES(?,?,?,?)";
            argument.push(graph);
        }

    }else{
        if(graph === null){
            sql = "INSERT INTO comment(user_id, board_id, content, parent, depth) VALUES(?,?,?,?,?)";
        }else{
            sql = "INSERT INTO comment(user_id, board_id, content, graph, parent, depth) VALUES(?,?,?,?,?,?)";
            argument.push(graph);
        }

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

exports.registReview = function (userID, boardID, title, content, rating, nickname, callback) {
    var sql = "INSERT INTO review(user_id, board_id, title, content, star, nickname) VALUES(?,?,?,?,?,?)";

    conn.query(sql, [userID, boardID, title, content, rating, nickname], function(err, results){
        if(err){
            callback(false);
        }else{
            callback(true);
        }
    })
};

exports.getReview = function (boardID, size, callback) {
    var sql = "SELECT * FROM review WHERE board_id=? ORDER BY id DESC ";
    if(size > 0){
        sql += " limit 0, ?";
    }

    conn.query(sql, [boardID, size], function(err, results){
        if(err){
            callback(true, err);
        }else{
            callback(false, results);
        }
    })
};

exports.getReviewSummary = function (boardID, callback) {
    var sql = "SELECT COUNT(id) as count, IFNULL(AVG(star),0) as rating FROM review where board_id=?";

    conn.query(sql, [boardID], function(err, results){
        if(err){
            callback(true, err);
        }else{
            callback(false, results[0]);
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

exports.getCapabilities = function (callback) {
    var sql = "SELECT * FROM capability";

    conn.query(sql, [], function(err, results){
        if(err){
            callback(true, err);
        }else{
            callback(false, results);
        }
    })
};

exports.getTag = function (callback) {
    var sql = "SELECT * FROM tag ORDER BY name";

    conn.query(sql, [], function(err, results) {
        if(err) {
            callback(true, err);
        } else {
            callback(false, results);
        }
    })
};

exports.curateProduct = function (data, callback) {

    var minPrice = data.minPrice;
    var maxPrice = data.maxPrice;
    var usdMinPrice = data.minPrice / 1100;
    var usdMaxPrice = data.maxPrice / 1100;
    var checkedTag = data.checkedTag;
    var checkedCapa = data.checkedCapa;

    var sqlTag = "";
    var sqlCapa = "";
    var sql = "SELECT * FROM product WHERE ((price BETWEEN ? AND ? " +
        "AND currency='KRW')" +
        "OR (price BETWEEN ? AND ? " +
        "AND currency='USD'))";

    for(var i = 0; i < checkedTag.length; i++) {
        sqlTag = sqlTag + " AND tag LIKE '%" + checkedTag[i] + "%'";
    }
    for(var i = 0; i < checkedCapa.length; i++) {
        sqlCapa = sqlCapa + " AND capability LIKE '%\"" + checkedCapa[i].id + "\"%'";
    }
    
    sql = sql + sqlTag + sqlCapa;

    conn.query(sql, [minPrice, maxPrice, usdMinPrice, usdMaxPrice], function(err, results) {
        if(err) {
            console.log(err);
            callback(true, err);
        }else {
            callback(false, results);
        }
    })
};

exports.curateEcosystem = function (data, callback) {
    
    var minCost = data.minPrice;
    var maxCost = data.maxPrice;
    var checkedTag = data.checkedTag;
    var checkedCapa = data.checkedCapa;
    
    var sqlId = "";
    var sqlTag = "";
    var sqlCapa = "";

    for(var i = 0; i < checkedTag.length; i++) {
        if(i==0) {
            sqlTag = " WHERE X.tags LIKE '%" + checkedTag[i] + "%'";
        }
        else {
            sqlTag = sqlTag + " AND X.tags LIKE '%" + checkedTag[i] + "%'";
        }
    }

    for(var i = 0; i < checkedCapa.length; i++) {
        if(i==0) {
            sqlCapa = " WHERE Z.product_capability LIKE '%\"check\": true, \"capability\": \"" + checkedCapa[i].capability + "\"%'";
        }
        else {
            sqlCapa = sqlCapa + " AND Z.product_capability LIKE '%\"check\": true, \"capability\": \"" + checkedCapa[i].capability + "\"%'";
        }
    }

    sqlId ="SELECT X.* FROM board AS X" + sqlTag;

    var sql = "SELECT Z.* FROM (" +
        "SELECT A.*, B.nickname as nickname, IFNULL(C.num, 0) as numOfComment, IFNULL(D.num, 0) as numOfLike, P.product_images as product_images, P.product_capability as product_capability " +
        "FROM (" + sqlId +") as A " +
        "LEFT OUTER JOIN ( " +
        "SELECT * FROM user " +
        "GROUP BY id) as B on(B.id = A.user_id) " +
        "LEFT OUTER JOIN ( " +
        "SELECT board_id, COUNT(id) as num FROM comment " +
        "GROUP BY board_id) as C on(C.board_id = A.id) " +
        "LEFT OUTER JOIN ( " +
        "SELECT board_id, COUNT(id) as num FROM recommend " +
        "GROUP BY board_id) as D on(D.board_id = A.id) " +
        "LEFT OUTER JOIN ( " +
        "SELECT board_id, group_concat(image) as product_images, group_concat(capability) as product_capability FROM board_product " +
        "GROUP BY board_id) as P on(P.board_id = A.id) "+
        "WHERE type='ecosystem' " +
        ") as Z" + sqlCapa;
        
    // var sql = "SELECT Z.* FROM (" +
    //     "SELECT A.*, B.nickname as nickname, IFNULL(C.num, 0) as numOfComment, IFNULL(D.num, 0) as numOfLike, P.product_images as product_images, P.product_capability as product_capability " +
    //     "FROM (" + sqlId +") as A " +
    //     "LEFT OUTER JOIN ( " +
    //     "SELECT * FROM user " +
    //     "GROUP BY id) as B on(B.id = A.user_id) " +
    //     "LEFT OUTER JOIN ( " +
    //     "SELECT board_id, COUNT(id) as num FROM comment " +
    //     "GROUP BY board_id) as C on(C.board_id = A.id) " +
    //     "LEFT OUTER JOIN ( " +
    //     "SELECT board_id, COUNT(id) as num FROM recommend " +
    //     "GROUP BY board_id) as D on(D.board_id = A.id) " +
    //     "LEFT OUTER JOIN ( " +
    //     "SELECT board_id, group_concat(image) as product_images, group_concat(capability) as product_capability FROM board_product " +
    //     "GROUP BY board_id) as P on(P.board_id = A.id) "+
    //     "WHERE type='ecosystem' " +
    //     ") as Z";

    var cntSql = "SELECT COUNT(id) FROM capability"
    console.log(sql);

    var totalSql = cntSql + "; " + "SET SESSION group_concat_max_len = 10000000000; " + sql + ";"

    conn.query(totalSql, [], function(err, results) {
        if(err) {
            console.log("zz", err);
            callback(true, err);
        } else {

            for (var i = 0; i < results[2].length; i++) {
                var result = results[2][i];
                if (result.product_images !== null) {
                    var product_urls = result.product_images;
                    var array = product_urls.split(",");
                    results[2][i].product_images = array;
                }
            }
        
            callback(false, results);
        }
    })
};

exports.saveScrap = function (boardID, userID, callback) {
    var sql = "SELECT * FROM scrap WHERE user_id=? and board_id=?";
    conn.query(sql, [userID, boardID], function(err, results){
        if(err){
            callback(true, false, err);
        }else{
            if(results.length > 0){
                callback(false, true, err);
            }else{
                var insertSql = "INSERT INTO scrap(user_id, board_id) VALUES(?,?)";
                conn.query(insertSql, [userID, boardID], function(err, results){
                    if(err){
                        callback(true, false, err);
                    }else{
                        callback(false, false, results);
                    }
                })
            }
        }
    })
};