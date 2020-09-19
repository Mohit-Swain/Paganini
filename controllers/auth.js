const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    req.session.name = "";
    req.session.token = "";
    res.redirect('/login');
}