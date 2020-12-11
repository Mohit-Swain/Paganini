var TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../schema/user')
require('dotenv').config();

exports.config = function () {
    return new TwitterStrategy({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
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