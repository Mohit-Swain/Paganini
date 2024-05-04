const express = require('express');
const passport = require('passport');
const oauthRoutes = express.Router();
const mongoose = require('mongoose');
const jwtMiddleware = require('../utils/middlewares/jwt_authorize');
const User = require('../utils/schema/user');
const TwitterModel = require('../utils/schema/Twitter_data');
require('dotenv').config();

var url = '';
if (process.env.NODE_ENV === 'development') {
    url = "http://localhost:3000";
}
else if (process.env.NODE_ENV === 'production') {
    url = process.env.PROD_URL;
}

oauthRoutes.get('/oauth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

oauthRoutes.get('/oauth/google/callback',
    passport.authenticate('google', {
        failureRedirect: url + '/login'
    }),
    function (req, res) {
        req.session.isLoggedIn = true;
        req.session.name = req.user.userName;
        req.session.hasTwitter = (req.user.twitterAccount ? true : false);
        if (req.user.twitterAccount) {
            TwitterModel.findById(req.user.twitterAccount)
                .then((twitInst) => {
                    if (twitInst) {
                        req.session.twitter = twitInst;
                    }
                    else {
                        req.session.hasTwitter = false;
                        req.session.twitter = null;
                    }
                    return req.session.save();
                }).then(() => {
                    return res.redirect(url);
                }).catch(() => {
                    return res.json({
                        completed: false,
                        errors: ['google oauth failed']
                    });
                });
        }
        else {
            req.session.save(() => {
                return res.redirect(url);
            });
        }
    });

oauthRoutes.get('/oauth/twitter', jwtMiddleware.authorize,
    function (req, res, next) {
        console.log(req.query);
        if (req.query.mode === 'new') {
            return next();
        }
        console.log("here");
        return User.findById(mongoose.Types.ObjectId(req.userId))
            .select({ twitterAccount: 1 })
            .populate('twitterAccount')
            .then(user => {
                console.log(user);
                if (!user) {
                    return res.redirect(url);
                }
                else if (!user.twitterAccount) {
                    return next();
                }
                else {
                    req.session.hasTwitter = true;
                    req.session.twitter = user.twitterAccount;
                    return req.session.save()
                        .then(() => res.redirect("back"))
                        .catch(err => res.redirect(url));
                }
            }).catch((err) => {
                console.log(err);
                return res.redirect(url);
            });
    }, passport.authorize('twitter', {
        failureRedirect: url
    })
);

oauthRoutes.get('/oauth/twitter/callback', jwtMiddleware.authorize,
    passport.authorize('twitter', {
        failureRedirect: url
    }),
    function (req, res) {
        var theUser = null;
        return User
            .findById(mongoose.Types.ObjectId(req.userId))
            .populate('twitterAccount')
            .then(user => {
                theUser = user;
                return TwitterModel.findOne({ id: req.account.twitterId, userId: user._id });
            })
            .then((TwitterInst) => {
                TwitterInst = new TwitterModel({
                    id: req.account.twitterId,
                    userName: req.account.twitterUserName,
                    displayName: req.account.twitterDisplayName,
                    accessToken: req.account.accessToken,
                    refreshToken: req.account.refreshToken,
                    userId: mongoose.Types.ObjectId(req.userId)
                });
                return TwitterInst.save();
            }).then(TwitterInst => {
                req.session.hasTwitter = true;
                req.session.twitter = TwitterInst;
                theUser.twitterAccount = TwitterInst;
                return req.session.save();
            })
            .then(() => {
                return theUser.save();
            })
            .then(() => {
                return res.redirect(url);
            })
            .catch(err => {
                return res.redirect(url);
            });

    }
);


module.exports = oauthRoutes;