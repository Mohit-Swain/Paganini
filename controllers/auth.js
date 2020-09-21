const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../utils/schema/user');
require('dotenv').config();


exports.postLogin = function (req, res) {
    var email = req.body.email
    var password = req.body.password
    userModel.check({
        email: email,
        password: password
    }).then((result) => {
        req.session.isLoggedIn = true;
        req.session.token = result.token;
        req.session.name = result.name;
        req.session.save();
        res.json(result);
    }).catch((err) => {
        return res.json(err)
    });
};

exports.postSignUp = function (req, res) {
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password
    userModel.addUser({
        name: name,
        email: email,
        password: password,
        data: []
    }).then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json(err)
    });
}


exports.getLogOut = function (req, res) {
    req.session.isLoggedIn = false;
    req.logout();
    req.session.name = "";
    req.session.token = "";
    req.session.save();
    res.redirect('/login');
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
    console.log('controller');
    userModel.changePassword(obj)
        .then((result) => {
            console.log('controller res');
            console.log(result);
            return res.json({
                completed: true,
                result: result
            })
        }).catch((err) => {
            console.log('controller err ');
            console.log(err);
            return res.json({
                completed: false,
                errors: err
            })
        });;
}