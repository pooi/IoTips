const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const googleConfig = require("../config/google");
const kakaoConfig = require("../config/kakao");
const naverConfig = require("../config/naver");
const dbDAO = require("../util/db-dao");

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new GoogleStrategy({
            clientID: googleConfig.client_ID,
            clientSecret: googleConfig.client_Secret,
            callbackURL: googleConfig.callbackURL
        }, function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            console.log(done);
            const socialId = profile.id;
            const name = profile.displayName;
            const email = profile.emails[0].value;
            const profileImageUrl = profile.photos[0].value;

            console.log(socialId, name, null, email, profileImageUrl);

            onLoginSuccess('google', socialId, name, null, email, profileImageUrl, function () {
                dbDAO.getAdditionalUserData(profile.id, function (moreData) {
                    var keys = Object.keys(moreData);
                    for(var i=0; i<keys.length; i++){
                        var key = keys[i];
                        profile[key] = moreData[key];
                    }
                    return done(null, profile);
                });
            });
            // return done(null, profile);
        }
    ));

    passport.use(new KakaoStrategy({
            clientID : kakaoConfig.client_ID,
            clientSecret: kakaoConfig.client_Secret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
            callbackURL : kakaoConfig.callbackURL
        },
        function(accessToken, refreshToken, profile, done){
            // 사용자의 정보는 profile에 들어있다.
            console.log(profile);
            console.log(done);
            const socialId = profile.id;
            const nickname = profile._json.properties.nickname;
            var email = "";//nickname + "@iotips.xyz";
            if("kaccount_email" in profile._json){
                email = profile._json.kaccount_email;
            }
            const profileImageUrl = profile._json.properties.profile_image;

            console.log(socialId, nickname, email, profileImageUrl);

            onLoginSuccess('kakao', socialId, nickname, nickname, email, profileImageUrl, function () {
                dbDAO.getAdditionalUserData(profile.id, function (moreData) {
                    var keys = Object.keys(moreData);
                    for(var i=0; i<keys.length; i++){
                        var key = keys[i];
                        profile[key] = moreData[key];
                    }
                    return done(null, profile);
                });
            });
            // User.findOrCreate(..., function(err, user) {
            //     if (err) { return done(err); }
            //     done(null, user);
            // });
        }
    ));

    passport.use(new NaverStrategy({
            clientID: naverConfig.client_ID,
            clientSecret: naverConfig.client_Secret,
            callbackURL: naverConfig.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            const socialId = profile.id;
            const email = profile.emails[0].value;
            const name = email.split("@")[0];
            // if("kaccount_email" in profile._json){
            //     email = profile._json.kaccount_email;
            // }
            const profileImageUrl = profile._json.profile_image;

            console.log(socialId, name, email, profileImageUrl);

            onLoginSuccess('naver', socialId, name, null, email, profileImageUrl, function () {
                dbDAO.getAdditionalUserData(profile.id, function (moreData) {
                    var keys = Object.keys(moreData);
                    for(var i=0; i<keys.length; i++){
                        var key = keys[i];
                        profile[key] = moreData[key];
                    }
                    return done(null, profile);
                });
            });
            // User.findOne({
            //     'naver.id': profile.id
            // }, function(err, user) {
            //     if (!user) {
            //         user = new User({
            //             name: profile.displayName,
            //             email: profile.emails[0].value,
            //             username: profile.displayName,
            //             provider: 'naver',
            //             naver: profile._json
            //         });
            //         user.save(function(err) {
            //             if (err) console.log(err);
            //             return done(err, user);
            //         });
            //     } else {
            //         return done(err, user);
            //     }
            // });
        }
    ));

    function onLoginSuccess(platformName, socialId, name, nickname, email, profileImageUrl, callback) {
        // dbDAO.isAlreadyRegisteredUser(socialId, function (isAlreadyRegistered) {
        //     console.log(isAlreadyRegistered);
        // });
        dbDAO.createNewUser(socialId, name, nickname, email, profileImageUrl, platformName, function (result) {
            if(result){
                callback();
            }else{
                console.log("Login Failed");
            }
        });
        // console.log(platformName, socialId, nickname, profileImageUrl, done);
        // done(null, user);
        // userService.findOrCreate(platformName, socialId, nickname, profileImageUrl)
        //     .spread((user, created) => {
        //         if (user.state === 1) {
        //             userService.updateUserToJoinedState(user)
        //                 .then(result => {
        //                     done(null, user);
        //                 })
        //                 .catch(err => {
        //                     done(null, user);
        //                 })
        //         } else {
        //             done(null, user);
        //         }
        //     });
    }
};