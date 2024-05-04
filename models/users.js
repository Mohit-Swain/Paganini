const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
var jwt = require('jsonwebtoken');

const userModel = require('../utils/schema/user');
const ObjectId = mongoose.mongo.ObjectID;

exports.addUser = function (user) {
    var name = user.name;
    var email = user.email;
    var password = user.password;
    return new Promise(function (resolve, reject) {
        userModel.findOne({
            email: email
        }, function (err, user) {
            if (user && !user.googleId) {
                reject(['The user email already exists']);
            } else {
                bcrypt.hash(password, 12).then(hashPassword => {
                    var newUser = new userModel({
                        userName: name,
                        email: email,
                        password: hashPassword
                    });
                    return newUser.save();
                }).then((res) => {
                    resolve();
                }).catch(err => {
                    reject(err);
                });
            }
        });
    });
};

exports.check = function (user) {
    var email = user.email;
    var password = user.password;
    return new Promise(function (resolve, reject) {

        userModel.findOne({
            email: email
        }).where('password').exists(true)
            .then(function (user) {
                if (!user) {
                    reject(['The user email doesn\'t exists']);
                } else {
                    bcrypt.compare(password, user.password).then(result => {
                        if (result) {
                            var token = jwt.sign({
                                id: user._id,
                                email: user.email
                            }, process.env.SECRET_KEY, {
                                expiresIn: 60 * 60
                            });
                            resolve({
                                token: token,
                                name: user.userName,
                                twitterAccountId: user.twitterAccount
                            });
                        } else {
                            reject(['The Password Didn\'t match']);
                        }
                    }).catch(err => {
                        reject(err);
                    });
                }
            })
            .catch(err => reject(err));

    });
};

exports.changePassword = function (obj) {
    var new_password = obj.new_password;
    var userId = obj.userId;
    var token = obj.token;
    ;
    return new Promise(function (resolve, reject) {
        userModel.findOne({
            _id: ObjectId(userId),
            resetToken: token,
            resetTokenExpiration: {
                $gte: Date.now()
            }
        }).then(user => {
            if (!user) {
                reject(['Token is inValid try again']);
            } else {
                // change it
                bcrypt.hash(new_password, 12).then(hashPassword => {
                    user.password = hashPassword;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    user.save();
                    resolve({});
                }).catch(err => {
                    reject(err._message);
                });;
            }
        }).catch(err => {
            reject(err._message);
        });

    });
};