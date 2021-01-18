var TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../schema/user')
require('dotenv').config();

exports.config = function () {
    var url = '';
    if(process.env.NODE_ENV === 'development'){
        url = "http://localhost:3000/oauth/twitter/callback";
    }
    else if(process.env.NODE_ENV === 'production'){
        url = "https://twello.herokuapp.com/oauth/twitter/callback";
    }
    return new TwitterStrategy({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: url,
            passReqToCallback: true,
            userAuthorizationURL: 'https://api.twitter.com/oauth/authorize?force_login=true'
        },
        function (req, accessToken, refreshToken, profile, cb) {
            if(!req.session.isLoggedIn){
                return cb({
                        completed: false,
                        errors: ['User Not LoggedIn in Twitter'],
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