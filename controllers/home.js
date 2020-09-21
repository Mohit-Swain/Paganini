const mongoose = require('mongoose');
const userModel = require('../utils/schema/user');

module.exports = {
    getHome: function (req, res) {
        res.render('home/home');
    },
    getLogin: function (req, res) {
        res.render('home/login');
    },
    getSignup: function (req, res) {
        res.render('home/signup');
    },
    getForgotPassword: function (req, res) {
        res.render('home/forgot');
    },
    getResetPassword: function (req, res) {
        var token = req.params.token;
        console.log('Token is ' + token);

        userModel.findOne({
                resetToken: token,
                resetTokenExpiration: {
                    $gte: Date.now()
                },
                password: {
                    $exists: true
                }

            }).then(user => {
                console.log(user);
                // console.log(user.resetTokenExpiration);
                // console.log(Date.now());
                // console.log(user.resetTokenExpiration > Date.now());
                // console.log(user.resetTokenExpiration < Date.now());
                // console.log(new Date(Date.now()));
                // console.log(user.resetTokenExpiration > new Date(Date.now()));
                // console.log(user.resetTokenExpiration < new Date(Date.now()));

                if (!user) {
                    // token invalid; Send 404
                    res.redirect('/login');
                } else {
                    res.render('home/reset', {
                        userId: user._id.toString(),
                        token: token
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
}