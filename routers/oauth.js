const express = require('express');
const passport = require('passport');
const Twit = require('twit');
const oauthRoutes = express.Router();
const mongoose = require('mongoose');
const jwtMiddleware = require('../utils/middlewares/jwt_authorize');
const User = require('../utils/schema/user');
const TwitterModel = require('../utils/schema/Twitter_data');
require('dotenv').config();

oauthRoutes.get('/oauth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

oauthRoutes.get('/oauth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        console.log(req.user);
        req.session.isLoggedIn = true;
        req.session.name = req.user.userName;
        req.session.hasTwitter = (req.user.twitterAccount ? true : false);
        if(req.user.twitterAccount){
            TwitterModel.findById(req.user.twitterAccount)
            .then((twitInst) => {
                if(twitInst){
                    req.session.twitter = twitInst;
                }
                else{
                    req.session.hasTwitter = false;
                    req.session.twitter = null;
                }
                return req.session.save();
            }).then(() => {
                return res.redirect('/');
            }).catch(() => {
                return res.json({
                    completed: false,
                    errors: ['google oauth failed']
                });
            })   
        }
        else{
            req.session.save(() => {
                return res.redirect('/');
            });
        }
    });

oauthRoutes.get('/oauth/twitter',jwtMiddleware.authorize,
    function(req,res,next){
        console.log("/oauth/twitter");
        if(req.query.mode === 'new'){
            return next();
        }
        return User.findById(mongoose.Types.ObjectId(req.userId))
        .select({twitterAccount : 1})
        .populate('twitterAccount')
        .then(user =>{
            console.log(user);
            if(!user){
                console.log(1);
                return res.redirect("/")
            }
            if(!user.twitterAccount){
                console.log(2);
                return next();
            }
            else{
                console.log(3);
                req.session.hasTwitter = true;
                req.session.twitter = user.twitterAccount;
                return req.session.save()
                        .then(() => res.redirect("back"))
                        .catch(err => res.redirect('/'));
            }
        }).catch(() =>{
            return res.redirect("/");
        })
    },passport.authorize('twitter', {
        failureRedirect: '/'
    })
);

oauthRoutes.get('/oauth/twitter/callback',jwtMiddleware.authorize,
    passport.authorize('twitter', {
        failureRedirect: '/'
    }),
    function (req, res) {
        console.log("/oauth/twitter/callback");
        console.log(req.account);
        var theUser = null;
        return User
        .findById(mongoose.Types.ObjectId(req.userId))
        .populate('twitterAccount')
        .then(user => {
            console.log(user);
            theUser = user;
            return TwitterModel.findOne({id : req.account.twitterId,userId : user._id});
        })
        .then((TwitterInst) =>{
            if(!TwitterInst){
                console.log('!T');
                TwitterInst = new TwitterModel({
                    id : req.account.twitterId,
                    userName: req.account.twitterUserName,
                    displayName: req.account.twitterDisplayName,
                    accessToken: req.account.accessToken,
                    refreshToken: req.account.refreshToken,
                    userId : mongoose.Types.ObjectId(req.userId)
                });
                 return TwitterInst.save()
            }
            else{
                console.log('4');
                TwitterInst.accessToken = req.account.accessToken;
                TwitterInst.refreshToken =  req.account.refreshToken;
                return TwitterInst.save();
            }
        }).then(TwitterInst => {
            console.log('1');
           req.session.hasTwitter = true;
           req.session.twitter = TwitterInst;
           return req.session.save();
       })
       .then(() => {
           console.log('2');
           theUser.twitterAccount = req.session.twitter;
           return theUser.save();
       })
       .then(() =>{
           console.log("done twitttt");
           return res.redirect("back");
       })
       .catch(err =>{
           console.log('3');
           return res.redirect("/");
       })
        
        // Associate the Twitter account with the logged-in user.
        // account.userId = user.id;
        // console.log("callback");
        // var T = new Twit({
        //     consumer_key: 'QtE6JLxqgM2Q1YRez292MtVHA',
        //     consumer_secret: '40NXunjZXrcRWkD9bNZVUwdU3yDK71zSWFtMeAEVRzBex86jU6',
        //     access_token: req.account.accessToken,
        //     access_token_secret: req.account.refreshToken,
        //     timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
        //     strictSSL: true, // optional - requires SSL certificates to be valid.
        // });


        // req.session.twitterAccount = 
        // T.post('statuses/update', {
        //     // status: 'hello world! from NODE!'
        // }, function (err, data, response) {
        //     console.log(data);
        // });
    }
);


module.exports = oauthRoutes;