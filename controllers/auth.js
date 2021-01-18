const userModel = require('../models/users');
const twitterModel = require('../utils/schema/Twitter_data');
require('dotenv').config();


exports.postLogin = function (req, res) {
    var email = req.body.email
    var password = req.body.password
    return userModel.check({
        email: email,
        password: password
    }).then((result) => {
        // console.log(result);
        req.session.isLoggedIn = true;
        req.session.token = result.token;
        req.session.name = result.name;
        req.session.hasTwitter = (result.twitterAccountId ? true : false);
        if(result.twitterAccountId){
            return twitterModel.findById(result.twitterAccountId)
            .then((twitInst) => {
                if(twitInst){
                    req.session.twitter = twitInst;
                }
                else{
                    req.session.twitter = null;
                }
            })
        }
        else{
            req.session.twitter = null;
        }
        return req.session.save()
    }) .then(() =>{
        return res.json({
            completed: true,
            result: 'login successful'
        });
    }).catch(err => {
        return res.json({
            completed: false,
            errors : err
        });
    });
};

exports.postSignUp = function (req, res) {
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password
    return userModel.addUser({
        name: name,
        email: email,
        password: password
    }).then((result) => {
        return res.json({
            completed: true,
            result: result
        });
    }).catch(err => {
        return res.json({
            completed: false,
            errors : err
        });
    });
}


exports.getLogOut = function (req, res) {
    req.session.isLoggedIn = false;
    req.logout();
    req.session.name = null;
    req.session.token = null;
    req.session.hasTwitter = false;
    req.session.twitter = null;
    req.session.save(() =>{
        res.redirect('/login');
    })
}

exports.putChangePassword = function (req, res) {
    var new_password = req.body.new_password;
    var userId = req.body.userId;
    var token = req.body.token;
    var obj = {
        new_password: new_password,
        userId: userId,
        token: token
    };
    return userModel.changePassword(obj)
        .then((result) => {
            return res.json({
                completed: true,
                result: result
            })
        }).catch(err => {
            return res.json({
                completed: false,
                errors : err
            });
        });
}