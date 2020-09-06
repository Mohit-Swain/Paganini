const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
var jwt = require('jsonwebtoken');

const userModel = require('../utils/schema/user');
const dataModel = require('../utils/schema/data');

exports.addUser = function (user) {
    var name = user.name;
    var email = user.email;
    var password = user.password;
    return new Promise(function (resolve, reject) {
        userModel.findOne({
            email: email
        }, function (err, user) {
            if (user) {
                reject({
                    completed: false,
                    errors: ['The user email already exists']
                })
            } else {
                bcrypt.hash(password, 12).then(hashPassword => {
                    console.log(email);
                    var newUser = new userModel({
                        userName: name,
                        email: email,
                        password: hashPassword
                    });
                    return newUser.save()
                }).then((res) => {
                    resolve({
                        completed: true,
                    })
                }).catch(err => {
                    reject({
                        completed: false,
                        errors: [err]
                    })
                })
            }
        });
    });
}

exports.check = function (user) {
    var email = user.email;
    var password = user.password;
    return new Promise(function (resolve, reject) {
        userModel.findOne({
            email: email
        }, function (err, user) {
            if (!user) {
                reject({
                    completed: false,
                    errors: ['The user email doesn\'t exists']
                });
            } else {
                bcrypt.compare(password, user.password).then(result => {
                    if (result) {
                        var token = jwt.sign({
                            name: user.userName,
                            email: user.email
                        }, process.env.SECRET_KEY, {
                            expiresIn: 60 * 60
                        });
                        resolve({
                            completed: true,
                            token: token
                        });
                    } else {
                        reject({
                            completed: false,
                            errors: ['The Password Didn\'t match']
                        });
                    }
                }).catch(err => {
                    reject({
                        completed: false,
                        errors: [err]
                    })
                })
            }
        })
    });
}