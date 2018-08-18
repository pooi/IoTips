var conn = require('../config/db')();

var oneDayMs = 86400000;

exports.getTodayMs = function () {
    var d = new Date();
    return d.getTime();
};

exports.dateToMs = function (date) {
    var temp = date.split('-');
    var year = parseInt(temp[0]);
    var month = parseInt(temp[1]);
    var day = parseInt(temp[2]);
    var k = Date.parse(date);
    return k;
};

exports.msToDate = function (ms) {
    var date = new Date(ms);
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!

    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var dateString = yyyy + "-" + mm + "-" + dd;
    return dateString;
};

exports.oneDayMs = oneDayMs;

exports.getTodayMsWithoutTime = function () {
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!

    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var dateString = yyyy + "- " + mm + "- " + dd;
    return this.dateToMs(dateString);
};

exports.ensureAuthenticated = function (req) {
    if (req.isAuthenticated()) {
        var user = req.user;
        var userData = {
            id: user.id,
            displayName: user.displayName,
            email: user.emails[0].value,
            photo: user.photos[0].value,
            provider: user.provider
        };
        return userData;
    }
    return null;
};
