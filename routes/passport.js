const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const googleConfig = require("../config/google");

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
            const nickname = profile.displayName;
            const email = profile.emails[0].value;
            const profileImageUrl = profile.photos[0].value;

            console.log(socialId, nickname, email, profileImageUrl);

            onLoginSuccess('Google', socialId, nickname, profileImageUrl, done);
            return done(null, profile);
        }
    ));

    function onLoginSuccess(platformName, socialId, nickname, profileImageUrl, done) {
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