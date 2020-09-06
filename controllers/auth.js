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
        var decode = jwt.decode(result.token, process.env.SECRET_KEY);

        return res.json(result);
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
        password: password
    }).then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json(err)
    });
}