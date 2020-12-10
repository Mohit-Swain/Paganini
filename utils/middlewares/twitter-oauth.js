var TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../schema/user')
require('dotenv').config();

exports.config = function () {
    return new TwitterStrategy({
            consumerKey: "QtE6JLxqgM2Q1YRez292MtVHA",
            consumerSecret: "40NXunjZXrcRWkD9bNZVUwdU3yDK71zSWFtMeAEVRzBex86jU6",
            callbackURL: "http://localhost:3000/oauth/twitter/callback",
            passReqToCallback: true,
            userAuthorizationURL: 'https://api.twitter.com/oauth/authorize?force_login=true'
        },
        function (req, accessToken, refreshToken, profile, cb) {
            console.log("callback");
            if(!req.session.isLoggedIn){
                return cb({
                        completed: false,
                        errors: ['User Not LoggedIn'],
                        errorCode: 500
                    },null);
            }
            else{
                return cb(null, {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    twitterId : profile.id,
                    twitterUserName : profile.username,
                    twitterDisplayName : profile.displayName
                });
            }
            
        }
    )
}