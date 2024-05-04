var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../schema/user');
require('dotenv').config();

exports.config = function () {
    var url;
    if (process.env.NODE_ENV === 'development') {
        url = "http://localhost:3000/oauth/google/callback";
    }
    else if (process.env.NODE_ENV === 'production') {
        url = process.env.PROD_URL + "/oauth/google/callback";
    }
    return new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: url
    },
        function (accessToken, refreshToken, profile, cb) {
            User.findOne({
                googleId: profile.id
            }).then(user => {
                if (user) {
                    cb(null, user);
                } else {
                    User.create({
                        googleId: profile.id,
                        email: profile._json.email,
                        userName: profile._json.name
                    }).then(user => {
                        cb(null, user);
                    }).catch(err => {
                        cb(err);
                    });
                }
            }).catch(err => {
                cb(err);
            });
        }
    );
};